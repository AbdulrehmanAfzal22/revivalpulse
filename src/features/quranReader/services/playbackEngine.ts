import { getChapterRecitation } from 'api/quran/quranClient';
import { buildAyahAudioUrl } from 'api/quran/everyAyahClient';
import { getAyahEditionAudio } from 'api/quran/alQuranCloudClient';
import { getCachedSurahAudio } from 'services/surahAudioCache';
import { queryClient } from 'services/queryClient';
import { getReciterById } from 'constants/reciters';
import { TRANSLATION_AUDIO_EDITIONS } from 'constants/translationAudio';
import { SURAHS } from 'data/quran/surahs';
import { usePlaybackStore } from 'stores/playbackStore';
import { useReadingPreferencesStore } from 'stores/readingPreferencesStore';
import { fetchChapterWithTranslations } from 'features/quranReader/services/translationAggregator';
import { controller } from './PlaybackController';
import type { QueueItem } from './PlaybackController';
import type { LoopMode, PlaybackRange } from 'types/audioPlayer.types';
import type { ChapterRecitation } from 'types/word.types';

/**
 * Deliberately retained diagnostic instrumentation — every playback
 * transition (queue creation, ayah/surah/reciter changes, pause/resume,
 * translation clips starting and finishing) logs here, which is what makes
 * a future report like "translation stopped partway through" or "it jumped
 * to the wrong ayah" reproducible from the console instead of guesswork.
 * Not gated behind Developer Mode — this is cheap, and the alternative is
 * re-adding it from scratch the next time something needs debugging.
 */
function logTransition(event: string, details?: Record<string, unknown>): void {
  // eslint-disable-next-line no-console
  if (details) console.log(`[playback] ${event}`, details);
  // eslint-disable-next-line no-console
  else console.log(`[playback] ${event}`);
}

function getAudio(): HTMLAudioElement {
  if (!controller.audio) {
    controller.audio = new Audio();
    controller.audio.addEventListener('timeupdate', handleTimeUpdate);
    controller.audio.addEventListener('ended', handleEnded);
  }
  return controller.audio;
}

async function resolveSrc(url: string): Promise<string> {
  const cached = await getCachedSurahAudio(url);
  return cached ?? url;
}

/**
 * `resolveSrc` creates a fresh `URL.createObjectURL(...)` every time it
 * resolves a downloaded (offline-cached) surah/ayah — an unbounded leak if
 * nothing ever revokes the previous one before assigning a new one. Reading
 * `element.src` *before* overwriting it and revoking it here (if it's a
 * blob: URL — a plain network URL is a no-op) is what closes that: every
 * place `.src` gets reassigned from resolveSrc's result goes through this.
 */
function assignAudioSrc(element: HTMLAudioElement, newUrl: string): void {
  if (element.src.startsWith('blob:')) URL.revokeObjectURL(element.src);
  element.src = newUrl;
}

function currentReciter() {
  const reciter = getReciterById(usePlaybackStore.getState().reciterId);
  if (!reciter) throw new Error('No reciter selected');
  return reciter;
}

function currentSurah() {
  const surah = SURAHS.find((item) => item.id === usePlaybackStore.getState().surahId);
  if (!surah) throw new Error('No surah loaded');
  return surah;
}

/** Translation-audio editions currently switched on via the explicit playback toggles (independent of which translations are selected as text). */
function activeTranslationAudioEditions() {
  const { urduTranslationAudioEnabled, englishTranslationAudioEnabled } = usePlaybackStore.getState();
  const editions = [];
  if (urduTranslationAudioEnabled) {
    const edition = TRANSLATION_AUDIO_EDITIONS.find((item) => item.languageCode === 'ur');
    if (edition) editions.push(edition);
  }
  if (englishTranslationAudioEnabled) {
    const edition = TRANSLATION_AUDIO_EDITIONS.find((item) => item.languageCode === 'en');
    if (edition) editions.push(edition);
  }
  return editions;
}

/**
 * One pure function builds the whole plan — every ordering rule (per-ayah
 * alternation, editions in a fixed order, no special-casing the last ayah)
 * is resolved once, here, not re-decided at playback time.
 */
function buildQueue(surahId: number, startAyah: number, endAyah: number, editions: ReturnType<typeof activeTranslationAudioEditions>): QueueItem[] {
  const queue: QueueItem[] = [];
  for (let ayah = startAyah; ayah <= endAyah; ayah += 1) {
    queue.push({ type: 'arabic', surah: surahId, ayah });
    for (const edition of editions) {
      queue.push({ type: edition.languageCode === 'ur' ? 'urdu' : 'english', surah: surahId, ayah });
    }
  }
  return queue;
}

/**
 * Guards the shared single-slot recitationCache against a genuinely stale
 * request (for a *different* surah/reciter) resolving after a newer one has
 * already taken over — without this, a slow call for surah A that resolves
 * after a fresh call for surah B has already cached B's data would silently
 * overwrite it with A's. The returned `data` itself is still handed back
 * regardless (so a stale caller gets a correct value to then discard via its
 * own epoch check against actual playback state), only the shared cache
 * write is guarded, and it's guarded by "is this key still the latest one
 * anyone requested" rather than by `epoch` — see `recitationLatestKey`'s
 * docstring for why epoch specifically isn't the right signal here.
 *
 * Also dedupes *in-flight* requests, not just already-resolved ones — this
 * is what lets a background preload and a real Play press for the same
 * surah (or two overlapping preloads) share one network request instead of
 * firing a redundant second one just because the first hadn't resolved yet.
 */
async function loadRecitation(recitationId: number, surahId: number): Promise<ChapterRecitation> {
  const key = `${recitationId}:${surahId}`;
  if (controller.recitationCache?.key === key) return controller.recitationCache.data;
  if (controller.recitationFetch?.key === key) return controller.recitationFetch.promise;

  controller.recitationLatestKey = key;
  const promise = getChapterRecitation(recitationId, surahId);
  controller.recitationFetch = { key, promise };
  try {
    const data = await promise;
    if (controller.recitationLatestKey === key) controller.recitationCache = { key, data };
    return data;
  } finally {
    if (controller.recitationFetch?.key === key) controller.recitationFetch = null;
  }
}

/**
 * Lazily created — used purely as a decoder utility (never connected to any
 * output node), so it never needs a user-gesture-triggered resume() the way
 * an AudioContext used for actual playback would.
 */
function getAudioContext(): AudioContext {
  if (!controller.audioContext) {
    controller.audioContext = new AudioContext();
  }
  return controller.audioContext;
}

/**
 * quran.com mode's shared chapter file decoded once into raw PCM and cached,
 * so every ayah in the surah can be sliced out of it without re-fetching or
 * re-decoding. This is what makes a sample-accurate per-ayah clip possible at
 * all — a fetched URL only supports seeking within one continuous stream,
 * never carving an independent, exactly-bounded clip out of it.
 *
 * Dedupes in-flight requests the same way loadRecitation does — this is the
 * expensive step (fetch + decode of a whole, possibly multi-minute, chapter
 * file), so it's the one most worth a real Play press being able to join
 * rather than duplicate if a background preload got there first.
 */
async function ensureDecodedRecitation(recitationId: number, surahId: number, audioUrl: string): Promise<AudioBuffer> {
  const key = `${recitationId}:${surahId}`;
  if (controller.decodedRecitationCache?.key === key) return controller.decodedRecitationCache.buffer;
  if (controller.decodedRecitationFetch?.key === key) return controller.decodedRecitationFetch.promise;

  controller.decodedRecitationLatestKey = key;
  const promise = (async () => {
    const resolvedUrl = await resolveSrc(audioUrl);
    const response = await fetch(resolvedUrl);
    const arrayBuffer = await response.arrayBuffer();
    return getAudioContext().decodeAudioData(arrayBuffer);
  })();
  controller.decodedRecitationFetch = { key, promise };
  try {
    const buffer = await promise;
    if (controller.decodedRecitationLatestKey === key) controller.decodedRecitationCache = { key, buffer };
    return buffer;
  } finally {
    if (controller.decodedRecitationFetch?.key === key) controller.decodedRecitationFetch = null;
  }
}

/** Carves an exact [fromMs, toMs) slice out of a decoded chapter buffer — sample-accurate, no polling or margin involved. */
function sliceAudioBuffer(source: AudioBuffer, audioContext: AudioContext, fromMs: number, toMs: number): AudioBuffer {
  const { sampleRate, numberOfChannels } = source;
  const startSample = Math.max(0, Math.floor((fromMs / 1000) * sampleRate));
  const endSample = Math.min(source.length, Math.ceil((toMs / 1000) * sampleRate));
  const frameCount = Math.max(0, endSample - startSample);

  const sliced = audioContext.createBuffer(numberOfChannels, frameCount, sampleRate);
  for (let channel = 0; channel < numberOfChannels; channel += 1) {
    sliced.copyToChannel(source.getChannelData(channel).subarray(startSample, endSample), channel);
  }
  return sliced;
}

/** Encodes a (typically short, single-ayah) AudioBuffer as a 16-bit PCM WAV Blob, playable by a plain `<audio>` element. */
function encodeWavBlob(buffer: AudioBuffer): Blob {
  const { numberOfChannels, sampleRate, length: numFrames } = buffer;
  const bytesPerSample = 2;
  const blockAlign = numberOfChannels * bytesPerSample;
  const dataSize = numFrames * blockAlign;

  const arrayBuffer = new ArrayBuffer(44 + dataSize);
  const view = new DataView(arrayBuffer);
  const writeString = (offset: number, value: string): void => {
    for (let i = 0; i < value.length; i += 1) view.setUint8(offset + i, value.charCodeAt(i));
  };

  writeString(0, 'RIFF');
  view.setUint32(4, 36 + dataSize, true);
  writeString(8, 'WAVE');
  writeString(12, 'fmt ');
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true); // PCM
  view.setUint16(22, numberOfChannels, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, sampleRate * blockAlign, true);
  view.setUint16(32, blockAlign, true);
  view.setUint16(34, bytesPerSample * 8, true);
  writeString(36, 'data');
  view.setUint32(40, dataSize, true);

  const channelData = Array.from({ length: numberOfChannels }, (_, channel) => buffer.getChannelData(channel));
  let offset = 44;
  for (let frame = 0; frame < numFrames; frame += 1) {
    for (let channel = 0; channel < numberOfChannels; channel += 1) {
      const sample = Math.max(-1, Math.min(1, channelData[channel]![frame]!));
      view.setInt16(offset, sample < 0 ? sample * 0x8000 : sample * 0x7fff, true);
      offset += 2;
    }
  }

  return new Blob([arrayBuffer], { type: 'audio/wav' });
}

/** Continuously updates activeWord for word-level highlighting while a quran.com-mode ayah plays — offsets the trimmed clip's own currentTime (which starts at 0) back into the original file's coordinate space that the segment timestamps are defined in. */
function updateWordSyncHighlight(): void {
  if (!controller.audio || !controller.activeTimestamp) return;
  const currentMs = controller.activeTimestamp.timestampFrom + controller.audio.currentTime * 1000;
  const activeSegment = controller.activeTimestamp.segments.find((segment) => currentMs >= segment.startMs && currentMs < segment.endMs);
  usePlaybackStore.getState().setActiveWord(activeSegment?.wordPosition ?? null);
}

function updateMediaSessionMetadata(reciterName: string, surahName: string, ayahNumber: number): void {
  if (!('mediaSession' in navigator)) return;
  navigator.mediaSession.metadata = new MediaMetadata({
    title: `${surahName} — Ayah ${ayahNumber}`,
    artist: reciterName,
    album: 'Quran',
  });
}

function wireMediaSessionActions(): void {
  if (controller.mediaSessionWired || !('mediaSession' in navigator)) return;
  controller.mediaSessionWired = true;
  navigator.mediaSession.setActionHandler('play', () => resume());
  navigator.mediaSession.setActionHandler('pause', () => pause());
  navigator.mediaSession.setActionHandler('nexttrack', () => void next());
  navigator.mediaSession.setActionHandler('previoustrack', () => void previous());
}

function preloadNextAyah(afterIndex: number): void {
  const reciter = currentReciter();
  if (reciter.source !== 'everyayah.com') return;

  const nextArabicItem = controller.queue.slice(afterIndex + 1).find((item) => item.type === 'arabic');
  if (!nextArabicItem) return;

  const url = buildAyahAudioUrl(reciter.folderName, nextArabicItem.surah, nextArabicItem.ayah);
  void resolveSrc(url)
    .then((resolvedUrl) => {
      if (!controller.preloadAudio) {
        controller.preloadAudio = new Audio();
        controller.preloadAudio.preload = 'auto';
      }
      assignAudioSrc(controller.preloadAudio, resolvedUrl);
    })
    .catch(() => {
      // Best-effort only — a failed preload just means the normal fetch-on-advance path runs instead.
    });
}

/**
 * Plays one ayah's Arabic — mode differences (trim this ayah's exact clip
 * out of the shared, decoded chapter buffer, vs. fetch and play that ayah's
 * own file) are an internal detail of *how this one item is realized*, never
 * a different queue shape or a different set of playback states. Both modes
 * end up playing a genuinely single-ayah audio resource through `controller.audio`,
 * so the native 'ended' event means the same thing either way.
 */
async function playArabicItem(item: QueueItem, index: number, epochAtStart: number): Promise<void> {
  const reciter = currentReciter();
  const surah = currentSurah();
  const verseKey = `${item.surah}:${item.ayah}`;

  if (reciter.source === 'quran.com') {
    if (!controller.recitationCache) return;
    const timestamp = controller.recitationCache.data.timestamps.find((entry) => entry.verseKey === verseKey);
    if (!timestamp) return;

    // The decoded buffer is guaranteed already cached by load() before this
    // ever runs for the first ayah of a session — this call is a no-op cache
    // hit in that case, and only does real work if something (a reciter
    // change mid-session) invalidated it since.
    const decoded = await ensureDecodedRecitation(reciter.recitationId, surah.id, controller.recitationCache.data.audioUrl);
    if (controller.epoch !== epochAtStart) return; // superseded while decoding

    // Trim this ayah's own exact samples out of the shared file and play
    // them as an independent clip, through the same one-file-per-ayah
    // mechanism everyayah.com mode already uses — the next ayah's audio
    // simply isn't present in this clip, so there's nothing for the native
    // 'ended' event to bleed into, no polling or margin required.
    const clip = sliceAudioBuffer(decoded, getAudioContext(), timestamp.timestampFrom, timestamp.timestampTo);
    const clipUrl = URL.createObjectURL(encodeWavBlob(clip));

    const player = getAudio();
    assignAudioSrc(player, clipUrl);
    player.playbackRate = usePlaybackStore.getState().playbackSpeed;
    controller.activeTimestamp = timestamp;
    usePlaybackStore.getState().setVerseKey(verseKey);
    updateMediaSessionMetadata(reciter.name, surah.nameSimple, item.ayah);
    controller.state = 'playing-recitation';
    logTransition('Playing Arabic', { verseKey });
    await player.play();
    if (controller.epoch !== epochAtStart) return; // superseded while play() was settling
    return;
  }

  // everyayah.com — fetch and play this ayah's own file.
  const url = buildAyahAudioUrl(reciter.folderName, item.surah, item.ayah);
  const resolvedUrl = await resolveSrc(url);
  if (controller.epoch !== epochAtStart) return; // superseded while resolving — stale, terminate silently

  const player = getAudio();
  assignAudioSrc(player, resolvedUrl);
  player.playbackRate = usePlaybackStore.getState().playbackSpeed;
  usePlaybackStore.getState().setVerseKey(verseKey);
  updateMediaSessionMetadata(reciter.name, surah.nameSimple, item.ayah);
  controller.state = 'playing-recitation';
  logTransition('Playing Arabic', { verseKey });
  await player.play();
  if (controller.epoch !== epochAtStart) return; // superseded while play() was settling
  preloadNextAyah(index);
}

function getTranslationAudioPlayer(): HTMLAudioElement {
  if (!controller.translationAudio) {
    controller.translationAudio = new Audio();
  }
  return controller.translationAudio;
}

type ClipOutcome = 'ended' | 'error' | 'aborted';

/**
 * Plays one translation-audio clip to completion.
 *
 * Fixes a truncation bug where only a fragment played before cutting off:
 * the 'ended' listener was previously attached *after* `await player.play()`
 * resolved — for a clip whose data was already buffered, playback could
 * reach 'ended' before the listener was attached, missing the event.
 * Attaching listeners *before* calling play() closes that race.
 *
 * Also listens for 'pause' — a manual `.pause()` call (exactly what session
 * teardown does to this element) fires neither 'ended' nor 'error', so
 * without this the returned promise would hang forever every time a session
 * is superseded mid-clip. Resolving with 'aborted' here means the awaiting
 * code always gets a real, immediate answer instead of a dangling promise.
 *
 * `epochAtStart` distinguishes two very different reasons this clip's
 * element could fire 'pause': an ordinary user pause() call (epoch
 * unchanged — the clip is merely suspended, resume() will call .play()
 * again on this exact element later, so the promise must stay open and
 * waiting) vs. a session teardown's pause() call (epoch already bumped —
 * this clip is genuinely abandoned and the promise must resolve now rather
 * than hang). Because an ordinary pause must NOT resolve the promise, the
 * 'pause' listener itself can't use `{ once: true }` — it may legitimately
 * fire more than once (pause/resume, pause/resume...) before a real
 * end/error/abort finally happens; `finish()` still handles its own
 * cleanup once one of those genuinely occurs.
 */
function playTranslationClip(url: string, epochAtStart: number): Promise<ClipOutcome> {
  const player = getTranslationAudioPlayer();
  player.pause();
  player.currentTime = 0;
  player.src = url;
  player.load();

  return new Promise<ClipOutcome>((resolve) => {
    const finish = (outcome: ClipOutcome) => (): void => {
      player.removeEventListener('ended', onEnded);
      player.removeEventListener('error', onError);
      player.removeEventListener('pause', onPause);
      resolve(outcome);
    };
    const onEnded = finish('ended');
    const onError = finish('error');
    const onPause = (): void => {
      if (player.ended) return; // the 'ended' listener already covers a natural finish
      if (controller.epoch === epochAtStart) return; // an ordinary pause — stay suspended, not aborted
      finish('aborted')();
    };
    player.addEventListener('ended', onEnded, { once: true });
    player.addEventListener('error', onError, { once: true });
    player.addEventListener('pause', onPause);
    void player.play().catch(onError);
  });
}

/** Plays one translation queue item (one ayah, one edition) and, once it settles, advances via the same onItemEnded every other item type uses. */
async function playTranslationItem(item: QueueItem, index: number, epochAtStart: number): Promise<void> {
  const edition = TRANSLATION_AUDIO_EDITIONS.find((candidate) => candidate.languageCode === (item.type === 'urdu' ? 'ur' : 'en'));
  const verseKey = `${item.surah}:${item.ayah}`;
  if (!edition) {
    onItemEnded(index);
    return;
  }

  controller.state = 'playing-translation';
  logTransition(`Starting ${edition.label}`, { verseKey });

  try {
    const url = await getAyahEditionAudio(verseKey, edition.identifier);
    if (controller.epoch !== epochAtStart) return; // superseded while fetching the URL
    const outcome = await playTranslationClip(url, epochAtStart);
    logTransition(`${edition.label} Finished`, { verseKey, outcome });
    if (outcome === 'error') {
      console.warn(
        `[translation-audio] "${edition.label}" (${edition.identifier}) failed to play for ${verseKey} — url: ${url}, reciter: ${usePlaybackStore.getState().reciterId}. Skipping to the next ayah.`
      );
    }
  } catch (error) {
    logTransition(`${edition.label} Finished`, { verseKey, outcome: 'error', threw: true });
    console.warn(
      `[translation-audio] "${edition.label}" (${edition.identifier}) failed to load for ${verseKey} — reciter: ${usePlaybackStore.getState().reciterId}.`,
      error
    );
  }

  if (controller.epoch !== epochAtStart) return; // superseded while the clip was playing
  onItemEnded(index);
}

/**
 * The entire "what plays next" question, for every case (first ayah,
 * middle, last, loop-ayah, loop-range/surah, autoplay off, translation
 * on/off) collapses to: look at `queue[currentIndex]`, play it. No other
 * function anywhere decides ordering.
 */
async function playCurrentItem(): Promise<void> {
  const epochAtStart = controller.epoch;
  const item = controller.queue[controller.currentIndex];

  if (!item) {
    const { loopMode } = usePlaybackStore.getState();
    if (loopMode === 'surah' || loopMode === 'range') {
      logTransition('Next Ayah (loop restart)', { toIndex: 0 });
      controller.currentIndex = 0;
      await playCurrentItem();
      return;
    }
    logTransition('Finished');
    stop();
    return;
  }

  if (item.type === 'arabic') {
    await playArabicItem(item, controller.currentIndex, epochAtStart);
  } else {
    await playTranslationItem(item, controller.currentIndex, epochAtStart);
  }
}

/**
 * The one place `currentIndex` ever moves during ordinary playback — every
 * item type (Arabic clip ended, translation clip settled) funnels through
 * here. `finishedIndex` is compared against the *current* currentIndex
 * first: if they don't match, this is a stale or duplicate trigger for an
 * item already moved past, and is silently ignored rather than
 * double-advancing.
 */
function onItemEnded(finishedIndex: number): void {
  if (controller.currentIndex !== finishedIndex) return;

  const finishedItem = controller.queue[finishedIndex];
  if (!finishedItem) return;
  const { loopMode, autoplayEnabled } = usePlaybackStore.getState();

  if (loopMode === 'ayah') {
    const ayahStartIndex = controller.queue.findIndex(
      (item) => item.surah === finishedItem.surah && item.ayah === finishedItem.ayah
    );
    logTransition('Repeat Ayah', { ayah: finishedItem.ayah });
    controller.currentIndex = ayahStartIndex === -1 ? finishedIndex : ayahStartIndex;
    void playCurrentItem();
    return;
  }

  const nextItem = controller.queue[finishedIndex + 1];
  const crossingIntoNextAyah = !nextItem || nextItem.ayah !== finishedItem.ayah || nextItem.surah !== finishedItem.surah;

  if (crossingIntoNextAyah && loopMode === 'off' && !autoplayEnabled) {
    logTransition('Stop', { reason: 'autoplay disabled' });
    controller.currentIndex = finishedIndex + 1;
    // 'idle' (not left as whatever it last was) so resume() knows there's
    // nothing currently loaded to resume — it should advance the queue
    // instead. See resume()'s docstring.
    controller.state = 'idle';
    pause();
    return;
  }

  controller.currentIndex = finishedIndex + 1;
  void playCurrentItem();
}

// --- shared handlers ---

function handleTimeUpdate(): void {
  if (!controller.audio) return;
  usePlaybackStore.getState().setProgress(controller.audio.currentTime, controller.audio.duration || 0);
  if (currentReciter().supportsWordSync) updateWordSyncHighlight();
}

/**
 * Native 'ended' on the shared recitation element — the sole boundary signal
 * for both reciter modes now that quran.com's ayahs are trimmed to their own
 * clips exactly like everyayah.com's always-one-file-per-ayah files.
 */
function handleEnded(): void {
  onItemEnded(controller.currentIndex);
}

// --- public controls ---

interface LoadTarget {
  surahId: number;
  ayah: number;
}

/**
 * The one and only place that ever tears down a session and starts another.
 * playSurah, next, previous, setReciter, and seekToAyah are all thin callers
 * of this — none of them has its own competing teardown-then-play
 * implementation.
 */
async function load(target: LoadTarget): Promise<void> {
  wireMediaSessionActions();
  const store = usePlaybackStore.getState();
  const reciter = getReciterById(store.reciterId);
  const surah = SURAHS.find((item) => item.id === target.surahId);
  if (!reciter || !surah) return;

  const previousSurahId = store.surahId;
  const previousVerseKey = store.verseKey;
  const verseKey = `${target.surahId}:${target.ayah}`;

  logTransition('Destroy Queue', { reason: 'load' });
  controller.epoch += 1;
  const epochAtStart = controller.epoch;
  controller.translationAudio?.pause();
  controller.audio?.pause();
  controller.state = 'idle';

  if (previousSurahId !== target.surahId) {
    logTransition('Surah Changed', { from: previousSurahId, to: target.surahId });
  } else if (previousVerseKey !== verseKey) {
    logTransition('Ayah Changed', { from: previousVerseKey, to: verseKey });
  }

  store.setSurahId(target.surahId);
  store.setLoading(true);

  try {
    if (reciter.source === 'quran.com') {
      const recitation = await loadRecitation(reciter.recitationId, target.surahId);
      if (controller.epoch !== epochAtStart) return; // superseded while fetching recitation metadata
      await ensureDecodedRecitation(reciter.recitationId, target.surahId, recitation.audioUrl);
      if (controller.epoch !== epochAtStart) return; // superseded while fetching/decoding the audio
      // Nothing gets assigned to `audio` here — playArabicItem trims and
      // assigns each ayah's own clip when its turn comes, same as
      // everyayah.com mode below.
    }
    // everyayah.com needs no upfront file load — each ayah's file is fetched lazily by playArabicItem when its turn comes.

    const startAyah = store.range?.startAyah ?? 1;
    const endAyah = store.range?.endAyah ?? surah.versesCount;
    controller.queue = buildQueue(target.surahId, startAyah, endAyah, activeTranslationAudioEditions());
    logTransition('Queue Created', { surah: target.surahId, ayahRange: [startAyah, endAyah], items: controller.queue.length });

    const targetIndex = controller.queue.findIndex((item) => item.type === 'arabic' && item.ayah === target.ayah);
    controller.currentIndex = targetIndex === -1 ? 0 : targetIndex;

    usePlaybackStore.getState().begin('surah', verseKey, pause);
    await playCurrentItem();
  } finally {
    // A stale call's finally must not flip isLoading back to false for a
    // session that superseded it while this one was still loading.
    if (controller.epoch === epochAtStart) usePlaybackStore.getState().setLoading(false);
  }
}

export async function playSurah(surahId: number, startAyah = 1): Promise<void> {
  await load({ surahId, ayah: startAyah });
}

/**
 * Warms every cache `load()` reads from, ahead of the user pressing Play —
 * called as soon as a surah is opened, not gated on any playback action.
 * Deliberately does not touch `controller.epoch`, `queue`, `currentIndex`, or
 * any actively-playing element: preloading a surah the user is merely
 * *viewing* must never interrupt whatever is actually playing. Fire-and-forget
 * by design (never awaited by its caller) so it can never block the UI.
 *
 * Calling this again (a new surah opened) supersedes any previous call via
 * `preloadToken` — the superseded call's own continuations detect the
 * mismatch after their next await and stop without writing anything or
 * touching `preloadAudio`. The underlying network requests already in flight
 * are not aborted (aborting a request `ensureDecodedRecitation`/`loadRecitation`
 * might be sharing with a *real*, currently-playing session for the same
 * surah would be a correctness bug, not an optimization), so a superseded
 * preload's request may still complete — it just won't be acted on further,
 * and if a real session for that surah starts later, its own epoch-guarded
 * cache write still lands normally.
 */
export function preloadSurah(surahId: number, startAyah = 1): void {
  controller.preloadToken += 1;
  const tokenAtStart = controller.preloadToken;

  const reciter = getReciterById(usePlaybackStore.getState().reciterId);
  const surah = SURAHS.find((item) => item.id === surahId);
  if (!reciter || !surah) return;

  const translationIds = [...useReadingPreferencesStore.getState().preferences.activeTranslationIds].sort();
  void queryClient.prefetchQuery({
    queryKey: ['quran', 'chapterVerses', surahId, translationIds],
    queryFn: () => fetchChapterWithTranslations(surahId, translationIds),
  });

  usePlaybackStore.getState().setSurahPreloading(true);

  void (async () => {
    try {
      if (reciter.source === 'quran.com') {
        const recitation = await loadRecitation(reciter.recitationId, surahId);
        if (controller.preloadToken !== tokenAtStart) return; // superseded by a newer preload — nothing left to do
        await ensureDecodedRecitation(reciter.recitationId, surahId, recitation.audioUrl);
      } else {
        // everyayah.com: only the starting ayah needs to be ready by Play —
        // every ayah after that is already handled by preloadNextAyah once
        // playback actually begins, exactly as today.
        const url = buildAyahAudioUrl(reciter.folderName, surahId, startAyah);
        const resolvedUrl = await resolveSrc(url);
        if (controller.preloadToken !== tokenAtStart) return;
        if (!controller.preloadAudio) {
          controller.preloadAudio = new Audio();
          controller.preloadAudio.preload = 'auto';
        }
        assignAudioSrc(controller.preloadAudio, resolvedUrl);
      }
    } catch {
      // Best-effort only — a failed preload just means load() fetches normally when Play is actually pressed.
    } finally {
      if (controller.preloadToken === tokenAtStart) usePlaybackStore.getState().setSurahPreloading(false);
    }
  })();
}

export function pause(): void {
  logTransition('Pause');
  controller.audio?.pause();
  controller.translationAudio?.pause();
  usePlaybackStore.setState({ isPlaying: false });
}

/**
 * Which of three things resume() should do is read entirely from
 * `controller.state`, never from an audio element's own `.ended` flag —
 * `.ended` is mode-dependent (true for everyayah.com's just-finished
 * per-ayah file, but false for quran.com's shared file merely paused
 * mid-way through) and would make this function behave differently per
 * reciter mode for the exact same logical situation. `state` doesn't have
 * that problem: onItemEnded explicitly sets it to 'idle' when autoplay-off
 * pauses at an ayah boundary (see there), so 'idle' here means exactly
 * "nothing loaded is currently ours to resume — advance the queue instead."
 */
export function resume(): void {
  if (controller.state === 'playing-translation') {
    if (!controller.translationAudio) return;
    logTransition('Resume', { context: 'translation interlude' });
    void controller.translationAudio.play();
    usePlaybackStore.setState({ isPlaying: true });
    return;
  }
  if (controller.state === 'playing-recitation') {
    if (!controller.audio) return;
    logTransition('Resume', { context: 'recitation' });
    void controller.audio.play();
    usePlaybackStore.setState({ isPlaying: true });
    return;
  }
  // controller.state === 'idle' — paused at an ayah boundary (autoplay off),
  // with currentIndex already pointing at the next queue item.
  logTransition('Resume', { context: 'advance to next queue item' });
  usePlaybackStore.setState({ isPlaying: true });
  void playCurrentItem();
}

/**
 * Seeks within the currently loaded audio. Every reciter's `audio` element
 * now holds exactly one ayah's own clip (quran.com's is trimmed to it,
 * everyayah.com's always was one file per ayah), so this is always bounded
 * to the current ayah — no cross-ayah re-sync needed for either mode.
 */
export function seekToTime(seconds: number): void {
  if (!controller.audio) return;
  controller.audio.currentTime = seconds;
}

/** The ayah actually tracked as current, for either reciter mode. */
function currentAyahNumber(): number | null {
  const { verseKey } = usePlaybackStore.getState();
  return verseKey ? Number(verseKey.split(':')[1]) : null;
}

/**
 * Manual skip is treated as an ayah change — same LOAD path as everything
 * else, not a lightweight in-place seek. This is a deliberate trade-off:
 * for quran.com mode, a lighter implementation could just move `currentTime`
 * within the already-loaded file (instant, no reload); going through
 * `load()` reassigns the audio element's `src`, which the browser treats as
 * a fresh resource load even when the underlying data is already cached —
 * a small, real cost, accepted here because it's what closes the actual bug
 * (next/previous silently ignoring an in-progress translation and stale
 * closures firing after them) rather than special-casing this one path back
 * into its own implementation.
 */
export async function next(): Promise<void> {
  const store = usePlaybackStore.getState();
  if (store.surahId === null) return;
  const surah = SURAHS.find((item) => item.id === store.surahId);
  if (!surah) return;
  const current = currentAyahNumber();
  if (current === null || current + 1 > surah.versesCount) return;
  await load({ surahId: store.surahId, ayah: current + 1 });
}

export async function previous(): Promise<void> {
  const store = usePlaybackStore.getState();
  if (store.surahId === null) return;
  const current = currentAyahNumber();
  if (current === null || current - 1 < 1) return;
  await load({ surahId: store.surahId, ayah: current - 1 });
}

export function setLoopMode(mode: LoopMode): void {
  usePlaybackStore.getState().setLoopMode(mode);
}

export function setRange(range: PlaybackRange | null): void {
  usePlaybackStore.getState().setRange(range);
}

/**
 * Call whenever the Urdu/English translation-audio toggles change.
 * Everything up to and including the rest of the *currently playing* ayah's
 * items is preserved exactly as queued (so `currentIndex` never needs to
 * move and nothing already in flight is disrupted) — only ayahs strictly
 * after the current one are rebuilt with the new live editions list. This
 * matches Phase 5 exactly: takes effect at the next ayah boundary, never
 * retroactively for the ayah already in progress.
 */
export function refreshTranslationEditions(): void {
  if (controller.queue.length === 0) return; // no active session
  const currentItem = controller.queue[controller.currentIndex];
  if (!currentItem) return;

  const lastItem = controller.queue[controller.queue.length - 1]!;
  const nextAyahStartIndex = controller.queue.findIndex(
    (item, idx) => idx > controller.currentIndex && (item.ayah !== currentItem.ayah || item.surah !== currentItem.surah)
  );
  if (nextAyahStartIndex === -1) return; // current item is already the queue's last ayah — nothing left to rebuild

  const nextItem = controller.queue[nextAyahStartIndex]!;
  const preservedHead = controller.queue.slice(0, nextAyahStartIndex);
  const rebuiltTail = buildQueue(nextItem.surah, nextItem.ayah, lastItem.ayah, activeTranslationAudioEditions());

  controller.queue = [...preservedHead, ...rebuiltTail];
  logTransition('Queue Created', {
    surah: nextItem.surah,
    ayahRange: [nextItem.ayah, lastItem.ayah],
    items: controller.queue.length,
    reason: 'translation toggle',
  });
}

export function setSpeed(speed: number): void {
  usePlaybackStore.getState().setPlaybackSpeed(speed);
  if (controller.audio) controller.audio.playbackRate = speed;
}

export function setReciter(reciterId: string): void {
  // No-op guard: picking the same reciter that's already selected must never
  // restart playback — without this, any redundant call (e.g. a UI element
  // re-firing the current value) would interrupt an in-progress translation
  // or just jarringly restart the current ayah for no reason.
  if (usePlaybackStore.getState().reciterId === reciterId) return;

  const wasPlaying = usePlaybackStore.getState().isPlaying;
  const surahId = usePlaybackStore.getState().surahId;
  const verseKey = usePlaybackStore.getState().verseKey;
  const resumeAyah = verseKey ? Number(verseKey.split(':')[1]) : 1;

  logTransition('Reciter Changed', { from: usePlaybackStore.getState().reciterId, to: reciterId });
  usePlaybackStore.getState().setReciterId(reciterId);
  controller.recitationCache = null;
  controller.decodedRecitationCache = null;

  if (wasPlaying && surahId) {
    void load({ surahId, ayah: resumeAyah });
  }
}

export function stop(): void {
  logTransition('Destroy Queue', { reason: 'stop' });
  controller.epoch += 1;
  controller.audio?.pause();
  controller.translationAudio?.pause();
  // Definitive end of this session — revoke now rather than leaving it for
  // whatever load() happens to run next (assignAudioSrc would still catch
  // it then, but there's no reason to wait).
  if (controller.audio?.src.startsWith('blob:')) URL.revokeObjectURL(controller.audio.src);
  if (controller.preloadAudio?.src.startsWith('blob:')) URL.revokeObjectURL(controller.preloadAudio.src);
  controller.state = 'idle';
  controller.queue = [];
  controller.currentIndex = 0;
  controller.activeTimestamp = null;
  usePlaybackStore.getState().stop();
  // Explicit, not left to whatever load() call happened to be in flight —
  // its own finally block correctly skips this for a stale (superseded)
  // call now that epoch-guarding exists, which means nothing else clears it
  // if stop() itself is what superseded it. Without this, calling stop()
  // while a load was still loading would leave isLoading stuck true forever.
  usePlaybackStore.getState().setLoading(false);
}

export function seekToAyah(ayahNumber: number): void {
  const store = usePlaybackStore.getState();
  if (store.surahId === null) return;
  void load({ surahId: store.surahId, ayah: ayahNumber });
}

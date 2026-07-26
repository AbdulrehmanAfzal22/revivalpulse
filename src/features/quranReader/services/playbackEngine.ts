import { getChapterRecitation } from 'api/quran/quranClient';
import { buildAyahAudioUrl } from 'api/quran/everyAyahClient';
import { getAyahEditionAudio } from 'api/quran/alQuranCloudClient';
import { getCachedSurahAudio } from 'services/surahAudioCache';
import { getReciterById } from 'constants/reciters';
import { TRANSLATION_AUDIO_EDITIONS } from 'constants/translationAudio';
import type { TranslationAudioEdition } from 'constants/translationAudio';
import { SURAHS } from 'data/quran/surahs';
import { usePlaybackStore } from 'stores/playbackStore';
import type { ChapterRecitation, VerseTimestamp } from 'types/word.types';
import type { LoopMode, PlaybackRange } from 'types/audioPlayer.types';

let audio: HTMLAudioElement | null = null;
let recitationCache: { key: string; data: ChapterRecitation } | null = null;
let everyAyahQueue: number[] = [];
let queueIndex = 0;
let mediaSessionWired = false;
let translationAudio: HTMLAudioElement | null = null;

/** Urdu translation audio is grouped: recite this many ayahs back to back, then their translations back to back, then repeat. */
const TRANSLATION_GROUP_SIZE = 3;
let translationGroupKeys: string[] = [];
/**
 * word-sync mode only. `timeupdate` fires roughly every ~250ms in most
 * browsers, so a narrow "are we within 30ms of the ayah's end" check
 * misses far more often than it hits — the tick right before the boundary
 * can land 200ms early, and the tick right after can land 200ms past it,
 * skipping the window entirely. That silently broke translation-audio
 * grouping for every word-synced reciter (Alafasy, Sudais, etc. — anyone
 * on quran.com's single-chapter-file mode), while everyayah.com-mode
 * reciters (Maher Al Muaiqly etc.) were unaffected since their boundary is
 * a real 'ended' event, not a polled window.
 *
 * Fix: once a `timeupdate` tick lands within a *wide* margin of an ayah's
 * end (generous enough that some tick is essentially guaranteed to land
 * inside it), switch to polling via requestAnimationFrame — which fires
 * ~60 times/second — until playback actually reaches that boundary, then
 * act immediately. Wide net to detect we're close; frame-accurate polling
 * to act at the right instant, so the pause always lands within ~16ms of
 * the true boundary regardless of how choppy `timeupdate` is.
 */
const WORD_SYNC_BOUNDARY_LOOKAHEAD_MS = 600;
let wordSyncWatchingVerseKey: string | null = null;
let wordSyncRafHandle: number | null = null;

/**
 * True from the moment the main `audio` element is paused for a
 * translation-audio interlude until that interlude finishes (or is
 * cancelled). While true, `translationAudio` — not `audio` — is the
 * element the user is actually listening to, even though `isPlaying` in
 * the store stays true throughout (so the UI still shows "playing").
 *
 * `resume()`, `pause()`, `playSurah()`, and `setReciter()` are all
 * reachable from outside this module (buttons, media-session hardware
 * keys, the reciter picker) and none of them know about the interlude —
 * without this flag, any of them firing mid-interlude would resume/replace
 * the *main* Arabic audio while the translation clip kept playing
 * underneath, producing both at once. Every public control below checks
 * this flag first and defers to the interlude instead of fighting it.
 */
let isInTranslationInterlude = false;

/**
 * everyayah.com mode plays one file per ayah — without this, there's a
 * network-fetch-sized gap of silence every time playback advances to the
 * next ayah, since nothing starts loading it until the current one ends.
 * quran.com mode doesn't need this: a whole surah is one file, already
 * streaming/buffering natively via the main <audio> element.
 */
let preloadAudio: HTMLAudioElement | null = null;

function preloadNextAyah(currentIndex: number): void {
  const reciter = currentReciter();
  if (reciter.source !== 'everyayah.com') return;

  const nextAyahNumber = everyAyahQueue[currentIndex + 1];
  if (nextAyahNumber === undefined) return;

  const surah = currentSurah();
  const url = buildAyahAudioUrl(reciter.folderName, surah.id, nextAyahNumber);

  void resolveSrc(url)
    .then((resolvedUrl) => {
      if (!preloadAudio) {
        preloadAudio = new Audio();
        preloadAudio.preload = 'auto';
      }
      preloadAudio.src = resolvedUrl;
    })
    .catch(() => {
      // Best-effort only — a failed preload just means the normal fetch-on-advance path runs instead.
    });
}

function getAudio(): HTMLAudioElement {
  if (!audio) {
    audio = new Audio();
    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('ended', handleEnded);
  }
  return audio;
}

async function resolveSrc(url: string): Promise<string> {
  const cached = await getCachedSurahAudio(url);
  return cached ?? url;
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
function activeTranslationAudioEditions(): TranslationAudioEdition[] {
  const { urduTranslationAudioEnabled, englishTranslationAudioEnabled } = usePlaybackStore.getState();
  const editions: TranslationAudioEdition[] = [];
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

// --- quran.com mode: one whole-chapter file, word+verse segments ---

async function loadRecitation(recitationId: number, surahId: number): Promise<ChapterRecitation> {
  const key = `${recitationId}:${surahId}`;
  if (recitationCache?.key === key) return recitationCache.data;
  const data = await getChapterRecitation(recitationId, surahId);
  recitationCache = { key, data };
  return data;
}

function activeTimestampIndex(recitation: ChapterRecitation, currentMs: number): number {
  return recitation.timestamps.findIndex(
    (timestamp) => currentMs >= timestamp.timestampFrom && currentMs < timestamp.timestampTo
  );
}

/**
 * Advances past one ayah boundary for word-synced (quran.com) reciters —
 * shared by the normal path and by resumeAfterTranslationInterlude below,
 * since a translation interlude just delays this decision, it doesn't
 * change it.
 */
function advanceWordSyncBoundary(timestamp: VerseTimestamp, ayahNumber: number): void {
  if (!audio || !recitationCache) return;
  const { loopMode, range, autoplayEnabled } = usePlaybackStore.getState();

  if (loopMode === 'ayah') {
    audio.currentTime = timestamp.timestampFrom / 1000;
  } else if (loopMode === 'range' && range && ayahNumber >= range.endAyah) {
    const startTimestamp = recitationCache.data.timestamps.find(
      (item) => Number(item.verseKey.split(':')[1]) === range.startAyah
    );
    if (startTimestamp) audio.currentTime = startTimestamp.timestampFrom / 1000;
  } else if (loopMode === 'off' && !autoplayEnabled) {
    pause();
  }
}

/**
 * Resumes word-synced recitation after the Urdu translation interlude for
 * one ayah finishes. Main audio was paused (not stopped) right at the ayah
 * boundary, so resuming just means: apply whatever the loop mode would
 * have done at that boundary, then un-pause — unless the user paused
 * playback themselves during the interlude, in which case leave it paused.
 */
function resumeAfterTranslationInterlude(
  timestamp: VerseTimestamp,
  ayahNumber: number
): void {
  isInTranslationInterlude = false;
  if (!audio || !usePlaybackStore.getState().isPlaying) return;
  advanceWordSyncBoundary(timestamp, ayahNumber);
  if (usePlaybackStore.getState().isPlaying) void audio.play();
}

function cancelWordSyncBoundaryWatch(): void {
  if (wordSyncRafHandle !== null) {
    cancelAnimationFrame(wordSyncRafHandle);
    wordSyncRafHandle = null;
  }
  wordSyncWatchingVerseKey = null;
}

/** Frame-accurate polling for the last stretch of an ayah — see WORD_SYNC_BOUNDARY_LOOKAHEAD_MS docstring. */
function watchForWordSyncBoundary(timestamp: VerseTimestamp, ayahNumber: number): void {
  const check = (): void => {
    if (!audio || audio.paused) {
      // Cleared (not just the handle) so a later resume re-arms the watch
      // for this same ayah instead of silently skipping it forever.
      wordSyncRafHandle = null;
      wordSyncWatchingVerseKey = null;
      return;
    }
    if (audio.currentTime * 1000 >= timestamp.timestampTo) {
      wordSyncRafHandle = null;
      wordSyncWatchingVerseKey = null;
      handleWordSyncAyahBoundary(timestamp, ayahNumber);
      return;
    }
    wordSyncRafHandle = requestAnimationFrame(check);
  };
  wordSyncRafHandle = requestAnimationFrame(check);
}

function handleWordSyncAyahBoundary(timestamp: VerseTimestamp, ayahNumber: number): void {
  if (!audio || !recitationCache) return;

  const editions = activeTranslationAudioEditions();
  if (editions.length === 0) {
    advanceWordSyncBoundary(timestamp, ayahNumber);
    return;
  }

  const { loopMode, range, autoplayEnabled } = usePlaybackStore.getState();
  const isRangeEnd = loopMode === 'range' && range !== null && ayahNumber >= range.endAyah;
  const isLastAyahOfSurah = timestamp === recitationCache.data.timestamps[recitationCache.data.timestamps.length - 1];
  const forceFlush = loopMode === 'ayah' || (loopMode === 'off' && !autoplayEnabled) || isRangeEnd || isLastAyahOfSurah;

  const group = collectForTranslationGroup(timestamp.verseKey, forceFlush);
  if (!group) return; // not a group boundary yet — let recitation continue straight into the next ayah

  audio.currentTime = timestamp.timestampTo / 1000;
  audio.pause();
  isInTranslationInterlude = true;
  void playTranslationGroup(group, editions).then(() => resumeAfterTranslationInterlude(timestamp, ayahNumber));
}

function handleQuranComTimeUpdate(): void {
  if (!audio || !recitationCache) return;
  // Reentrancy guard: while intentionally paused for a translation interlude,
  // ignore any stray timeupdate ticks (some browsers fire one right around a
  // currentTime/pause() change) rather than re-processing the same boundary.
  if (audio.paused) return;

  const currentMs = audio.currentTime * 1000;
  const index = activeTimestampIndex(recitationCache.data, currentMs);
  if (index === -1) return;

  const timestamp = recitationCache.data.timestamps[index];
  if (!timestamp) return;

  usePlaybackStore.getState().setVerseKey(timestamp.verseKey);
  const activeSegment = timestamp.segments.find(
    (segment) => currentMs >= segment.startMs && currentMs < segment.endMs
  );
  usePlaybackStore.getState().setActiveWord(activeSegment?.wordPosition ?? null);

  const ayahNumber = Number(timestamp.verseKey.split(':')[1]);

  if (activeTranslationAudioEditions().length === 0) {
    if (currentMs >= timestamp.timestampTo - 30) advanceWordSyncBoundary(timestamp, ayahNumber);
    return;
  }

  if (currentMs < timestamp.timestampTo - WORD_SYNC_BOUNDARY_LOOKAHEAD_MS) return;
  if (wordSyncWatchingVerseKey === timestamp.verseKey) return; // already polling this ayah's boundary via rAF
  wordSyncWatchingVerseKey = timestamp.verseKey;
  watchForWordSyncBoundary(timestamp, ayahNumber);
}

// --- everyayah.com mode: one file per ayah, verse-level only ---

function buildQueue(surahId: number, versesCount: number, range: PlaybackRange | null): number[] {
  const start = range?.startAyah ?? 1;
  const end = range?.endAyah ?? versesCount;
  const queue: number[] = [];
  for (let ayah = start; ayah <= end; ayah += 1) queue.push(ayah);
  return queue;
}

async function playQueueIndex(index: number): Promise<void> {
  const reciter = currentReciter();
  const surah = currentSurah();
  if (reciter.source !== 'everyayah.com') return;

  const ayahNumber = everyAyahQueue[index];
  if (ayahNumber === undefined) return;

  queueIndex = index;
  const url = buildAyahAudioUrl(reciter.folderName, surah.id, ayahNumber);
  const player = getAudio();
  player.src = await resolveSrc(url);
  player.playbackRate = usePlaybackStore.getState().playbackSpeed;
  usePlaybackStore.getState().setVerseKey(`${surah.id}:${ayahNumber}`);
  updateMediaSessionMetadata(reciter.name, surah.nameSimple, ayahNumber);
  await player.play();
  preloadNextAyah(index);
}

function getTranslationAudioPlayer(): HTMLAudioElement {
  if (!translationAudio) {
    translationAudio = new Audio();
  }
  return translationAudio;
}

/**
 * Plays one translation-audio clip to completion.
 *
 * Fixes a truncation bug where only a fragment played before cutting off:
 * the 'ended' listener was previously attached *after* `await player.play()`
 * resolved. `play()` resolves once playback *starts*, not once it's fully
 * buffered — for a clip whose data was already cached/buffered quickly,
 * playback could reach 'ended' before the listener was attached, so the
 * event was missed and the wrapping promise never resolved on its own
 * (only ever surviving by accident, e.g. a later unrelated pause() call
 * elsewhere resolving it early with whatever had played so far). Attaching
 * the listener *before* calling play() closes that race. Explicitly
 * pausing + reloading before each clip also guarantees no state (buffered
 * range, playback position) carries over from the previous clip.
 */
/**
 * Resolves `true` if the clip actually finished playing, `false` if it
 * failed (network/decode error, or play() rejected — e.g. an interrupted
 * load). Previously both 'ended' and 'error' were treated identically,
 * which meant a failed clip looked exactly like a successfully finished
 * one to every caller — no way to tell "this ayah has no audio" apart
 * from "it played fine", so failures were both silent AND invisible in
 * the console. Distinguishing them here is what makes the fallback in
 * playTranslationAudioForVerse (skip + log) possible.
 */
function playTranslationClip(url: string): Promise<boolean> {
  const player = getTranslationAudioPlayer();
  player.pause();
  player.currentTime = 0;
  player.src = url;
  player.load();

  return new Promise<boolean>((resolve) => {
    const finish = (succeeded: boolean) => (): void => {
      player.removeEventListener('ended', onEnded);
      player.removeEventListener('error', onError);
      resolve(succeeded);
    };
    const onEnded = finish(true);
    const onError = finish(false);
    player.addEventListener('ended', onEnded, { once: true });
    player.addEventListener('error', onError, { once: true });
    void player.play().catch(onError);
  });
}

/**
 * Plays one ayah's translation audio for a given edition and resolves once
 * it fully finishes (or fails). Best-effort: a failed fetch/playback
 * shouldn't block the main recitation queue from advancing — but unlike
 * before, it's no longer silent: a failure is logged with the exact
 * request context (edition, verse, reciter) so a real source gap or a
 * transient failure is distinguishable from a working clip, instead of
 * both looking like nothing happened.
 */
async function playTranslationAudioForVerse(verseKey: string, edition: TranslationAudioEdition): Promise<void> {
  try {
    const url = await getAyahEditionAudio(verseKey, edition.identifier);
    const succeeded = await playTranslationClip(url);
    if (!succeeded) {
      console.warn(
        `[translation-audio] "${edition.label}" (${edition.identifier}) failed to play for ${verseKey} — url: ${url}, reciter: ${usePlaybackStore.getState().reciterId}. Skipping to the next ayah.`
      );
    }
  } catch (error) {
    console.warn(
      `[translation-audio] "${edition.label}" (${edition.identifier}) failed to load for ${verseKey} — reciter: ${usePlaybackStore.getState().reciterId}.`,
      error
    );
  }
}

/**
 * Buffers ayahs for grouped Urdu translation playback. Returns (and clears)
 * the group once it reaches TRANSLATION_GROUP_SIZE, or immediately when
 * `force` is set — used for single-ayah playback (loop-ayah, or a manual
 * one-ayah play with autoplay off) and for a trailing partial group at the
 * end of a surah/range, where waiting for a full group of 3 would either
 * make no sense or silently drop the last 1–2 ayahs' translations.
 */
function collectForTranslationGroup(verseKey: string, force: boolean): string[] | null {
  translationGroupKeys.push(verseKey);
  if (translationGroupKeys.length >= TRANSLATION_GROUP_SIZE || force) {
    const group = translationGroupKeys;
    translationGroupKeys = [];
    return group;
  }
  return null;
}

/** Plays every ayah's translation for one edition, then the next edition — e.g. all 3 ayahs in Urdu, then all 3 in English. */
async function playTranslationGroup(verseKeys: string[], editions: TranslationAudioEdition[]): Promise<void> {
  for (const edition of editions) {
    for (const verseKey of verseKeys) {
      await playTranslationAudioForVerse(verseKey, edition);
    }
  }
}

function advanceEveryAyahQueue(): void {
  const { loopMode, autoplayEnabled } = usePlaybackStore.getState();

  if (loopMode === 'ayah') {
    void playQueueIndex(queueIndex);
    return;
  }

  if (!autoplayEnabled && loopMode === 'off') {
    pause();
    return;
  }

  const nextIndex = queueIndex + 1;
  if (nextIndex < everyAyahQueue.length) {
    void playQueueIndex(nextIndex);
    return;
  }

  if (loopMode === 'surah' || loopMode === 'range') {
    void playQueueIndex(0);
    return;
  }

  stop();
}

function handleEveryAyahEnded(): void {
  const { verseKey, loopMode, autoplayEnabled } = usePlaybackStore.getState();
  const editions = activeTranslationAudioEditions();

  if (editions.length > 0 && verseKey) {
    const isLastInQueue = queueIndex === everyAyahQueue.length - 1;
    const forceFlush = loopMode === 'ayah' || (loopMode === 'off' && !autoplayEnabled) || isLastInQueue;
    const group = collectForTranslationGroup(verseKey, forceFlush);
    if (group) {
      isInTranslationInterlude = true;
      void playTranslationGroup(group, editions).then(() => {
        isInTranslationInterlude = false;
        advanceEveryAyahQueue();
      });
      return;
    }
    advanceEveryAyahQueue();
    return;
  }

  advanceEveryAyahQueue();
}

// --- shared handlers ---

function handleTimeUpdate(): void {
  if (!audio) return;
  usePlaybackStore.getState().setProgress(audio.currentTime, audio.duration || 0);
  if (currentReciter().supportsWordSync) handleQuranComTimeUpdate();
}

function handleEnded(): void {
  const reciter = currentReciter();
  if (reciter.supportsWordSync) {
    const { loopMode } = usePlaybackStore.getState();
    if (loopMode === 'surah' && audio) {
      audio.currentTime = 0;
      void audio.play();
      return;
    }
    stop();
    return;
  }
  handleEveryAyahEnded();
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
  if (mediaSessionWired || !('mediaSession' in navigator)) return;
  mediaSessionWired = true;
  navigator.mediaSession.setActionHandler('play', () => resume());
  navigator.mediaSession.setActionHandler('pause', () => pause());
  navigator.mediaSession.setActionHandler('nexttrack', () => void next());
  navigator.mediaSession.setActionHandler('previoustrack', () => void previous());
}

// --- public controls ---

export async function playSurah(surahId: number, startAyah = 1): Promise<void> {
  wireMediaSessionActions();
  const store = usePlaybackStore.getState();
  const reciter = getReciterById(store.reciterId);
  const surah = SURAHS.find((item) => item.id === surahId);
  if (!reciter || !surah) return;

  // Fresh start — cancel any in-progress translation interlude (a genuinely
  // new surah/ayah supersedes it) and don't let a leftover partial
  // translation group from a previous session/surah bleed into this one.
  translationAudio?.pause();
  isInTranslationInterlude = false;
  translationGroupKeys = [];
  cancelWordSyncBoundaryWatch();

  store.setSurahId(surahId);
  store.setLoading(true);
  const player = getAudio();
  const verseKey = `${surahId}:${startAyah}`;

  try {
    if (reciter.source === 'quran.com') {
      const recitation = await loadRecitation(reciter.recitationId, surahId);
      const timestamp = recitation.timestamps.find((item) => item.verseKey === verseKey);
      player.src = await resolveSrc(recitation.audioUrl);
      player.playbackRate = store.playbackSpeed;
      player.currentTime = (timestamp?.timestampFrom ?? 0) / 1000;
      updateMediaSessionMetadata(reciter.name, surah.nameSimple, startAyah);
      usePlaybackStore.getState().begin('surah', verseKey, pause);
      await player.play();
    } else {
      everyAyahQueue = buildQueue(surahId, surah.versesCount, store.range);
      const index = Math.max(0, everyAyahQueue.indexOf(startAyah));
      usePlaybackStore.getState().begin('surah', verseKey, pause);
      await playQueueIndex(index);
    }
  } finally {
    usePlaybackStore.getState().setLoading(false);
  }
}

export function pause(): void {
  audio?.pause();
  translationAudio?.pause();
  usePlaybackStore.setState({ isPlaying: false });
}

export function resume(): void {
  // Mid-interlude, the thing actually producing sound is translationAudio,
  // not the (intentionally paused) main audio — resuming the main audio
  // here would start the Arabic recitation again while the translation
  // clip keeps playing underneath. See isInTranslationInterlude docstring.
  if (isInTranslationInterlude) {
    if (!translationAudio) return;
    void translationAudio.play();
    usePlaybackStore.setState({ isPlaying: true });
    return;
  }
  if (!audio) return;
  void audio.play();
  usePlaybackStore.setState({ isPlaying: true });
}

/**
 * Seeks within the currently loaded audio. For quran.com reciters this spans
 * the whole surah; for everyayah.com reciters it's bounded to the current
 * ayah's file (each ayah is a separate file in that mode).
 */
export function seekToTime(seconds: number): void {
  if (!audio) return;
  audio.currentTime = seconds;
}

export async function next(): Promise<void> {
  const reciter = currentReciter();
  if (reciter.source === 'quran.com' && audio && recitationCache) {
    cancelWordSyncBoundaryWatch();
    const currentMs = audio.currentTime * 1000;
    const index = activeTimestampIndex(recitationCache.data, currentMs);
    const nextTimestamp = recitationCache.data.timestamps[index + 1];
    if (nextTimestamp) audio.currentTime = nextTimestamp.timestampFrom / 1000;
    return;
  }
  await playQueueIndex(queueIndex + 1);
}

export async function previous(): Promise<void> {
  const reciter = currentReciter();
  if (reciter.source === 'quran.com' && audio && recitationCache) {
    cancelWordSyncBoundaryWatch();
    const currentMs = audio.currentTime * 1000;
    const index = activeTimestampIndex(recitationCache.data, currentMs);
    const previousTimestamp = recitationCache.data.timestamps[index - 1];
    if (previousTimestamp) audio.currentTime = previousTimestamp.timestampFrom / 1000;
    return;
  }
  await playQueueIndex(queueIndex - 1);
}

export function setLoopMode(mode: LoopMode): void {
  usePlaybackStore.getState().setLoopMode(mode);
}

export function setRange(range: PlaybackRange | null): void {
  usePlaybackStore.getState().setRange(range);
}

export function setSpeed(speed: number): void {
  usePlaybackStore.getState().setPlaybackSpeed(speed);
  if (audio) audio.playbackRate = speed;
}

export function setReciter(reciterId: string): void {
  // No-op guard: picking the same reciter that's already selected must never
  // restart playback — without this, any redundant call (e.g. a UI element
  // re-firing the current value) would interrupt an in-progress translation
  // interlude or just jarringly restart the current ayah for no reason.
  if (usePlaybackStore.getState().reciterId === reciterId) return;

  const wasPlaying = usePlaybackStore.getState().isPlaying;
  const surahId = usePlaybackStore.getState().surahId;
  const verseKey = usePlaybackStore.getState().verseKey;
  const resumeAyah = verseKey ? Number(verseKey.split(':')[1]) : 1;

  usePlaybackStore.getState().setReciterId(reciterId);
  recitationCache = null;

  if (wasPlaying && surahId) {
    void playSurah(surahId, resumeAyah);
  }
}

/**
 * Call whenever the Urdu/English translation-audio toggles change. Without
 * this, ayahs collected into `translationGroupKeys` *before* a toggle
 * flips off sit there un-flushed (that branch never touches the group
 * while translation audio is off) — so turning it back on later mixes
 * those stale, possibly long-past ayahs into the next group instead of
 * starting a clean group from where playback currently is.
 */
export function resetTranslationAudioGroup(): void {
  translationGroupKeys = [];
}

export function stop(): void {
  audio?.pause();
  translationAudio?.pause();
  isInTranslationInterlude = false;
  translationGroupKeys = [];
  cancelWordSyncBoundaryWatch();
  usePlaybackStore.getState().stop();
}

export function seekToAyah(ayahNumber: number): void {
  const store = usePlaybackStore.getState();
  if (store.surahId === null) return;
  void playSurah(store.surahId, ayahNumber);
}

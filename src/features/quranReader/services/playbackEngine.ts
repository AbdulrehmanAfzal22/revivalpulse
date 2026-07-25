import { getChapterRecitation } from 'api/quran/quranClient';
import { buildAyahAudioUrl } from 'api/quran/everyAyahClient';
import { getCachedSurahAudio } from 'services/surahAudioCache';
import { getReciterById } from 'constants/reciters';
import { SURAHS } from 'data/quran/surahs';
import { usePlaybackStore } from 'stores/playbackStore';
import type { ChapterRecitation } from 'types/word.types';
import type { LoopMode, PlaybackRange } from 'types/audioPlayer.types';

let audio: HTMLAudioElement | null = null;
let recitationCache: { key: string; data: ChapterRecitation } | null = null;
let everyAyahQueue: number[] = [];
let queueIndex = 0;
let mediaSessionWired = false;

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

function handleQuranComTimeUpdate(): void {
  if (!audio || !recitationCache) return;
  const currentMs = audio.currentTime * 1000;
  const { loopMode, range, autoplayEnabled } = usePlaybackStore.getState();
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

  if (loopMode === 'ayah' && currentMs >= timestamp.timestampTo - 30) {
    audio.currentTime = timestamp.timestampFrom / 1000;
  } else if (loopMode === 'range' && range && ayahNumber >= range.endAyah && currentMs >= timestamp.timestampTo - 30) {
    const startTimestamp = recitationCache.data.timestamps.find(
      (item) => Number(item.verseKey.split(':')[1]) === range.startAyah
    );
    if (startTimestamp) audio.currentTime = startTimestamp.timestampFrom / 1000;
  } else if (loopMode === 'off' && !autoplayEnabled && currentMs >= timestamp.timestampTo - 30) {
    pause();
  }
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

function handleEveryAyahEnded(): void {
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
  usePlaybackStore.setState({ isPlaying: false });
}

export function resume(): void {
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

export function stop(): void {
  audio?.pause();
  usePlaybackStore.getState().stop();
}

export function seekToAyah(ayahNumber: number): void {
  const store = usePlaybackStore.getState();
  if (store.surahId === null) return;
  void playSurah(store.surahId, ayahNumber);
}

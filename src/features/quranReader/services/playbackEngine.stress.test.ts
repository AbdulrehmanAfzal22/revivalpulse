import { controller } from './PlaybackController';
import { usePlaybackStore } from 'stores/playbackStore';

/**
 * Stress/concurrency testing for the playback engine. There's no real
 * browser/audio hardware available in this environment, so genuine
 * playback timing (rAF-driven ayah-boundary detection) can't be exercised
 * here — that needs a live device. What real automated tests *can* verify
 * without any of that: the epoch-cancellation guarantee itself, under
 * actually-overlapping async calls with deliberately staggered network
 * delays, using everyayah.com mode (fetch-one-file-per-ayah, no rAF timing
 * involved at all) so the scenario is fully driven by mocked promises
 * resolving in a controlled, adversarial order — exactly the situation the
 * epoch mechanism exists for.
 */

jest.mock('api/quran/quranClient', () => ({
  getChapterRecitation: jest.fn(),
}));
jest.mock('api/quran/alQuranCloudClient', () => ({
  getAyahEditionAudio: jest.fn().mockResolvedValue('https://example.com/clip.mp3'),
}));

const cacheDelays: number[] = [];
jest.mock('services/surahAudioCache', () => ({
  getCachedSurahAudio: jest.fn().mockImplementation(
    () =>
      new Promise((resolve) => {
        const delay = cacheDelays.shift() ?? 0;
        setTimeout(() => resolve(null), delay);
      })
  ),
}));

class FakeAudio {
  src = '';
  currentTime = 0;
  duration = 100;
  paused = true;
  playbackRate = 1;
  ended = false;
  private listeners: Record<string, Array<() => void>> = {};
  addEventListener(type: string, cb: () => void): void {
    (this.listeners[type] ??= []).push(cb);
  }
  removeEventListener(type: string, cb: () => void): void {
    this.listeners[type] = (this.listeners[type] ?? []).filter((listener) => listener !== cb);
  }
  play(): Promise<void> {
    this.paused = false;
    return Promise.resolve();
  }
  pause(): void {
    this.paused = true;
  }
  load(): void {
    // no-op fake
  }
}

describe('playback engine — concurrency/stress scenarios', () => {
  const RECITER_A = 'maher-muaiqly'; // everyayah.com
  const RECITER_B = 'saad-ghamdi'; // everyayah.com
  const SURAH_A = 114; // An-Nas, 6 ayahs — short, real corpus, no mocking of surah data needed
  const SURAH_B = 113; // Al-Falaq, 5 ayahs

  beforeEach(() => {
    (global as unknown as { Audio: typeof FakeAudio }).Audio = FakeAudio;
    cacheDelays.length = 0;
    controller.audio = null;
    controller.translationAudio = null;
    controller.preloadAudio = null;
    controller.recitationCache = null;
    controller.queue = [];
    controller.currentIndex = 0;
    controller.state = 'idle';
    controller.epoch = 0;
    controller.decodedRecitationCache = null;
    controller.activeTimestamp = null;
    controller.mediaSessionWired = false;
    usePlaybackStore.setState({
      reciterId: RECITER_A,
      surahId: null,
      verseKey: null,
      isPlaying: false,
      isLoading: false,
      source: null,
      loopMode: 'off',
      range: null,
      autoplayEnabled: true,
      urduTranslationAudioEnabled: false,
      englishTranslationAudioEnabled: false,
    });
  });

  test('rapid surah changes: the last call wins completely, the first leaves no trace', async () => {
    const engine = await import('./playbackEngine');

    cacheDelays.push(30, 5); // first call's fetch resolves LAST, second resolves FIRST — deliberately adversarial order
    const first = engine.playSurah(SURAH_A, 1);
    const second = engine.playSurah(SURAH_B, 1);

    await Promise.all([first, second]);
    await new Promise((resolve) => setTimeout(resolve, 50)); // let the slow, stale first call's continuation fully settle too

    expect(usePlaybackStore.getState().surahId).toBe(SURAH_B);
    expect(usePlaybackStore.getState().verseKey).toBe(`${SURAH_B}:1`);
    expect(usePlaybackStore.getState().isLoading).toBe(false);
    expect(controller.queue.every((item) => item.surah === SURAH_B)).toBe(true);
  });

  test('rapid ayah changes on the same surah: only the final target ayah is where playback ends up', async () => {
    const engine = await import('./playbackEngine');

    cacheDelays.push(30, 20, 5);
    await engine.playSurah(SURAH_A, 1);
    await new Promise((resolve) => setTimeout(resolve, 10));

    cacheDelays.push(30, 5);
    const a = engine.seekToAyah(2);
    const b = engine.seekToAyah(4);
    await Promise.resolve(a);
    await Promise.resolve(b);
    await new Promise((resolve) => setTimeout(resolve, 50));

    expect(usePlaybackStore.getState().verseKey).toBe(`${SURAH_A}:4`);
  });

  test('rapid reciter changes: final reciterId and queue both reflect only the last change', async () => {
    const engine = await import('./playbackEngine');

    cacheDelays.push(10);
    await engine.playSurah(SURAH_A, 1);
    await new Promise((resolve) => setTimeout(resolve, 20));

    cacheDelays.push(30, 5);
    engine.setReciter(RECITER_B);
    engine.setReciter(RECITER_A);
    await new Promise((resolve) => setTimeout(resolve, 60));

    expect(usePlaybackStore.getState().reciterId).toBe(RECITER_A);
    expect(usePlaybackStore.getState().surahId).toBe(SURAH_A);
  });

  test('rapid pause/resume/pause never throws and leaves a consistent final isPlaying', async () => {
    const engine = await import('./playbackEngine');
    cacheDelays.push(5);
    await engine.playSurah(SURAH_A, 1);

    expect(() => {
      engine.pause();
      engine.resume();
      engine.pause();
    }).not.toThrow();

    expect(usePlaybackStore.getState().isPlaying).toBe(false);
  });

  test('stop during an in-flight load leaves the engine idle, not half-loaded', async () => {
    const engine = await import('./playbackEngine');
    cacheDelays.push(40);
    const loadPromise = engine.playSurah(SURAH_A, 1);
    engine.stop();
    await loadPromise;
    await new Promise((resolve) => setTimeout(resolve, 60));

    // surahId itself is allowed to stay stale after stop() — that's the
    // pre-existing contract (the player bar hides via `source`, not
    // `surahId`; AyahRenderer/AudioPlayer already gate on `source`). What
    // must never happen is isLoading getting stuck true forever, or the
    // queue/source still reflecting an active session.
    expect(usePlaybackStore.getState().source).toBeNull();
    expect(usePlaybackStore.getState().isLoading).toBe(false);
    expect(controller.queue).toEqual([]);
  });

  test('mixed rapid interactions (surah change, then reciter change, then pause) settle into one coherent final state', async () => {
    const engine = await import('./playbackEngine');
    cacheDelays.push(20, 15, 5);

    engine.playSurah(SURAH_A, 1);
    engine.playSurah(SURAH_B, 3);
    engine.setReciter(RECITER_B);
    await new Promise((resolve) => setTimeout(resolve, 80));
    engine.pause();

    const state = usePlaybackStore.getState();
    // Whichever of these ended up "last" per the mocked delays, the
    // invariant under test is *consistency*, not a specific winner: surahId,
    // verseKey's surah portion, and controller.queue must all agree.
    expect(controller.queue.every((item) => item.surah === state.surahId)).toBe(true);
    expect(state.verseKey?.split(':')[0]).toBe(String(state.surahId));
    expect(state.isPlaying).toBe(false);
  });
});

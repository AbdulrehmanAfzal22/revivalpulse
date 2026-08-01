import { controller } from './PlaybackController';
import { usePlaybackStore } from 'stores/playbackStore';

/**
 * Preloading: as soon as a surah is opened (before Play is pressed),
 * preloadSurah() should warm the exact same caches load() reads from, so a
 * real Play press finds everything already there. These tests cover the
 * three properties that actually matter: (1) preloading alone populates the
 * caches without touching playback state, (2) a real Play press for the same
 * surah while preloading is still in flight joins that same request instead
 * of firing a duplicate one, and its result still gets cached correctly
 * (this is the specific bug the latestKey-based guard — replacing the
 * epoch-based one — exists to fix: epoch doesn't change for a preload, so
 * gating the cache write on "epoch unchanged since whoever started the
 * fetch" would wrongly discard a result a real, current session is waiting
 * on), and (3) switching to a different surah mid-preload supersedes the
 * first one, which — however its network call happens to resolve — must
 * never clobber the cache with stale data.
 */

jest.mock('api/quran/alQuranCloudClient', () => ({
  getAyahEditionAudio: jest.fn(() => new Promise(() => {})),
}));
jest.mock('services/surahAudioCache', () => ({
  getCachedSurahAudio: jest.fn().mockResolvedValue(null),
}));
jest.mock('services/queryClient', () => ({
  queryClient: { prefetchQuery: jest.fn() },
}));
jest.mock('features/quranReader/services/translationAggregator', () => ({
  fetchChapterWithTranslations: jest.fn(),
}));

const chapterDelays: number[] = [];
jest.mock('api/quran/quranClient', () => ({ getChapterRecitation: jest.fn() }));

/**
 * CRA's Jest config resets mock implementations (not just call counts) after
 * every test, so an implementation set only once via the jest.mock() factory
 * above would silently vanish after the first test in this file, leaving
 * every later test's getChapterRecitation() returning undefined. Rebuilding
 * it fresh in beforeEach (below) is what makes it survive.
 */
function installGetChapterRecitationMock(): void {
  const { getChapterRecitation } = jest.requireMock('api/quran/quranClient') as { getChapterRecitation: jest.Mock };
  getChapterRecitation.mockImplementation(
    () =>
      new Promise((resolve) => {
        const delay = chapterDelays.shift() ?? 0;
        setTimeout(
          () =>
            resolve({
              audioUrl: 'https://example.com/chapter.mp3',
              timestamps: [
                { verseKey: '114:1', timestampFrom: 0, timestampTo: 1000, segments: [] },
                { verseKey: '114:2', timestampFrom: 1000, timestampTo: 2000, segments: [] },
              ],
            }),
          delay
        );
      })
  );
}

class FakeAudio {
  src = '';
  currentTime = 0;
  duration = 100;
  paused = true;
  playbackRate = 1;
  ended = false;
  preload = '';
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

class FakeAudioBuffer {
  private channels: Float32Array[];
  constructor(
    public numberOfChannels: number,
    public length: number,
    public sampleRate: number
  ) {
    this.channels = Array.from({ length: numberOfChannels }, () => new Float32Array(length));
  }
  getChannelData(channel: number): Float32Array {
    return this.channels[channel]!;
  }
  copyToChannel(source: Float32Array, channel: number): void {
    this.channels[channel]!.set(source);
  }
}

describe('preloadSurah: warms audio caches ahead of Play', () => {
  const RECITER = 'alafasy'; // quran.com — the mode with an expensive upfront decode worth preloading
  const SURAH = 114;
  let decodeAudioDataMock: jest.Mock;
  let fetchMock: jest.Mock;

  beforeEach(() => {
    chapterDelays.length = 0;
    installGetChapterRecitationMock();
    (global as unknown as { Audio: typeof FakeAudio }).Audio = FakeAudio;
    decodeAudioDataMock = jest.fn().mockResolvedValue(new FakeAudioBuffer(1, 2000, 1000));
    (global as unknown as { AudioContext: new () => unknown }).AudioContext = class {
      createBuffer = (numberOfChannels: number, length: number, sampleRate: number) =>
        new FakeAudioBuffer(numberOfChannels, length, sampleRate);
      decodeAudioData = decodeAudioDataMock;
    };
    fetchMock = jest.fn().mockResolvedValue({ arrayBuffer: () => Promise.resolve(new ArrayBuffer(8)) });
    (global as unknown as { fetch: jest.Mock }).fetch = fetchMock;
    (global as unknown as { URL: { createObjectURL: jest.Mock; revokeObjectURL: jest.Mock } }).URL = {
      createObjectURL: jest.fn(() => 'blob:mock-url'),
      revokeObjectURL: jest.fn(),
    };

    controller.audio = null;
    controller.translationAudio = null;
    controller.preloadAudio = null;
    controller.recitationCache = null;
    controller.recitationFetch = null;
    controller.recitationLatestKey = null;
    controller.decodedRecitationCache = null;
    controller.decodedRecitationFetch = null;
    controller.decodedRecitationLatestKey = null;
    controller.audioContext = null;
    controller.activeTimestamp = null;
    controller.queue = [];
    controller.currentIndex = 0;
    controller.state = 'idle';
    controller.epoch = 0;
    controller.preloadToken = 0;
    controller.mediaSessionWired = false;
    usePlaybackStore.setState({
      reciterId: RECITER,
      surahId: null,
      verseKey: null,
      isPlaying: false,
      isLoading: false,
      isSurahPreloading: false,
      source: null,
      loopMode: 'off',
      range: null,
      autoplayEnabled: true,
      urduTranslationAudioEnabled: false,
      englishTranslationAudioEnabled: false,
    });
  });

  test('preloading alone populates both caches without starting playback', async () => {
    const engine = await import('./playbackEngine');
    engine.preloadSurah(SURAH, 1);

    await new Promise((resolve) => setTimeout(resolve, 20));

    expect(controller.recitationCache?.key).toBe('7:114'); // alafasy's recitationId is 7
    expect(controller.decodedRecitationCache?.key).toBe('7:114');
    // Nothing about actual playback moved — preloading a surah merely opened must never start audio.
    expect(controller.state).toBe('idle');
    expect(controller.queue).toEqual([]);
    expect(usePlaybackStore.getState().isPlaying).toBe(false);
  });

  test('isSurahPreloading toggles on while in flight and off once settled', async () => {
    chapterDelays.push(15);
    const engine = await import('./playbackEngine');
    engine.preloadSurah(SURAH, 1);

    expect(usePlaybackStore.getState().isSurahPreloading).toBe(true);
    await new Promise((resolve) => setTimeout(resolve, 30));
    expect(usePlaybackStore.getState().isSurahPreloading).toBe(false);
  });

  test('a real Play press joins an in-flight preload instead of duplicating the fetch, and still ends up cached', async () => {
    const { getChapterRecitation } = jest.requireMock('api/quran/quranClient') as { getChapterRecitation: jest.Mock };
    chapterDelays.push(20);

    const engine = await import('./playbackEngine');
    engine.preloadSurah(SURAH, 1); // starts the fetch first, epoch stays 0

    await new Promise((resolve) => setTimeout(resolve, 5)); // let preload's fetch actually start, before Play

    await engine.playSurah(SURAH, 1); // bumps epoch to 1, must join the SAME in-flight fetch, not start a second one

    expect(getChapterRecitation).toHaveBeenCalledTimes(1); // the crux: no duplicate network call
    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(decodeAudioDataMock).toHaveBeenCalledTimes(1);
    // And critically: the result must still be cached for the (now real,
    // higher-epoch) session to use — this is exactly what an epoch-only
    // guard would have gotten wrong, since epoch changed between when the
    // fetch was *started* (by preload, epoch 0) and when it *resolved*.
    expect(controller.recitationCache?.key).toBe('7:114');
    expect(controller.decodedRecitationCache?.key).toBe('7:114');
    expect(controller.state).toBe('playing-recitation');
  });

  test('switching surahs mid-preload supersedes the first — its eventual resolution never overwrites the second', async () => {
    const OTHER_SURAH = 113;
    chapterDelays.push(30, 5); // first surah's fetch resolves LAST, second resolves FIRST — adversarial order

    const engine = await import('./playbackEngine');
    engine.preloadSurah(SURAH, 1);
    engine.preloadSurah(OTHER_SURAH, 1); // user immediately switched away — supersedes the first

    await new Promise((resolve) => setTimeout(resolve, 50)); // let both fetches (including the slow, stale first one) fully settle

    expect(controller.recitationCache?.key).toBe(`7:${OTHER_SURAH}`);
    expect(controller.decodedRecitationCache?.key).toBe(`7:${OTHER_SURAH}`);
  });

  test('everyayah.com mode preloads the starting ayah into preloadAudio', async () => {
    usePlaybackStore.setState({ reciterId: 'maher-muaiqly' });
    const engine = await import('./playbackEngine');
    engine.preloadSurah(SURAH, 3);

    await new Promise((resolve) => setTimeout(resolve, 10));

    // getCachedSurahAudio is mocked to resolve null (no offline cache hit),
    // so resolveSrc falls through to the plain network URL for ayah 3 —
    // the exact one Play would need moments later.
    expect(controller.preloadAudio).not.toBeNull();
    expect(controller.preloadAudio!.src).toBe('https://everyayah.com/data/Maher_AlMuaiqly_64kbps/114003.mp3');
  });
});

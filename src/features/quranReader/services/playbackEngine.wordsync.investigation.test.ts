import { controller } from './PlaybackController';
import { usePlaybackStore } from 'stores/playbackStore';

/**
 * Investigation, not a fix: proves — deterministically, not by inference —
 * that word-highlighting is driven exclusively by the native 'timeupdate'
 * event, and that this alone is sufficient to permanently skip a genuinely
 * spoken word whenever that word's own duration is shorter than the gap
 * between two consecutive 'timeupdate' firings. Per the WHATWG spec
 * (https://html.spec.whatwg.org/multipage/media.html#event-media-timeupdate),
 * "the event ... must be dispatched ... no more frequently than every 15ms
 * and no less frequently than every 250ms" — i.e. browsers are explicitly
 * permitted to sample as coarsely as every 250ms, and commonly do. Real
 * recited words are frequently shorter than that. This test does not
 * simulate a hypothetical browser bug — it drives the engine's *actual*
 * listener (`handleTimeUpdate`, attached via `controller.audio.addEventListener('timeupdate', ...)`
 * in getAudio()) with a fixed, spec-legal sampling schedule and shows a real
 * segment is never observed.
 */

jest.mock('api/quran/quranClient', () => ({ getChapterRecitation: jest.fn() }));
jest.mock('api/quran/alQuranCloudClient', () => ({
  getAyahEditionAudio: jest.fn(() => new Promise(() => {})),
}));
jest.mock('services/surahAudioCache', () => ({
  getCachedSurahAudio: jest.fn().mockResolvedValue(null),
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
  /** Simulates the browser delivering a 'timeupdate' at whatever currentTime the test has just set. */
  fire(type: string): void {
    (this.listeners[type] ?? []).forEach((cb) => cb());
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

describe('investigation: word-highlighting is driven by "timeupdate", not by a continuous clock', () => {
  const RECITER = 'alafasy'; // supportsWordSync: true
  const SURAH = 114;

  beforeEach(() => {
    (global as unknown as { Audio: typeof FakeAudio }).Audio = FakeAudio;
    (global as unknown as { AudioContext: new () => unknown }).AudioContext = class {
      createBuffer = (numberOfChannels: number, length: number, sampleRate: number) =>
        new FakeAudioBuffer(numberOfChannels, length, sampleRate);
      decodeAudioData = jest.fn().mockResolvedValue(new FakeAudioBuffer(1, 1000, 1000));
    };
    (global as unknown as { fetch: jest.Mock }).fetch = jest.fn().mockResolvedValue({
      arrayBuffer: () => Promise.resolve(new ArrayBuffer(8)),
    });
    (global as unknown as { URL: { createObjectURL: jest.Mock; revokeObjectURL: jest.Mock } }).URL = {
      createObjectURL: jest.fn(() => 'blob:mock-url'),
      revokeObjectURL: jest.fn(),
    };

    controller.audio = null;
    controller.translationAudio = null;
    controller.preloadAudio = null;
    controller.recitationCache = null;
    controller.decodedRecitationCache = null;
    controller.audioContext = null;
    controller.activeTimestamp = null;
    controller.queue = [];
    controller.currentIndex = 0;
    controller.state = 'idle';
    controller.epoch = 0;
    controller.mediaSessionWired = false;
    usePlaybackStore.setState({
      reciterId: RECITER,
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

  test('a word entirely inside one 250ms sampling gap is never highlighted at all', async () => {
    const { getChapterRecitation } = jest.requireMock('api/quran/quranClient') as { getChapterRecitation: jest.Mock };
    getChapterRecitation.mockResolvedValue({
      audioUrl: 'https://example.com/chapter.mp3',
      timestamps: [
        {
          verseKey: `${SURAH}:1`,
          timestampFrom: 0,
          timestampTo: 1000,
          // Four words of realistic, uneven length. Word 3 (300-450ms, 150ms
          // long) is the one under test: shorter than the 250ms sampling gap
          // and positioned to fall entirely between two samples.
          segments: [
            { wordPosition: 1, startMs: 0, endMs: 150 },
            { wordPosition: 2, startMs: 150, endMs: 300 },
            { wordPosition: 3, startMs: 300, endMs: 450 },
            { wordPosition: 4, startMs: 450, endMs: 1000 },
          ],
        },
      ],
    });

    const engine = await import('./playbackEngine');
    await engine.playSurah(SURAH, 1);

    const fakeAudio = controller.audio as unknown as FakeAudio;
    const observedWords: Array<number | null> = [];

    // Exactly the WHATWG spec's permitted upper bound for 'timeupdate'
    // spacing (250ms) — not a contrived worst case, the *legal maximum*
    // browsers are explicitly allowed to use.
    for (const t of [0, 0.25, 0.5, 0.75, 1.0]) {
      fakeAudio.currentTime = t;
      fakeAudio.fire('timeupdate');
      observedWords.push(usePlaybackStore.getState().activeWordPosition);
    }

    // Word 3 (300-450ms) is real, spoken content — but at t=250ms we're still
    // in word 2 (150-300), and by t=500ms we've already moved into word 4
    // (450-1000). Word 3's entire window was skipped: it is never once the
    // recorded active word, at any sampled instant.
    expect(observedWords).not.toContain(3);
    // For contrast: words 1, 2, and 4 — each long enough to contain at least
    // one sample point — are correctly observed.
    expect(observedWords).toContain(1);
    expect(observedWords).toContain(2);
    expect(observedWords).toContain(4);
  });
});

import { controller } from './PlaybackController';
import { usePlaybackStore } from 'stores/playbackStore';

/**
 * Regression test for the trimmed-clip fix: quran.com (word-sync) ayahs are
 * now sliced out of the decoded chapter buffer to their own exact-length
 * clip and played like everyayah.com's one-file-per-ayah mode, instead of
 * playing the whole shared file continuously and polling for a boundary.
 * This proves the guarantee structurally — the clip literally cannot
 * contain another ayah's samples, rather than relying on detecting an
 * overrun after the fact (which is what the margin-based approach did, and
 * why it could never be a 100% guarantee).
 */

jest.mock('api/quran/quranClient', () => ({ getChapterRecitation: jest.fn() }));
jest.mock('api/quran/alQuranCloudClient', () => ({
  getAyahEditionAudio: jest.fn(() => new Promise(() => {})), // never resolves — keeps translation phase open for inspection
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
  /** Simulates the browser reaching the real end of this (trimmed) clip's own audio — a genuine native event, not a polled approximation. */
  fire(type: string): void {
    if (type === 'ended') {
      this.paused = true;
      this.ended = true;
    }
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

/** Single-channel PCM whose sample value equals its own absolute index (in "ms" since sampleRate=1000/s), so any slice's content can be checked against the exact expected absolute range. */
class FakeAudioBuffer {
  private channels: Float32Array[];
  constructor(
    public numberOfChannels: number,
    public length: number,
    public sampleRate: number,
    fill?: (index: number) => number
  ) {
    this.channels = Array.from({ length: numberOfChannels }, () => {
      const data = new Float32Array(length);
      if (fill) for (let i = 0; i < length; i += 1) data[i] = fill(i);
      return data;
    });
  }
  getChannelData(channel: number): Float32Array {
    return this.channels[channel]!;
  }
  copyToChannel(source: Float32Array, channel: number): void {
    this.channels[channel]!.set(source);
  }
}

describe('trimmed-clip fix: each quran.com ayah is sliced to its own exact-length, exact-content clip', () => {
  const RECITER = 'alafasy'; // quran.com — word-sync, shared file, sliced per ayah
  const SURAH = 114;
  const SAMPLE_RATE = 1000; // 1 sample per ms, so lengths/content are trivial to reason about in ms

  let fullBuffer: FakeAudioBuffer;
  let createBufferMock: jest.Mock;

  beforeEach(() => {
    (global as unknown as { Audio: typeof FakeAudio }).Audio = FakeAudio;
    // Whole "chapter" is 3000ms — three 1000ms ayahs back to back, sample value = absolute ms index.
    fullBuffer = new FakeAudioBuffer(1, 3000, SAMPLE_RATE, (i) => i);
    createBufferMock = jest.fn(
      (numberOfChannels: number, length: number, sampleRate: number) => new FakeAudioBuffer(numberOfChannels, length, sampleRate)
    );
    (global as unknown as { AudioContext: new () => unknown }).AudioContext = class {
      createBuffer = createBufferMock;
      decodeAudioData = jest.fn().mockResolvedValue(fullBuffer);
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
      urduTranslationAudioEnabled: true,
      englishTranslationAudioEnabled: false,
    });
  });

  test('ayah 1\'s clip is created with exactly its own duration and exactly its own samples', async () => {
    const { getChapterRecitation } = jest.requireMock('api/quran/quranClient') as { getChapterRecitation: jest.Mock };
    getChapterRecitation.mockResolvedValue({
      audioUrl: 'https://example.com/chapter.mp3',
      timestamps: [
        { verseKey: `${SURAH}:1`, timestampFrom: 0, timestampTo: 1000, segments: [] },
        { verseKey: `${SURAH}:2`, timestampFrom: 1000, timestampTo: 2000, segments: [] },
        { verseKey: `${SURAH}:3`, timestampFrom: 2000, timestampTo: 3000, segments: [] },
      ],
    });

    const engine = await import('./playbackEngine');
    await engine.playSurah(SURAH, 1);

    // The clip requested is exactly 1000 samples long — structurally bounded
    // to ayah 1's own duration. There is no way for it to hold ayah 2's
    // opening samples: the buffer created literally has no room for them.
    expect(createBufferMock).toHaveBeenCalledTimes(1);
    const [, length] = createBufferMock.mock.calls[0]!;
    expect(length).toBe(1000);

    const slicedBuffer = createBufferMock.mock.results[0]!.value as FakeAudioBuffer;
    const content = slicedBuffer.getChannelData(0);
    // Exactly ayah 1's own samples (absolute ms 0..999) — nothing from ayah 2 (which starts at 1000).
    expect(content[0]).toBe(0);
    expect(content[999]).toBe(999);
  });

  test('the native "ended" event on the trimmed clip advances to the translation for the SAME ayah — no bleed possible', async () => {
    const { getChapterRecitation } = jest.requireMock('api/quran/quranClient') as { getChapterRecitation: jest.Mock };
    getChapterRecitation.mockResolvedValue({
      audioUrl: 'https://example.com/chapter.mp3',
      timestamps: [
        { verseKey: `${SURAH}:1`, timestampFrom: 0, timestampTo: 1000, segments: [] },
        { verseKey: `${SURAH}:2`, timestampFrom: 1000, timestampTo: 2000, segments: [] },
      ],
    });

    const engine = await import('./playbackEngine');
    await engine.playSurah(SURAH, 1);

    expect(usePlaybackStore.getState().verseKey).toBe(`${SURAH}:1`);
    expect(controller.state).toBe('playing-recitation');

    // The clip reaches its own genuine, unambiguous end — nothing to detect
    // "early" or "late", because the clip's own audio data simply stops here.
    (controller.audio as unknown as FakeAudio).fire('ended');

    expect(controller.state).toBe('playing-translation');
    // verseKey is unchanged — the translation that starts is unambiguously
    // for ayah 1, the ayah whose clip just genuinely finished.
    expect(usePlaybackStore.getState().verseKey).toBe(`${SURAH}:1`);
  });

  test('ayah 2\'s clip, once its turn comes, is sliced from exactly its own range — never ayah 1\'s or ayah 3\'s', async () => {
    const { getChapterRecitation } = jest.requireMock('api/quran/quranClient') as { getChapterRecitation: jest.Mock };
    getChapterRecitation.mockResolvedValue({
      audioUrl: 'https://example.com/chapter.mp3',
      timestamps: [
        { verseKey: `${SURAH}:1`, timestampFrom: 0, timestampTo: 1000, segments: [] },
        { verseKey: `${SURAH}:2`, timestampFrom: 1000, timestampTo: 2000, segments: [] },
        { verseKey: `${SURAH}:3`, timestampFrom: 2000, timestampTo: 3000, segments: [] },
      ],
    });

    const engine = await import('./playbackEngine');
    await engine.playSurah(SURAH, 2);

    expect(usePlaybackStore.getState().verseKey).toBe(`${SURAH}:2`);
    const [, length] = createBufferMock.mock.calls[0]!;
    expect(length).toBe(1000);

    const slicedBuffer = createBufferMock.mock.results[0]!.value as FakeAudioBuffer;
    const content = slicedBuffer.getChannelData(0);
    expect(content[0]).toBe(1000); // ayah 2 starts at absolute ms 1000, not 0 (ayah 1) or 2000 (ayah 3)
    expect(content[999]).toBe(1999);
  });
});

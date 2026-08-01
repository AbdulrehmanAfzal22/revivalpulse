import { controller } from './PlaybackController';
import { usePlaybackStore } from 'stores/playbackStore';

/**
 * Root-cause demonstration, not a regression suite to keep long-term: proves
 * that `handleEnded` — the single `'ended'` listener attached once, forever,
 * to the shared `controller.audio` element in `getAudio()` — has no way to
 * tell "this event belongs to the session that's current right now" apart
 * from "this event is a leftover signal from whatever the element was
 * playing before it got reassigned." A real browser does not guarantee that
 * a queued media-element event fires before (or is cancelled by) the next
 * `.src` reassignment — this test doesn't need that guarantee to be true to
 * prove the bug; it just needs to show what happens if the event *does*
 * arrive late, which is a documented possibility, not a contrived one.
 */

jest.mock('api/quran/quranClient', () => ({ getChapterRecitation: jest.fn() }));
jest.mock('api/quran/alQuranCloudClient', () => ({
  getAyahEditionAudio: jest.fn().mockResolvedValue('https://example.com/clip.mp3'),
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
  /** Test-only hook: simulate the browser delivering a queued event for whichever listeners are *currently* attached, regardless of which session "logically" caused it. */
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

describe('root cause: handleEnded has no session identity of its own', () => {
  const RECITER = 'maher-muaiqly'; // everyayah.com — one file per ayah, native 'ended' is the only boundary signal
  const SURAH_A = 114; // An-Nas
  const SURAH_B = 113; // Al-Falaq

  beforeEach(() => {
    (global as unknown as { Audio: typeof FakeAudio }).Audio = FakeAudio;
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

  test('a late "ended" event from a superseded session advances the CURRENT session\'s barely-started item', async () => {
    const engine = await import('./playbackEngine');

    // Session A: playing surah 114 ayah 1. Its 'arabic' item sits at
    // currentIndex 0 — the browser has (hypothetically) already queued an
    // 'ended' event for it that hasn't been delivered yet.
    await engine.playSurah(SURAH_A, 1);
    expect(controller.queue[0]).toMatchObject({ type: 'arabic', surah: SURAH_A, ayah: 1 });
    expect(controller.currentIndex).toBe(0);

    // Session B supersedes it — a different surah, started fresh at its own
    // ayah 1, so its 'arabic' item *also* sits at currentIndex 0. This is
    // not a contrived coincidence: currentIndex is just "position in
    // whatever queue is current," so two unrelated sessions landing on the
    // same number is completely ordinary.
    await engine.playSurah(SURAH_B, 1);
    expect(controller.queue[0]).toMatchObject({ type: 'arabic', surah: SURAH_B, ayah: 1 });
    expect(controller.currentIndex).toBe(0);
    const verseKeyRightAfterStarting = usePlaybackStore.getState().verseKey;
    expect(verseKeyRightAfterStarting).toBe(`${SURAH_B}:1`);

    // Session A's late 'ended' event finally "arrives" — delivered to the
    // one listener that has been attached to this shared element since the
    // very first getAudio() call and never removed.
    (controller.audio as unknown as FakeAudio).fire('ended');

    // The bug: session B's ayah 1 — which has been playing for a fraction of
    // a second and has not remotely finished — gets treated as complete.
    // currentIndex silently advances (and, since translation is enabled,
    // this is exactly the moment a translation clip would start for an
    // ayah/session that was never actually reached on its own).
    expect(controller.currentIndex).not.toBe(0); // FAILS if the bug is fixed correctly (should stay 0)
  });
});

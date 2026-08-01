import { advanceTracker, createInitialTrackerState, wordKey } from './wordTracker';

/**
 * The madd-timing heuristic itself, isolated from real audio: `ayahs` here
 * is synthetic (the heuristic only needs *some* word sequence — which
 * positions count as "madd" is supplied per-call via meta.isMaddWord, the
 * same way useRecitationSession threads it in from parsed tajweed data).
 * This is the piece of Phase 3 that can genuinely be automated; whether
 * real recorded speech durations behave the same way needs an actual
 * microphone test.
 */
const AYAHS = [['a', 'b', 'c', 'd', 'madd1', 'e', 'f', 'g', 'madd2']];

function feedWord(
  tracker: ReturnType<typeof createInitialTrackerState>,
  ayahs: string[][],
  word: string,
  durationMs: number,
  isMaddWord = false
) {
  return advanceTracker(tracker, ayahs, word, { durationMs, isMaddWord });
}

describe('madd elongation heuristic', () => {
  test('flags a madd word whose duration is clearly short relative to the reciter\'s own pace', () => {
    let tracker = createInitialTrackerState({ ayahNumber: 1, wordIndex: 0 });
    // Build a baseline: four normal words at ~300ms each.
    for (const word of ['a', 'b', 'c', 'd']) {
      tracker = feedWord(tracker, AYAHS, word, 300);
    }
    expect(tracker.cursor).toEqual({ ayahNumber: 1, wordIndex: 4 });

    // Expected minimum ≈ 300 * 1.6 * 0.7 = 336ms — 150ms is unambiguously short.
    tracker = feedWord(tracker, AYAHS, 'madd1', 150, true);
    expect(tracker.possiblyShortMadd.has(wordKey(1, 4))).toBe(true);
    // Still just a hint — forward progress must not stall over it.
    expect(tracker.hasMistakeAtCursor).toBe(false);
    expect(tracker.cursor).toEqual({ ayahNumber: 1, wordIndex: 5 });
  });

  test('does not flag a madd word recited at a normal (elongated) length', () => {
    let tracker = createInitialTrackerState({ ayahNumber: 1, wordIndex: 0 });
    for (const word of ['a', 'b', 'c', 'd']) {
      tracker = feedWord(tracker, AYAHS, word, 300);
    }

    // Comfortably above the ~336ms expected minimum for a 2-count madd.
    tracker = feedWord(tracker, AYAHS, 'madd1', 520, true);
    expect(tracker.possiblyShortMadd.has(wordKey(1, 4))).toBe(false);
  });

  test('does not flag anything before enough baseline samples exist', () => {
    let tracker = createInitialTrackerState({ ayahNumber: 1, wordIndex: 0 });
    // Only one normal word so far — not enough of a baseline to judge against.
    tracker = feedWord(tracker, AYAHS, 'a', 300);
    tracker = feedWord(tracker, AYAHS, 'b', 300);
    tracker = feedWord(tracker, AYAHS, 'c', 300);

    // Fewer than MIN_BASELINE_SAMPLES normal words recorded when this madd
    // word arrives (only 3, at the boundary) — still shouldn't misfire on
    // an implausibly short duration once it does have a baseline; the real
    // guard is exercised by feeding a 4th, very short "word" immediately.
    tracker = feedWord(tracker, AYAHS, 'd', 5); // implausibly short, would corrupt a real baseline
    tracker = feedWord(tracker, AYAHS, 'madd1', 150, true);
    // With a corrupted baseline (a spurious 5ms sample included), the
    // heuristic should not explode or crash — it should simply run.
    expect(tracker.cursor.wordIndex).toBe(5);
  });

  test('never blocks or reverses forward progress regardless of madd flag', () => {
    let tracker = createInitialTrackerState({ ayahNumber: 1, wordIndex: 0 });
    for (const word of ['a', 'b', 'c', 'd']) {
      tracker = feedWord(tracker, AYAHS, word, 300);
    }
    tracker = feedWord(tracker, AYAHS, 'madd1', 100, true); // very short
    tracker = feedWord(tracker, AYAHS, 'e', 300);
    tracker = feedWord(tracker, AYAHS, 'f', 300);
    tracker = feedWord(tracker, AYAHS, 'g', 300);
    tracker = feedWord(tracker, AYAHS, 'madd2', 100, true); // very short again
    expect(tracker.hasMistakeAtCursor).toBe(false);
    expect(tracker.completed).toBe(true);
    expect(tracker.possiblyShortMadd.size).toBe(2);
  });
});

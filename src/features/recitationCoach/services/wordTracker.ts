export interface TrackerCursor {
  ayahNumber: number;
  wordIndex: number;
}

export interface WordTrackerState {
  cursor: TrackerCursor;
  /** Keys are `${ayahNumber}:${wordIndex}` for words confirmed correct so far. */
  correctWords: Set<string>;
  hasMistakeAtCursor: boolean;
  completed: boolean;
  /**
   * The position just before the current cursor — used to tolerate a
   * duplicate re-recognition of an already-confirmed word (e.g. from ASR
   * non-determinism at an overlapping chunk boundary that the text-level
   * dedup missed) without treating it as a fresh, unrelated mistake.
   */
  previousCursor: TrackerCursor | null;
  /** Rolling window of recent non-madd word durations (ms) — the reciter's own pace baseline, since reciters vary widely and an absolute threshold would misfire for both fast and slow readers. */
  recentWordDurationsMs: number[];
  /** Keys are `${ayahNumber}:${wordIndex}` for madd words whose recognized duration looked too short relative to that baseline — a best-effort hint, not a verified tajweed judgment. */
  possiblyShortMadd: Set<string>;
  /** Count of fresh mistake occurrences (false→true transitions), used for the completion screen's approximate accuracy stat — not a count of every mismatched word, since a frozen cursor gets compared repeatedly until corrected. */
  mistakeCount: number;
  /**
   * Consecutive medium-confidence (neither a clear match nor a clear
   * mistake) attempts at the current cursor position — see
   * WordComparisonOverride below. Only present so a plausible near-miss can
   * get a second word's chance before being treated as a real mistake,
   * instead of every non-exact word freezing the tracker immediately.
   * Always 0 when advanceTracker is called the old way (no comparison
   * override), so existing exact-match behavior is completely unaffected.
   */
  uncertainStreak: number;
}

export function wordKey(ayahNumber: number, wordIndex: number): string {
  return `${ayahNumber}:${wordIndex}`;
}

export function createInitialTrackerState(cursor: TrackerCursor): WordTrackerState {
  return {
    cursor,
    correctWords: new Set(),
    hasMistakeAtCursor: false,
    completed: false,
    previousCursor: null,
    recentWordDurationsMs: [],
    possiblyShortMadd: new Set(),
    mistakeCount: 0,
    uncertainStreak: 0,
  };
}

const PACE_WINDOW_SIZE = 8;
/** A madd syllable should take noticeably longer than this reciter's own average word — 2 tajweed counts is roughly double a normal syllable's length. */
const MADD_EXPECTED_MULTIPLIER = 1.6;
/** Only flag when clearly short, not on borderline cases — a heuristic hint should err toward not nagging. */
const MADD_SHORT_RATIO = 0.7;
/** Need a handful of baseline samples before trusting the average enough to flag anything. */
const MIN_BASELINE_SAMPLES = 3;

function averageOf(values: number[]): number | null {
  if (values.length < MIN_BASELINE_SAMPLES) return null;
  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

function advanceCursor(ayahs: string[][], cursor: TrackerCursor): TrackerCursor | null {
  const currentAyahWords = ayahs[cursor.ayahNumber - 1];
  if (currentAyahWords && cursor.wordIndex + 1 < currentAyahWords.length) {
    return { ayahNumber: cursor.ayahNumber, wordIndex: cursor.wordIndex + 1 };
  }
  const nextAyahWords = ayahs[cursor.ayahNumber];
  if (nextAyahWords && nextAyahWords.length > 0) {
    return { ayahNumber: cursor.ayahNumber + 1, wordIndex: 0 };
  }
  return null;
}

function wordAt(ayahs: string[][], cursor: TrackerCursor | null): string | undefined {
  if (!cursor) return undefined;
  return ayahs[cursor.ayahNumber - 1]?.[cursor.wordIndex];
}

export interface AdvanceMeta {
  /** How long Whisper heard this word take, in ms — omitted when unknown (e.g. a timed-word/text-count mismatch fallback). */
  durationMs?: number;
  /** Whether the expected word at the current cursor carries a madd (elongation) tajweed rule. */
  isMaddWord?: boolean;
}

/**
 * A precomputed verdict for the current recognized word, from the
 * intelligent matcher (see wordMatcher.ts) — lets advanceTracker's cursor
 * mechanics stay exactly as they are while the *decision* of "does this
 * count as a match" comes from Levenshtein/alignment-aware scoring instead
 * of strict string equality. Omitted entirely (the default for every
 * existing caller), advanceTracker behaves byte-identical to before:
 * recognizedWord === expected, freezing on the very first mismatch.
 */
export interface WordComparisonOverride {
  isMatch: boolean;
  /**
   * Medium confidence — neither a clear match nor a clear mistake. Doesn't
   * advance and doesn't freeze on its own; held at the same cursor,
   * accumulating in `uncertainStreak`, until either a later word resolves it
   * as a match, or it stays uncertain for MAX_UNCERTAIN_STREAK consecutive
   * attempts, at which point it's finally treated as a genuine mistake.
   * Ignored when `isMatch` is true.
   */
  isUncertain?: boolean;
}

/** How many consecutive medium-confidence attempts at the same cursor position are tolerated before treating it as a real mistake — see WordComparisonOverride.isUncertain. */
const MAX_UNCERTAIN_STREAK = 2;

/**
 * Advances the tracker by exactly one newly recognized word. A match turns
 * the expected word green and moves the cursor forward; a mismatch marks
 * the expected word red and freezes the cursor there — every subsequent
 * recognized word keeps being compared against that same expected word
 * until one matches, rather than skipping past the mistake.
 *
 * Before committing to "mistake", a mismatched word is also checked
 * against the position just confirmed (not only the current one) — see
 * `previousCursor` docstring above. Without this, an ASR hiccup that
 * re-emits an already-correct word a second time would freeze the tracker
 * on a phantom mistake one word after the user actually recited correctly.
 *
 * On a correct match, if this was a madd word and its recognized duration
 * came in clearly short relative to this reciter's own recent pace, it's
 * flagged in `possiblyShortMadd` — a hint, not a red mistake; duration
 * alone can't verify real tajweed rules, so this only ever nudges, never
 * blocks forward progress.
 *
 * `comparison`, when supplied, replaces the strict `===` decision with a
 * precomputed one (see WordComparisonOverride) — this is what lets a
 * plausible Whisper misrecognition be told apart from a genuine recitation
 * mistake without changing anything about how the cursor itself advances,
 * freezes, or recovers.
 */
export function advanceTracker(
  state: WordTrackerState,
  ayahs: string[][],
  recognizedWord: string,
  meta: AdvanceMeta = {},
  comparison?: WordComparisonOverride
): WordTrackerState {
  if (state.completed) return state;

  const { ayahNumber, wordIndex } = state.cursor;
  const ayahWords = ayahs[ayahNumber - 1];
  const expected = ayahWords?.[wordIndex];
  if (expected === undefined) return { ...state, completed: true };

  const isMatch = comparison ? comparison.isMatch : recognizedWord === expected;

  if (!isMatch) {
    const previousWord = wordAt(ayahs, state.previousCursor);
    if (previousWord !== undefined && recognizedWord === previousWord) {
      return state; // stale duplicate of the word we just confirmed — ignore, not a new mistake
    }

    if (comparison?.isUncertain) {
      const uncertainStreak = state.uncertainStreak + 1;
      if (uncertainStreak < MAX_UNCERTAIN_STREAK) {
        // Not enough evidence yet either way — hold at the same cursor
        // without declaring a mistake, and wait for another word.
        return { ...state, uncertainStreak };
      }
      return {
        ...state,
        hasMistakeAtCursor: true,
        mistakeCount: state.hasMistakeAtCursor ? state.mistakeCount : state.mistakeCount + 1,
        uncertainStreak,
      };
    }

    return {
      ...state,
      hasMistakeAtCursor: true,
      mistakeCount: state.hasMistakeAtCursor ? state.mistakeCount : state.mistakeCount + 1,
      uncertainStreak: 0,
    };
  }

  const correctWords = new Set(state.correctWords);
  correctWords.add(wordKey(ayahNumber, wordIndex));

  let recentWordDurationsMs = state.recentWordDurationsMs;
  let possiblyShortMadd = state.possiblyShortMadd;

  if (meta.durationMs !== undefined && meta.durationMs > 0) {
    if (meta.isMaddWord) {
      const baseline = averageOf(recentWordDurationsMs);
      if (baseline !== null && meta.durationMs < baseline * MADD_EXPECTED_MULTIPLIER * MADD_SHORT_RATIO) {
        possiblyShortMadd = new Set(possiblyShortMadd);
        possiblyShortMadd.add(wordKey(ayahNumber, wordIndex));
      }
      // Madd words are deliberately excluded from the pace baseline itself —
      // otherwise a correctly-elongated word would inflate the average and
      // make the next madd's expected minimum creep upward too.
    } else {
      recentWordDurationsMs = [...recentWordDurationsMs, meta.durationMs].slice(-PACE_WINDOW_SIZE);
    }
  }

  const nextCursor = advanceCursor(ayahs, state.cursor);
  if (!nextCursor) {
    return {
      cursor: state.cursor,
      correctWords,
      hasMistakeAtCursor: false,
      completed: true,
      previousCursor: state.cursor,
      recentWordDurationsMs,
      possiblyShortMadd,
      mistakeCount: state.mistakeCount,
      uncertainStreak: 0,
    };
  }
  return {
    cursor: nextCursor,
    correctWords,
    hasMistakeAtCursor: false,
    completed: false,
    previousCursor: state.cursor,
    recentWordDurationsMs,
    possiblyShortMadd,
    mistakeCount: state.mistakeCount,
    uncertainStreak: 0,
  };
}

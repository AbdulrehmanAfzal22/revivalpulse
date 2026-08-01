import { stripDiacriticsAndTatweel } from './arabicNormalization';
import type { WordComparisonOverride } from './wordTracker';

/** How many upcoming expected words the aligner looks at per chunk — within the 5-10 range that gives merge/split/skip patterns enough context to resolve without the window (and therefore the DP cost) growing with surah length. */
export const ALIGNMENT_WINDOW_SIZE = 8;

export interface ExpectedWindowEntry {
  ayahNumber: number;
  wordIndex: number;
  /** Normalized form — what alignWindow actually compares against. */
  word: string;
  /** Display (diacritics-intact) form, when available — used only to distinguish the "Exact Match" vs "Arabic Variant" reason. */
  raw?: string;
}

/**
 * Walks forward from the tracker's cursor for up to `windowSize` words,
 * rolling over ayah boundaries exactly the way wordTracker's own
 * advanceCursor does for a single step — just producing a flat run instead
 * of one step at a time. Bounded strictly by windowSize regardless of how
 * many ayahs or words remain in the surah.
 */
export function buildExpectedWindow(
  ayahs: string[][],
  cursor: { ayahNumber: number; wordIndex: number },
  windowSize: number,
  rawAyahs?: string[][]
): ExpectedWindowEntry[] {
  const window: ExpectedWindowEntry[] = [];
  let ayahNumber = cursor.ayahNumber;
  let wordIndex = cursor.wordIndex;

  while (window.length < windowSize) {
    const words = ayahs[ayahNumber - 1];
    if (!words) break;
    if (wordIndex >= words.length) {
      ayahNumber += 1;
      wordIndex = 0;
      continue;
    }
    window.push({ ayahNumber, wordIndex, word: words[wordIndex]!, raw: rawAyahs?.[ayahNumber - 1]?.[wordIndex] });
    wordIndex += 1;
  }

  return window;
}

/**
 * Standard iterative Levenshtein distance, bounded to single-word inputs
 * (Quranic words are short — a handful of characters) so this is always
 * cheap regardless of how long the surah being recited is. Only the
 * previous row is kept, not a full matrix, since that's all a single
 * distance computation needs.
 */
export function levenshteinDistance(a: string, b: string): number {
  if (a === b) return 0;
  if (a.length === 0) return b.length;
  if (b.length === 0) return a.length;

  let previousRow = Array.from({ length: b.length + 1 }, (_, i) => i);
  for (let i = 0; i < a.length; i += 1) {
    const currentRow = [i + 1];
    for (let j = 0; j < b.length; j += 1) {
      const insertCost = currentRow[j]! + 1;
      const deleteCost = previousRow[j + 1]! + 1;
      const substituteCost = previousRow[j]! + (a[i] === b[j] ? 0 : 1);
      currentRow.push(Math.min(insertCost, deleteCost, substituteCost));
    }
    previousRow = currentRow;
  }
  return previousRow[b.length]!;
}

/**
 * A short word tolerates far fewer absolute edits than a long one before
 * "probably the same word" stops being plausible — a flat distance
 * threshold would either be too strict for long words or too loose for
 * short ones. Expressed as a fraction of the longer word's length, with a
 * floor of 1 so even 2-3 letter words get *some* tolerance for a single
 * substitution.
 */
const LEVENSHTEIN_TOLERANCE_RATIO = 0.34;

function levenshteinTolerance(wordLength: number): number {
  return Math.max(1, Math.floor(wordLength * LEVENSHTEIN_TOLERANCE_RATIO));
}

export type MatchReason =
  | 'Exact Match'
  | 'Arabic Variant'
  | 'Levenshtein Match'
  | 'Likely Whisper Error'
  | 'Likely User Mistake';

export interface WordMatchResult {
  matchScore: number; // 0-100
  confidence: number; // 0-100
  reason: MatchReason;
}

/**
 * Confidence bands the smart cursor (wordTracker) acts on. High advances
 * immediately; medium holds and waits for another word before deciding
 * anything; low is treated as a mistake right away — a word this far off
 * isn't a plausible near-miss, so there's nothing to gain by waiting.
 */
export const CONFIDENCE_HIGH = 80;
export const CONFIDENCE_MEDIUM = 45;

/**
 * Scores one recognized word against one expected word. Both must already
 * be normalized via normalizeArabicWord (the same normalization every other
 * comparison in this feature uses) — this function only adds edit-distance
 * tolerance and variant-vs-exact reporting on top of that, it doesn't
 * duplicate the folding itself.
 *
 * `expectedRaw`, when supplied, is compared via the lighter
 * stripDiacriticsAndTatweel tier purely to distinguish the `reason` label
 * ("Exact Match" vs "Arabic Variant") — it never changes the match/no-match
 * decision itself, which is always based on the fully-normalized forms.
 */
export function scoreWordMatch(expectedNormalized: string, recognizedNormalized: string, expectedRaw?: string): WordMatchResult {
  if (expectedNormalized === recognizedNormalized) {
    const isVariant =
      expectedRaw !== undefined && stripDiacriticsAndTatweel(expectedRaw) !== stripDiacriticsAndTatweel(recognizedNormalized);
    return { matchScore: 100, confidence: 100, reason: isVariant ? 'Arabic Variant' : 'Exact Match' };
  }

  const distance = levenshteinDistance(expectedNormalized, recognizedNormalized);
  const longerLength = Math.max(expectedNormalized.length, recognizedNormalized.length);
  const tolerance = levenshteinTolerance(longerLength);

  if (distance <= tolerance) {
    // Score decays smoothly with how much of the tolerance budget was used,
    // rather than being a flat "pass" — a 1-edit near-miss on a long word is
    // a stronger match than a 1-edit near-miss on a 2-letter word using its
    // entire budget in one go.
    const usedRatio = distance / tolerance;
    const matchScore = Math.round(100 - usedRatio * 40); // 60-100 range
    const confidence = Math.round(100 - usedRatio * 50); // 50-100 range
    return { matchScore, confidence, reason: 'Levenshtein Match' };
  }

  // Beyond the strict tolerance but still within a wider edit-distance
  // band — plausibly a merge/split/garbled-chunk-boundary artifact rather
  // than a genuinely different word choice. Gated on edit distance itself
  // (not raw length similarity — two totally unrelated short words can be
  // "similar length" without sharing anything, which a length-only check
  // would wrongly let through here). Scored low-medium: worth a second
  // word's chance before committing to "mistake", but never enough on its
  // own to advance.
  const wideTolerance = Math.max(tolerance + 1, Math.floor(longerLength * 0.6));
  if (distance <= wideTolerance) {
    const confidence = Math.max(10, Math.round(40 - (distance - tolerance) * 5));
    return { matchScore: Math.max(10, confidence - 5), confidence, reason: 'Likely Whisper Error' };
  }

  return { matchScore: 0, confidence: 0, reason: 'Likely User Mistake' };
}

export type WordMatchClassification =
  | 'correct'
  | 'probably-correct'
  | 'probably-whisper-error'
  | 'missing-word'
  | 'extra-word'
  | 'wrong-word'
  | 'repeated-word'
  | 'out-of-sequence';

export interface AlignmentStep {
  classification: WordMatchClassification;
  result: WordMatchResult;
  /** Index into the expected window this step consumes, or the pair for a merge/split step; undefined for a pure insertion (extra/repeated word). */
  expectedIndices: number[];
  /** Index into the recognized window this step consumes; undefined for a pure deletion (missing word). */
  recognizedIndices: number[];
}

const GAP_PENALTY = 60; // cost of skipping an expected or recognized word entirely

interface Cell {
  cost: number;
  // 'match' consumes 1 expected + 1 recognized; 'merge' consumes 2 expected + 1
  // recognized (Whisper merged two words into one); 'split' consumes 1
  // expected + 2 recognized (Whisper split one word into two); 'delete'
  // consumes 1 expected + 0 recognized (missing word); 'insert' consumes 0
  // expected + 1 recognized (extra/repeated word).
  move: 'match' | 'merge' | 'split' | 'delete' | 'insert' | 'start';
}

/**
 * Aligns a window of upcoming expected words against a window of newly
 * recognized words, choosing the lowest-total-cost path through every
 * combination of match / substitute / insert / delete / merge / split —
 * the same family of algorithm as classic edit-distance-with-traceback
 * (Needleman-Wunsch-style), just over words instead of characters, with two
 * extra transition types added for Whisper's specific failure modes (one
 * token covering two spoken words, or one spoken word split across two
 * tokens).
 *
 * Bounded strictly by the two window sizes (typically ≤10 each) — the cost
 * is a fixed small grid regardless of how long the surah or the Quran is,
 * so this never scales with corpus size.
 */
export function alignWindow(
  expectedWindow: string[],
  recognizedWindow: string[],
  expectedRawWindow?: string[]
): AlignmentStep[] {
  const rows = expectedWindow.length;
  const cols = recognizedWindow.length;
  const grid: Cell[][] = Array.from({ length: rows + 1 }, () => new Array(cols + 1));

  grid[0]![0] = { cost: 0, move: 'start' };
  for (let i = 1; i <= rows; i += 1) grid[i]![0] = { cost: i * GAP_PENALTY, move: 'delete' };
  for (let j = 1; j <= cols; j += 1) grid[0]![j] = { cost: j * GAP_PENALTY, move: 'insert' };

  const scoreAt = (i: number, j: number): WordMatchResult =>
    scoreWordMatch(expectedWindow[i]!, recognizedWindow[j]!, expectedRawWindow?.[i]);

  for (let i = 1; i <= rows; i += 1) {
    for (let j = 1; j <= cols; j += 1) {
      const candidates: Array<{ cost: number; move: Cell['move'] }> = [];

      const pair = scoreAt(i - 1, j - 1);
      candidates.push({ cost: grid[i - 1]![j - 1]!.cost + (100 - pair.matchScore), move: 'match' });

      candidates.push({ cost: grid[i - 1]![j]!.cost + GAP_PENALTY, move: 'delete' });
      candidates.push({ cost: grid[i]![j - 1]!.cost + GAP_PENALTY, move: 'insert' });

      if (i >= 2) {
        const merged = expectedWindow[i - 2]! + expectedWindow[i - 1]!;
        const mergeScore = scoreWordMatch(merged, recognizedWindow[j - 1]!);
        candidates.push({ cost: grid[i - 2]![j]!.cost + (100 - mergeScore.matchScore) + 15, move: 'merge' });
      }
      if (j >= 2) {
        const combined = recognizedWindow[j - 2]! + recognizedWindow[j - 1]!;
        const splitScore = scoreWordMatch(expectedWindow[i - 1]!, combined);
        candidates.push({ cost: grid[i]![j - 2]!.cost + (100 - splitScore.matchScore) + 15, move: 'split' });
      }

      let best = candidates[0]!;
      for (const candidate of candidates) if (candidate.cost < best.cost) best = candidate;
      grid[i]![j] = best;
    }
  }

  // Traceback from the bottom-right corner to reconstruct the chosen path.
  const steps: AlignmentStep[] = [];
  let i = rows;
  let j = cols;
  while (i > 0 || j > 0) {
    const cell = grid[i]![j]!;
    if (cell.move === 'match') {
      const result = scoreAt(i - 1, j - 1);
      steps.push({ classification: classifyMatch(result), result, expectedIndices: [i - 1], recognizedIndices: [j - 1] });
      i -= 1;
      j -= 1;
    } else if (cell.move === 'merge') {
      const merged = expectedWindow[i - 2]! + expectedWindow[i - 1]!;
      const result = scoreWordMatch(merged, recognizedWindow[j - 1]!);
      steps.push({
        classification: result.confidence >= CONFIDENCE_MEDIUM ? 'probably-whisper-error' : 'wrong-word',
        result,
        expectedIndices: [i - 2, i - 1],
        recognizedIndices: [j - 1],
      });
      i -= 2;
      j -= 1;
    } else if (cell.move === 'split') {
      const combined = recognizedWindow[j - 2]! + recognizedWindow[j - 1]!;
      const result = scoreWordMatch(expectedWindow[i - 1]!, combined);
      steps.push({
        classification: result.confidence >= CONFIDENCE_MEDIUM ? 'probably-whisper-error' : 'wrong-word',
        result,
        expectedIndices: [i - 1],
        recognizedIndices: [j - 2, j - 1],
      });
      i -= 1;
      j -= 2;
    } else if (cell.move === 'delete') {
      steps.push({
        classification: 'missing-word',
        result: { matchScore: 0, confidence: 0, reason: 'Likely Whisper Error' },
        expectedIndices: [i - 1],
        recognizedIndices: [],
      });
      i -= 1;
    } else if (cell.move === 'insert') {
      const isRepeat = i < rows && recognizedWindow[j - 1] === expectedWindow[i]; // reappears as the very next expected word too
      steps.push({
        classification: isRepeat ? 'repeated-word' : 'extra-word',
        result: { matchScore: 0, confidence: 0, reason: 'Likely Whisper Error' },
        expectedIndices: [],
        recognizedIndices: [j - 1],
      });
      j -= 1;
    } else {
      break;
    }
  }

  steps.reverse();
  return markOutOfSequence(steps);
}

function classifyMatch(result: WordMatchResult): WordMatchClassification {
  if (result.reason === 'Exact Match' || result.reason === 'Arabic Variant') return 'correct';
  if (result.confidence >= CONFIDENCE_HIGH) return 'correct';
  if (result.confidence >= CONFIDENCE_MEDIUM) return 'probably-correct';
  if (result.reason === 'Likely Whisper Error') return 'probably-whisper-error';
  return 'wrong-word';
}

/**
 * A 'match'/'merge'/'split' step whose expected index doesn't strictly
 * increase from the previous consuming step indicates the aligner found a
 * better score by revisiting earlier material — e.g. the reciter backtracked
 * and repeated an earlier phrase. The forward-only tracker can't represent
 * that as ordinary progress, so it's flagged distinctly rather than silently
 * treated as an ordinary correct/incorrect word.
 */
function markOutOfSequence(steps: AlignmentStep[]): AlignmentStep[] {
  let lastExpectedIndex = -1;
  return steps.map((step) => {
    if (step.expectedIndices.length === 0) return step;
    const firstIndex = step.expectedIndices[0]!;
    if (firstIndex < lastExpectedIndex) {
      return { ...step, classification: 'out-of-sequence' as const };
    }
    lastExpectedIndex = step.expectedIndices[step.expectedIndices.length - 1]!;
    return step;
  });
}

/**
 * Maps a step's classification to what wordTracker.advanceTracker should do
 * with it — `null` means "don't call advanceTracker at all", for steps that
 * consume no expected position (extra/repeated recognized words). Kept as
 * its own pure, tested mapping separate from the DP itself.
 *
 * 'probably-correct' and a confidently-inferred 'missing-word' both advance
 * immediately rather than going through the tracker's own uncertain-streak
 * hold: the sliding-window alignment has *already* used the surrounding
 * words' context to arrive at that classification, which is exactly the
 * "wait for more words" the plain per-word tracker can't do on its own.
 * 'probably-whisper-error' is the one case that stays genuinely ambiguous
 * even with that context, so it's the one routed into the tracker's own
 * hold-and-wait mechanism instead of being decided here.
 */
export function classificationToComparison(classification: WordMatchClassification): WordComparisonOverride | null {
  switch (classification) {
    case 'correct':
    case 'probably-correct':
    case 'missing-word':
      return { isMatch: true };
    case 'probably-whisper-error':
      return { isMatch: false, isUncertain: true };
    case 'wrong-word':
    case 'out-of-sequence':
      return { isMatch: false };
    case 'extra-word':
    case 'repeated-word':
      return null;
  }
}

export interface PlannedAdvance {
  /** Which position in the expected window this advance is for — used by the caller to fall back to the expected word's own text for a confidently-inferred missing word. */
  expectedIndex: number;
  /** Which position in the recognized window this drew its word text/timing from, or null when there wasn't one (a missing word inferred purely from alignment, with no corresponding recognized audio). */
  recognizedIndex: number | null;
  comparison: WordComparisonOverride;
  /** The alignment step's own classification this advance came from — carried through (not re-derived) so a consumer like the coaching engine can react to *which* of the 8 categories this was, not just whether it counted as a match. */
  classification: WordMatchClassification;
  /** The underlying WordMatchResult's confidence (0-100) this step's classification was derived from — surfaced for developer diagnostics (e.g. the coaching debug panel), not used by the tracker itself. */
  confidence: number;
}

/**
 * Flattens alignment steps into one entry per expected word position that
 * should actually be advanced through the tracker, in order. A merge step
 * (two expected words, one recognized token) expands into two entries
 * sharing that one recognized index; a split step (one expected, two
 * recognized) collapses into one; pure insertions (extra/repeated
 * recognized words) vanish entirely, since they don't correspond to any
 * expected position at all.
 */
export function planAdvances(steps: AlignmentStep[]): PlannedAdvance[] {
  const plan: PlannedAdvance[] = [];
  for (const step of steps) {
    const comparison = classificationToComparison(step.classification);
    if (!comparison) continue;
    const recognizedIndex = step.recognizedIndices.length > 0 ? step.recognizedIndices[0]! : null;
    for (const expectedIndex of step.expectedIndices) {
      plan.push({ expectedIndex, recognizedIndex, comparison, classification: step.classification, confidence: step.result.confidence });
    }
  }
  return plan;
}

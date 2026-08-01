import type { TajweedWord } from './tajweedParser';
import type { WordMatchClassification } from './wordMatcher';
import { normalizeArabicWord } from './arabicNormalization';
import type { TranslationKey } from 'i18n/types';

/**
 * Rules with their own independently-evaluable status. "Noon Sakinah" and
 * "Meem Sakinah" are deliberately *not* in this list — they're conditions
 * (a letter + state) that always resolve to exactly one of
 * Izhar/Idgham/Iqlab/Ikhfa (or the Shafawi equivalents for Meem), never a
 * separately-scored outcome of their own. Scoring them independently would
 * double-count the same judgment under two names. classifyNoonSakinahContext
 * / classifyMeemSakinahContext (below) identify *which* sub-rule applies —
 * that sub-rule is what actually gets evaluated.
 */
export type TajweedRuleId =
  | 'madd'
  | 'ghunnah'
  | 'qalqalah'
  | 'ikhfa'
  | 'idgham'
  | 'iqlab'
  | 'izhar'
  | 'lam-shamsiyyah'
  | 'lam-qamariyyah';

export const ALL_TAJWEED_RULE_IDS: TajweedRuleId[] = [
  'madd',
  'ghunnah',
  'qalqalah',
  'ikhfa',
  'idgham',
  'iqlab',
  'izhar',
  'lam-shamsiyyah',
  'lam-qamariyyah',
];

export type TajweedStatus = 'correct' | 'probably-correct' | 'needs-review' | 'likely-incorrect' | 'unknown';

export interface TajweedRuleEvaluation {
  ruleId: TajweedRuleId;
  confidence: number; // 0-100
  expectedBehaviorKey: TranslationKey;
  observedBehaviorKey: TranslationKey;
  status: TajweedStatus;
  /** Educational, not a verdict — see feedback pool in the locale files. */
  feedbackKey: TranslationKey;
}

export interface TajweedThresholds {
  madd: { tooShortRatio: number; slightlyLongRatio: number; excessivelyLongRatio: number };
  ghunnah: { tooShortRatio: number; tooLongRatio: number };
  /** Below this many recent non-elongated-word samples, there's no reliable pace baseline yet — every duration-based rule falls back to 'unknown' rather than guessing. */
  minBaselineSamples: number;
  /** How many recent word durations feed the rolling pace baseline. */
  paceWindowSize: number;
}

/**
 * All approximate, all overridable per call — these are reasonable starting
 * points (madd's own multiplier mirrors the existing wordTracker heuristic),
 * not empirically tuned against real recitation audio, which isn't
 * available in this environment. Expressed as ratios against the reciter's
 * own recent pace so they scale with each reciter's natural speed rather
 * than assuming one fixed tempo.
 */
export const DEFAULT_TAJWEED_THRESHOLDS: TajweedThresholds = {
  madd: { tooShortRatio: 1.15, slightlyLongRatio: 2.5, excessivelyLongRatio: 3.5 },
  ghunnah: { tooShortRatio: 1.1, tooLongRatio: 1.6 },
  minBaselineSamples: 3,
  paceWindowSize: 8,
};

export interface TajweedEvaluationContext {
  word: TajweedWord;
  /** Diacritics-intact display form — needed for the text-based rules (Izhar, Lam Qamariyyah), which have no tajweed markup to rely on. */
  rawWord: string;
  /** The next word in reading order, if any — Izhar's most common form is at a word boundary (a word-final noon/tanween followed by the next word's throat letter), which can't be detected from one word alone. */
  nextRawWord: string | null;
  /** How long Whisper heard this word take, in ms — null when unknown. */
  durationMs: number | null;
  /** The reciter's own recent average word duration, in ms — null until enough baseline samples exist. */
  paceBaselineMs: number | null;
  /** Phase 1's own classification for this word, if available — the one usable indirect signal for phoneme-substitution rules that duration can't assess (see module docstring). */
  wordMatchClassification: WordMatchClassification | null;
}

const MARKUP_RULE_CLASSES: Record<Exclude<TajweedRuleId, 'izhar' | 'lam-qamariyyah'>, string[]> = {
  madd: ['madda_normal', 'madda_permissible', 'madda_necessary', 'madda_obligatory'],
  ghunnah: ['ghunnah'],
  qalqalah: ['qalaqah'],
  ikhfa: ['ikhafa', 'ikhafa_shafawi'],
  idgham: ['idgham_shafawi', 'idgham_ghunnah', 'idgham_wo_ghunnah', 'idgham_mutajanisayn', 'idgham_mutaqaribayn'],
  iqlab: ['iqlab'],
  'lam-shamsiyyah': ['laam_shamsiyah'],
};

const TANWEEN_REGEX = /[ًٌٍ]$/; // fathatan/kasratan/dammatan at the very end (checked before stripping)
const MOON_LETTERS = new Set(['ا', 'ب', 'ج', 'ح', 'خ', 'ع', 'غ', 'ف', 'ق', 'ك', 'م', 'ه', 'و', 'ي']);
const THROAT_LETTERS = new Set(['ء', 'ه', 'ع', 'ح', 'غ', 'خ']);

/**
 * Word-initial alef-lam followed by a moon letter, with no lam-shamsiyyah
 * marker already present (which would mean the opposite, sun-letter case).
 * Purely text-based — Qamariyyah is the "pronounce normally" default, so
 * there's nothing for tajweed markup to highlight.
 */
function detectLamQamariyyah(word: TajweedWord, rawWord: string): boolean {
  if (word.segments.some((segment) => segment.ruleClass === 'laam_shamsiyah')) return false;
  const normalized = normalizeArabicWord(rawWord);
  if (!normalized.startsWith('ال') || normalized.length < 3) return false;
  return MOON_LETTERS.has(normalized[2]!);
}

/**
 * Izhar's most common real occurrence is at a word boundary: this word ends
 * in a noon sakinah or tanween, and the *next* word starts with a throat
 * letter. A heuristic, not a full morphological analysis — a word-final
 * noon is treated as a sakinah candidate whenever it isn't followed by a
 * vowel diacritic in the raw text, which can over-detect in some
 * constructions. Reasonable for an educational hint, not a certified
 * judgment, matching this whole engine's stated goal.
 */
function detectIzharCandidate(rawWord: string, nextRawWord: string | null): boolean {
  if (!nextRawWord) return false;
  const normalizedNext = normalizeArabicWord(nextRawWord);
  const nextFirstLetter = normalizedNext[0];
  if (!nextFirstLetter || !THROAT_LETTERS.has(nextFirstLetter)) return false;

  const hasTanween = TANWEEN_REGEX.test(rawWord);
  const normalizedWord = normalizeArabicWord(rawWord);
  const endsInBareNoon = normalizedWord.endsWith('ن');
  return hasTanween || endsInBareNoon;
}

/** Which of Izhar/Idgham/Iqlab/Ikhfa a noon-sakinah-or-tanween context resolves to, given the following letter — a thin classifier, not an independent rule (see module docstring). */
export function classifyNoonSakinahContext(followingLetter: string): Exclude<TajweedRuleId, 'madd' | 'ghunnah' | 'qalqalah' | 'lam-shamsiyyah' | 'lam-qamariyyah'> {
  if (THROAT_LETTERS.has(followingLetter)) return 'izhar';
  if (followingLetter === 'ب') return 'iqlab';
  if (['ي', 'ن', 'م', 'و'].includes(followingLetter)) return 'idgham';
  return 'ikhfa';
}

/**
 * Detects every rule that applies to this word — markup-backed rules read
 * directly from the already-parsed TajweedWord segments (no re-fetching or
 * re-parsing), text-based rules (Izhar, Lam Qamariyyah) are inferred from
 * the raw letters. Cost is O(segments in this one word) — independent of
 * surah length, and the caller only ever calls this for the single word
 * currently being revealed, not the whole surah at once.
 */
export function detectAppliedRules(word: TajweedWord, rawWord: string, nextRawWord: string | null = null): TajweedRuleId[] {
  const applied = new Set<TajweedRuleId>();

  for (const segment of word.segments) {
    if (!segment.ruleClass) continue;
    for (const ruleId of Object.keys(MARKUP_RULE_CLASSES) as Array<keyof typeof MARKUP_RULE_CLASSES>) {
      if (MARKUP_RULE_CLASSES[ruleId].includes(segment.ruleClass)) applied.add(ruleId);
    }
  }

  if (detectLamQamariyyah(word, rawWord)) applied.add('lam-qamariyyah');
  if (detectIzharCandidate(rawWord, nextRawWord)) applied.add('izhar');

  return Array.from(applied);
}

function evaluation(
  ruleId: TajweedRuleId,
  confidence: number,
  status: TajweedStatus,
  expectedBehaviorKey: TranslationKey,
  observedBehaviorKey: TranslationKey,
  feedbackKey: TranslationKey
): TajweedRuleEvaluation {
  return { ruleId, confidence, status, expectedBehaviorKey, observedBehaviorKey, feedbackKey };
}

const UNKNOWN_NO_TIMING_KEY: TranslationKey = 'recitationCoach.tajweed.observed.noTiming';

/**
 * Madd (elongation) is fundamentally a duration phenomenon, so word-level
 * timing relative to the reciter's own recent pace is a genuinely
 * meaningful (if approximate) signal — the same underlying idea as the
 * existing wordTracker madd heuristic, extended from a binary
 * short/not-short flag into four tiers.
 */
export function evaluateMadd(context: TajweedEvaluationContext, thresholds: TajweedThresholds = DEFAULT_TAJWEED_THRESHOLDS): TajweedRuleEvaluation {
  if (context.durationMs === null || context.paceBaselineMs === null || context.durationMs <= 0) {
    return evaluation(
      'madd',
      10,
      'unknown',
      'recitationCoach.tajweed.expected.madd',
      UNKNOWN_NO_TIMING_KEY,
      'recitationCoach.tajweed.feedback.maddUnknown'
    );
  }

  const ratio = context.durationMs / context.paceBaselineMs;
  const t = thresholds.madd;

  if (ratio < t.tooShortRatio) {
    return evaluation(
      'madd',
      60,
      'likely-incorrect',
      'recitationCoach.tajweed.expected.madd',
      'recitationCoach.tajweed.observed.maddShort',
      'recitationCoach.tajweed.feedback.maddTooShort'
    );
  }
  if (ratio < t.slightlyLongRatio) {
    return evaluation(
      'madd',
      70,
      'correct',
      'recitationCoach.tajweed.expected.madd',
      'recitationCoach.tajweed.observed.maddCorrect',
      'recitationCoach.tajweed.feedback.maddCorrect'
    );
  }
  if (ratio < t.excessivelyLongRatio) {
    return evaluation(
      'madd',
      55,
      'probably-correct',
      'recitationCoach.tajweed.expected.madd',
      'recitationCoach.tajweed.observed.maddSlightlyLong',
      'recitationCoach.tajweed.feedback.maddSlightlyLong'
    );
  }
  return evaluation(
    'madd',
    50,
    'needs-review',
    'recitationCoach.tajweed.expected.madd',
    'recitationCoach.tajweed.observed.maddExcessivelyLong',
    'recitationCoach.tajweed.feedback.maddExcessivelyLong'
  );
}

/** Ghunnah (nasalization) is also duration-based, but a lighter effect than madd — proportionally smaller ratios distinguish its tiers. */
export function evaluateGhunnah(context: TajweedEvaluationContext, thresholds: TajweedThresholds = DEFAULT_TAJWEED_THRESHOLDS): TajweedRuleEvaluation {
  if (context.durationMs === null || context.paceBaselineMs === null || context.durationMs <= 0) {
    return evaluation(
      'ghunnah',
      10,
      'unknown',
      'recitationCoach.tajweed.expected.ghunnah',
      UNKNOWN_NO_TIMING_KEY,
      'recitationCoach.tajweed.feedback.ghunnahUnknown'
    );
  }

  const ratio = context.durationMs / context.paceBaselineMs;
  const t = thresholds.ghunnah;

  if (ratio < t.tooShortRatio) {
    return evaluation(
      'ghunnah',
      55,
      'likely-incorrect',
      'recitationCoach.tajweed.expected.ghunnah',
      'recitationCoach.tajweed.observed.ghunnahShort',
      'recitationCoach.tajweed.feedback.ghunnahTooShort'
    );
  }
  if (ratio < t.tooLongRatio) {
    return evaluation(
      'ghunnah',
      65,
      'correct',
      'recitationCoach.tajweed.expected.ghunnah',
      'recitationCoach.tajweed.observed.ghunnahCorrect',
      'recitationCoach.tajweed.feedback.ghunnahCorrect'
    );
  }
  return evaluation(
    'ghunnah',
    50,
    'probably-correct',
    'recitationCoach.tajweed.expected.ghunnah',
    'recitationCoach.tajweed.observed.ghunnahLong',
    'recitationCoach.tajweed.feedback.ghunnahLong'
  );
}

/**
 * Qalqalah is about a distinct "bouncing echo" articulation quality, not
 * duration — word-level timing alone genuinely cannot verify that quality
 * (it would need acoustic/spectral analysis of the plosive release, not
 * available here). Confidence is deliberately capped low regardless of
 * outcome; the only signal used is whether the word wasn't rushed
 * (at-or-above the reciter's own pace), which is weak corroborating
 * evidence at best, never a real verdict.
 */
export function evaluateQalqalah(context: TajweedEvaluationContext): TajweedRuleEvaluation {
  if (context.durationMs === null || context.paceBaselineMs === null || context.durationMs <= 0) {
    return evaluation(
      'qalqalah',
      10,
      'unknown',
      'recitationCoach.tajweed.expected.qalqalah',
      UNKNOWN_NO_TIMING_KEY,
      'recitationCoach.tajweed.feedback.qalqalahUnknown'
    );
  }
  const notRushed = context.durationMs >= context.paceBaselineMs * 0.9;
  return notRushed
    ? evaluation(
        'qalqalah',
        35,
        'probably-correct',
        'recitationCoach.tajweed.expected.qalqalah',
        'recitationCoach.tajweed.observed.qalqalahNotRushed',
        'recitationCoach.tajweed.feedback.qalqalahOk'
      )
    : evaluation(
        'qalqalah',
        30,
        'needs-review',
        'recitationCoach.tajweed.expected.qalqalah',
        'recitationCoach.tajweed.observed.qalqalahRushed',
        'recitationCoach.tajweed.feedback.qalqalahEmphasize'
      );
}

/**
 * Shared evaluator for every remaining rule (Ikhfa, Idgham, Iqlab, Izhar,
 * Lam Shamsiyyah, Lam Qamariyyah) — all are phoneme-substitution or
 * merging rules, not duration effects, so there is no timing signal that
 * meaningfully assesses them. The one honest, usable proxy: Phase 1's own
 * word-match classification. If Whisper recognized the word correctly,
 * that's weak indirect evidence the phoneme was produced intelligibly; a
 * clear mismatch is weak evidence of the opposite. Confidence stays low
 * either way — this is corroboration, not verification.
 */
function evaluateLowEvidenceRule(ruleId: TajweedRuleId, context: TajweedEvaluationContext): TajweedRuleEvaluation {
  const expectedKey = `recitationCoach.tajweed.expected.${ruleId}` as TranslationKey;
  const cls = context.wordMatchClassification;

  if (cls === 'correct' || cls === 'probably-correct') {
    return evaluation(
      ruleId,
      40,
      'probably-correct',
      expectedKey,
      'recitationCoach.tajweed.observed.wordRecognizedWell',
      'recitationCoach.tajweed.feedback.genericGood'
    );
  }
  if (cls === 'wrong-word' || cls === 'out-of-sequence') {
    return evaluation(
      ruleId,
      30,
      'needs-review',
      expectedKey,
      'recitationCoach.tajweed.observed.wordUnclear',
      'recitationCoach.tajweed.feedback.genericReview'
    );
  }
  return evaluation(ruleId, 15, 'unknown', expectedKey, 'recitationCoach.tajweed.observed.insufficientEvidence', 'recitationCoach.tajweed.feedback.genericUnknown');
}

type RuleEvaluator = (context: TajweedEvaluationContext, thresholds: TajweedThresholds) => TajweedRuleEvaluation;

/**
 * One entry point per rule — a future ML-based evaluator for any single
 * rule is a one-line swap here, never a change to detectAppliedRules,
 * analyzeWord, or any aggregation logic below.
 */
const RULE_EVALUATORS: Record<TajweedRuleId, RuleEvaluator> = {
  madd: evaluateMadd,
  ghunnah: evaluateGhunnah,
  qalqalah: (context) => evaluateQalqalah(context),
  ikhfa: (context) => evaluateLowEvidenceRule('ikhfa', context),
  idgham: (context) => evaluateLowEvidenceRule('idgham', context),
  iqlab: (context) => evaluateLowEvidenceRule('iqlab', context),
  izhar: (context) => evaluateLowEvidenceRule('izhar', context),
  'lam-shamsiyyah': (context) => evaluateLowEvidenceRule('lam-shamsiyyah', context),
  'lam-qamariyyah': (context) => evaluateLowEvidenceRule('lam-qamariyyah', context),
};

export function evaluateRule(
  ruleId: TajweedRuleId,
  context: TajweedEvaluationContext,
  thresholds: TajweedThresholds = DEFAULT_TAJWEED_THRESHOLDS
): TajweedRuleEvaluation {
  return RULE_EVALUATORS[ruleId](context, thresholds);
}

export interface WordTajweedAnalysis {
  ayahNumber: number;
  wordIndex: number;
  rulesApplied: TajweedRuleId[];
  evaluations: TajweedRuleEvaluation[];
}

/** Analyzes one word: which rules apply, and how each one was likely performed. Cost is bounded by the word's own segment count and rule count (9) — independent of surah length. */
export function analyzeWord(
  ayahNumber: number,
  wordIndex: number,
  context: TajweedEvaluationContext,
  thresholds: TajweedThresholds = DEFAULT_TAJWEED_THRESHOLDS
): WordTajweedAnalysis {
  const rulesApplied = detectAppliedRules(context.word, context.rawWord, context.nextRawWord);
  const evaluations = rulesApplied.map((ruleId) => evaluateRule(ruleId, context, thresholds));
  return { ayahNumber, wordIndex, rulesApplied, evaluations };
}

// --- Pace baseline tracking (self-contained — does not read wordTracker's own baseline) ---

export interface PaceTrackerState {
  recentDurationsMs: number[];
}

export function createPaceTrackerState(): PaceTrackerState {
  return { recentDurationsMs: [] };
}

export function currentPaceBaseline(state: PaceTrackerState, minSamples: number): number | null {
  if (state.recentDurationsMs.length < minSamples) return null;
  return state.recentDurationsMs.reduce((sum, value) => sum + value, 0) / state.recentDurationsMs.length;
}

/** Callers should skip feeding madd/ghunnah words into the baseline (mirroring wordTracker's own rationale) — a correctly-elongated word would otherwise inflate the average and make the next elongation's expected minimum creep upward too. */
export function recordPaceSample(state: PaceTrackerState, durationMs: number, windowSize: number = DEFAULT_TAJWEED_THRESHOLDS.paceWindowSize): PaceTrackerState {
  return { recentDurationsMs: [...state.recentDurationsMs, durationMs].slice(-windowSize) };
}

// --- Aggregation: per-ayah summaries and the end-of-surah report ---

export interface AyahTajweedSummary {
  ayahNumber: number;
  rulesApplied: TajweedRuleId[];
  rulesPerformedWell: TajweedRuleId[];
  rulesNeedingPractice: TajweedRuleId[];
  overallConfidence: number;
}

function isPositiveStatus(status: TajweedStatus): boolean {
  return status === 'correct' || status === 'probably-correct';
}

function isNegativeStatus(status: TajweedStatus): boolean {
  return status === 'likely-incorrect' || status === 'needs-review';
}

/** Summarizes one ayah's worth of already-collected word analyses — a pure aggregation, called once when the tracker's cursor moves past that ayah. */
export function summarizeAyah(ayahNumber: number, wordAnalyses: WordTajweedAnalysis[]): AyahTajweedSummary {
  const rulesApplied = new Set<TajweedRuleId>();
  const performedWell = new Set<TajweedRuleId>();
  const needsPractice = new Set<TajweedRuleId>();
  let confidenceSum = 0;
  let confidenceCount = 0;

  for (const wordAnalysis of wordAnalyses) {
    for (const wordEvaluation of wordAnalysis.evaluations) {
      rulesApplied.add(wordEvaluation.ruleId);
      confidenceSum += wordEvaluation.confidence;
      confidenceCount += 1;
      if (isPositiveStatus(wordEvaluation.status)) performedWell.add(wordEvaluation.ruleId);
      if (isNegativeStatus(wordEvaluation.status)) needsPractice.add(wordEvaluation.ruleId);
    }
  }

  return {
    ayahNumber,
    rulesApplied: Array.from(rulesApplied),
    rulesPerformedWell: Array.from(performedWell),
    rulesNeedingPractice: Array.from(needsPractice),
    overallConfidence: confidenceCount > 0 ? Math.round(confidenceSum / confidenceCount) : 0,
  };
}

export interface RuleAccuracyEntry {
  evaluatedCount: number;
  /** Excludes 'needs-review'/'unknown' evaluations — those are inconclusive, not evidence either way, and would dilute accuracy in either direction if counted. */
  conclusiveCount: number;
  correctCount: number;
  accuracy: number; // 0-100, correctCount / max(conclusiveCount, 1)
}

export interface SurahTajweedReport {
  overallScore: number; // 0-100
  strongestRules: TajweedRuleId[];
  weakestRules: TajweedRuleId[];
  mostFrequentIssue: TajweedRuleId | null;
  recommendedPracticeAreas: TajweedRuleId[];
  ruleAccuracyBreakdown: Partial<Record<TajweedRuleId, RuleAccuracyEntry>>;
}

/**
 * Structured, serializable summary across a whole surah's worth of ayah
 * summaries — deliberately a plain data shape (no functions, no class
 * instances) so it can be logged, persisted, or handed to a future
 * analytics/progress-tracking feature without transformation.
 */
export function summarizeSurah(ayahSummaries: AyahTajweedSummary[]): SurahTajweedReport {
  const breakdown: Partial<Record<TajweedRuleId, RuleAccuracyEntry>> = {};

  for (const ayahSummary of ayahSummaries) {
    for (const ruleId of ayahSummary.rulesApplied) {
      const entry = breakdown[ruleId] ?? { evaluatedCount: 0, conclusiveCount: 0, correctCount: 0, accuracy: 0 };
      entry.evaluatedCount += 1;
      const wasWell = ayahSummary.rulesPerformedWell.includes(ruleId);
      const wasPractice = ayahSummary.rulesNeedingPractice.includes(ruleId);
      if (wasWell || wasPractice) {
        entry.conclusiveCount += 1;
        if (wasWell) entry.correctCount += 1;
      }
      breakdown[ruleId] = entry;
    }
  }

  for (const entry of Object.values(breakdown)) {
    entry.accuracy = entry.conclusiveCount > 0 ? Math.round((entry.correctCount / entry.conclusiveCount) * 100) : 0;
  }

  const ranked = (Object.entries(breakdown) as Array<[TajweedRuleId, RuleAccuracyEntry]>).filter(([, entry]) => entry.conclusiveCount > 0);
  const strongestRules = [...ranked].sort((a, b) => b[1].accuracy - a[1].accuracy).slice(0, 3).map(([ruleId]) => ruleId);
  const weakestRules = [...ranked].sort((a, b) => a[1].accuracy - b[1].accuracy).slice(0, 3).map(([ruleId]) => ruleId);

  const mostFrequentIssue =
    [...ranked]
      .map(([ruleId, entry]) => [ruleId, entry.conclusiveCount - entry.correctCount] as const)
      .sort((a, b) => b[1] - a[1])
      .find(([, issueCount]) => issueCount > 0)?.[0] ?? null;

  const overallScore =
    ranked.length > 0 ? Math.round(ranked.reduce((sum, [, entry]) => sum + entry.accuracy, 0) / ranked.length) : 0;

  return {
    overallScore,
    strongestRules,
    weakestRules,
    mostFrequentIssue,
    recommendedPracticeAreas: weakestRules,
    ruleAccuracyBreakdown: breakdown,
  };
}

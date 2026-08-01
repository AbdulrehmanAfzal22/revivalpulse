import type { WordMatchClassification } from './wordMatcher';
import type { AyahTajweedSummary, SurahTajweedReport } from './tajweedAnalysisEngine';
import type { TranslationKey } from 'i18n/types';

/**
 * Consumes only the already-computed OUTPUTS of the matching pipeline
 * (per-word classification + confidence, exactly what useRecitationSession
 * already exposes as `lastWordEvent`) and of the Tajweed engine
 * (SurahTajweedReport / AyahTajweedSummary) — it never imports evaluation
 * logic from wordMatcher.ts, quranCorrectionLayer.ts, coachingEngine.ts, or
 * tajweedAnalysisEngine.ts, only their result *types*. Recovery/fluency
 * detection is computed independently from the same raw classification
 * stream Coaching also happens to read, rather than depending on Coaching's
 * own derived analytics events — this keeps the "stay independent of the
 * Coaching module" requirement literal, not just nominal.
 */

// --- Raw input: one entry per lastWordEvent the hook has observed ---

export interface WordScoringSample {
  ayahNumber: number;
  wordIndex: number;
  classification: WordMatchClassification;
  /** Phase 1's match confidence (0-100) for this specific attempt — not the dimension-level confidence computed below. */
  confidence: number;
  durationMs: number;
  timestamp: number;
}

/**
 * A word position can appear more than once in the sample stream — the
 * tracker freezes on a mismatch and keeps comparing subsequent recognized
 * words against the *same* expected position until one resolves it (see
 * wordTracker.advanceTracker) — so multiple samples sharing an
 * (ayahNumber, wordIndex) is the normal shape of a held-and-retried word,
 * not a bug.
 */
const POSITIVE_CLASSIFICATIONS: ReadonlySet<WordMatchClassification> = new Set(['correct', 'probably-correct']);
const NEGATIVE_CLASSIFICATIONS: ReadonlySet<WordMatchClassification> = new Set([
  'wrong-word',
  'missing-word',
  'out-of-sequence',
]);
// 'probably-whisper-error' is deliberately in neither set — it's exactly as
// inconclusive here as it is everywhere else in this feature (see
// tajweedAnalysisEngine's RuleAccuracyEntry docstring for the same
// exclude-inconclusive rationale).

// --- Incremental accumulator (pure, mirrors tajweedAnalysisEngine's PaceTrackerState pattern) ---

export interface AyahRawMetrics {
  ayahNumber: number;
  samples: WordScoringSample[];
  tajweedSummary?: AyahTajweedSummary | null;
}

export interface ScoringAccumulatorState {
  currentAyahNumber: number | null;
  currentAyahSamples: WordScoringSample[];
  finalizedAyahRaw: AyahRawMetrics[];
}

export function createScoringAccumulatorState(): ScoringAccumulatorState {
  return { currentAyahNumber: null, currentAyahSamples: [], finalizedAyahRaw: [] };
}

/** Appends one sample, finalizing the previous ayah's raw metrics the moment the ayah number changes. */
export function recordWordSample(state: ScoringAccumulatorState, sample: WordScoringSample): ScoringAccumulatorState {
  if (state.currentAyahNumber !== null && state.currentAyahNumber !== sample.ayahNumber) {
    const finalized: AyahRawMetrics = { ayahNumber: state.currentAyahNumber, samples: state.currentAyahSamples };
    return {
      currentAyahNumber: sample.ayahNumber,
      currentAyahSamples: [sample],
      finalizedAyahRaw: [...state.finalizedAyahRaw, finalized],
    };
  }
  return {
    currentAyahNumber: sample.ayahNumber,
    currentAyahSamples: [...state.currentAyahSamples, sample],
    finalizedAyahRaw: state.finalizedAyahRaw,
  };
}

/** Call once the surah completes, to flush whatever ayah was still in progress. */
export function finalizeCurrentAyah(state: ScoringAccumulatorState): ScoringAccumulatorState {
  if (state.currentAyahNumber === null) return state;
  const finalized: AyahRawMetrics = { ayahNumber: state.currentAyahNumber, samples: state.currentAyahSamples };
  return { currentAyahNumber: null, currentAyahSamples: [], finalizedAyahRaw: [...state.finalizedAyahRaw, finalized] };
}

// --- Per-ayah analysis (Requirement 3) ---

export interface AyahScoreAnalysis {
  ayahNumber: number;
  accuracy: number; // 0-100
  tajweedScore: number; // 0-100, from the Tajweed engine's own per-ayah summary; 0 when no tajweed data was available
  fluency: number; // 0-100
  correctWords: number;
  mistakes: number;
  recoveryEvents: number;
  timeTakenMs: number;
  wordCount: number;
  averageConfidence: number;
}

/**
 * Not enough duration samples to judge pace variance either way — a
 * neutral default, not a claim of good or bad fluency.
 */
const MIN_DURATION_SAMPLES_FOR_PACE = 2;

function average(values: number[]): number {
  return values.length > 0 ? values.reduce((sum, value) => sum + value, 0) / values.length : 0;
}

/**
 * Coefficient-of-variation based pace-consistency score: 0 variance (every
 * word took the same time) scores 100; heavy variance floors at 20 rather
 * than 0, since some natural variation is expected and shouldn't read as a
 * total fluency failure.
 */
function calculatePaceConsistencyScore(durations: number[]): number {
  if (durations.length < MIN_DURATION_SAMPLES_FOR_PACE) return 70;
  const mean = average(durations);
  if (mean === 0) return 70;
  const variance = average(durations.map((duration) => (duration - mean) ** 2));
  const coefficientOfVariation = Math.sqrt(variance) / mean;
  return Math.round(Math.max(20, 100 - coefficientOfVariation * 80));
}

/**
 * Groups this ayah's samples by word position, then classifies each
 * position by its *final* recorded classification (the one the reciter
 * ultimately settled on), while still counting how many attempts and how
 * many of those were negative — a position resolved positive after 3
 * negative attempts is a recovery, but a slower one than resolving after 1.
 */
export function computeAyahAnalysis(raw: AyahRawMetrics): AyahScoreAnalysis {
  const { ayahNumber, samples, tajweedSummary } = raw;

  const byPosition = new Map<number, WordScoringSample[]>();
  for (const sample of samples) {
    const list = byPosition.get(sample.wordIndex) ?? [];
    list.push(sample);
    byPosition.set(sample.wordIndex, list);
  }

  let correctWords = 0;
  let mistakes = 0;
  let recoveryEvents = 0;
  let totalRetries = 0;
  let retriedPositions = 0;

  for (const positionSamples of byPosition.values()) {
    const finalSample = positionSamples[positionSamples.length - 1]!;
    const hadNegativeAttempt = positionSamples.some((sample) => NEGATIVE_CLASSIFICATIONS.has(sample.classification));

    if (POSITIVE_CLASSIFICATIONS.has(finalSample.classification)) {
      correctWords += 1;
      if (hadNegativeAttempt) {
        recoveryEvents += 1;
        retriedPositions += 1;
        totalRetries += positionSamples.length - 1;
      }
    } else if (NEGATIVE_CLASSIFICATIONS.has(finalSample.classification)) {
      mistakes += 1;
    }
  }

  const conclusivePositions = correctWords + mistakes;
  const accuracy = conclusivePositions > 0 ? Math.round((correctWords / conclusivePositions) * 100) : 0;

  const durations = samples.map((sample) => sample.durationMs).filter((duration) => duration > 0);
  const paceScore = calculatePaceConsistencyScore(durations);
  const retryPenalty = retriedPositions > 0 ? Math.min(40, (totalRetries / retriedPositions) * 20) : 0;
  const fluency = Math.max(0, Math.round(paceScore - retryPenalty));

  const averageConfidence = samples.length > 0 ? Math.round(average(samples.map((sample) => sample.confidence))) : 0;
  const timeTakenMs = durations.reduce((sum, duration) => sum + duration, 0);

  return {
    ayahNumber,
    accuracy,
    tajweedScore: tajweedSummary?.overallConfidence ?? 0,
    fluency,
    correctWords,
    mistakes,
    recoveryEvents,
    timeTakenMs,
    wordCount: byPosition.size,
    averageConfidence,
  };
}

// --- Score dimensions (Requirement 1) ---

export type ScoreDimension =
  | 'wordAccuracy'
  | 'pronunciation'
  | 'tajweed'
  | 'fluency'
  | 'recovery'
  | 'consistency'
  | 'confidence';

export const SCORE_DIMENSIONS: ScoreDimension[] = [
  'wordAccuracy',
  'pronunciation',
  'tajweed',
  'fluency',
  'recovery',
  'consistency',
  'confidence',
];

export type ReportDimension = ScoreDimension | 'overall';

export interface DimensionScore {
  dimension: ReportDimension;
  score: number; // 0-100
  /** How much evidence backs this particular score — not the score itself. Low when there simply isn't much data yet (e.g. a two-ayah session), regardless of what that data says. */
  confidence: number; // 0-100
}

export interface SessionScoringInput {
  ayahAnalyses: AyahScoreAnalysis[];
  allSamples: WordScoringSample[];
  tajweedReport: SurahTajweedReport | null;
}

/** More samples -> more confidence, with diminishing returns capped at `fullConfidenceAtCount`; never a claim of certainty from a handful of words. */
function sampleCountConfidence(count: number, fullConfidenceAtCount: number): number {
  if (fullConfidenceAtCount <= 0) return 0;
  return Math.round(Math.min(100, (count / fullConfidenceAtCount) * 100));
}

function totalWordCount(ayahAnalyses: AyahScoreAnalysis[]): number {
  return ayahAnalyses.reduce((sum, ayah) => sum + ayah.wordCount, 0);
}

function calculateWordAccuracy(input: SessionScoringInput): DimensionScore {
  const totalCorrect = input.ayahAnalyses.reduce((sum, ayah) => sum + ayah.correctWords, 0);
  const totalMistakes = input.ayahAnalyses.reduce((sum, ayah) => sum + ayah.mistakes, 0);
  const conclusive = totalCorrect + totalMistakes;
  const score = conclusive > 0 ? Math.round((totalCorrect / conclusive) * 100) : 0;
  return { dimension: 'wordAccuracy', score, confidence: sampleCountConfidence(conclusive, 20) };
}

/**
 * A deliberately different signal from Word Accuracy: the average
 * match-confidence (how *clean* a match was) across attempts that weren't
 * outright missing/extra words, rather than the binary correct/incorrect
 * verdict. Two reciters can have identical accuracy while one consistently
 * produced crisp, high-confidence matches and the other scraped by on
 * borderline Levenshtein matches — this dimension is what tells them apart.
 * It is an approximation of pronunciation clarity via ASR match quality,
 * not a phoneme-level acoustic assessment (Whisper only gives word-level
 * timing here, the same limitation the Tajweed engine documents).
 */
function calculatePronunciation(input: SessionScoringInput): DimensionScore {
  const relevant = input.allSamples.filter(
    (sample) => sample.classification !== 'missing-word' && sample.classification !== 'out-of-sequence'
  );
  const score = relevant.length > 0 ? Math.round(average(relevant.map((sample) => sample.confidence))) : 0;
  return { dimension: 'pronunciation', score, confidence: sampleCountConfidence(relevant.length, 20) };
}

function calculateTajweedDimension(input: SessionScoringInput): DimensionScore {
  if (!input.tajweedReport) return { dimension: 'tajweed', score: 0, confidence: 0 };
  const evaluatedCount = Object.values(input.tajweedReport.ruleAccuracyBreakdown).reduce(
    (sum, entry) => sum + (entry?.evaluatedCount ?? 0),
    0
  );
  return {
    dimension: 'tajweed',
    score: input.tajweedReport.overallScore,
    confidence: sampleCountConfidence(evaluatedCount, 15),
  };
}

function calculateFluency(input: SessionScoringInput): DimensionScore {
  const totalWords = totalWordCount(input.ayahAnalyses);
  if (totalWords === 0) return { dimension: 'fluency', score: 0, confidence: 0 };
  const weightedSum = input.ayahAnalyses.reduce((sum, ayah) => sum + ayah.fluency * ayah.wordCount, 0);
  return { dimension: 'fluency', score: Math.round(weightedSum / totalWords), confidence: sampleCountConfidence(totalWords, 20) };
}

/**
 * A mistake "episode" is one word position that ever carried a negative
 * classification. It counts as recovered if the position's samples
 * eventually resolved positive (see computeAyahAnalysis.recoveryEvents);
 * otherwise it's still unresolved when the session record was taken
 * (ayah.mistakes). recoveryRate rewards resolving mistakes at all; sessions
 * with no mistakes score a perfect (but low-confidence, since there's
 * nothing to have measured) recovery.
 */
function calculateRecovery(input: SessionScoringInput): DimensionScore {
  const totalRecovered = input.ayahAnalyses.reduce((sum, ayah) => sum + ayah.recoveryEvents, 0);
  const totalUnrecovered = input.ayahAnalyses.reduce((sum, ayah) => sum + ayah.mistakes, 0);
  const totalEpisodes = totalRecovered + totalUnrecovered;
  if (totalEpisodes === 0) {
    return { dimension: 'recovery', score: 100, confidence: sampleCountConfidence(totalWordCount(input.ayahAnalyses), 30) };
  }
  const score = Math.round((totalRecovered / totalEpisodes) * 100);
  return { dimension: 'recovery', score, confidence: sampleCountConfidence(totalEpisodes, 5) };
}

/** Inverse of the variance across per-ayah accuracy scores — rewards uniform performance over a mix of great and poor ayahs, even at the same average. Needs several ayahs to mean anything; short sessions get a neutral score and low confidence rather than an overreaching verdict. */
function calculateConsistency(input: SessionScoringInput): DimensionScore {
  const accuracies = input.ayahAnalyses.map((ayah) => ayah.accuracy);
  if (accuracies.length < 2) return { dimension: 'consistency', score: 70, confidence: sampleCountConfidence(accuracies.length, 6) };
  const mean = average(accuracies);
  const variance = average(accuracies.map((value) => (value - mean) ** 2));
  const stdDev = Math.sqrt(variance);
  const score = Math.round(Math.max(0, 100 - stdDev * 1.5));
  return { dimension: 'consistency', score, confidence: sampleCountConfidence(accuracies.length, 6) };
}

/** Meta-confidence: how sure the underlying matching was across every attempt, independent of whether those attempts were right or wrong. */
function calculateConfidence(input: SessionScoringInput): DimensionScore {
  const score = input.allSamples.length > 0 ? Math.round(average(input.allSamples.map((sample) => sample.confidence))) : 0;
  return { dimension: 'confidence', score, confidence: sampleCountConfidence(input.allSamples.length, 20) };
}

type DimensionCalculator = (input: SessionScoringInput) => DimensionScore;

/**
 * One entry point per dimension — swapping any single dimension for a
 * future ML-based scorer (e.g. a real acoustic pronunciation model) is a
 * one-line change here, never a change to buildSurahScoreReport or anything
 * downstream of it. Mirrors tajweedAnalysisEngine's RULE_EVALUATORS.
 */
const DIMENSION_CALCULATORS: Record<ScoreDimension, DimensionCalculator> = {
  wordAccuracy: calculateWordAccuracy,
  pronunciation: calculatePronunciation,
  tajweed: calculateTajweedDimension,
  fluency: calculateFluency,
  recovery: calculateRecovery,
  consistency: calculateConsistency,
  confidence: calculateConfidence,
};

// --- Configurable weights (Requirement 2) ---

export interface ScoringWeights {
  wordAccuracy: number;
  tajweed: number;
  fluency: number;
  pronunciation: number;
  recovery: number;
  confidence: number;
  // 'consistency' is deliberately not a weighted input to Overall — it's a
  // metric *about* the other per-ayah scores (their variance), so folding
  // it back into the sum it's derived from would be circular. It's still
  // always computed and always shown as its own score.
}

/** As specified: Word Accuracy 40%, Tajweed 25%, Fluency 15%, Pronunciation 10%, Recovery 5%, Confidence 5%. */
export const DEFAULT_SCORING_WEIGHTS: ScoringWeights = {
  wordAccuracy: 0.4,
  tajweed: 0.25,
  fluency: 0.15,
  pronunciation: 0.1,
  recovery: 0.05,
  confidence: 0.05,
};

/**
 * Weighted, not averaged. Two normalizations happen, deliberately for
 * different reasons:
 *
 * 1. Overall *confidence* is the configured weights applied directly to
 *    each dimension's own confidence, normalized by total weight — so a
 *    custom weight config that doesn't sum to exactly 1 degrades
 *    gracefully instead of silently under/over-scoring.
 * 2. Overall *score* additionally scales each dimension's weight by that
 *    same dimension's confidence before summing. Without this, a dimension
 *    with zero evidence (e.g. Recovery defaults to a "perfect" 100 when a
 *    session has no mistakes to recover from at all, including a
 *    completely empty session) would still inject its default value into
 *    the overall at full nominal weight. Scaling by confidence means a
 *    dimension the engine isn't sure about yet contributes little to
 *    nothing to the headline number, while still being fully visible in
 *    its own right (e.g. in the debug panel).
 */
export function calculateOverallScore(dimensions: Record<ScoreDimension, DimensionScore>, weights: ScoringWeights): DimensionScore {
  const entries: Array<[DimensionScore, number]> = [
    [dimensions.wordAccuracy, weights.wordAccuracy],
    [dimensions.tajweed, weights.tajweed],
    [dimensions.fluency, weights.fluency],
    [dimensions.pronunciation, weights.pronunciation],
    [dimensions.recovery, weights.recovery],
    [dimensions.confidence, weights.confidence],
  ];
  const totalWeight = entries.reduce((sum, [, weight]) => sum + weight, 0);
  if (totalWeight <= 0) return { dimension: 'overall', score: 0, confidence: 0 };

  const confidenceSum = entries.reduce((sum, [dim, weight]) => sum + dim.confidence * weight, 0);
  const confidence = Math.round(confidenceSum / totalWeight);

  const effectiveEntries = entries.map(([dim, weight]) => [dim, weight * (dim.confidence / 100)] as const);
  const totalEffectiveWeight = effectiveEntries.reduce((sum, [, effectiveWeight]) => sum + effectiveWeight, 0);
  const score =
    totalEffectiveWeight > 0
      ? Math.round(effectiveEntries.reduce((sum, [dim, effectiveWeight]) => sum + dim.score * effectiveWeight, 0) / totalEffectiveWeight)
      : 0;

  return { dimension: 'overall', score, confidence };
}

// --- Difficulty analysis (Requirement 7) ---

export interface DifficultWordEntry {
  ayahNumber: number;
  wordIndex: number;
  attempts: number;
  mistakeAttempts: number;
}

function computeDifficultWords(allSamples: WordScoringSample[], limit = 5): DifficultWordEntry[] {
  const byPosition = new Map<string, DifficultWordEntry>();
  for (const sample of allSamples) {
    const key = `${sample.ayahNumber}:${sample.wordIndex}`;
    const entry = byPosition.get(key) ?? { ayahNumber: sample.ayahNumber, wordIndex: sample.wordIndex, attempts: 0, mistakeAttempts: 0 };
    entry.attempts += 1;
    if (NEGATIVE_CLASSIFICATIONS.has(sample.classification)) entry.mistakeAttempts += 1;
    byPosition.set(key, entry);
  }
  return Array.from(byPosition.values())
    .filter((entry) => entry.mistakeAttempts > 0)
    .sort((a, b) => b.mistakeAttempts - a.mistakeAttempts || b.attempts - a.attempts)
    .slice(0, limit);
}

/** Counts each word position's *final* classification once (not every retry attempt), so a heavily-retried word doesn't skew the type breakdown just for taking longer to resolve. */
function computeMistakeTypeBreakdown(allSamples: WordScoringSample[]): Partial<Record<WordMatchClassification, number>> {
  const finalByPosition = new Map<string, WordMatchClassification>();
  for (const sample of allSamples) {
    finalByPosition.set(`${sample.ayahNumber}:${sample.wordIndex}`, sample.classification);
  }
  const breakdown: Partial<Record<WordMatchClassification, number>> = {};
  for (const classification of finalByPosition.values()) {
    if (!NEGATIVE_CLASSIFICATIONS.has(classification)) continue;
    breakdown[classification] = (breakdown[classification] ?? 0) + 1;
  }
  return breakdown;
}

function mostCommonMistakeType(breakdown: Partial<Record<WordMatchClassification, number>>): WordMatchClassification | null {
  const entries = Object.entries(breakdown) as Array<[WordMatchClassification, number]>;
  if (entries.length === 0) return null;
  return entries.sort((a, b) => b[1] - a[1])[0]![0];
}

function rankAyahs(ayahAnalyses: AyahScoreAnalysis[], limit = 3): { strongestAyahs: number[]; weakestAyahs: number[] } {
  const withComposite = ayahAnalyses.map((ayah) => ({
    ayahNumber: ayah.ayahNumber,
    composite: Math.round((ayah.accuracy + ayah.tajweedScore + ayah.fluency) / 3),
  }));
  const strongestAyahs = [...withComposite].sort((a, b) => b.composite - a.composite).slice(0, limit).map((entry) => entry.ayahNumber);
  const weakestAyahs = [...withComposite].sort((a, b) => a.composite - b.composite).slice(0, limit).map((entry) => entry.ayahNumber);
  return { strongestAyahs, weakestAyahs };
}

export interface RecoveryPerformance {
  totalRecovered: number;
  totalUnrecovered: number;
  recoveryRate: number; // 0-100
}

function computeRecoveryPerformance(ayahAnalyses: AyahScoreAnalysis[]): RecoveryPerformance {
  const totalRecovered = ayahAnalyses.reduce((sum, ayah) => sum + ayah.recoveryEvents, 0);
  const totalUnrecovered = ayahAnalyses.reduce((sum, ayah) => sum + ayah.mistakes, 0);
  const total = totalRecovered + totalUnrecovered;
  return { totalRecovered, totalUnrecovered, recoveryRate: total > 0 ? Math.round((totalRecovered / total) * 100) : 100 };
}

// --- Insights & recommendations (Requirements 5 & 8) ---
// Text lives in i18n (a key + optional params), never a literal English
// string here — the pure engine decides *which* observation is warranted
// from the data; the UI/locale layer decides how to phrase it in whichever
// language is active. Consistent with how the Tajweed and Coaching engines
// carry only TranslationKeys, never rendered text.

export interface ScoreInsight {
  textKey: TranslationKey;
  params?: Record<string, string>;
}

export interface ScoreRecommendation {
  textKey: TranslationKey;
  params?: Record<string, string>;
}

interface ReportDraft {
  dimensions: Record<ScoreDimension, DimensionScore>;
  ayahAnalyses: AyahScoreAnalysis[];
  tajweedReport: SurahTajweedReport | null;
}

/**
 * Params carry raw identifiers (a TajweedRuleId like 'madd', a ScoreDimension
 * like 'wordAccuracy') rather than pre-resolved TranslationKeys — t()'s
 * interpolation only ever does flat string substitution, it never
 * recursively translates a param value. Resolving 'madd' to its display
 * label is the UI layer's job (it already owns TAJWEED_RULE_NAME_KEYS /
 * SCORE_DIMENSION_NAME_KEYS for rendering the rest of this report), exactly
 * the same division of responsibility tajweedAnalysisEngine.ts already
 * uses for its own rule IDs.
 */

/** Minimum point gap between two dimension scores before it's worth calling out as a specific strength/weakness pair — small gaps are noise, not a real asymmetry. */
const DIMENSION_GAP_THRESHOLD = 20;
/** Minimum point gap between first-half and second-half average accuracy before it's worth an insight — otherwise a two- or three-ayah surah would trigger this from pure noise. */
const HALF_SPLIT_GAP_THRESHOLD = 8;
const MIN_AYAHS_FOR_HALF_SPLIT = 4;

function generateInsights(draft: ReportDraft): ScoreInsight[] {
  const insights: ScoreInsight[] = [];
  const { dimensions, ayahAnalyses, tajweedReport } = draft;

  if (dimensions.fluency.score >= 85) {
    insights.push({ textKey: 'recitationCoach.scoring.insight.excellentFluency' });
  } else if (dimensions.fluency.score < 50 && dimensions.fluency.confidence >= 30) {
    insights.push({ textKey: 'recitationCoach.scoring.insight.fluencyStruggle' });
  }

  if (tajweedReport?.mostFrequentIssue) {
    insights.push({
      textKey: 'recitationCoach.scoring.insight.tajweedFrequentIssue',
      params: { rule: tajweedReport.mostFrequentIssue },
    });
  }

  if (dimensions.recovery.confidence >= 20) {
    if (dimensions.recovery.score >= 85) {
      insights.push({ textKey: 'recitationCoach.scoring.insight.recoveryFast' });
    } else if (dimensions.recovery.score < 50) {
      insights.push({ textKey: 'recitationCoach.scoring.insight.recoveryStruggle' });
    }
  }

  if (ayahAnalyses.length >= MIN_AYAHS_FOR_HALF_SPLIT) {
    const midpoint = Math.floor(ayahAnalyses.length / 2);
    const firstHalfAvg = average(ayahAnalyses.slice(0, midpoint).map((ayah) => ayah.accuracy));
    const secondHalfAvg = average(ayahAnalyses.slice(midpoint).map((ayah) => ayah.accuracy));
    const diff = secondHalfAvg - firstHalfAvg;
    if (diff >= HALF_SPLIT_GAP_THRESHOLD) {
      insights.push({ textKey: 'recitationCoach.scoring.insight.improvedSecondHalf' });
    } else if (diff <= -HALF_SPLIT_GAP_THRESHOLD) {
      insights.push({ textKey: 'recitationCoach.scoring.insight.droppedSecondHalf' });
    }
  }

  if (dimensions.consistency.confidence >= 30) {
    if (dimensions.consistency.score >= 80) {
      insights.push({ textKey: 'recitationCoach.scoring.insight.consistentPerformance' });
    } else if (dimensions.consistency.score < 50) {
      insights.push({ textKey: 'recitationCoach.scoring.insight.variedPerformance' });
    }
  }

  const { strongest, weakest } = findStrongestAndWeakest(dimensions);
  if (strongest && weakest && strongest.score - weakest.score >= DIMENSION_GAP_THRESHOLD) {
    insights.push({
      textKey: 'recitationCoach.scoring.insight.strongestVsWeakest',
      params: { strongest: strongest.dimension, weakest: weakest.dimension },
    });
  }

  return insights;
}

function findStrongestAndWeakest(
  dimensions: Record<ScoreDimension, DimensionScore>
): { strongest: { dimension: ScoreDimension; score: number } | null; weakest: { dimension: ScoreDimension; score: number } | null } {
  // 'confidence' (the meta-confidence dimension) is excluded from this
  // comparison — it describes how sure the system is, not how well the
  // reciter performed, so it shouldn't be called out as a "weakness".
  const comparable = SCORE_DIMENSIONS.filter((dimension) => dimension !== 'confidence' && dimensions[dimension].confidence >= 20);
  if (comparable.length < 2) return { strongest: null, weakest: null };
  const scored = comparable.map((dimension) => ({ dimension, score: dimensions[dimension].score }));
  const strongest = scored.reduce((best, current) => (current.score > best.score ? current : best));
  const weakest = scored.reduce((worst, current) => (current.score < worst.score ? current : worst));
  return { strongest, weakest };
}

function generateRecommendations(draft: ReportDraft, weakestAyahs: number[]): ScoreRecommendation[] {
  const recommendations: ScoreRecommendation[] = [];
  const { dimensions, tajweedReport } = draft;

  if (weakestAyahs.length > 0 && dimensions.wordAccuracy.score < 90) {
    recommendations.push({
      textKey: 'recitationCoach.scoring.recommendation.repeatAyah',
      params: { ayah: String(weakestAyahs[0]) },
    });
  }

  for (const ruleId of tajweedReport?.recommendedPracticeAreas.slice(0, 2) ?? []) {
    recommendations.push({
      textKey: 'recitationCoach.scoring.recommendation.practiceTajweedRule',
      params: { rule: ruleId },
    });
  }

  if (dimensions.fluency.score < 60 && dimensions.fluency.confidence >= 30) {
    recommendations.push({ textKey: 'recitationCoach.scoring.recommendation.improveFluency' });
  }

  if (dimensions.recovery.score < 60 && dimensions.recovery.confidence >= 20) {
    recommendations.push({ textKey: 'recitationCoach.scoring.recommendation.improveRecoverySpeed' });
  }

  const { strongest, weakest } = findStrongestAndWeakest(dimensions);
  if (
    strongest &&
    weakest &&
    strongest.dimension === 'pronunciation' &&
    weakest.dimension === 'fluency' &&
    strongest.score - weakest.score >= DIMENSION_GAP_THRESHOLD
  ) {
    recommendations.push({ textKey: 'recitationCoach.scoring.recommendation.strongPronunciationImproveFluency' });
  }

  if (recommendations.length === 0) {
    recommendations.push({ textKey: 'recitationCoach.scoring.recommendation.generalPractice' });
  }

  return recommendations;
}

// --- End-of-surah report (Requirement 4) ---

export interface SurahScoreReport {
  overall: DimensionScore;
  dimensions: Record<ScoreDimension, DimensionScore>;
  ayahAnalyses: AyahScoreAnalysis[];
  strongestAyahs: number[];
  weakestAyahs: number[];
  mostCommonMistakeType: WordMatchClassification | null;
  mistakeTypeBreakdown: Partial<Record<WordMatchClassification, number>>;
  mostDifficultWords: DifficultWordEntry[];
  recoveryPerformance: RecoveryPerformance;
  averageConfidence: number;
  insights: ScoreInsight[];
  recommendations: ScoreRecommendation[];
  weights: ScoringWeights;
}

/**
 * The single orchestration point: turns accumulated raw per-ayah samples
 * (plus the Tajweed engine's already-computed report) into the full
 * scoring report. O(total words + total ayahs) — every step here is a
 * single pass or sort over data already bounded by the surah's own length,
 * so cost never grows worse than linear in surah size regardless of how
 * long the recitation runs.
 */
export function buildSurahScoreReport(
  ayahRawMetrics: AyahRawMetrics[],
  tajweedReport: SurahTajweedReport | null,
  weights: ScoringWeights = DEFAULT_SCORING_WEIGHTS
): SurahScoreReport {
  const ayahAnalyses = ayahRawMetrics.map(computeAyahAnalysis);
  const allSamples = ayahRawMetrics.flatMap((raw) => raw.samples);

  const input: SessionScoringInput = { ayahAnalyses, allSamples, tajweedReport };

  const dimensions = {} as Record<ScoreDimension, DimensionScore>;
  for (const dimension of SCORE_DIMENSIONS) {
    dimensions[dimension] = DIMENSION_CALCULATORS[dimension](input);
  }
  const overall = calculateOverallScore(dimensions, weights);

  const { strongestAyahs, weakestAyahs } = rankAyahs(ayahAnalyses);
  const mistakeTypeBreakdown = computeMistakeTypeBreakdown(allSamples);
  const mostDifficultWords = computeDifficultWords(allSamples);
  const recoveryPerformance = computeRecoveryPerformance(ayahAnalyses);
  const averageConfidence = allSamples.length > 0 ? Math.round(average(allSamples.map((sample) => sample.confidence))) : 0;

  const draft: ReportDraft = { dimensions, ayahAnalyses, tajweedReport };
  const insights = generateInsights(draft);
  const recommendations = generateRecommendations(draft, weakestAyahs);

  return {
    overall,
    dimensions,
    ayahAnalyses,
    strongestAyahs,
    weakestAyahs,
    mostCommonMistakeType: mostCommonMistakeType(mistakeTypeBreakdown),
    mistakeTypeBreakdown,
    mostDifficultWords,
    recoveryPerformance,
    averageConfidence,
    insights,
    recommendations,
    weights,
  };
}

// --- Progress tracking model (Requirement 6) ---
// A plain, JSON-serializable shape (no functions/class instances), matching
// the precedent set by SurahTajweedReport — ready to be persisted locally
// or synced to a future backend without transformation.

export interface RecitationSessionRecord {
  id: string;
  dateIso: string;
  surahId: number;
  ayahRange: { start: number; end: number };
  durationMs: number;
  overallScore: number;
  overallConfidence: number;
  dimensionScores: Record<ScoreDimension, number>;
  mistakeSummary: { total: number; byType: Partial<Record<WordMatchClassification, number>> };
  tajweedSummary: SurahTajweedReport | null;
  report: SurahScoreReport;
}

export function createSessionRecord(
  id: string,
  dateIso: string,
  surahId: number,
  ayahRange: { start: number; end: number },
  durationMs: number,
  report: SurahScoreReport,
  tajweedReport: SurahTajweedReport | null
): RecitationSessionRecord {
  const dimensionScores = {} as Record<ScoreDimension, number>;
  for (const dimension of SCORE_DIMENSIONS) dimensionScores[dimension] = report.dimensions[dimension].score;

  const totalMistakes = Object.values(report.mistakeTypeBreakdown).reduce((sum, count) => sum + (count ?? 0), 0);

  return {
    id,
    dateIso,
    surahId,
    ayahRange,
    durationMs,
    overallScore: report.overall.score,
    overallConfidence: report.overall.confidence,
    dimensionScores,
    mistakeSummary: { total: totalMistakes, byType: report.mistakeTypeBreakdown },
    tajweedSummary: tajweedReport,
    report,
  };
}

import type { WordMatchClassification } from './wordMatcher';
import type { TajweedRuleId } from './tajweedAnalysisEngine';
import type { CoachingAnalyticsEvent } from './coachingEngine';
import type { DifficultWordEntry, RecitationSessionRecord, ScoreDimension, ScoreInsight } from './scoringEngine';

/**
 * The Learning Profile Engine: turns a history of completed sessions (each
 * already scored by Phase 5's Scoring Engine) into a persistent picture of
 * who this reciter is over time — running totals, long-term weaknesses and
 * strengths, trend lines, motivation messages, and cross-session insights.
 * Consumes only RecitationSessionRecord (Scoring's already-computed output)
 * and CoachingAnalyticsEvent (Coaching's already-computed output) — it
 * never imports evaluation logic from either module.
 */

// --- Per-session, long-term-storage-shaped projection ---

/**
 * A deliberately lean per-session snapshot for long-term history — not the
 * full SurahScoreReport (which carries a full per-ayah breakdown). Storing
 * only these derived numbers/flags is what lets thousands of sessions stay
 * cheap to persist and to scan: each entry is a handful of numbers, not an
 * ever-growing nested structure.
 */
export interface StoredSessionSummary {
  id: string;
  dateIso: string;
  surahId: number;
  ayahRange: { start: number; end: number };
  durationMs: number;
  overallScore: number;
  overallConfidence: number;
  dimensionScores: Record<ScoreDimension, number>;
  mistakeTypeBreakdown: Partial<Record<WordMatchClassification, number>>;
  weakestTajweedRules: TajweedRuleId[];
  mostDifficultWords: DifficultWordEntry[];
  weakestAyahs: number[];
  recoveryRate: number;
  /** Whether this session's own per-ayah data showed a meaningfully lower fluency score on its longer-than-average ayahs versus its shorter ones. False (not "no data") when there wasn't enough length variation in the surah to compare at all. */
  longAyahFluencyDropDetected: boolean;
  /** Count of a 'mistake-detected' event immediately followed by a 'pause-detected' event within the (capped, rolling) coaching analytics window this session — a best-effort proxy for "hesitates after mistakes", not an exhaustive count for very long surahs. */
  hesitationAfterMistakeCount: number;
  coachingEventCounts: Partial<Record<CoachingAnalyticsEvent['type'], number>>;
  /** This session's own end-of-surah insights/recommendations, frozen at capture time — the session-history record of "what stood out then", not recomputed later. */
  insights: ScoreInsight[];
  recommendations: ScoreInsight[];
}

function average(values: number[]): number {
  return values.length > 0 ? values.reduce((sum, value) => sum + value, 0) / values.length : 0;
}

const MIN_AYAHS_FOR_LENGTH_COMPARISON = 3;
const FLUENCY_DROP_THRESHOLD = 15;

/** Compares fluency on this session's longer-than-average ayahs against its shorter ones — needs real length variation within the surah to mean anything, so a uniformly-short (or uniformly-long) surah honestly reports "no evidence" rather than guessing. */
export function detectLongAyahFluencyDrop(ayahAnalyses: Array<{ wordCount: number; fluency: number }>): boolean {
  if (ayahAnalyses.length < MIN_AYAHS_FOR_LENGTH_COMPARISON) return false;
  const averageWordCount = average(ayahAnalyses.map((ayah) => ayah.wordCount));
  const longAyahs = ayahAnalyses.filter((ayah) => ayah.wordCount > averageWordCount);
  const shortAyahs = ayahAnalyses.filter((ayah) => ayah.wordCount <= averageWordCount);
  if (longAyahs.length === 0 || shortAyahs.length === 0) return false;
  return average(shortAyahs.map((ayah) => ayah.fluency)) - average(longAyahs.map((ayah) => ayah.fluency)) >= FLUENCY_DROP_THRESHOLD;
}

/** A 'mistake-detected' immediately followed by a 'pause-detected' in the recent-events window — the one honest proxy available for "hesitates after making a mistake" without Coaching exposing its full, unbounded event log. */
export function countHesitationAfterMistake(events: CoachingAnalyticsEvent[]): number {
  let count = 0;
  for (let i = 0; i < events.length - 1; i += 1) {
    if (events[i]!.type === 'mistake-detected' && events[i + 1]!.type === 'pause-detected') count += 1;
  }
  return count;
}

function tallyCoachingEvents(events: CoachingAnalyticsEvent[]): Partial<Record<CoachingAnalyticsEvent['type'], number>> {
  const tally: Partial<Record<CoachingAnalyticsEvent['type'], number>> = {};
  for (const event of events) tally[event.type] = (tally[event.type] ?? 0) + 1;
  return tally;
}

export function toStoredSessionSummary(record: RecitationSessionRecord, recentCoachingEvents: CoachingAnalyticsEvent[]): StoredSessionSummary {
  const report = record.report;
  return {
    id: record.id,
    dateIso: record.dateIso,
    surahId: record.surahId,
    ayahRange: record.ayahRange,
    durationMs: record.durationMs,
    overallScore: record.overallScore,
    overallConfidence: record.overallConfidence,
    dimensionScores: record.dimensionScores,
    mistakeTypeBreakdown: record.mistakeSummary.byType,
    weakestTajweedRules: record.tajweedSummary?.weakestRules ?? [],
    mostDifficultWords: report.mostDifficultWords,
    weakestAyahs: report.weakestAyahs,
    recoveryRate: report.recoveryPerformance.recoveryRate,
    longAyahFluencyDropDetected: detectLongAyahFluencyDrop(report.ayahAnalyses),
    hesitationAfterMistakeCount: countHesitationAfterMistake(recentCoachingEvents),
    coachingEventCounts: tallyCoachingEvents(recentCoachingEvents),
    insights: report.insights,
    recommendations: report.recommendations,
  };
}

// --- Requirement 1: persistent, incrementally-updated lifetime totals ---

/**
 * Maintained as running sums/counts rather than re-derived from the
 * (necessarily capped, see learningProfileStorage.ts) session history array
 * — an O(1) update per session that stays exactly correct forever,
 * regardless of how many older history entries eventually roll off. Deriving
 * lifetime totals from a capped array instead would silently become wrong
 * the moment history exceeds the cap.
 */
export interface LearningProfileTotals {
  totalSessions: number;
  totalPracticeTimeMs: number;
  totalAyahsCompleted: number;
  /** Serializable stand-in for a Set — every surah ID ever completed, each counted once. */
  distinctSurahIds: number[];
  sumAccuracy: number;
  sumTajweedScore: number;
  sumFluency: number;
  sumConfidence: number;
  lastUpdatedIso: string;
}

export function createEmptyTotals(): LearningProfileTotals {
  return {
    totalSessions: 0,
    totalPracticeTimeMs: 0,
    totalAyahsCompleted: 0,
    distinctSurahIds: [],
    sumAccuracy: 0,
    sumTajweedScore: 0,
    sumFluency: 0,
    sumConfidence: 0,
    lastUpdatedIso: new Date(0).toISOString(),
  };
}

export function updateTotalsWithSession(totals: LearningProfileTotals, summary: StoredSessionSummary): LearningProfileTotals {
  const ayahsInSession = Math.max(0, summary.ayahRange.end - summary.ayahRange.start + 1);
  const distinctSurahIds = totals.distinctSurahIds.includes(summary.surahId)
    ? totals.distinctSurahIds
    : [...totals.distinctSurahIds, summary.surahId];
  return {
    totalSessions: totals.totalSessions + 1,
    totalPracticeTimeMs: totals.totalPracticeTimeMs + summary.durationMs,
    totalAyahsCompleted: totals.totalAyahsCompleted + ayahsInSession,
    distinctSurahIds,
    sumAccuracy: totals.sumAccuracy + summary.dimensionScores.wordAccuracy,
    sumTajweedScore: totals.sumTajweedScore + summary.dimensionScores.tajweed,
    sumFluency: totals.sumFluency + summary.dimensionScores.fluency,
    sumConfidence: totals.sumConfidence + summary.dimensionScores.confidence,
    lastUpdatedIso: summary.dateIso,
  };
}

export interface LearningProfile {
  totalSessions: number;
  totalPracticeTimeMs: number;
  totalAyahsCompleted: number;
  totalSurahsCompleted: number;
  averageAccuracy: number;
  averageTajweedScore: number;
  averageFluency: number;
  averageConfidence: number;
  lastUpdatedIso: string;
}

export function deriveLearningProfile(totals: LearningProfileTotals): LearningProfile {
  const n = Math.max(totals.totalSessions, 1);
  return {
    totalSessions: totals.totalSessions,
    totalPracticeTimeMs: totals.totalPracticeTimeMs,
    totalAyahsCompleted: totals.totalAyahsCompleted,
    totalSurahsCompleted: totals.distinctSurahIds.length,
    averageAccuracy: totals.totalSessions > 0 ? Math.round(totals.sumAccuracy / n) : 0,
    averageTajweedScore: totals.totalSessions > 0 ? Math.round(totals.sumTajweedScore / n) : 0,
    averageFluency: totals.totalSessions > 0 ? Math.round(totals.sumFluency / n) : 0,
    averageConfidence: totals.totalSessions > 0 ? Math.round(totals.sumConfidence / n) : 0,
    lastUpdatedIso: totals.lastUpdatedIso,
  };
}

// --- Requirements 2 & 3: weakness / strength detection ---

export type WeaknessCategory =
  | 'skips-words'
  | 'shortens-madd'
  | 'ghunnah-mistakes'
  | 'similar-word-confusion'
  | 'fluency-drop-long-ayahs'
  | 'hesitation-after-mistakes';

export const ALL_WEAKNESS_CATEGORIES: WeaknessCategory[] = [
  'skips-words',
  'shortens-madd',
  'ghunnah-mistakes',
  'similar-word-confusion',
  'fluency-drop-long-ayahs',
  'hesitation-after-mistakes',
];

/** Returns a severity (0-100) if this category is present in the given session, or null if it isn't — null sessions don't count toward frequency at all, rather than counting as "severity 0". */
type WeaknessDetector = (session: StoredSessionSummary) => number | null;

/**
 * One entry point per weakness — swapping any single detector for a future
 * ML-based one (e.g. a real phoneme-confusion model in place of the
 * wrong-word-rate proxy) is a one-line change here, never a change to
 * detectWeaknesses or anything that ranks its output. Mirrors
 * tajweedAnalysisEngine's RULE_EVALUATORS and scoringEngine's
 * DIMENSION_CALCULATORS.
 */
const WEAKNESS_DETECTORS: Record<WeaknessCategory, WeaknessDetector> = {
  'skips-words': (session) => {
    const missing = session.mistakeTypeBreakdown['missing-word'] ?? 0;
    return missing > 0 ? Math.min(100, missing * 20) : null;
  },
  'shortens-madd': (session) => (session.weakestTajweedRules.includes('madd') ? 70 : null),
  'ghunnah-mistakes': (session) => (session.weakestTajweedRules.includes('ghunnah') ? 70 : null),
  // 'wrong-word' means Whisper heard a *different, real* word rather than
  // silence or an insertion — the closest available proxy for "confused one
  // word with a similar-looking/sounding one" given only word-level text
  // comparison (no phoneme-level confusion data exists in this pipeline).
  'similar-word-confusion': (session) => {
    const wrong = session.mistakeTypeBreakdown['wrong-word'] ?? 0;
    return wrong > 0 ? Math.min(100, wrong * 20) : null;
  },
  'fluency-drop-long-ayahs': (session) => (session.longAyahFluencyDropDetected ? Math.max(0, 100 - session.dimensionScores.fluency) : null),
  'hesitation-after-mistakes': (session) =>
    session.hesitationAfterMistakeCount > 0 ? Math.min(100, session.hesitationAfterMistakeCount * 25) : null,
};

export interface WeaknessRanking {
  category: WeaknessCategory;
  /** Fraction (0-100) of the analyzed sessions this weakness appeared in. */
  frequency: number;
  /** Average severity (0-100) on the sessions where it appeared. */
  severity: number;
  /** frequency * severity / 100 — ranks "happens often AND is pronounced" above either alone. */
  score: number;
  sessionsAnalyzed: number;
}

/** Ranks every weakness category by how often it shows up and how severe it is when it does, across the (already recency-bounded, see learningProfileStorage) session history. */
export function detectWeaknesses(history: StoredSessionSummary[]): WeaknessRanking[] {
  if (history.length === 0) return [];

  const rankings = ALL_WEAKNESS_CATEGORIES.map((category) => {
    const detector = WEAKNESS_DETECTORS[category];
    const severities = history.map((session) => detector(session)).filter((value): value is number => value !== null);
    const frequency = Math.round((severities.length / history.length) * 100);
    const severity = severities.length > 0 ? Math.round(average(severities)) : 0;
    return { category, frequency, severity, score: Math.round((frequency * severity) / 100), sessionsAnalyzed: history.length };
  });

  return rankings.filter((ranking) => ranking.frequency > 0).sort((a, b) => b.score - a.score);
}

export type StrengthCategory = 'excellent-pronunciation' | 'strong-tajweed' | 'consistent-fluency' | 'fast-recovery' | 'high-confidence';

export const ALL_STRENGTH_CATEGORIES: StrengthCategory[] = [
  'excellent-pronunciation',
  'strong-tajweed',
  'consistent-fluency',
  'fast-recovery',
  'high-confidence',
];

const STRENGTH_THRESHOLD = 78;

/** Unlike weaknesses (episodic events), strengths are about *consistently* good averages across history — a single lucky session shouldn't count. */
function averageForStrength(history: StoredSessionSummary[], category: StrengthCategory): number {
  switch (category) {
    case 'excellent-pronunciation':
      return average(history.map((session) => session.dimensionScores.pronunciation));
    case 'strong-tajweed':
      return average(history.map((session) => session.dimensionScores.tajweed));
    case 'consistent-fluency':
      return average(history.map((session) => session.dimensionScores.fluency));
    case 'fast-recovery':
      return average(history.map((session) => session.recoveryRate));
    case 'high-confidence':
      return average(history.map((session) => session.dimensionScores.confidence));
  }
}

export interface StrengthRanking {
  category: StrengthCategory;
  averageScore: number;
  sessionsAnalyzed: number;
}

export function detectStrengths(history: StoredSessionSummary[]): StrengthRanking[] {
  if (history.length === 0) return [];
  return ALL_STRENGTH_CATEGORIES.map((category) => ({
    category,
    averageScore: Math.round(averageForStrength(history, category)),
    sessionsAnalyzed: history.length,
  }))
    .filter((ranking) => ranking.averageScore >= STRENGTH_THRESHOLD)
    .sort((a, b) => b.averageScore - a.averageScore);
}

// --- Requirement 6: long-term progress tracking ---

export type TrendDimension = 'wordAccuracy' | 'tajweed' | 'fluency' | 'confidence';

export interface TrendPoint {
  dateIso: string;
  value: number;
}

export interface TrendSeries {
  dimension: TrendDimension;
  points: TrendPoint[];
  direction: 'improving' | 'declining' | 'stable';
  changeSinceFirst: number;
}

const TREND_STABLE_THRESHOLD = 5;

export function buildTrendSeries(history: StoredSessionSummary[], dimension: TrendDimension): TrendSeries {
  const points = history.map((session) => ({ dateIso: session.dateIso, value: session.dimensionScores[dimension] }));
  if (points.length < 2) return { dimension, points, direction: 'stable', changeSinceFirst: 0 };

  const changeSinceFirst = points[points.length - 1]!.value - points[0]!.value;
  const direction: TrendSeries['direction'] =
    changeSinceFirst > TREND_STABLE_THRESHOLD ? 'improving' : changeSinceFirst < -TREND_STABLE_THRESHOLD ? 'declining' : 'stable';
  return { dimension, points, direction, changeSinceFirst };
}

export function buildAllTrends(history: StoredSessionSummary[]): Record<TrendDimension, TrendSeries> {
  return {
    wordAccuracy: buildTrendSeries(history, 'wordAccuracy'),
    tajweed: buildTrendSeries(history, 'tajweed'),
    fluency: buildTrendSeries(history, 'fluency'),
    confidence: buildTrendSeries(history, 'confidence'),
  };
}

const MS_PER_DAY = 24 * 60 * 60 * 1000;

/** Groups sessions into two adjacent windows of `windowDays` each — the most recent window and the one immediately before it — and reports the average-score delta between them, for a given dimension. Returns null when there isn't a full previous window of history to compare against yet. */
export function computeWindowedImprovement(history: StoredSessionSummary[], dimension: TrendDimension, windowDays: number): number | null {
  if (history.length === 0) return null;
  const latestTimestamp = new Date(history[history.length - 1]!.dateIso).getTime();
  const windowMs = windowDays * MS_PER_DAY;

  const currentWindow = history.filter((session) => latestTimestamp - new Date(session.dateIso).getTime() < windowMs);
  const previousWindow = history.filter((session) => {
    const age = latestTimestamp - new Date(session.dateIso).getTime();
    return age >= windowMs && age < windowMs * 2;
  });

  if (currentWindow.length === 0 || previousWindow.length === 0) return null;
  return Math.round(average(currentWindow.map((s) => s.dimensionScores[dimension])) - average(previousWindow.map((s) => s.dimensionScores[dimension])));
}

export function computeWeeklyImprovement(history: StoredSessionSummary[], dimension: TrendDimension): number | null {
  return computeWindowedImprovement(history, dimension, 7);
}

export function computeMonthlyImprovement(history: StoredSessionSummary[], dimension: TrendDimension): number | null {
  return computeWindowedImprovement(history, dimension, 30);
}

// --- Requirement 9: motivation system ---

/**
 * Every message here is conditioned on an actual computed delta or
 * milestone — there is no "keep going!" fallback with no numbers behind it,
 * per the "avoid generic motivational messages" requirement. When nothing
 * data-driven applies yet (e.g. the very first session), this returns an
 * empty list rather than manufacturing praise.
 */
export function generateMotivationMessages(history: StoredSessionSummary[]): ScoreInsight[] {
  const messages: ScoreInsight[] = [];
  if (history.length === 0) return messages;

  if (history.length >= 2) {
    const latest = history[history.length - 1]!;
    const previous = history[history.length - 2]!;
    const overallDelta = latest.overallScore - previous.overallScore;
    if (overallDelta >= 5) {
      messages.push({ textKey: 'recitationCoach.learning.motivation.improvedVsLastSession', params: { delta: String(overallDelta) } });
    }
    const fluencyDelta = latest.dimensionScores.fluency - previous.dimensionScores.fluency;
    if (fluencyDelta >= 5) {
      messages.push({ textKey: 'recitationCoach.learning.motivation.fluencyImproved', params: { delta: String(fluencyDelta) } });
    }
  }

  const weeklyAccuracyDelta = computeWeeklyImprovement(history, 'wordAccuracy');
  if (weeklyAccuracyDelta !== null && weeklyAccuracyDelta >= 5) {
    messages.push({ textKey: 'recitationCoach.learning.motivation.weeklyImprovement', params: { delta: String(weeklyAccuracyDelta) } });
  }

  // "Mastered X in Surah Y": a tajweed rule that was among this surah's
  // weakest rules on an earlier attempt, but hasn't appeared as weak in any
  // of that surah's last 3 attempts (and there are at least 3 to judge).
  const bySurah = new Map<number, StoredSessionSummary[]>();
  for (const session of history) {
    const list = bySurah.get(session.surahId) ?? [];
    list.push(session);
    bySurah.set(session.surahId, list);
  }
  for (const [surahId, sessions] of bySurah) {
    if (sessions.length < 3) continue;
    const earlierWeakRules = new Set(sessions.slice(0, -3).flatMap((s) => s.weakestTajweedRules));
    const recentSessions = sessions.slice(-3);
    const recentWeakRules = new Set(recentSessions.flatMap((s) => s.weakestTajweedRules));
    for (const rule of earlierWeakRules) {
      if (!recentWeakRules.has(rule)) {
        messages.push({
          textKey: 'recitationCoach.learning.motivation.masteredRuleInSurah',
          params: { rule, surahId: String(surahId) },
        });
      }
    }
  }

  return messages;
}

// --- Requirement 10: learning insights ---

const MIN_MISTAKE_FREE_SCORE = 95;

function longestMistakeFreeStreak(history: StoredSessionSummary[]): number {
  let longest = 0;
  let current = 0;
  for (const session of history) {
    const totalMistakes = Object.values(session.mistakeTypeBreakdown).reduce((sum, count) => sum + (count ?? 0), 0);
    if (totalMistakes === 0 || session.overallScore >= MIN_MISTAKE_FREE_SCORE) {
      current += 1;
      longest = Math.max(longest, current);
    } else {
      current = 0;
    }
  }
  return longest;
}

/** Average number of days between consecutive sessions — lower means more consistent practice. Undefined (returns null) with fewer than 2 sessions. */
function averageDaysBetweenSessions(history: StoredSessionSummary[]): number | null {
  if (history.length < 2) return null;
  let totalGapMs = 0;
  for (let i = 1; i < history.length; i += 1) {
    totalGapMs += new Date(history[i]!.dateIso).getTime() - new Date(history[i - 1]!.dateIso).getTime();
  }
  return Math.round((totalGapMs / (history.length - 1) / MS_PER_DAY) * 10) / 10;
}

function mostFrequentTajweedRule(history: StoredSessionSummary[]): TajweedRuleId | null {
  const counts = new Map<TajweedRuleId, number>();
  for (const session of history) {
    for (const rule of session.weakestTajweedRules) counts.set(rule, (counts.get(rule) ?? 0) + 1);
  }
  if (counts.size === 0) return null;
  return Array.from(counts.entries()).sort((a, b) => b[1] - a[1])[0]![0];
}

function mostImprovedSurah(history: StoredSessionSummary[]): { surahId: number; delta: number } | null {
  const bySurah = new Map<number, StoredSessionSummary[]>();
  for (const session of history) {
    const list = bySurah.get(session.surahId) ?? [];
    list.push(session);
    bySurah.set(session.surahId, list);
  }
  let best: { surahId: number; delta: number } | null = null;
  for (const [surahId, sessions] of bySurah) {
    if (sessions.length < 2) continue;
    const delta = sessions[sessions.length - 1]!.overallScore - sessions[0]!.overallScore;
    if (delta > 0 && (best === null || delta > best.delta)) best = { surahId, delta };
  }
  return best;
}

function mostImprovedSkill(history: StoredSessionSummary[]): TrendDimension | null {
  const trends = buildAllTrends(history);
  const improving = (Object.entries(trends) as Array<[TrendDimension, TrendSeries]>).filter(([, series]) => series.direction === 'improving');
  if (improving.length === 0) return null;
  return improving.sort((a, b) => b[1].changeSinceFirst - a[1].changeSinceFirst)[0]![0];
}

/** Cross-session observations, each grounded in an actual computed value — mirrors Phase 5's insight-generation discipline (data-driven, never generic) but over the whole history rather than one session. */
export function generateLearningInsights(history: StoredSessionSummary[]): ScoreInsight[] {
  const insights: ScoreInsight[] = [];
  if (history.length === 0) return insights;

  const skill = mostImprovedSkill(history);
  if (skill) insights.push({ textKey: 'recitationCoach.learning.insight.mostImprovedSkill', params: { skill } });

  const rule = mostFrequentTajweedRule(history);
  if (rule) insights.push({ textKey: 'recitationCoach.learning.insight.mostDifficultRule', params: { rule } });

  const surah = mostImprovedSurah(history);
  if (surah) insights.push({ textKey: 'recitationCoach.learning.insight.mostImprovedSurah', params: { surahId: String(surah.surahId), delta: String(surah.delta) } });

  const averageRecovery = Math.round(average(history.map((session) => session.recoveryRate)));
  insights.push({ textKey: 'recitationCoach.learning.insight.averageRecoverySpeed', params: { rate: String(averageRecovery) } });

  const streak = longestMistakeFreeStreak(history);
  if (streak >= 2) insights.push({ textKey: 'recitationCoach.learning.insight.longestMistakeFreeStreak', params: { count: String(streak) } });

  const daysBetween = averageDaysBetweenSessions(history);
  if (daysBetween !== null) {
    insights.push({ textKey: 'recitationCoach.learning.insight.practiceConsistency', params: { days: String(daysBetween) } });
  }

  return insights;
}

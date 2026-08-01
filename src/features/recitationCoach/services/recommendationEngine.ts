import type { StoredSessionSummary, WeaknessRanking } from './learningProfileEngine';
import type { TranslationKey } from 'i18n/types';

// Params carry raw identifiers (e.g. a TajweedRuleId like 'madd'), never a
// pre-resolved TranslationKey — see scoringEngine.ts's note on why: t()'s
// interpolation only does flat string substitution, so resolving 'madd' to
// its display label is left to the UI layer, which already owns
// TAJWEED_RULE_NAME_KEYS for exactly this purpose.

/**
 * The (long-term, analytics-based) Recommendation Engine — distinct from
 * Phase 5's per-session `report.recommendations` (which react only to the
 * single surah just recited). This engine looks across the whole learning
 * history (already-computed StoredSessionSummary entries and
 * WeaknessRanking output from learningProfileEngine.ts) to suggest what to
 * practice *next*, and assembles a daily practice plan from the same
 * underlying signals.
 */

function average(values: number[]): number {
  return values.length > 0 ? values.reduce((sum, value) => sum + value, 0) / values.length : 0;
}

function groupBySurah(history: StoredSessionSummary[]): Map<number, StoredSessionSummary[]> {
  const map = new Map<number, StoredSessionSummary[]>();
  for (const session of history) {
    const list = map.get(session.surahId) ?? [];
    list.push(session);
    map.set(session.surahId, list);
  }
  return map;
}

export interface RecommendationContext {
  history: StoredSessionSummary[];
  weaknesses: WeaknessRanking[];
  latestSession: StoredSessionSummary | null;
}

export type SmartRecommendationType =
  | 'practice-surah-next'
  | 'review-ayah-tomorrow'
  | 'focus-tajweed-rule-week'
  | 'repeat-difficult-words'
  | 'reduce-speed';

export interface SmartRecommendation {
  type: SmartRecommendationType;
  textKey: TranslationKey;
  params?: Record<string, string>;
  /** 0-100, higher means more worth acting on first — used purely to order the list, not shown as a literal number to the user. */
  priority: number;
}

type RecommendationDetector = (context: RecommendationContext) => SmartRecommendation | null;

/** A surah is only ever named "practice this next" once there's a genuine comparison point (at least 2 distinct surahs practiced) and it's meaningfully behind the others — otherwise this recommendation is silently omitted rather than picking one arbitrarily. */
const LOW_SURAH_SCORE_THRESHOLD = 80;

/**
 * One entry point per recommendation type — exactly the registry pattern
 * used throughout this feature (scoringEngine's DIMENSION_CALCULATORS,
 * tajweedAnalysisEngine's RULE_EVALUATORS, learningProfileEngine's
 * WEAKNESS_DETECTORS) — swapping any one heuristic for a future ML-ranked
 * recommender is a one-line change here, never a change to
 * generateSmartRecommendations itself.
 */
const RECOMMENDATION_DETECTORS: Record<SmartRecommendationType, RecommendationDetector> = {
  'practice-surah-next': (context) => {
    const bySurah = groupBySurah(context.history);
    if (bySurah.size < 2) return null;
    let worst: { surahId: number; averageScore: number } | null = null;
    for (const [surahId, sessions] of bySurah) {
      const averageScore = average(sessions.map((session) => session.overallScore));
      if (worst === null || averageScore < worst.averageScore) worst = { surahId, averageScore };
    }
    if (!worst || worst.averageScore >= LOW_SURAH_SCORE_THRESHOLD) return null;
    return {
      type: 'practice-surah-next',
      textKey: 'recitationCoach.learning.recommendation.practiceSurahNext',
      params: { surahId: String(worst.surahId) },
      priority: Math.round(100 - worst.averageScore),
    };
  },

  'review-ayah-tomorrow': (context) => {
    if (!context.latestSession || context.latestSession.weakestAyahs.length === 0) return null;
    return {
      type: 'review-ayah-tomorrow',
      textKey: 'recitationCoach.learning.recommendation.reviewAyahTomorrow',
      params: { ayah: String(context.latestSession.weakestAyahs[0]), surahId: String(context.latestSession.surahId) },
      priority: 70,
    };
  },

  'focus-tajweed-rule-week': (context) => {
    const topRuleWeakness = context.weaknesses.find((w) => w.category === 'shortens-madd' || w.category === 'ghunnah-mistakes');
    if (!topRuleWeakness) return null;
    const ruleId = topRuleWeakness.category === 'shortens-madd' ? 'madd' : 'ghunnah';
    return {
      type: 'focus-tajweed-rule-week',
      textKey: 'recitationCoach.learning.recommendation.focusTajweedRuleWeek',
      params: { rule: ruleId },
      priority: topRuleWeakness.score,
    };
  },

  'repeat-difficult-words': (context) => {
    if (!context.latestSession || context.latestSession.mostDifficultWords.length === 0) return null;
    return {
      type: 'repeat-difficult-words',
      textKey: 'recitationCoach.learning.recommendation.repeatDifficultWords',
      params: { count: String(context.latestSession.mostDifficultWords.length) },
      priority: 60,
    };
  },

  'reduce-speed': (context) => {
    const fluencyWeakness = context.weaknesses.find((w) => w.category === 'fluency-drop-long-ayahs');
    if (!fluencyWeakness) return null;
    return { type: 'reduce-speed', textKey: 'recitationCoach.learning.recommendation.reduceSpeed', priority: fluencyWeakness.score };
  },
};

export function generateSmartRecommendations(context: RecommendationContext): SmartRecommendation[] {
  return Object.values(RECOMMENDATION_DETECTORS)
    .map((detector) => detector(context))
    .filter((recommendation): recommendation is SmartRecommendation => recommendation !== null)
    .sort((a, b) => b.priority - a.priority);
}

// --- Requirement 4: personalized daily practice plan ---

export interface PracticePlanItem {
  textKey: TranslationKey;
  params?: Record<string, string>;
  estimatedMinutes: number;
}

export interface DailyPracticePlan {
  items: PracticePlanItem[];
  totalPracticeTimeMinutes: number;
}

/**
 * A flat, documented estimate per plan item — not a measured duration
 * (nothing in this pipeline times how long a review exercise actually
 * takes). Stated plainly here rather than presented as a precise number the
 * system doesn't actually know.
 */
const ESTIMATED_MINUTES_PER_ITEM = 3;

/** Assembles the day's practice plan directly from the same weakness/session signals the recommendation detectors above use — a plan is a *presentation* of those signals as concrete action items with a rough time budget, not a separate heuristic. */
export function generateDailyPracticePlan(context: RecommendationContext): DailyPracticePlan {
  const items: PracticePlanItem[] = [];

  if (context.latestSession && context.latestSession.weakestAyahs.length > 0) {
    items.push({
      textKey: 'recitationCoach.learning.plan.repeatAyah',
      params: { ayah: String(context.latestSession.weakestAyahs[0]), times: '3' },
      estimatedMinutes: ESTIMATED_MINUTES_PER_ITEM,
    });
  }

  if (context.weaknesses.some((w) => w.category === 'shortens-madd') && context.latestSession) {
    items.push({
      textKey: 'recitationCoach.learning.plan.practiceMadd',
      params: { surahId: String(context.latestSession.surahId) },
      estimatedMinutes: ESTIMATED_MINUTES_PER_ITEM,
    });
  }

  if (context.weaknesses.some((w) => w.category === 'ghunnah-mistakes')) {
    items.push({ textKey: 'recitationCoach.learning.plan.reviewGhunnah', estimatedMinutes: ESTIMATED_MINUTES_PER_ITEM });
  }

  if (context.latestSession && context.latestSession.mostDifficultWords.length > 0) {
    items.push({
      textKey: 'recitationCoach.learning.plan.repeatDifficultWords',
      params: { count: String(context.latestSession.mostDifficultWords.length) },
      estimatedMinutes: ESTIMATED_MINUTES_PER_ITEM,
    });
  }

  if (items.length === 0) {
    items.push({ textKey: 'recitationCoach.learning.plan.generalReview', estimatedMinutes: ESTIMATED_MINUTES_PER_ITEM });
  }

  return { items, totalPracticeTimeMinutes: items.reduce((sum, item) => sum + item.estimatedMinutes, 0) };
}

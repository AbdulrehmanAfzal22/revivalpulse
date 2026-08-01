import type { LearningProfile, StoredSessionSummary, WeaknessRanking } from './learningProfileEngine';
import type { ReviewScheduleEntry } from './reviewScheduler';
import type { TajweedRuleId } from './tajweedAnalysisEngine';

/**
 * The Goal Engine: every target here is derived from the reciter's own
 * recent numbers (average ayahs/session, average practice time, current
 * fluency, current mistake trend) rather than a fixed number applying to
 * everyone — "adaptive goals" means the target itself moves as the
 * reciter's baseline does, not just that the UI re-renders it.
 */

function average(values: number[]): number {
  return values.length > 0 ? values.reduce((sum, value) => sum + value, 0) / values.length : 0;
}

function totalMistakes(session: StoredSessionSummary): number {
  return Object.values(session.mistakeTypeBreakdown).reduce((sum, count) => sum + (count ?? 0), 0);
}

function isSameCalendarDay(a: string, b: string): boolean {
  return a.slice(0, 10) === b.slice(0, 10);
}

const MS_PER_DAY = 24 * 60 * 60 * 1000;

// --- Daily goal ---

export interface DailyGoal {
  targetAyahs: number;
  targetMinutes: number;
  targetReviewCount: number;
  focusTajweedRule?: TajweedRuleId;
  focusTajweedTarget?: number;
}

const MIN_DAILY_AYAHS = 3;
const MIN_DAILY_MINUTES = 5;
const MAX_DAILY_REVIEWS = 5;
const TAJWEED_STRETCH_TARGET_INCREMENT = 10;
const TAJWEED_STRETCH_TARGET_CAP = 95;

/** Targets are the reciter's own recent averages (never below a small floor, so a single tiny session doesn't set a goal of "practice 1 ayah") — a brand-new user with no history yet gets the floor values as a starting point. */
export function generateDailyGoal(profile: LearningProfile, dueReviewsCount: number, weaknesses: WeaknessRanking[]): DailyGoal {
  const averageAyahsPerSession = profile.totalSessions > 0 ? Math.round(profile.totalAyahsCompleted / profile.totalSessions) : MIN_DAILY_AYAHS;
  const averageMinutesPerSession =
    profile.totalSessions > 0 ? Math.round(profile.totalPracticeTimeMs / profile.totalSessions / 60000) : MIN_DAILY_MINUTES;

  const targetAyahs = Math.max(MIN_DAILY_AYAHS, averageAyahsPerSession);
  const targetMinutes = Math.max(MIN_DAILY_MINUTES, averageMinutesPerSession);
  const targetReviewCount = Math.min(dueReviewsCount, MAX_DAILY_REVIEWS);

  const maddWeakness = weaknesses.find((weakness) => weakness.category === 'shortens-madd');
  if (!maddWeakness) return { targetAyahs, targetMinutes, targetReviewCount };

  return {
    targetAyahs,
    targetMinutes,
    targetReviewCount,
    focusTajweedRule: 'madd',
    focusTajweedTarget: Math.min(TAJWEED_STRETCH_TARGET_CAP, profile.averageTajweedScore + TAJWEED_STRETCH_TARGET_INCREMENT),
  };
}

export interface DailyGoalProgress {
  ayahsCompleted: number;
  minutesCompleted: number;
  reviewsCompleted: number;
}

export function computeDailyProgress(history: StoredSessionSummary[], reviewSchedule: ReviewScheduleEntry[], todayIso: string): DailyGoalProgress {
  const todaysSessions = history.filter((session) => isSameCalendarDay(session.dateIso, todayIso));
  const ayahsCompleted = todaysSessions.reduce((sum, session) => sum + Math.max(0, session.ayahRange.end - session.ayahRange.start + 1), 0);
  const minutesCompleted = Math.round(todaysSessions.reduce((sum, session) => sum + session.durationMs, 0) / 60000);
  const reviewsCompleted = reviewSchedule.filter((entry) => isSameCalendarDay(entry.lastReviewedIso, todayIso)).length;
  return { ayahsCompleted, minutesCompleted, reviewsCompleted };
}

// --- Weekly goal ---

export interface WeeklyGoal {
  targetSurahId?: number;
  targetFluencyScore: number;
  targetMistakeReductionPercent: number;
}

const WEEKLY_FLUENCY_STRETCH_INCREMENT = 5;
const WEEKLY_FLUENCY_CAP = 95;
const BASELINE_MISTAKE_REDUCTION_TARGET_PERCENT = 20;
const MISTAKE_REDUCTION_STRETCH_MARGIN_PERCENT = 10;
const MIN_MISTAKE_REDUCTION_TARGET_PERCENT = 10;
const MISTAKE_TREND_WINDOW_SESSIONS = 14;

/** The mistake-reduction target beats the reciter's *own current trend* (computed by splitting their recent sessions in half) by a fixed stretch margin, rather than asking everyone for a flat 30% regardless of where they're starting from. With too little history to compute a real trend yet, a modest baseline target is used instead. */
export function generateWeeklyGoal(profile: LearningProfile, history: StoredSessionSummary[]): WeeklyGoal {
  const targetFluencyScore = Math.min(WEEKLY_FLUENCY_CAP, profile.averageFluency + WEEKLY_FLUENCY_STRETCH_INCREMENT);
  const targetSurahId = history.length > 0 ? history[history.length - 1]!.surahId : undefined;

  const recentWindow = history.slice(-MISTAKE_TREND_WINDOW_SESSIONS);
  const midpoint = Math.floor(recentWindow.length / 2);
  let targetMistakeReductionPercent = BASELINE_MISTAKE_REDUCTION_TARGET_PERCENT;

  if (recentWindow.length >= 4) {
    const earlierAverage = average(recentWindow.slice(0, midpoint).map(totalMistakes));
    if (earlierAverage > 0) {
      const laterAverage = average(recentWindow.slice(midpoint).map(totalMistakes));
      const currentTrendPercent = Math.round(((earlierAverage - laterAverage) / earlierAverage) * 100);
      targetMistakeReductionPercent = Math.max(MIN_MISTAKE_REDUCTION_TARGET_PERCENT, currentTrendPercent + MISTAKE_REDUCTION_STRETCH_MARGIN_PERCENT);
    }
  }

  return { targetSurahId, targetFluencyScore, targetMistakeReductionPercent };
}

export interface WeeklyGoalProgress {
  currentFluencyScore: number;
  /** Positive means mistakes went down versus the prior week (progress); negative means they went up. 0 when there isn't yet a full prior week to compare against. */
  mistakeReductionAchievedPercent: number;
}

export function computeWeeklyProgress(history: StoredSessionSummary[], nowIso: string): WeeklyGoalProgress {
  const currentFluencyScore = history.length > 0 ? history[history.length - 1]!.dimensionScores.fluency : 0;

  const now = new Date(nowIso).getTime();
  const currentWeek = history.filter((session) => now - new Date(session.dateIso).getTime() < 7 * MS_PER_DAY);
  const previousWeek = history.filter((session) => {
    const age = now - new Date(session.dateIso).getTime();
    return age >= 7 * MS_PER_DAY && age < 14 * MS_PER_DAY;
  });

  if (currentWeek.length === 0 || previousWeek.length === 0) {
    return { currentFluencyScore, mistakeReductionAchievedPercent: 0 };
  }

  const previousAverage = average(previousWeek.map(totalMistakes));
  if (previousAverage === 0) return { currentFluencyScore, mistakeReductionAchievedPercent: 0 };

  const currentAverage = average(currentWeek.map(totalMistakes));
  const mistakeReductionAchievedPercent = Math.round(((previousAverage - currentAverage) / previousAverage) * 100);
  return { currentFluencyScore, mistakeReductionAchievedPercent };
}

import { computeDailyProgress, computeWeeklyProgress, generateDailyGoal, generateWeeklyGoal } from './goalEngine';
import type { LearningProfile, StoredSessionSummary, WeaknessRanking } from './learningProfileEngine';
import type { ReviewScheduleEntry } from './reviewScheduler';
import type { ScoreDimension } from './scoringEngine';

const DAY_MS = 24 * 60 * 60 * 1000;
function addDays(iso: string, days: number): string {
  return new Date(new Date(iso).getTime() + days * DAY_MS).toISOString();
}
const BASE_DATE = '2026-01-15T00:00:00.000Z';

function dimensionScores(overrides: Partial<Record<ScoreDimension, number>> = {}): Record<ScoreDimension, number> {
  return { wordAccuracy: 80, pronunciation: 80, tajweed: 80, fluency: 80, recovery: 80, consistency: 80, confidence: 80, ...overrides };
}

function summary(overrides: Partial<StoredSessionSummary> = {}): StoredSessionSummary {
  return {
    id: 's1',
    dateIso: BASE_DATE,
    surahId: 1,
    ayahRange: { start: 1, end: 7 },
    durationMs: 10 * 60000,
    overallScore: 80,
    overallConfidence: 80,
    dimensionScores: dimensionScores(),
    mistakeTypeBreakdown: {},
    weakestTajweedRules: [],
    mostDifficultWords: [],
    weakestAyahs: [],
    recoveryRate: 80,
    longAyahFluencyDropDetected: false,
    hesitationAfterMistakeCount: 0,
    coachingEventCounts: {},
    insights: [],
    recommendations: [],
    ...overrides,
  };
}

function profile(overrides: Partial<LearningProfile> = {}): LearningProfile {
  return {
    totalSessions: 10,
    totalPracticeTimeMs: 10 * 10 * 60000,
    totalAyahsCompleted: 70,
    totalSurahsCompleted: 2,
    averageAccuracy: 80,
    averageTajweedScore: 75,
    averageFluency: 80,
    averageConfidence: 80,
    lastUpdatedIso: BASE_DATE,
    ...overrides,
  };
}

function weakness(overrides: Partial<WeaknessRanking> = {}): WeaknessRanking {
  return { category: 'shortens-madd', frequency: 60, severity: 70, score: 42, sessionsAnalyzed: 5, ...overrides };
}

describe('generateDailyGoal', () => {
  it('derives target ayahs/minutes from the reciter\'s own recent averages', () => {
    const goal = generateDailyGoal(profile({ totalSessions: 10, totalAyahsCompleted: 70, totalPracticeTimeMs: 10 * 8 * 60000 }), 0, []);
    expect(goal.targetAyahs).toBe(7); // 70 / 10
    expect(goal.targetMinutes).toBe(8);
  });

  it('never sets a target below the configured floor for a brand-new user', () => {
    const goal = generateDailyGoal(profile({ totalSessions: 0, totalAyahsCompleted: 0, totalPracticeTimeMs: 0 }), 0, []);
    expect(goal.targetAyahs).toBeGreaterThanOrEqual(3);
    expect(goal.targetMinutes).toBeGreaterThanOrEqual(5);
  });

  it('caps the review target at the configured maximum even with many due reviews', () => {
    const goal = generateDailyGoal(profile(), 50, []);
    expect(goal.targetReviewCount).toBeLessThanOrEqual(5);
  });

  it('uses the actual due-review count when below the cap', () => {
    const goal = generateDailyGoal(profile(), 2, []);
    expect(goal.targetReviewCount).toBe(2);
  });

  it('adds a Madd focus target only when shortens-madd is a ranked weakness', () => {
    const withMadd = generateDailyGoal(profile({ averageTajweedScore: 70 }), 0, [weakness({ category: 'shortens-madd' })]);
    expect(withMadd.focusTajweedRule).toBe('madd');
    expect(withMadd.focusTajweedTarget).toBe(80); // 70 + 10 increment

    const withoutMadd = generateDailyGoal(profile(), 0, [weakness({ category: 'ghunnah-mistakes' })]);
    expect(withoutMadd.focusTajweedRule).toBeUndefined();
  });

  it('caps the Madd stretch target at the configured ceiling', () => {
    const goal = generateDailyGoal(profile({ averageTajweedScore: 92 }), 0, [weakness({ category: 'shortens-madd' })]);
    expect(goal.focusTajweedTarget).toBeLessThanOrEqual(95);
  });
});

describe('computeDailyProgress', () => {
  it('sums ayahs and minutes only from sessions on the given day', () => {
    const history = [
      summary({ dateIso: BASE_DATE, ayahRange: { start: 1, end: 7 }, durationMs: 5 * 60000 }),
      summary({ dateIso: addDays(BASE_DATE, -1), ayahRange: { start: 1, end: 100 }, durationMs: 999 * 60000 }),
    ];
    const progress = computeDailyProgress(history, [], BASE_DATE);
    expect(progress.ayahsCompleted).toBe(7);
    expect(progress.minutesCompleted).toBe(5);
  });

  it('counts reviews completed today from the review schedule', () => {
    const reviewSchedule: ReviewScheduleEntry[] = [
      { surahId: 1, ayahNumber: 1, intervalDays: 1, easeFactor: 2.5, dueDateIso: BASE_DATE, lastReviewedIso: BASE_DATE, lastReviewScore: 90 },
      { surahId: 1, ayahNumber: 2, intervalDays: 1, easeFactor: 2.5, dueDateIso: BASE_DATE, lastReviewedIso: addDays(BASE_DATE, -3), lastReviewScore: 90 },
    ];
    const progress = computeDailyProgress([], reviewSchedule, BASE_DATE);
    expect(progress.reviewsCompleted).toBe(1);
  });
});

describe('generateWeeklyGoal', () => {
  it('targets the most recently practiced surah for "finish this surah"', () => {
    const history = [summary({ surahId: 1 }), summary({ surahId: 55 })];
    expect(generateWeeklyGoal(profile(), history).targetSurahId).toBe(55);
  });

  it('sets a fluency target above the current average but capped at the ceiling', () => {
    const goal = generateWeeklyGoal(profile({ averageFluency: 92 }), []);
    expect(goal.targetFluencyScore).toBeLessThanOrEqual(95);
    expect(goal.targetFluencyScore).toBeGreaterThan(92);
  });

  it('sets a higher mistake-reduction target when the recent trend shows worsening mistakes', () => {
    const worsening = [
      summary({ mistakeTypeBreakdown: {} }),
      summary({ mistakeTypeBreakdown: {} }),
      summary({ mistakeTypeBreakdown: { 'wrong-word': 3 } }),
      summary({ mistakeTypeBreakdown: { 'wrong-word': 3 } }),
    ];
    const goal = generateWeeklyGoal(profile(), worsening);
    expect(goal.targetMistakeReductionPercent).toBeGreaterThan(10);
  });

  it('falls back to the baseline target with too little history to compute a trend', () => {
    const goal = generateWeeklyGoal(profile(), [summary()]);
    expect(goal.targetMistakeReductionPercent).toBe(20);
  });
});

describe('computeWeeklyProgress', () => {
  it('reports 0 mistake reduction without a full previous week to compare against', () => {
    const progress = computeWeeklyProgress([summary({ dateIso: BASE_DATE })], BASE_DATE);
    expect(progress.mistakeReductionAchievedPercent).toBe(0);
  });

  it('reports positive reduction when this week has fewer mistakes than last week', () => {
    const history = [
      summary({ dateIso: addDays(BASE_DATE, -10), mistakeTypeBreakdown: { 'wrong-word': 4 } }),
      summary({ dateIso: addDays(BASE_DATE, -1), mistakeTypeBreakdown: {} }),
    ];
    const progress = computeWeeklyProgress(history, BASE_DATE);
    expect(progress.mistakeReductionAchievedPercent).toBeGreaterThan(0);
  });

  it('uses the most recent session\'s fluency score as the current value', () => {
    const history = [summary({ dimensionScores: dimensionScores({ fluency: 60 }) }), summary({ dimensionScores: dimensionScores({ fluency: 88 }) })];
    expect(computeWeeklyProgress(history, BASE_DATE).currentFluencyScore).toBe(88);
  });
});

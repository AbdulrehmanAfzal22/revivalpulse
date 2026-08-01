import { computeCurrentPracticeStreak, evaluateNewAchievements, practicedDaysInLastWeek } from './achievementEngine';
import type { AchievementEvaluationContext } from './achievementEngine';
import type { LearningProfile, StoredSessionSummary } from './learningProfileEngine';
import type { ScoreDimension } from './scoringEngine';

const DAY_MS = 24 * 60 * 60 * 1000;
function addDays(iso: string, days: number): string {
  return new Date(new Date(iso).getTime() + days * DAY_MS).toISOString();
}
const BASE_DATE = '2026-01-01T00:00:00.000Z';

function dimensionScores(): Record<ScoreDimension, number> {
  return { wordAccuracy: 80, pronunciation: 80, tajweed: 80, fluency: 80, recovery: 80, consistency: 80, confidence: 80 };
}

function summary(overrides: Partial<StoredSessionSummary> = {}): StoredSessionSummary {
  return {
    id: 's1',
    dateIso: BASE_DATE,
    surahId: 1,
    ayahRange: { start: 1, end: 7 },
    durationMs: 60000,
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
    totalSessions: 1,
    totalPracticeTimeMs: 60000,
    totalAyahsCompleted: 7,
    totalSurahsCompleted: 1,
    averageAccuracy: 80,
    averageTajweedScore: 80,
    averageFluency: 80,
    averageConfidence: 80,
    lastUpdatedIso: BASE_DATE,
    ...overrides,
  };
}

function context(overrides: Partial<AchievementEvaluationContext> = {}): AchievementEvaluationContext {
  const latestSessionSummary = summary();
  return {
    latestSessionSummary,
    latestAyahQualities: [],
    history: [latestSessionSummary],
    profile: profile(),
    ...overrides,
  };
}

describe('computeCurrentPracticeStreak', () => {
  it('returns 0 with no history', () => {
    expect(computeCurrentPracticeStreak([])).toBe(0);
  });

  it('counts consecutive calendar days ending at the most recent session', () => {
    const history = [
      summary({ dateIso: addDays(BASE_DATE, 0) }),
      summary({ dateIso: addDays(BASE_DATE, 1) }),
      summary({ dateIso: addDays(BASE_DATE, 2) }),
    ];
    expect(computeCurrentPracticeStreak(history)).toBe(3);
  });

  it('breaks the streak on a skipped day', () => {
    const history = [summary({ dateIso: addDays(BASE_DATE, 0) }), summary({ dateIso: addDays(BASE_DATE, 5) })];
    expect(computeCurrentPracticeStreak(history)).toBe(1);
  });

  it('treats multiple sessions on the same day as a single streak day', () => {
    const history = [summary({ dateIso: BASE_DATE }), summary({ dateIso: addDays(BASE_DATE, 0.1) })];
    expect(computeCurrentPracticeStreak(history)).toBe(1);
  });
});

describe('practicedDaysInLastWeek', () => {
  it('counts only distinct days within the last 7 days', () => {
    const history = [
      summary({ dateIso: addDays(BASE_DATE, 0) }),
      summary({ dateIso: addDays(BASE_DATE, 2) }),
      summary({ dateIso: addDays(BASE_DATE, 4) }),
      summary({ dateIso: addDays(BASE_DATE, -30) }), // too old, excluded
    ];
    expect(practicedDaysInLastWeek(history, addDays(BASE_DATE, 4))).toBe(3);
  });
});

describe('evaluateNewAchievements', () => {
  it('unlocks first-perfect-ayah when the latest session had a perfect, mistake-free ayah', () => {
    const unlocked = evaluateNewAchievements(context({ latestAyahQualities: [{ accuracy: 100, mistakes: 0 }, { accuracy: 60, mistakes: 1 }] }), []);
    expect(unlocked).toContain('first-perfect-ayah');
    expect(unlocked).not.toContain('first-perfect-surah'); // not every ayah was perfect
  });

  it('unlocks first-perfect-surah only when every ayah in the session was perfect', () => {
    const unlocked = evaluateNewAchievements(
      context({ latestAyahQualities: [{ accuracy: 100, mistakes: 0 }, { accuracy: 100, mistakes: 0 }] }),
      []
    );
    expect(unlocked).toContain('first-perfect-surah');
  });

  it('does not unlock first-perfect-surah for an empty ayah list', () => {
    const unlocked = evaluateNewAchievements(context({ latestAyahQualities: [] }), []);
    expect(unlocked).not.toContain('first-perfect-surah');
  });

  it('unlocks zero-mistakes-session when the mistake breakdown is empty', () => {
    const unlocked = evaluateNewAchievements(context({ latestSessionSummary: summary({ mistakeTypeBreakdown: {} }) }), []);
    expect(unlocked).toContain('zero-mistakes-session');
  });

  it('does not unlock zero-mistakes-session when mistakes were recorded', () => {
    const unlocked = evaluateNewAchievements(context({ latestSessionSummary: summary({ mistakeTypeBreakdown: { 'wrong-word': 1 } }) }), []);
    expect(unlocked).not.toContain('zero-mistakes-session');
  });

  it('unlocks hundred-ayahs-practiced once the lifetime total crosses 100', () => {
    const unlocked = evaluateNewAchievements(context({ profile: profile({ totalAyahsCompleted: 120 }) }), []);
    expect(unlocked).toContain('hundred-ayahs-practiced');
  });

  it('unlocks seven-day-streak once the current streak reaches 7', () => {
    const history = Array.from({ length: 7 }, (_, i) => summary({ dateIso: addDays(BASE_DATE, i) }));
    const unlocked = evaluateNewAchievements(context({ history, latestSessionSummary: history[history.length - 1]! }), []);
    expect(unlocked).toContain('seven-day-streak');
  });

  it('unlocks tajweed-master only with enough sessions and a high average tajweed score', () => {
    const unlockedWithFewSessions = evaluateNewAchievements(
      context({ profile: profile({ totalSessions: 3, averageTajweedScore: 95 }) }),
      []
    );
    expect(unlockedWithFewSessions).not.toContain('tajweed-master');

    const unlockedProperly = evaluateNewAchievements(context({ profile: profile({ totalSessions: 12, averageTajweedScore: 95 }) }), []);
    expect(unlockedProperly).toContain('tajweed-master');
  });

  it('unlocks consistency-champion when practiced on at least 5 of the last 7 days', () => {
    const history = Array.from({ length: 5 }, (_, i) => summary({ dateIso: addDays(BASE_DATE, i) }));
    const unlocked = evaluateNewAchievements(context({ history, latestSessionSummary: history[history.length - 1]! }), []);
    expect(unlocked).toContain('consistency-champion');
  });

  it('never re-unlocks an achievement already in the unlocked list', () => {
    const unlocked = evaluateNewAchievements(
      context({ latestSessionSummary: summary({ mistakeTypeBreakdown: {} }) }),
      ['zero-mistakes-session']
    );
    expect(unlocked).not.toContain('zero-mistakes-session');
  });
});

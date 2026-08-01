import { generateDailyPracticePlan, generateSmartRecommendations } from './recommendationEngine';
import type { RecommendationContext } from './recommendationEngine';
import type { StoredSessionSummary, WeaknessRanking } from './learningProfileEngine';
import type { ScoreDimension } from './scoringEngine';

function dimensionScores(): Record<ScoreDimension, number> {
  return { wordAccuracy: 80, pronunciation: 80, tajweed: 80, fluency: 80, recovery: 80, consistency: 80, confidence: 80 };
}

function summary(overrides: Partial<StoredSessionSummary> = {}): StoredSessionSummary {
  return {
    id: 's1',
    dateIso: '2026-01-01T00:00:00.000Z',
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

function weakness(overrides: Partial<WeaknessRanking> = {}): WeaknessRanking {
  return { category: 'shortens-madd', frequency: 60, severity: 70, score: 42, sessionsAnalyzed: 5, ...overrides };
}

function context(overrides: Partial<RecommendationContext> = {}): RecommendationContext {
  return { history: [], weaknesses: [], latestSession: null, ...overrides };
}

describe('generateSmartRecommendations', () => {
  it('returns nothing when there is no history, no weaknesses, and no latest session', () => {
    expect(generateSmartRecommendations(context())).toEqual([]);
  });

  it('recommends practicing the weakest surah when at least two surahs have been attempted', () => {
    const history = [
      summary({ surahId: 1, overallScore: 90 }),
      summary({ surahId: 2, overallScore: 55 }),
    ];
    const recommendations = generateSmartRecommendations(context({ history }));
    const rec = recommendations.find((r) => r.type === 'practice-surah-next');
    expect(rec?.params?.surahId).toBe('2');
  });

  it('does not recommend a surah to practice when only one surah has ever been attempted', () => {
    const history = [summary({ surahId: 1, overallScore: 40 })];
    const recommendations = generateSmartRecommendations(context({ history }));
    expect(recommendations.some((r) => r.type === 'practice-surah-next')).toBe(false);
  });

  it('does not recommend a surah when every surah is already scoring well', () => {
    const history = [summary({ surahId: 1, overallScore: 90 }), summary({ surahId: 2, overallScore: 85 })];
    const recommendations = generateSmartRecommendations(context({ history }));
    expect(recommendations.some((r) => r.type === 'practice-surah-next')).toBe(false);
  });

  it('recommends reviewing the latest session weakest ayah tomorrow', () => {
    const latestSession = summary({ weakestAyahs: [12, 4] });
    const recommendations = generateSmartRecommendations(context({ latestSession }));
    const rec = recommendations.find((r) => r.type === 'review-ayah-tomorrow');
    expect(rec?.params?.ayah).toBe('12');
  });

  it('recommends focusing on madd when shortens-madd is a ranked weakness', () => {
    const recommendations = generateSmartRecommendations(context({ weaknesses: [weakness({ category: 'shortens-madd' })] }));
    const rec = recommendations.find((r) => r.type === 'focus-tajweed-rule-week');
    expect(rec?.params?.rule).toBe('madd');
  });

  it('recommends repeating difficult words when the latest session had any', () => {
    const latestSession = summary({ mostDifficultWords: [{ ayahNumber: 1, wordIndex: 2, attempts: 2, mistakeAttempts: 2 }] });
    const recommendations = generateSmartRecommendations(context({ latestSession }));
    expect(recommendations.some((r) => r.type === 'repeat-difficult-words')).toBe(true);
  });

  it('recommends reducing speed when fluency-drop-long-ayahs is a ranked weakness', () => {
    const recommendations = generateSmartRecommendations(context({ weaknesses: [weakness({ category: 'fluency-drop-long-ayahs' })] }));
    expect(recommendations.some((r) => r.type === 'reduce-speed')).toBe(true);
  });

  it('sorts recommendations by priority, highest first', () => {
    const recommendations = generateSmartRecommendations(
      context({
        latestSession: summary({ weakestAyahs: [1], mostDifficultWords: [{ ayahNumber: 1, wordIndex: 0, attempts: 1, mistakeAttempts: 1 }] }),
        weaknesses: [weakness({ category: 'shortens-madd', score: 95 })],
      })
    );
    for (let i = 1; i < recommendations.length; i += 1) {
      expect(recommendations[i]!.priority).toBeLessThanOrEqual(recommendations[i - 1]!.priority);
    }
  });
});

describe('generateDailyPracticePlan', () => {
  it('falls back to a general-review item when nothing specific applies', () => {
    const plan = generateDailyPracticePlan(context());
    expect(plan.items).toHaveLength(1);
    expect(plan.items[0]!.textKey).toBe('recitationCoach.learning.plan.generalReview');
    expect(plan.totalPracticeTimeMinutes).toBeGreaterThan(0);
  });

  it('builds a plan combining weakest ayah repetition, tajweed focus, and difficult words', () => {
    const latestSession = summary({
      weakestAyahs: [9],
      surahId: 55,
      mostDifficultWords: [{ ayahNumber: 9, wordIndex: 1, attempts: 2, mistakeAttempts: 1 }],
    });
    const plan = generateDailyPracticePlan(
      context({ latestSession, weaknesses: [weakness({ category: 'shortens-madd' }), weakness({ category: 'ghunnah-mistakes' })] })
    );
    const keys = plan.items.map((item) => item.textKey);
    expect(keys).toContain('recitationCoach.learning.plan.repeatAyah');
    expect(keys).toContain('recitationCoach.learning.plan.practiceMadd');
    expect(keys).toContain('recitationCoach.learning.plan.reviewGhunnah');
    expect(keys).toContain('recitationCoach.learning.plan.repeatDifficultWords');
  });

  it('sums estimated minutes across every item in the plan', () => {
    const latestSession = summary({ weakestAyahs: [3] });
    const plan = generateDailyPracticePlan(context({ latestSession }));
    const expectedTotal = plan.items.reduce((sum, item) => sum + item.estimatedMinutes, 0);
    expect(plan.totalPracticeTimeMinutes).toBe(expectedTotal);
  });
});

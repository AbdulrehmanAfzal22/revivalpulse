import { decideAdaptiveCoaching } from './adaptiveCoachingEngine';
import type { LearningProfile, WeaknessRanking } from './learningProfileEngine';

function profile(overrides: Partial<LearningProfile> = {}): LearningProfile {
  return {
    totalSessions: 0,
    totalPracticeTimeMs: 0,
    totalAyahsCompleted: 0,
    totalSurahsCompleted: 0,
    averageAccuracy: 0,
    averageTajweedScore: 0,
    averageFluency: 0,
    averageConfidence: 0,
    lastUpdatedIso: '2026-01-01T00:00:00.000Z',
    ...overrides,
  };
}

function weakness(overrides: Partial<WeaknessRanking> = {}): WeaknessRanking {
  return { category: 'skips-words', frequency: 50, severity: 50, score: 25, sessionsAnalyzed: 5, ...overrides };
}

describe('decideAdaptiveCoaching', () => {
  it('defaults a brand-new learner to beginner regardless of any single good score', () => {
    const decision = decideAdaptiveCoaching(profile({ totalSessions: 1, averageAccuracy: 100, averageTajweedScore: 100 }), []);
    expect(decision.recommendedLevel).toBe('beginner');
    expect(decision.reasonKey).toBe('recitationCoach.learning.adaptive.reason.newLearner');
  });

  it('recommends advanced only once both session count and score thresholds are met', () => {
    const decision = decideAdaptiveCoaching(profile({ totalSessions: 20, averageAccuracy: 90, averageTajweedScore: 85 }), []);
    expect(decision.recommendedLevel).toBe('advanced');
  });

  it('does not recommend advanced with enough sessions but mediocre scores', () => {
    const decision = decideAdaptiveCoaching(profile({ totalSessions: 20, averageAccuracy: 70, averageTajweedScore: 60 }), []);
    expect(decision.recommendedLevel).not.toBe('advanced');
  });

  it('recommends intermediate for a moderately experienced, moderately accurate learner', () => {
    const decision = decideAdaptiveCoaching(profile({ totalSessions: 8, averageAccuracy: 70, averageTajweedScore: 60 }), []);
    expect(decision.recommendedLevel).toBe('intermediate');
  });

  it('keeps a struggling learner at beginner even with many sessions', () => {
    const decision = decideAdaptiveCoaching(profile({ totalSessions: 30, averageAccuracy: 40, averageTajweedScore: 40 }), []);
    expect(decision.recommendedLevel).toBe('beginner');
    expect(decision.reasonKey).toBe('recitationCoach.learning.adaptive.reason.needsSupport');
  });

  it('flags a weakness repeated across enough sessions as needing extra coaching attention', () => {
    const decision = decideAdaptiveCoaching(
      profile({ totalSessions: 10 }),
      [weakness({ category: 'shortens-madd', frequency: 60, sessionsAnalyzed: 5 })]
    );
    expect(decision.attentionTopics).toContain('shortens-madd');
  });

  it('does not flag a rare, low-frequency weakness for extra attention', () => {
    const decision = decideAdaptiveCoaching(
      profile({ totalSessions: 10 }),
      [weakness({ category: 'shortens-madd', frequency: 10, sessionsAnalyzed: 10 })]
    );
    expect(decision.attentionTopics).not.toContain('shortens-madd');
  });

  it('does not flag a weakness observed over too few sessions, even if frequent within them', () => {
    const decision = decideAdaptiveCoaching(
      profile({ totalSessions: 10 }),
      [weakness({ category: 'shortens-madd', frequency: 100, sessionsAnalyzed: 1 })]
    );
    expect(decision.attentionTopics).not.toContain('shortens-madd');
  });
});

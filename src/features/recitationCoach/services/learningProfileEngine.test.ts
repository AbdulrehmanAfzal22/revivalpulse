import {
  buildAllTrends,
  computeMonthlyImprovement,
  computeWeeklyImprovement,
  countHesitationAfterMistake,
  createEmptyTotals,
  deriveLearningProfile,
  detectLongAyahFluencyDrop,
  detectStrengths,
  detectWeaknesses,
  generateLearningInsights,
  generateMotivationMessages,
  toStoredSessionSummary,
  updateTotalsWithSession,
} from './learningProfileEngine';
import type { StoredSessionSummary } from './learningProfileEngine';
import type { CoachingAnalyticsEvent } from './coachingEngine';
import type { RecitationSessionRecord, ScoreDimension } from './scoringEngine';

function dimensionScores(overrides: Partial<Record<ScoreDimension, number>> = {}): Record<ScoreDimension, number> {
  return {
    wordAccuracy: 80,
    pronunciation: 80,
    tajweed: 80,
    fluency: 80,
    recovery: 80,
    consistency: 80,
    confidence: 80,
    ...overrides,
  };
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

describe('detectLongAyahFluencyDrop', () => {
  it('returns false when there are too few ayahs to compare lengths', () => {
    expect(detectLongAyahFluencyDrop([{ wordCount: 5, fluency: 50 }])).toBe(false);
  });

  it('returns false when every ayah is a similar length (no basis for comparison)', () => {
    expect(
      detectLongAyahFluencyDrop([
        { wordCount: 5, fluency: 90 },
        { wordCount: 5, fluency: 40 },
        { wordCount: 5, fluency: 60 },
      ])
    ).toBe(false);
  });

  it('detects a genuine fluency drop on longer-than-average ayahs', () => {
    expect(
      detectLongAyahFluencyDrop([
        { wordCount: 3, fluency: 90 },
        { wordCount: 3, fluency: 90 },
        { wordCount: 20, fluency: 40 },
      ])
    ).toBe(true);
  });

  it('does not flag a drop when long ayahs are actually just as fluent', () => {
    expect(
      detectLongAyahFluencyDrop([
        { wordCount: 3, fluency: 85 },
        { wordCount: 3, fluency: 85 },
        { wordCount: 20, fluency: 82 },
      ])
    ).toBe(false);
  });
});

describe('countHesitationAfterMistake', () => {
  it('counts a mistake immediately followed by a pause', () => {
    const events: CoachingAnalyticsEvent[] = [
      { type: 'mistake-detected', mistakeType: 'wrong-word', suppressed: false, timestamp: 1 },
      { type: 'pause-detected', tier: 'hesitation', silentMs: 2500, timestamp: 2 },
      { type: 'recovery-detected', timestamp: 3 },
    ];
    expect(countHesitationAfterMistake(events)).toBe(1);
  });

  it('does not count a mistake followed by anything other than a pause', () => {
    const events: CoachingAnalyticsEvent[] = [
      { type: 'mistake-detected', mistakeType: 'wrong-word', suppressed: false, timestamp: 1 },
      { type: 'recovery-detected', timestamp: 2 },
    ];
    expect(countHesitationAfterMistake(events)).toBe(0);
  });
});

describe('totals / profile derivation', () => {
  it('accumulates totals across sessions with an O(1) update per session', () => {
    let totals = createEmptyTotals();
    totals = updateTotalsWithSession(totals, summary({ surahId: 1, durationMs: 60000, ayahRange: { start: 1, end: 7 } }));
    totals = updateTotalsWithSession(totals, summary({ surahId: 1, durationMs: 30000, ayahRange: { start: 1, end: 7 } }));
    totals = updateTotalsWithSession(totals, summary({ surahId: 112, durationMs: 15000, ayahRange: { start: 1, end: 4 } }));

    const profile = deriveLearningProfile(totals);
    expect(profile.totalSessions).toBe(3);
    expect(profile.totalPracticeTimeMs).toBe(105000);
    expect(profile.totalAyahsCompleted).toBe(7 + 7 + 4);
    expect(profile.totalSurahsCompleted).toBe(2); // surah 1 counted once despite two sessions
    expect(profile.averageAccuracy).toBe(80);
  });

  it('stays exactly correct even after many sessions (no drift from repeated updates)', () => {
    let totals = createEmptyTotals();
    for (let i = 0; i < 50; i += 1) {
      totals = updateTotalsWithSession(totals, summary({ surahId: i % 3, dimensionScores: dimensionScores({ wordAccuracy: 90 }) }));
    }
    expect(deriveLearningProfile(totals).averageAccuracy).toBe(90);
    expect(deriveLearningProfile(totals).totalSessions).toBe(50);
    expect(deriveLearningProfile(totals).totalSurahsCompleted).toBe(3);
  });

  it('returns all-zero profile with no sessions', () => {
    const profile = deriveLearningProfile(createEmptyTotals());
    expect(profile.totalSessions).toBe(0);
    expect(profile.averageAccuracy).toBe(0);
    expect(profile.totalSurahsCompleted).toBe(0);
  });
});

describe('detectWeaknesses', () => {
  it('ranks skips-words higher when missing words are frequent and severe', () => {
    const history = [
      summary({ mistakeTypeBreakdown: { 'missing-word': 4 } }),
      summary({ mistakeTypeBreakdown: { 'missing-word': 3 } }),
      summary({ mistakeTypeBreakdown: {} }),
    ];
    const rankings = detectWeaknesses(history);
    const skipsWords = rankings.find((r) => r.category === 'skips-words');
    expect(skipsWords).toBeDefined();
    expect(skipsWords!.frequency).toBe(67); // 2 of 3 sessions
    expect(skipsWords!.severity).toBeGreaterThan(0);
  });

  it('flags shortens-madd only when madd is among the weakest tajweed rules', () => {
    const history = [summary({ weakestTajweedRules: ['madd'] }), summary({ weakestTajweedRules: [] })];
    const rankings = detectWeaknesses(history);
    const madd = rankings.find((r) => r.category === 'shortens-madd');
    expect(madd?.frequency).toBe(50);
  });

  it('returns an empty list for a spotless history', () => {
    const history = [summary(), summary(), summary()];
    expect(detectWeaknesses(history)).toEqual([]);
  });

  it('returns an empty list with no history at all', () => {
    expect(detectWeaknesses([])).toEqual([]);
  });

  it('ranks by frequency*severity, not frequency or severity alone', () => {
    const history = [
      // hesitation: happens in 1/2 sessions, quite severe when it does
      summary({ hesitationAfterMistakeCount: 4 }),
      summary({}),
    ];
    const rankings = detectWeaknesses(history);
    const hesitation = rankings.find((r) => r.category === 'hesitation-after-mistakes')!;
    expect(hesitation.score).toBe(Math.round((hesitation.frequency * hesitation.severity) / 100));
  });
});

describe('detectStrengths', () => {
  it('identifies a consistently high-scoring dimension as a strength', () => {
    const history = [
      summary({ dimensionScores: dimensionScores({ pronunciation: 90 }) }),
      summary({ dimensionScores: dimensionScores({ pronunciation: 88 }) }),
    ];
    const strengths = detectStrengths(history);
    expect(strengths.some((s) => s.category === 'excellent-pronunciation')).toBe(true);
  });

  it('does not call a mediocre average a strength', () => {
    const history = [summary({ dimensionScores: dimensionScores({ pronunciation: 60 }) })];
    const strengths = detectStrengths(history);
    expect(strengths.some((s) => s.category === 'excellent-pronunciation')).toBe(false);
  });

  it('returns an empty list with no history', () => {
    expect(detectStrengths([])).toEqual([]);
  });
});

describe('trends', () => {
  it('reports stable/insufficient trend with fewer than 2 sessions', () => {
    const trend = buildAllTrends([summary()]).wordAccuracy;
    expect(trend.direction).toBe('stable');
    expect(trend.changeSinceFirst).toBe(0);
  });

  it('detects an improving trend from first to last session', () => {
    const history = [
      summary({ dimensionScores: dimensionScores({ wordAccuracy: 50 }) }),
      summary({ dimensionScores: dimensionScores({ wordAccuracy: 60 }) }),
      summary({ dimensionScores: dimensionScores({ wordAccuracy: 75 }) }),
    ];
    const trend = buildAllTrends(history).wordAccuracy;
    expect(trend.direction).toBe('improving');
    expect(trend.changeSinceFirst).toBe(25);
  });

  it('detects a declining trend', () => {
    const history = [
      summary({ dimensionScores: dimensionScores({ tajweed: 80 }) }),
      summary({ dimensionScores: dimensionScores({ tajweed: 55 }) }),
    ];
    expect(buildAllTrends(history).tajweed.direction).toBe('declining');
  });

  it('computes weekly improvement by comparing two adjacent 7-day windows', () => {
    const history = [
      summary({ dateIso: '2026-01-01T00:00:00.000Z', dimensionScores: dimensionScores({ wordAccuracy: 50 }) }),
      summary({ dateIso: '2026-01-10T00:00:00.000Z', dimensionScores: dimensionScores({ wordAccuracy: 70 }) }),
    ];
    expect(computeWeeklyImprovement(history, 'wordAccuracy')).toBe(20);
  });

  it('returns null for weekly improvement without a full previous window', () => {
    const history = [summary({ dateIso: '2026-01-01T00:00:00.000Z' })];
    expect(computeWeeklyImprovement(history, 'wordAccuracy')).toBeNull();
  });

  it('computes monthly improvement independently of the weekly window', () => {
    const history = [
      summary({ dateIso: '2026-01-01T00:00:00.000Z', dimensionScores: dimensionScores({ fluency: 40 }) }),
      summary({ dateIso: '2026-02-20T00:00:00.000Z', dimensionScores: dimensionScores({ fluency: 65 }) }),
    ];
    expect(computeMonthlyImprovement(history, 'fluency')).toBe(25);
  });
});

describe('generateMotivationMessages', () => {
  it('produces nothing for a single session (no baseline to compare against)', () => {
    expect(generateMotivationMessages([summary()])).toEqual([]);
  });

  it('celebrates a meaningful overall-score improvement versus the previous session', () => {
    const history = [summary({ overallScore: 60 }), summary({ overallScore: 72 })];
    const messages = generateMotivationMessages(history);
    expect(messages.some((m) => m.textKey === 'recitationCoach.learning.motivation.improvedVsLastSession')).toBe(true);
  });

  it('does not celebrate a trivial or negative change', () => {
    const history = [summary({ overallScore: 70 }), summary({ overallScore: 71 })];
    const messages = generateMotivationMessages(history);
    expect(messages.some((m) => m.textKey === 'recitationCoach.learning.motivation.improvedVsLastSession')).toBe(false);
  });

  it('detects mastering a tajweed rule that stopped appearing as weak in a surah', () => {
    const history = [
      summary({ surahId: 55, weakestTajweedRules: ['madd'] }),
      summary({ surahId: 55, weakestTajweedRules: [] }),
      summary({ surahId: 55, weakestTajweedRules: [] }),
      summary({ surahId: 55, weakestTajweedRules: [] }),
    ];
    const messages = generateMotivationMessages(history);
    expect(messages.some((m) => m.textKey === 'recitationCoach.learning.motivation.masteredRuleInSurah')).toBe(true);
  });
});

describe('generateLearningInsights', () => {
  it('produces nothing with no history', () => {
    expect(generateLearningInsights([])).toEqual([]);
  });

  it('always includes an average recovery speed insight when there is any history', () => {
    const insights = generateLearningInsights([summary()]);
    expect(insights.some((i) => i.textKey === 'recitationCoach.learning.insight.averageRecoverySpeed')).toBe(true);
  });

  it('identifies the most difficult tajweed rule by frequency across history', () => {
    const history = [
      summary({ weakestTajweedRules: ['madd'] }),
      summary({ weakestTajweedRules: ['madd', 'ghunnah'] }),
      summary({ weakestTajweedRules: ['ghunnah'] }),
    ];
    const insights = generateLearningInsights(history);
    const ruleInsight = insights.find((i) => i.textKey === 'recitationCoach.learning.insight.mostDifficultRule');
    expect(ruleInsight?.params?.rule).toBe('madd');
  });

  it('reports a longest mistake-free streak of at least 2 when consecutive clean sessions exist', () => {
    const history = [
      summary({ mistakeTypeBreakdown: { 'wrong-word': 2 }, overallScore: 60 }),
      summary({ mistakeTypeBreakdown: {}, overallScore: 90 }),
      summary({ mistakeTypeBreakdown: {}, overallScore: 92 }),
    ];
    const insights = generateLearningInsights(history);
    const streak = insights.find((i) => i.textKey === 'recitationCoach.learning.insight.longestMistakeFreeStreak');
    expect(streak?.params?.count).toBe('2');
  });
});

describe('toStoredSessionSummary', () => {
  it('projects a RecitationSessionRecord into a lean, JSON-serializable summary', () => {
    const record: RecitationSessionRecord = {
      id: 'abc',
      dateIso: '2026-01-01T00:00:00.000Z',
      surahId: 1,
      ayahRange: { start: 1, end: 7 },
      durationMs: 5000,
      overallScore: 80,
      overallConfidence: 70,
      dimensionScores: dimensionScores(),
      mistakeSummary: { total: 1, byType: { 'wrong-word': 1 } },
      tajweedSummary: {
        overallScore: 75,
        strongestRules: [],
        weakestRules: ['madd'],
        mostFrequentIssue: 'madd',
        recommendedPracticeAreas: ['madd'],
        ruleAccuracyBreakdown: {},
      },
      report: {
        overall: { dimension: 'overall', score: 80, confidence: 70 },
        dimensions: {
          wordAccuracy: { dimension: 'wordAccuracy', score: 80, confidence: 70 },
          pronunciation: { dimension: 'pronunciation', score: 80, confidence: 70 },
          tajweed: { dimension: 'tajweed', score: 75, confidence: 70 },
          fluency: { dimension: 'fluency', score: 80, confidence: 70 },
          recovery: { dimension: 'recovery', score: 80, confidence: 70 },
          consistency: { dimension: 'consistency', score: 80, confidence: 70 },
          confidence: { dimension: 'confidence', score: 80, confidence: 70 },
        },
        ayahAnalyses: [{ ayahNumber: 1, accuracy: 80, tajweedScore: 75, fluency: 80, correctWords: 5, mistakes: 1, recoveryEvents: 0, timeTakenMs: 1000, wordCount: 6, averageConfidence: 70 }],
        strongestAyahs: [1],
        weakestAyahs: [1],
        mostCommonMistakeType: 'wrong-word',
        mistakeTypeBreakdown: { 'wrong-word': 1 },
        mostDifficultWords: [{ ayahNumber: 1, wordIndex: 2, attempts: 2, mistakeAttempts: 1 }],
        recoveryPerformance: { totalRecovered: 0, totalUnrecovered: 1, recoveryRate: 0 },
        averageConfidence: 70,
        insights: [{ textKey: 'recitationCoach.scoring.insight.excellentFluency' }],
        recommendations: [{ textKey: 'recitationCoach.scoring.recommendation.generalPractice' }],
        weights: { wordAccuracy: 0.4, tajweed: 0.25, fluency: 0.15, pronunciation: 0.1, recovery: 0.05, confidence: 0.05 },
      },
    };

    const events: CoachingAnalyticsEvent[] = [{ type: 'mistake-detected', mistakeType: 'wrong-word', suppressed: false, timestamp: 1 }];
    const result = toStoredSessionSummary(record, events);

    const roundTripped = JSON.parse(JSON.stringify(result));
    expect(roundTripped).toEqual(result);
    expect(result.weakestTajweedRules).toEqual(['madd']);
    expect(result.mostDifficultWords).toHaveLength(1);
    expect(result.recoveryRate).toBe(0);
    expect(result.insights[0]!.textKey).toBe('recitationCoach.scoring.insight.excellentFluency');
  });
});

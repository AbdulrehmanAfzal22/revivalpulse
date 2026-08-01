import {
  DEFAULT_SCORING_WEIGHTS,
  buildSurahScoreReport,
  calculateOverallScore,
  computeAyahAnalysis,
  createScoringAccumulatorState,
  createSessionRecord,
  finalizeCurrentAyah,
  recordWordSample,
} from './scoringEngine';
import type { AyahRawMetrics, DimensionScore, ScoreDimension, WordScoringSample } from './scoringEngine';
import type { SurahTajweedReport } from './tajweedAnalysisEngine';

function sample(overrides: Partial<WordScoringSample> = {}): WordScoringSample {
  return {
    ayahNumber: 1,
    wordIndex: 0,
    classification: 'correct',
    confidence: 90,
    durationMs: 300,
    timestamp: Date.now(),
    ...overrides,
  };
}

function makeDimensions(scores: Partial<Record<ScoreDimension, number>>, confidence = 80): Record<ScoreDimension, DimensionScore> {
  const base: Record<ScoreDimension, DimensionScore> = {
    wordAccuracy: { dimension: 'wordAccuracy', score: 0, confidence },
    pronunciation: { dimension: 'pronunciation', score: 0, confidence },
    tajweed: { dimension: 'tajweed', score: 0, confidence },
    fluency: { dimension: 'fluency', score: 0, confidence },
    recovery: { dimension: 'recovery', score: 0, confidence },
    consistency: { dimension: 'consistency', score: 0, confidence },
    confidence: { dimension: 'confidence', score: 0, confidence },
  };
  for (const [dimension, score] of Object.entries(scores) as Array<[ScoreDimension, number]>) {
    base[dimension] = { ...base[dimension], score };
  }
  return base;
}

function emptyTajweedReport(): SurahTajweedReport {
  return {
    overallScore: 0,
    strongestRules: [],
    weakestRules: [],
    mostFrequentIssue: null,
    recommendedPracticeAreas: [],
    ruleAccuracyBreakdown: {},
  };
}

describe('calculateOverallScore', () => {
  it('is a weighted sum, not a simple average of the dimensions', () => {
    const dimensions = makeDimensions({
      wordAccuracy: 100,
      tajweed: 100,
      fluency: 0,
      pronunciation: 0,
      recovery: 0,
      confidence: 0,
    });
    const overall = calculateOverallScore(dimensions, DEFAULT_SCORING_WEIGHTS);
    // Simple average of the 6 weighted dimensions would be ~33; the weighted
    // result should be dominated by wordAccuracy (40%) + tajweed (25%) = 65.
    expect(overall.score).toBe(65);
    expect(overall.score).not.toBe(Math.round((100 + 100 + 0 + 0 + 0 + 0) / 6));
  });

  it('normalizes by total weight rather than assuming weights sum to exactly 1', () => {
    const dimensions = makeDimensions({ wordAccuracy: 80, tajweed: 60, fluency: 40, pronunciation: 20, recovery: 100, confidence: 100 });
    const skewedWeights = { wordAccuracy: 4, tajweed: 2.5, fluency: 1.5, pronunciation: 1, recovery: 0.5, confidence: 0.5 }; // sums to 10, not 1
    const overall = calculateOverallScore(dimensions, skewedWeights);
    const normalizedWeights = DEFAULT_SCORING_WEIGHTS;
    const overallNormalized = calculateOverallScore(dimensions, normalizedWeights);
    expect(overall.score).toBe(overallNormalized.score);
  });

  it('returns 0 score and 0 confidence when all weights are zero', () => {
    const dimensions = makeDimensions({ wordAccuracy: 90 });
    const overall = calculateOverallScore(dimensions, {
      wordAccuracy: 0,
      tajweed: 0,
      fluency: 0,
      pronunciation: 0,
      recovery: 0,
      confidence: 0,
    });
    expect(overall.score).toBe(0);
    expect(overall.confidence).toBe(0);
  });

  it('excludes consistency from the weighted overall entirely', () => {
    const withLowConsistency = makeDimensions({ wordAccuracy: 80, consistency: 0 });
    const withHighConsistency = makeDimensions({ wordAccuracy: 80, consistency: 100 });
    expect(calculateOverallScore(withLowConsistency, DEFAULT_SCORING_WEIGHTS).score).toBe(
      calculateOverallScore(withHighConsistency, DEFAULT_SCORING_WEIGHTS).score
    );
  });
});

describe('computeAyahAnalysis', () => {
  it('scores 100% accuracy when every word position resolves correct on the first attempt', () => {
    const raw: AyahRawMetrics = {
      ayahNumber: 1,
      samples: [
        sample({ wordIndex: 0, classification: 'correct' }),
        sample({ wordIndex: 1, classification: 'correct' }),
        sample({ wordIndex: 2, classification: 'probably-correct' }),
      ],
    };
    const analysis = computeAyahAnalysis(raw);
    expect(analysis.accuracy).toBe(100);
    expect(analysis.mistakes).toBe(0);
    expect(analysis.recoveryEvents).toBe(0);
    expect(analysis.correctWords).toBe(3);
  });

  it('counts a position as recovered when it resolves correct after a negative attempt', () => {
    const raw: AyahRawMetrics = {
      ayahNumber: 1,
      samples: [
        sample({ wordIndex: 0, classification: 'wrong-word' }),
        sample({ wordIndex: 0, classification: 'correct' }),
        sample({ wordIndex: 1, classification: 'correct' }),
      ],
    };
    const analysis = computeAyahAnalysis(raw);
    expect(analysis.recoveryEvents).toBe(1);
    expect(analysis.mistakes).toBe(0);
    expect(analysis.correctWords).toBe(2);
    expect(analysis.accuracy).toBe(100);
  });

  it('counts a position still negative at its last sample as an unrecovered mistake', () => {
    const raw: AyahRawMetrics = {
      ayahNumber: 1,
      samples: [sample({ wordIndex: 0, classification: 'correct' }), sample({ wordIndex: 1, classification: 'missing-word' })],
    };
    const analysis = computeAyahAnalysis(raw);
    expect(analysis.mistakes).toBe(1);
    expect(analysis.correctWords).toBe(1);
    expect(analysis.accuracy).toBe(50);
  });

  it('excludes inconclusive (probably-whisper-error) positions from accuracy entirely', () => {
    const raw: AyahRawMetrics = {
      ayahNumber: 1,
      samples: [sample({ wordIndex: 0, classification: 'correct' }), sample({ wordIndex: 1, classification: 'probably-whisper-error' })],
    };
    const analysis = computeAyahAnalysis(raw);
    expect(analysis.accuracy).toBe(100); // only 1 conclusive position, and it was correct
    expect(analysis.wordCount).toBe(2); // still counted as evidence, just not accuracy-conclusive
  });

  it('handles an ayah with zero samples without crashing', () => {
    const analysis = computeAyahAnalysis({ ayahNumber: 1, samples: [] });
    expect(analysis.accuracy).toBe(0);
    // No duration samples to judge pace from at all -> the neutral default,
    // not 0 (0 would falsely claim "definitely poor fluency").
    expect(analysis.fluency).toBe(70);
    expect(analysis.wordCount).toBe(0);
    expect(Number.isNaN(analysis.accuracy)).toBe(false);
  });

  it('lowers fluency when retries are needed to resolve a mistake, relative to a clean run', () => {
    const clean: AyahRawMetrics = {
      ayahNumber: 1,
      samples: [
        sample({ wordIndex: 0, classification: 'correct', durationMs: 300 }),
        sample({ wordIndex: 1, classification: 'correct', durationMs: 300 }),
      ],
    };
    const retried: AyahRawMetrics = {
      ayahNumber: 1,
      samples: [
        sample({ wordIndex: 0, classification: 'wrong-word', durationMs: 300 }),
        sample({ wordIndex: 0, classification: 'wrong-word', durationMs: 300 }),
        sample({ wordIndex: 0, classification: 'correct', durationMs: 300 }),
        sample({ wordIndex: 1, classification: 'correct', durationMs: 300 }),
      ],
    };
    expect(computeAyahAnalysis(retried).fluency).toBeLessThan(computeAyahAnalysis(clean).fluency);
  });

  it('uses the tajweed summary confidence as the ayah tajweed score when provided', () => {
    const raw: AyahRawMetrics = {
      ayahNumber: 1,
      samples: [sample()],
      tajweedSummary: { ayahNumber: 1, rulesApplied: ['madd'], rulesPerformedWell: ['madd'], rulesNeedingPractice: [], overallConfidence: 77 },
    };
    expect(computeAyahAnalysis(raw).tajweedScore).toBe(77);
  });
});

describe('buildSurahScoreReport', () => {
  function twoAyahRawMetrics(): AyahRawMetrics[] {
    return [
      {
        ayahNumber: 1,
        samples: [
          sample({ ayahNumber: 1, wordIndex: 0, classification: 'correct' }),
          sample({ ayahNumber: 1, wordIndex: 1, classification: 'correct' }),
        ],
      },
      {
        ayahNumber: 2,
        samples: [
          sample({ ayahNumber: 2, wordIndex: 0, classification: 'wrong-word' }),
          sample({ ayahNumber: 2, wordIndex: 0, classification: 'correct' }),
          sample({ ayahNumber: 2, wordIndex: 1, classification: 'missing-word' }),
        ],
      },
    ];
  }

  it('produces every required dimension plus an overall score', () => {
    const report = buildSurahScoreReport(twoAyahRawMetrics(), null);
    const dims: ScoreDimension[] = ['wordAccuracy', 'pronunciation', 'tajweed', 'fluency', 'recovery', 'consistency', 'confidence'];
    for (const dimension of dims) {
      expect(report.dimensions[dimension]).toBeDefined();
      expect(report.dimensions[dimension].score).toBeGreaterThanOrEqual(0);
      expect(report.dimensions[dimension].score).toBeLessThanOrEqual(100);
      expect(report.dimensions[dimension].confidence).toBeGreaterThanOrEqual(0);
    }
    expect(report.overall.score).toBeGreaterThanOrEqual(0);
    expect(report.overall.score).toBeLessThanOrEqual(100);
  });

  it('scores 0 for every dimension on a completely empty session without crashing', () => {
    const report = buildSurahScoreReport([], null);
    expect(report.overall.score).toBe(0);
    expect(report.ayahAnalyses).toHaveLength(0);
    expect(report.mostCommonMistakeType).toBeNull();
    expect(report.mostDifficultWords).toHaveLength(0);
    expect(report.insights).toEqual([]);
    expect(report.recommendations.length).toBeGreaterThan(0); // falls back to the general-practice recommendation
  });

  it('identifies the most common mistake type from final classifications only', () => {
    const raw: AyahRawMetrics[] = [
      {
        ayahNumber: 1,
        samples: [
          sample({ ayahNumber: 1, wordIndex: 0, classification: 'missing-word' }),
          sample({ ayahNumber: 1, wordIndex: 1, classification: 'missing-word' }),
          sample({ ayahNumber: 1, wordIndex: 2, classification: 'wrong-word' }),
        ],
      },
    ];
    const report = buildSurahScoreReport(raw, null);
    expect(report.mostCommonMistakeType).toBe('missing-word');
    expect(report.mistakeTypeBreakdown['missing-word']).toBe(2);
    expect(report.mistakeTypeBreakdown['wrong-word']).toBe(1);
  });

  it('ranks the most difficult words by mistake attempts, highest first', () => {
    const raw: AyahRawMetrics[] = [
      {
        ayahNumber: 1,
        samples: [
          sample({ ayahNumber: 1, wordIndex: 0, classification: 'wrong-word' }),
          sample({ ayahNumber: 1, wordIndex: 0, classification: 'wrong-word' }),
          sample({ ayahNumber: 1, wordIndex: 0, classification: 'correct' }),
          sample({ ayahNumber: 1, wordIndex: 1, classification: 'wrong-word' }),
          sample({ ayahNumber: 1, wordIndex: 1, classification: 'correct' }),
        ],
      },
    ];
    const report = buildSurahScoreReport(raw, null);
    expect(report.mostDifficultWords[0]).toMatchObject({ ayahNumber: 1, wordIndex: 0, mistakeAttempts: 2 });
    expect(report.mostDifficultWords[1]).toMatchObject({ ayahNumber: 1, wordIndex: 1, mistakeAttempts: 1 });
  });

  it('ranks strongest and weakest ayahs by composite score', () => {
    const raw: AyahRawMetrics[] = [
      { ayahNumber: 1, samples: [sample({ ayahNumber: 1, wordIndex: 0, classification: 'correct' })] },
      { ayahNumber: 2, samples: [sample({ ayahNumber: 2, wordIndex: 0, classification: 'missing-word' })] },
    ];
    const report = buildSurahScoreReport(raw, null);
    expect(report.strongestAyahs[0]).toBe(1);
    expect(report.weakestAyahs[0]).toBe(2);
  });

  it('reuses the tajweed engine overall score directly for the tajweed dimension', () => {
    const tajweedReport: SurahTajweedReport = {
      overallScore: 82,
      strongestRules: ['madd'],
      weakestRules: ['ghunnah'],
      mostFrequentIssue: 'ghunnah',
      recommendedPracticeAreas: ['ghunnah'],
      ruleAccuracyBreakdown: { madd: { evaluatedCount: 5, conclusiveCount: 5, correctCount: 5, accuracy: 100 } },
    };
    const report = buildSurahScoreReport(twoAyahRawMetrics(), tajweedReport);
    expect(report.dimensions.tajweed.score).toBe(82);
  });

  it('includes a tajweed-frequent-issue insight and a matching recommendation when the tajweed report has one', () => {
    const tajweedReport: SurahTajweedReport = {
      ...emptyTajweedReport(),
      mostFrequentIssue: 'ghunnah',
      recommendedPracticeAreas: ['ghunnah'],
    };
    const report = buildSurahScoreReport(twoAyahRawMetrics(), tajweedReport);
    expect(report.insights.some((insight) => insight.textKey === 'recitationCoach.scoring.insight.tajweedFrequentIssue')).toBe(true);
    expect(
      report.recommendations.some((recommendation) => recommendation.textKey === 'recitationCoach.scoring.recommendation.practiceTajweedRule')
    ).toBe(true);
  });

  it('generates a repeat-ayah recommendation naming the weakest ayah when accuracy is imperfect', () => {
    const raw: AyahRawMetrics[] = [
      { ayahNumber: 1, samples: [sample({ ayahNumber: 1, wordIndex: 0, classification: 'correct' })] },
      { ayahNumber: 5, samples: [sample({ ayahNumber: 5, wordIndex: 0, classification: 'missing-word' })] },
    ];
    const report = buildSurahScoreReport(raw, null);
    const repeatRecommendation = report.recommendations.find(
      (recommendation) => recommendation.textKey === 'recitationCoach.scoring.recommendation.repeatAyah'
    );
    expect(repeatRecommendation?.params?.ayah).toBe('5');
  });

  it('does not emit an improved/dropped second-half insight for a session shorter than the minimum ayah count', () => {
    const raw: AyahRawMetrics[] = [
      { ayahNumber: 1, samples: [sample({ ayahNumber: 1, wordIndex: 0, classification: 'missing-word' })] },
      { ayahNumber: 2, samples: [sample({ ayahNumber: 2, wordIndex: 0, classification: 'correct' })] },
    ];
    const report = buildSurahScoreReport(raw, null);
    expect(report.insights.some((insight) => insight.textKey === 'recitationCoach.scoring.insight.improvedSecondHalf')).toBe(false);
    expect(report.insights.some((insight) => insight.textKey === 'recitationCoach.scoring.insight.droppedSecondHalf')).toBe(false);
  });

  it('emits an improved-second-half insight when later ayahs score meaningfully higher than earlier ones', () => {
    const raw: AyahRawMetrics[] = [
      { ayahNumber: 1, samples: [sample({ ayahNumber: 1, wordIndex: 0, classification: 'missing-word' })] },
      { ayahNumber: 2, samples: [sample({ ayahNumber: 2, wordIndex: 0, classification: 'missing-word' })] },
      { ayahNumber: 3, samples: [sample({ ayahNumber: 3, wordIndex: 0, classification: 'correct' })] },
      { ayahNumber: 4, samples: [sample({ ayahNumber: 4, wordIndex: 0, classification: 'correct' })] },
    ];
    const report = buildSurahScoreReport(raw, null);
    expect(report.insights.some((insight) => insight.textKey === 'recitationCoach.scoring.insight.improvedSecondHalf')).toBe(true);
  });
});

describe('accumulator (recordWordSample / finalizeCurrentAyah)', () => {
  it('finalizes the previous ayah the moment a sample from a new ayah arrives', () => {
    let state = createScoringAccumulatorState();
    state = recordWordSample(state, sample({ ayahNumber: 1, wordIndex: 0 }));
    state = recordWordSample(state, sample({ ayahNumber: 1, wordIndex: 1 }));
    state = recordWordSample(state, sample({ ayahNumber: 2, wordIndex: 0 }));

    expect(state.finalizedAyahRaw).toHaveLength(1);
    expect(state.finalizedAyahRaw[0]!.ayahNumber).toBe(1);
    expect(state.finalizedAyahRaw[0]!.samples).toHaveLength(2);
    expect(state.currentAyahNumber).toBe(2);
    expect(state.currentAyahSamples).toHaveLength(1);
  });

  it('flushes whatever ayah is in progress on finalizeCurrentAyah', () => {
    let state = createScoringAccumulatorState();
    state = recordWordSample(state, sample({ ayahNumber: 1, wordIndex: 0 }));
    state = finalizeCurrentAyah(state);
    expect(state.finalizedAyahRaw).toHaveLength(1);
    expect(state.currentAyahNumber).toBeNull();
  });

  it('is a no-op when finalizing with nothing in progress', () => {
    const state = createScoringAccumulatorState();
    expect(finalizeCurrentAyah(state)).toEqual(state);
  });
});

describe('createSessionRecord', () => {
  it('produces a plain, JSON-serializable record that round-trips', () => {
    const report = buildSurahScoreReport(
      [{ ayahNumber: 1, samples: [sample({ ayahNumber: 1, wordIndex: 0, classification: 'correct' })] }],
      null
    );
    const record = createSessionRecord('session-1', '2026-07-29T00:00:00.000Z', 55, { start: 1, end: 1 }, 12000, report, null);
    const roundTripped = JSON.parse(JSON.stringify(record));
    expect(roundTripped).toEqual(record);
    expect(roundTripped.overallScore).toBe(report.overall.score);
    expect(roundTripped.dimensionScores.wordAccuracy).toBe(report.dimensions.wordAccuracy.score);
  });

  it('sums mistakeSummary.total across all mistake types in the breakdown', () => {
    const report = buildSurahScoreReport(
      [
        {
          ayahNumber: 1,
          samples: [
            sample({ ayahNumber: 1, wordIndex: 0, classification: 'missing-word' }),
            sample({ ayahNumber: 1, wordIndex: 1, classification: 'wrong-word' }),
          ],
        },
      ],
      null
    );
    const record = createSessionRecord('session-2', '2026-07-29T00:00:00.000Z', 55, { start: 1, end: 1 }, 8000, report, null);
    expect(record.mistakeSummary.total).toBe(2);
  });
});

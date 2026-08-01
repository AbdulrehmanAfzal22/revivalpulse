import type { TajweedWord } from './tajweedParser';
import {
  ALL_TAJWEED_RULE_IDS,
  DEFAULT_TAJWEED_THRESHOLDS,
  analyzeWord,
  classifyNoonSakinahContext,
  createPaceTrackerState,
  currentPaceBaseline,
  detectAppliedRules,
  evaluateGhunnah,
  evaluateMadd,
  evaluateQalqalah,
  evaluateRule,
  recordPaceSample,
  summarizeAyah,
  summarizeSurah,
} from './tajweedAnalysisEngine';
import type { TajweedEvaluationContext, TajweedRuleId, WordTajweedAnalysis } from './tajweedAnalysisEngine';

function wordWithRule(ruleClass: string | null, text = 'x'): TajweedWord {
  return { segments: [{ text, ruleClass }] };
}

function baseContext(overrides: Partial<TajweedEvaluationContext> = {}): TajweedEvaluationContext {
  return {
    word: wordWithRule(null),
    rawWord: 'كلمة',
    nextRawWord: null,
    durationMs: null,
    paceBaselineMs: null,
    wordMatchClassification: null,
    ...overrides,
  };
}

describe('detectAppliedRules: every supported rule', () => {
  test.each([
    ['madda_normal', 'madd'],
    ['madda_permissible', 'madd'],
    ['madda_necessary', 'madd'],
    ['madda_obligatory', 'madd'],
    ['ghunnah', 'ghunnah'],
    ['qalaqah', 'qalqalah'],
    ['ikhafa', 'ikhfa'],
    ['ikhafa_shafawi', 'ikhfa'],
    ['idgham_shafawi', 'idgham'],
    ['idgham_ghunnah', 'idgham'],
    ['iqlab', 'iqlab'],
    ['laam_shamsiyah', 'lam-shamsiyyah'],
  ] as const)('markup class %s is detected as rule %s', (ruleClass, expectedRuleId) => {
    const rules = detectAppliedRules(wordWithRule(ruleClass), 'كلمة');
    expect(rules).toContain(expectedRuleId as TajweedRuleId);
  });

  test('a word with no markup and no special text pattern has no rules applied', () => {
    const rules = detectAppliedRules(wordWithRule(null), 'كتاب');
    expect(rules).toEqual([]);
  });

  test('Lam Qamariyyah is detected purely from text: alef-lam followed by a moon letter, no shamsiyyah marker', () => {
    // القمر — al-lam followed by qaf (a moon letter), no lam_shamsiyah segment.
    const rules = detectAppliedRules(wordWithRule(null), 'القمر');
    expect(rules).toContain('lam-qamariyyah');
  });

  test('Lam Qamariyyah is NOT flagged when a lam_shamsiyah marker is already present (the opposite case)', () => {
    const rules = detectAppliedRules(wordWithRule('laam_shamsiyah'), 'الشمس');
    expect(rules).not.toContain('lam-qamariyyah');
  });

  test('Izhar is detected at a word boundary: word-final bare noon followed by a throat letter starting the next word', () => {
    // من + هدى — noon at the end of "من", "هدى" starts with a throat letter (ه).
    const rules = detectAppliedRules(wordWithRule(null), 'من', 'هدى');
    expect(rules).toContain('izhar');
  });

  test('Izhar is not detected when there is no next word to check', () => {
    const rules = detectAppliedRules(wordWithRule(null), 'من', null);
    expect(rules).not.toContain('izhar');
  });

  test('Izhar is not detected when the next word does not start with a throat letter', () => {
    const rules = detectAppliedRules(wordWithRule(null), 'من', 'كتاب');
    expect(rules).not.toContain('izhar');
  });
});

describe('classifyNoonSakinahContext', () => {
  test('a throat letter resolves to izhar', () => {
    expect(classifyNoonSakinahContext('ء')).toBe('izhar');
    expect(classifyNoonSakinahContext('ه')).toBe('izhar');
  });
  test('ba resolves to iqlab', () => {
    expect(classifyNoonSakinahContext('ب')).toBe('iqlab');
  });
  test('the idgham letters resolve to idgham', () => {
    expect(classifyNoonSakinahContext('ي')).toBe('idgham');
    expect(classifyNoonSakinahContext('م')).toBe('idgham');
  });
  test('anything else defaults to ikhfa (the majority case)', () => {
    expect(classifyNoonSakinahContext('س')).toBe('ikhfa');
  });
});

describe('evaluateMadd: duration-relative tiers', () => {
  test('no duration/baseline yet -> unknown, low confidence', () => {
    const result = evaluateMadd(baseContext());
    expect(result.status).toBe('unknown');
    expect(result.confidence).toBeLessThan(30);
  });

  test('duration close to baseline (barely elongated) -> likely-incorrect (too short)', () => {
    const result = evaluateMadd(baseContext({ durationMs: 310, paceBaselineMs: 300 }));
    expect(result.status).toBe('likely-incorrect');
  });

  test('duration in the expected elongated range -> correct', () => {
    const result = evaluateMadd(baseContext({ durationMs: 600, paceBaselineMs: 300 })); // ratio 2.0
    expect(result.status).toBe('correct');
  });

  test('duration somewhat beyond the expected range -> probably-correct (slightly long)', () => {
    const result = evaluateMadd(baseContext({ durationMs: 870, paceBaselineMs: 300 })); // ratio 2.9
    expect(result.status).toBe('probably-correct');
  });

  test('duration far beyond the expected range -> needs-review (excessively long)', () => {
    const result = evaluateMadd(baseContext({ durationMs: 1200, paceBaselineMs: 300 })); // ratio 4.0
    expect(result.status).toBe('needs-review');
  });

  test('thresholds are configurable — a custom threshold set changes the tier boundary', () => {
    const customThresholds = {
      ...DEFAULT_TAJWEED_THRESHOLDS,
      madd: { tooShortRatio: 3.0, slightlyLongRatio: 4.0, excessivelyLongRatio: 5.0 },
    };
    // ratio 2.0 would be "correct" under defaults, but "too short" under this stricter custom config.
    const result = evaluateMadd(baseContext({ durationMs: 600, paceBaselineMs: 300 }), customThresholds);
    expect(result.status).toBe('likely-incorrect');
  });
});

describe('evaluateGhunnah: duration-relative tiers', () => {
  test('no timing -> unknown', () => {
    expect(evaluateGhunnah(baseContext()).status).toBe('unknown');
  });
  test('barely different from baseline -> likely-incorrect (too short)', () => {
    expect(evaluateGhunnah(baseContext({ durationMs: 305, paceBaselineMs: 300 })).status).toBe('likely-incorrect');
  });
  test('moderately longer than baseline -> correct', () => {
    expect(evaluateGhunnah(baseContext({ durationMs: 400, paceBaselineMs: 300 })).status).toBe('correct'); // ratio 1.33
  });
  test('much longer than baseline -> probably-correct (long)', () => {
    expect(evaluateGhunnah(baseContext({ durationMs: 600, paceBaselineMs: 300 })).status).toBe('probably-correct'); // ratio 2.0
  });
});

describe('evaluateQalqalah: deliberately low confidence, never a hard verdict', () => {
  test('no timing -> unknown', () => {
    const result = evaluateQalqalah(baseContext());
    expect(result.status).toBe('unknown');
    expect(result.confidence).toBeLessThanOrEqual(15);
  });

  test('not rushed -> probably-correct, but capped at low confidence regardless', () => {
    const result = evaluateQalqalah(baseContext({ durationMs: 300, paceBaselineMs: 300 }));
    expect(result.status).toBe('probably-correct');
    expect(result.confidence).toBeLessThanOrEqual(50);
  });

  test('clearly rushed -> needs-review, still low confidence (never "likely-incorrect" — audio alone cannot verify articulation quality)', () => {
    const result = evaluateQalqalah(baseContext({ durationMs: 100, paceBaselineMs: 300 }));
    expect(result.status).toBe('needs-review');
    expect(result.confidence).toBeLessThanOrEqual(50);
    expect(result.status).not.toBe('likely-incorrect');
  });
});

describe('evaluateRule: low-evidence rules (Ikhfa/Idgham/Iqlab/Izhar/Lam Shamsiyyah/Lam Qamariyyah) lean on word-match classification', () => {
  test.each(['ikhfa', 'idgham', 'iqlab', 'izhar', 'lam-shamsiyyah', 'lam-qamariyyah'] as const)(
    '%s: a correctly-recognized word is probably-correct, at modest confidence',
    (ruleId) => {
      const result = evaluateRule(ruleId, baseContext({ wordMatchClassification: 'correct' }));
      expect(result.status).toBe('probably-correct');
      expect(result.confidence).toBeLessThanOrEqual(50);
    }
  );

  test.each(['ikhfa', 'idgham', 'iqlab', 'izhar', 'lam-shamsiyyah', 'lam-qamariyyah'] as const)(
    '%s: a clearly mismatched word needs-review rather than a confident verdict',
    (ruleId) => {
      const result = evaluateRule(ruleId, baseContext({ wordMatchClassification: 'wrong-word' }));
      expect(result.status).toBe('needs-review');
    }
  );

  test('with no classification available at all, status is unknown', () => {
    const result = evaluateRule('ikhfa', baseContext({ wordMatchClassification: null }));
    expect(result.status).toBe('unknown');
  });

  test('never reports "likely-incorrect" for a low-evidence rule — that would overstate what audio timing/word-match alone can prove', () => {
    for (const ruleId of ['ikhfa', 'idgham', 'iqlab', 'izhar', 'lam-shamsiyyah', 'lam-qamariyyah'] as const) {
      for (const cls of ['correct', 'probably-correct', 'wrong-word', 'out-of-sequence', null] as const) {
        const result = evaluateRule(ruleId, baseContext({ wordMatchClassification: cls }));
        expect(result.status).not.toBe('likely-incorrect');
      }
    }
  });
});

describe('every evaluation includes a confidence score and educational feedback (never a bare verdict)', () => {
  test.each(ALL_TAJWEED_RULE_IDS)('%s always returns a confidence in [0,100] and a feedbackKey', (ruleId) => {
    const result = evaluateRule(ruleId, baseContext({ durationMs: 500, paceBaselineMs: 300, wordMatchClassification: 'correct' }));
    expect(result.confidence).toBeGreaterThanOrEqual(0);
    expect(result.confidence).toBeLessThanOrEqual(100);
    expect(typeof result.feedbackKey).toBe('string');
    expect(result.feedbackKey.length).toBeGreaterThan(0);
  });
});

describe('analyzeWord: full per-word orchestration', () => {
  test('detects and evaluates every rule that applies to a word in one call', () => {
    const context: TajweedEvaluationContext = baseContext({
      word: wordWithRule('madda_normal'),
      durationMs: 600,
      paceBaselineMs: 300,
    });
    const result = analyzeWord(1, 0, context);
    expect(result.ayahNumber).toBe(1);
    expect(result.wordIndex).toBe(0);
    expect(result.rulesApplied).toEqual(['madd']);
    expect(result.evaluations).toHaveLength(1);
    expect(result.evaluations[0]!.status).toBe('correct');
  });

  test('a word with no applicable rules returns an empty analysis, not an error', () => {
    const result = analyzeWord(1, 0, baseContext());
    expect(result.rulesApplied).toEqual([]);
    expect(result.evaluations).toEqual([]);
  });
});

describe('pace baseline tracking (self-contained, independent of wordTracker)', () => {
  test('returns null until enough samples exist', () => {
    let state = createPaceTrackerState();
    state = recordPaceSample(state, 300);
    state = recordPaceSample(state, 310);
    expect(currentPaceBaseline(state, 3)).toBeNull();
    state = recordPaceSample(state, 290);
    expect(currentPaceBaseline(state, 3)).toBeCloseTo(300, 0);
  });

  test('the window is bounded — old samples fall off', () => {
    let state = createPaceTrackerState();
    for (let i = 0; i < 20; i += 1) {
      state = recordPaceSample(state, 1000, 4); // window size 4
    }
    state = recordPaceSample(state, 100, 4);
    expect(state.recentDurationsMs).toHaveLength(4);
    expect(currentPaceBaseline(state, 1)).toBeLessThan(1000); // the huge 100ms sample pulled the average down within the small window
  });
});

describe('summarizeAyah: per-ayah aggregation', () => {
  test('groups rules into performed-well vs needing-practice based on evaluation status', () => {
    const analyses: WordTajweedAnalysis[] = [
      {
        ayahNumber: 1,
        wordIndex: 0,
        rulesApplied: ['madd'],
        evaluations: [{ ruleId: 'madd', confidence: 70, status: 'correct', expectedBehaviorKey: 'recitationCoach.tajweed.expected.madd', observedBehaviorKey: 'recitationCoach.tajweed.observed.maddCorrect', feedbackKey: 'recitationCoach.tajweed.feedback.maddCorrect' }],
      },
      {
        ayahNumber: 1,
        wordIndex: 1,
        rulesApplied: ['ghunnah'],
        evaluations: [{ ruleId: 'ghunnah', confidence: 55, status: 'likely-incorrect', expectedBehaviorKey: 'recitationCoach.tajweed.expected.ghunnah', observedBehaviorKey: 'recitationCoach.tajweed.observed.ghunnahShort', feedbackKey: 'recitationCoach.tajweed.feedback.ghunnahTooShort' }],
      },
    ];
    const summary = summarizeAyah(1, analyses);
    expect(summary.rulesApplied.sort()).toEqual(['ghunnah', 'madd']);
    expect(summary.rulesPerformedWell).toEqual(['madd']);
    expect(summary.rulesNeedingPractice).toEqual(['ghunnah']);
    expect(summary.overallConfidence).toBe(Math.round((70 + 55) / 2));
  });

  test('an ayah with no analyzed words has a neutral, empty summary', () => {
    const summary = summarizeAyah(2, []);
    expect(summary.rulesApplied).toEqual([]);
    expect(summary.overallConfidence).toBe(0);
  });
});

describe('summarizeSurah: end-of-surah report', () => {
  function ayah(ruleId: TajweedRuleId, performedWell: boolean): ReturnType<typeof summarizeAyah> {
    return {
      ayahNumber: 1,
      rulesApplied: [ruleId],
      rulesPerformedWell: performedWell ? [ruleId] : [],
      rulesNeedingPractice: performedWell ? [] : [ruleId],
      overallConfidence: 60,
    };
  }

  test('computes accuracy per rule, excluding inconclusive (unknown/needs-review is handled by caller not marking either list)', () => {
    const report = summarizeSurah([ayah('madd', true), ayah('madd', true), ayah('madd', false)]);
    expect(report.ruleAccuracyBreakdown.madd?.evaluatedCount).toBe(3);
    expect(report.ruleAccuracyBreakdown.madd?.conclusiveCount).toBe(3);
    expect(report.ruleAccuracyBreakdown.madd?.correctCount).toBe(2);
    expect(report.ruleAccuracyBreakdown.madd?.accuracy).toBe(67);
  });

  test('identifies strongest and weakest rules', () => {
    const report = summarizeSurah([
      ayah('madd', true),
      ayah('madd', true),
      ayah('ghunnah', false),
      ayah('ghunnah', false),
    ]);
    expect(report.strongestRules).toContain('madd');
    expect(report.weakestRules).toContain('ghunnah');
    expect(report.recommendedPracticeAreas).toEqual(report.weakestRules);
  });

  test('identifies the most frequent issue', () => {
    const report = summarizeSurah([ayah('qalqalah', false), ayah('qalqalah', false), ayah('madd', false)]);
    expect(report.mostFrequentIssue).toBe('qalqalah');
  });

  test('an empty surah (nothing evaluated) has a neutral report, not an error', () => {
    const report = summarizeSurah([]);
    expect(report.overallScore).toBe(0);
    expect(report.mostFrequentIssue).toBeNull();
    expect(report.strongestRules).toEqual([]);
  });

  test('is a plain, serializable data shape (JSON round-trips without loss) — reusable in future analytics as required', () => {
    const report = summarizeSurah([ayah('madd', true)]);
    expect(JSON.parse(JSON.stringify(report))).toEqual(report);
  });
});

describe('performance: analysis cost does not scale with surah length', () => {
  test('analyzing many words individually stays fast — each call is independent of how many words came before it', () => {
    const context: TajweedEvaluationContext = baseContext({ word: wordWithRule('madda_normal'), durationMs: 500, paceBaselineMs: 300 });
    const start = Date.now();
    for (let i = 0; i < 5000; i += 1) {
      analyzeWord(1, i, context);
    }
    expect(Date.now() - start).toBeLessThan(500);
  });
});

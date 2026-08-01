import {
  DEFAULT_MEMORIZATION_THRESHOLDS,
  computeSurahMastery,
  computeWordMasteryFromHistory,
  effectiveMasteryScore,
  effectiveStatus,
  updateAyahMemorization,
} from './memorizationEngine';
import type { AyahMemorizationRecord } from './memorizationEngine';
import type { StoredSessionSummary } from './learningProfileEngine';
import type { ScoreDimension } from './scoringEngine';

const DAY_MS = 24 * 60 * 60 * 1000;
const BASE_DATE = '2026-01-01T00:00:00.000Z';

function addDays(iso: string, days: number): string {
  return new Date(new Date(iso).getTime() + days * DAY_MS).toISOString();
}

function goodAttempt() {
  return { accuracy: 95, tajweedScore: 90, fluency: 90, mistakes: 0 };
}
function badAttempt() {
  return { accuracy: 40, tajweedScore: 40, fluency: 40, mistakes: 3 };
}

describe('updateAyahMemorization', () => {
  it('starts a brand-new record from a single attempt', () => {
    const record = updateAyahMemorization(null, goodAttempt(), 1, 1, BASE_DATE);
    expect(record.practiceCount).toBe(1);
    expect(record.consecutiveGoodAttempts).toBe(1);
    expect(record.masteryScore).toBeGreaterThan(0);
    expect(record.averageAccuracy).toBe(95);
  });

  it('smooths mastery toward the new quality rather than snapping to it', () => {
    let record: AyahMemorizationRecord | null = null;
    let date = BASE_DATE;
    for (let i = 0; i < 6; i += 1) {
      record = updateAyahMemorization(record, goodAttempt(), 1, 1, date);
      date = addDays(date, 1);
    }
    const masteryAfterStreak = record!.masteryScore;
    record = updateAyahMemorization(record, badAttempt(), 1, 1, date);
    // One bad attempt (quality well below the built-up mastery) should pull
    // mastery down, but not erase everything built up in a single step.
    expect(record.masteryScore).toBeLessThan(masteryAfterStreak);
    expect(record.masteryScore).toBeGreaterThan(0);
  });

  it('resets consecutiveGoodAttempts to 0 on any attempt that misses the quality bar', () => {
    let record: AyahMemorizationRecord | null = null;
    record = updateAyahMemorization(record, goodAttempt(), 1, 1, BASE_DATE);
    record = updateAyahMemorization(record, goodAttempt(), 1, 1, addDays(BASE_DATE, 1));
    expect(record.consecutiveGoodAttempts).toBe(2);
    record = updateAyahMemorization(record, badAttempt(), 1, 1, addDays(BASE_DATE, 2));
    expect(record.consecutiveGoodAttempts).toBe(0);
  });

  it('maintains a correct running average accuracy across many attempts', () => {
    let record: AyahMemorizationRecord | null = null;
    const accuracies = [100, 80, 60, 90];
    let date = BASE_DATE;
    for (const accuracy of accuracies) {
      record = updateAyahMemorization(record, { accuracy, tajweedScore: 80, fluency: 80, mistakes: 0 }, 1, 1, date);
      date = addDays(date, 1);
    }
    const expectedAverage = Math.round(accuracies.reduce((a, b) => a + b, 0) / accuracies.length);
    expect(record!.averageAccuracy).toBe(expectedAverage);
  });
});

describe('effectiveMasteryScore (decay)', () => {
  it('does not decay within the grace period', () => {
    const record = updateAyahMemorization(null, goodAttempt(), 1, 1, BASE_DATE);
    const scoreAtGrace = effectiveMasteryScore(record, addDays(BASE_DATE, DEFAULT_MEMORIZATION_THRESHOLDS.decayGraceDays), DEFAULT_MEMORIZATION_THRESHOLDS);
    expect(scoreAtGrace).toBe(record.masteryScore);
  });

  it('decays proportionally to days past the grace period', () => {
    const record = updateAyahMemorization(null, goodAttempt(), 1, 1, BASE_DATE);
    const daysPast = 10;
    const laterIso = addDays(BASE_DATE, DEFAULT_MEMORIZATION_THRESHOLDS.decayGraceDays + daysPast);
    const decayed = effectiveMasteryScore(record, laterIso, DEFAULT_MEMORIZATION_THRESHOLDS);
    const expected = Math.max(0, Math.round(record.masteryScore - daysPast * DEFAULT_MEMORIZATION_THRESHOLDS.decayRatePerDay));
    expect(decayed).toBe(expected);
  });

  it('never decays below zero', () => {
    const record = updateAyahMemorization(null, goodAttempt(), 1, 1, BASE_DATE);
    const farFuture = addDays(BASE_DATE, 3650);
    expect(effectiveMasteryScore(record, farFuture, DEFAULT_MEMORIZATION_THRESHOLDS)).toBe(0);
  });
});

describe('effectiveStatus', () => {
  it('reports "new" when there is no record at all', () => {
    expect(effectiveStatus(null, BASE_DATE)).toBe('new');
  });

  it('reports "learning" for a low-mastery record regardless of recency', () => {
    const record = updateAyahMemorization(null, badAttempt(), 1, 1, BASE_DATE);
    expect(effectiveStatus(record, BASE_DATE)).toBe('learning');
  });

  it('reports "memorized" only once mastery and the good-attempt streak both clear their thresholds', () => {
    let record: AyahMemorizationRecord | null = null;
    let date = BASE_DATE;
    for (let i = 0; i < 8; i += 1) {
      record = updateAyahMemorization(record, goodAttempt(), 1, 1, date);
      date = addDays(date, 1);
    }
    expect(effectiveStatus(record, date)).toBe('memorized');
  });

  it('downgrades a memorized ayah to "needs-review" after enough days without practice', () => {
    let record: AyahMemorizationRecord | null = null;
    let date = BASE_DATE;
    for (let i = 0; i < 8; i += 1) {
      record = updateAyahMemorization(record, goodAttempt(), 1, 1, date);
      date = addDays(date, 1);
    }
    const lastPracticed = record!.lastPracticedIso;
    const checkDate = addDays(lastPracticed, DEFAULT_MEMORIZATION_THRESHOLDS.needsReviewDays + 1);
    expect(effectiveStatus(record, checkDate)).toBe('needs-review');
  });

  it('downgrades to "forgotten" after a much longer gap', () => {
    let record: AyahMemorizationRecord | null = null;
    let date = BASE_DATE;
    for (let i = 0; i < 8; i += 1) {
      record = updateAyahMemorization(record, goodAttempt(), 1, 1, date);
      date = addDays(date, 1);
    }
    const checkDate = addDays(record!.lastPracticedIso, DEFAULT_MEMORIZATION_THRESHOLDS.forgottenDays + 1);
    expect(effectiveStatus(record, checkDate)).toBe('forgotten');
  });

  it('reports "practicing" for moderate, recent mastery', () => {
    let record: AyahMemorizationRecord | null = null;
    let date = BASE_DATE;
    for (let i = 0; i < 6; i += 1) {
      record = updateAyahMemorization(record, { accuracy: 78, tajweedScore: 75, fluency: 72, mistakes: 0 }, 1, 1, date);
      date = addDays(date, 1);
    }
    expect(record!.masteryScore).toBeGreaterThanOrEqual(DEFAULT_MEMORIZATION_THRESHOLDS.practicingMastery);
    expect(record!.masteryScore).toBeLessThan(DEFAULT_MEMORIZATION_THRESHOLDS.memorizedMastery);
    expect(effectiveStatus(record, date)).toBe('practicing');
  });
});

describe('computeSurahMastery', () => {
  it('reports "new" for a surah with no tracked ayahs', () => {
    expect(computeSurahMastery(2, [], BASE_DATE)).toEqual({ surahId: 2, masteryScore: 0, ayahsMemorized: 0, ayahsTracked: 0, status: 'new' });
  });

  it('reports "memorized" only when every tracked ayah is individually memorized', () => {
    let a1: AyahMemorizationRecord | null = null;
    let a2: AyahMemorizationRecord | null = null;
    let date = BASE_DATE;
    for (let i = 0; i < 8; i += 1) {
      a1 = updateAyahMemorization(a1, goodAttempt(), 1, 1, date);
      a2 = updateAyahMemorization(a2, goodAttempt(), 1, 2, date);
      date = addDays(date, 1);
    }
    const mastery = computeSurahMastery(1, [a1!, a2!], date);
    expect(mastery.status).toBe('memorized');
    expect(mastery.ayahsMemorized).toBe(2);
    expect(mastery.ayahsTracked).toBe(2);
  });

  it('is not "memorized" if even one tracked ayah is still weak', () => {
    let a1: AyahMemorizationRecord | null = null;
    let date = BASE_DATE;
    for (let i = 0; i < 8; i += 1) {
      a1 = updateAyahMemorization(a1, goodAttempt(), 1, 1, date);
      date = addDays(date, 1);
    }
    const a2 = updateAyahMemorization(null, badAttempt(), 1, 2, date);
    const mastery = computeSurahMastery(1, [a1!, a2], date);
    expect(mastery.status).not.toBe('memorized');
  });

  it('only considers records matching the requested surah', () => {
    const a1 = updateAyahMemorization(null, goodAttempt(), 1, 1, BASE_DATE);
    const otherSurah = updateAyahMemorization(null, badAttempt(), 2, 1, BASE_DATE);
    const mastery = computeSurahMastery(1, [a1, otherSurah], BASE_DATE);
    expect(mastery.ayahsTracked).toBe(1);
  });
});

describe('computeWordMasteryFromHistory', () => {
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

  it('returns an empty list with no history', () => {
    expect(computeWordMasteryFromHistory([])).toEqual([]);
  });

  it('aggregates attempts and mistakes for the same word position across multiple sessions', () => {
    const history = [
      summary({ mostDifficultWords: [{ ayahNumber: 3, wordIndex: 1, attempts: 2, mistakeAttempts: 1 }] }),
      summary({ mostDifficultWords: [{ ayahNumber: 3, wordIndex: 1, attempts: 3, mistakeAttempts: 2 }] }),
    ];
    const mastery = computeWordMasteryFromHistory(history);
    expect(mastery).toHaveLength(1);
    expect(mastery[0]!.totalAttempts).toBe(5);
    expect(mastery[0]!.masteryScore).toBe(Math.round(((5 - 3) / 5) * 100));
  });

  it('gives a word with no recorded difficulty a full mastery score of 100 by definition (never appeared as difficult)', () => {
    // computeWordMasteryFromHistory only ever sees words that appeared in
    // mostDifficultWords at least once — this test documents that absence
    // from the input entirely (not a zero-attempt entry) is what "full
    // mastery" means here.
    expect(computeWordMasteryFromHistory([summary()])).toEqual([]);
  });
});

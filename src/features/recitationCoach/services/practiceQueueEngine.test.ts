import { buildPracticeQueue, buildSmartPracticeQueue } from './practiceQueueEngine';
import type { StoredSessionSummary } from './learningProfileEngine';
import type { ScoreDimension } from './scoringEngine';
import { updateAyahMemorization } from './memorizationEngine';
import type { AyahMemorizationRecord } from './memorizationEngine';
import type { ReviewScheduleEntry } from './reviewScheduler';

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

describe('buildPracticeQueue', () => {
  it('returns an empty queue with no history', () => {
    expect(buildPracticeQueue([])).toEqual([]);
  });

  it('prioritizes an ayah missed across multiple sessions over one missed only once', () => {
    const history = [
      summary({ surahId: 1, weakestAyahs: [5] }),
      summary({ surahId: 1, weakestAyahs: [5] }),
      summary({ surahId: 1, weakestAyahs: [9] }),
    ];
    const queue = buildPracticeQueue(history);
    const ayah5 = queue.find((item) => item.type === 'ayah' && item.ayahNumber === 5);
    const ayah9 = queue.find((item) => item.type === 'ayah' && item.ayahNumber === 9);
    expect(ayah5!.priority).toBeGreaterThan(ayah9!.priority);
  });

  it('includes a difficult-word item scaled by total mistake attempts', () => {
    const history = [
      summary({ surahId: 2, mostDifficultWords: [{ ayahNumber: 3, wordIndex: 1, attempts: 3, mistakeAttempts: 3 }] }),
    ];
    const queue = buildPracticeQueue(history);
    const wordItem = queue.find((item) => item.type === 'word');
    expect(wordItem).toBeDefined();
    expect(wordItem!.params?.surahId).toBe('2');
  });

  it('includes a tajweed-rule item without pinning it to any single surah', () => {
    const history = [summary({ weakestTajweedRules: ['madd'] }), summary({ weakestTajweedRules: ['madd'] })];
    const queue = buildPracticeQueue(history);
    const ruleItem = queue.find((item) => item.type === 'tajweed-rule');
    expect(ruleItem?.ruleId).toBe('madd');
    expect(ruleItem?.surahId).toBeUndefined();
  });

  it('flags a recently-attempted, low-repetition surah for reinforcement', () => {
    const history = [summary({ surahId: 99 })];
    const queue = buildPracticeQueue(history);
    expect(queue.some((item) => item.type === 'surah-reinforcement' && item.surahId === 99)).toBe(true);
  });

  it('does not flag a well-established surah (many attempts) as needing reinforcement', () => {
    const history = Array.from({ length: 6 }, () => summary({ surahId: 1 }));
    const queue = buildPracticeQueue(history);
    expect(queue.some((item) => item.type === 'surah-reinforcement' && item.surahId === 1)).toBe(false);
  });

  it('flags a low-confidence session for review', () => {
    const history = [summary({ overallConfidence: 30 })];
    const queue = buildPracticeQueue(history);
    expect(queue.some((item) => item.type === 'low-confidence-session')).toBe(true);
  });

  it('does not flag a high-confidence session', () => {
    const history = [summary({ overallConfidence: 90 })];
    const queue = buildPracticeQueue(history);
    expect(queue.some((item) => item.type === 'low-confidence-session')).toBe(false);
  });

  it('respects the limit parameter and returns highest-priority items first', () => {
    const history = [
      summary({ surahId: 1, weakestAyahs: [1, 2, 3, 4, 5] }),
      summary({ surahId: 1, weakestAyahs: [1, 2, 3, 4, 5] }),
      summary({ surahId: 1, weakestAyahs: [1, 2, 3, 4, 5] }),
    ];
    const queue = buildPracticeQueue(history, 3);
    expect(queue).toHaveLength(3);
    for (let i = 1; i < queue.length; i += 1) {
      expect(queue[i]!.priority).toBeLessThanOrEqual(queue[i - 1]!.priority);
    }
  });
});

describe('buildSmartPracticeQueue', () => {
  function memorizedRecord(nowIso: string, lastPracticedDaysAgo: number): AyahMemorizationRecord {
    let record: AyahMemorizationRecord | null = null;
    let date = addDays(nowIso, -lastPracticedDaysAgo - 8);
    for (let i = 0; i < 8; i += 1) {
      record = updateAyahMemorization(record, { accuracy: 95, tajweedScore: 90, fluency: 90, mistakes: 0 }, 1, 1, date);
      date = addDays(date, 1);
    }
    return record!;
  }

  it('includes every signal buildPracticeQueue already produces', () => {
    const history = [summary({ weakestAyahs: [5] })];
    const smartQueue = buildSmartPracticeQueue(history, [], [], BASE_DATE);
    expect(smartQueue.some((item) => item.type === 'ayah')).toBe(true);
  });

  it('flags a forgotten ayah with high priority', () => {
    const record = memorizedRecord(BASE_DATE, 60); // long past forgottenDays
    const smartQueue = buildSmartPracticeQueue([], [record], [], BASE_DATE);
    expect(smartQueue.some((item) => item.type === 'forgotten-ayah')).toBe(true);
  });

  it('flags a needs-review ayah (moderate gap) distinctly from a forgotten one', () => {
    const record = memorizedRecord(BASE_DATE, 20); // past needsReviewDays but not forgottenDays
    const smartQueue = buildSmartPracticeQueue([], [record], [], BASE_DATE);
    expect(smartQueue.some((item) => item.type === 'needs-review-ayah')).toBe(true);
    expect(smartQueue.some((item) => item.type === 'forgotten-ayah')).toBe(false);
  });

  it('does not flag a recently-practiced memorized ayah at all', () => {
    const record = memorizedRecord(BASE_DATE, 1);
    const smartQueue = buildSmartPracticeQueue([], [record], [], BASE_DATE);
    expect(smartQueue.some((item) => item.type === 'forgotten-ayah' || item.type === 'needs-review-ayah')).toBe(false);
  });

  it('includes an overdue review with priority increasing the longer it has been overdue', () => {
    const soonOverdue: ReviewScheduleEntry = {
      surahId: 1, ayahNumber: 1, intervalDays: 1, easeFactor: 2.5, dueDateIso: addDays(BASE_DATE, -1), lastReviewedIso: BASE_DATE, lastReviewScore: 40,
    };
    const wayOverdue: ReviewScheduleEntry = {
      surahId: 1, ayahNumber: 2, intervalDays: 1, easeFactor: 2.5, dueDateIso: addDays(BASE_DATE, -30), lastReviewedIso: BASE_DATE, lastReviewScore: 40,
    };
    const smartQueue = buildSmartPracticeQueue([], [], [soonOverdue, wayOverdue], BASE_DATE);
    const soon = smartQueue.find((item) => item.ayahNumber === 1)!;
    const way = smartQueue.find((item) => item.ayahNumber === 2)!;
    expect(way.priority).toBeGreaterThan(soon.priority);
  });

  it('ranks a forgotten ayah above a merely-frequent mistake ayah', () => {
    const history = [summary({ weakestAyahs: [9] })];
    const record = memorizedRecord(BASE_DATE, 60);
    const smartQueue = buildSmartPracticeQueue(history, [record], [], BASE_DATE);
    expect(smartQueue[0]!.type).toBe('forgotten-ayah');
  });
});

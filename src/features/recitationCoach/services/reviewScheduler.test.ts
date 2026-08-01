import { DEFAULT_REVIEW_SCHEDULER_CONFIG, computeReviewQuality, getDueReviews, scheduleNextReview } from './reviewScheduler';
import type { ReviewScheduleEntry } from './reviewScheduler';

const BASE_DATE = '2026-01-01T00:00:00.000Z';
function addDays(iso: string, days: number): string {
  return new Date(new Date(iso).getTime() + days * 24 * 60 * 60 * 1000).toISOString();
}

describe('computeReviewQuality', () => {
  it('combines accuracy, tajweed, and confidence into a single 0-100 figure', () => {
    const quality = computeReviewQuality({ accuracy: 100, tajweedScore: 100, averageConfidence: 100, mistakes: 0 });
    expect(quality).toBe(100);
  });

  it('penalizes quality proportionally to mistake count', () => {
    const clean = computeReviewQuality({ accuracy: 90, tajweedScore: 90, averageConfidence: 90, mistakes: 0 });
    const withMistakes = computeReviewQuality({ accuracy: 90, tajweedScore: 90, averageConfidence: 90, mistakes: 2 });
    expect(withMistakes).toBeLessThan(clean);
  });

  it('never goes negative even with many mistakes', () => {
    const quality = computeReviewQuality({ accuracy: 20, tajweedScore: 20, averageConfidence: 20, mistakes: 50 });
    expect(quality).toBeGreaterThanOrEqual(0);
  });
});

describe('scheduleNextReview', () => {
  it('starts a first-time review at the initial interval', () => {
    const entry = scheduleNextReview(null, 1, 1, 90, BASE_DATE);
    expect(entry.intervalDays).toBe(DEFAULT_REVIEW_SCHEDULER_CONFIG.initialIntervalDays);
    expect(entry.dueDateIso).toBe(addDays(BASE_DATE, DEFAULT_REVIEW_SCHEDULER_CONFIG.initialIntervalDays));
  });

  it('grows the interval on a passing review, scaled by the ease factor', () => {
    let entry: ReviewScheduleEntry | null = scheduleNextReview(null, 1, 1, 90, BASE_DATE);
    const firstInterval = entry.intervalDays;
    entry = scheduleNextReview(entry, 1, 1, 90, addDays(BASE_DATE, firstInterval));
    expect(entry.intervalDays).toBeGreaterThan(firstInterval);
  });

  it('resets the interval to the initial value on a failing review', () => {
    let entry: ReviewScheduleEntry | null = scheduleNextReview(null, 1, 1, 95, BASE_DATE);
    entry = scheduleNextReview(entry, 1, 1, 95, addDays(BASE_DATE, entry.intervalDays));
    expect(entry.intervalDays).toBeGreaterThan(DEFAULT_REVIEW_SCHEDULER_CONFIG.initialIntervalDays);
    // Now a failing attempt — should snap back to reviewing it again very soon.
    entry = scheduleNextReview(entry, 1, 1, 20, addDays(BASE_DATE, 100));
    expect(entry.intervalDays).toBe(DEFAULT_REVIEW_SCHEDULER_CONFIG.initialIntervalDays);
  });

  it('lowers the ease factor on a failing review and raises it on a passing one', () => {
    const failed = scheduleNextReview(null, 1, 1, 10, BASE_DATE);
    expect(failed.easeFactor).toBeLessThan(DEFAULT_REVIEW_SCHEDULER_CONFIG.defaultEaseFactor);

    const passed = scheduleNextReview(null, 1, 1, 100, BASE_DATE);
    expect(passed.easeFactor).toBeGreaterThan(DEFAULT_REVIEW_SCHEDULER_CONFIG.defaultEaseFactor);
  });

  it('never lets the ease factor drop below the configured minimum', () => {
    let entry: ReviewScheduleEntry | null = null;
    let date = BASE_DATE;
    for (let i = 0; i < 20; i += 1) {
      entry = scheduleNextReview(entry, 1, 1, 0, date);
      date = addDays(date, 1);
    }
    expect(entry!.easeFactor).toBeGreaterThanOrEqual(DEFAULT_REVIEW_SCHEDULER_CONFIG.minEaseFactor);
  });

  it('never lets the interval exceed the configured maximum', () => {
    let entry: ReviewScheduleEntry | null = null;
    let date = BASE_DATE;
    for (let i = 0; i < 30; i += 1) {
      entry = scheduleNextReview(entry, 1, 1, 100, date);
      date = addDays(date, entry.intervalDays);
    }
    expect(entry!.intervalDays).toBeLessThanOrEqual(DEFAULT_REVIEW_SCHEDULER_CONFIG.maxIntervalDays);
  });

  it('records the review quality and date it was reviewed', () => {
    const entry = scheduleNextReview(null, 5, 12, 77, BASE_DATE);
    expect(entry.lastReviewScore).toBe(77);
    expect(entry.lastReviewedIso).toBe(BASE_DATE);
    expect(entry.surahId).toBe(5);
    expect(entry.ayahNumber).toBe(12);
  });
});

describe('getDueReviews', () => {
  it('returns entries whose due date has already passed', () => {
    const schedule: ReviewScheduleEntry[] = [
      { surahId: 1, ayahNumber: 1, intervalDays: 1, easeFactor: 2.5, dueDateIso: addDays(BASE_DATE, -1), lastReviewedIso: BASE_DATE, lastReviewScore: 80 },
      { surahId: 1, ayahNumber: 2, intervalDays: 10, easeFactor: 2.5, dueDateIso: addDays(BASE_DATE, 10), lastReviewedIso: BASE_DATE, lastReviewScore: 80 },
    ];
    const due = getDueReviews(schedule, BASE_DATE);
    expect(due).toHaveLength(1);
    expect(due[0]!.ayahNumber).toBe(1);
  });

  it('treats an entry due exactly now as due', () => {
    const schedule: ReviewScheduleEntry[] = [
      { surahId: 1, ayahNumber: 1, intervalDays: 1, easeFactor: 2.5, dueDateIso: BASE_DATE, lastReviewedIso: BASE_DATE, lastReviewScore: 80 },
    ];
    expect(getDueReviews(schedule, BASE_DATE)).toHaveLength(1);
  });

  it('returns an empty list when nothing is due yet', () => {
    const schedule: ReviewScheduleEntry[] = [
      { surahId: 1, ayahNumber: 1, intervalDays: 10, easeFactor: 2.5, dueDateIso: addDays(BASE_DATE, 5), lastReviewedIso: BASE_DATE, lastReviewScore: 80 },
    ];
    expect(getDueReviews(schedule, BASE_DATE)).toEqual([]);
  });
});

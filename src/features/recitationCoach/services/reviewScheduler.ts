/**
 * The Review Scheduler: a simplified SM-2-style spaced-repetition
 * algorithm. Time-since-last-practice and previous-review-performance
 * (Requirement 2) aren't separate inputs to compute here — they're what
 * the interval/ease mechanism itself already *is*: every review updates
 * the interval based on how the previous one went, and the due date is
 * simply "last reviewed + current interval". Accuracy, Tajweed score, and
 * mistake count feed a single 0-100 "quality" figure that drives whether
 * the interval grows or resets.
 */

export interface ReviewSchedulerConfig {
  /** Quality (0-100) at or above which a review counts as a "pass" and the interval grows; below it, the interval resets to the initial value. */
  passQualityThreshold: number;
  /** How much ease factor is lost on a failed review. */
  easePenaltyOnFail: number;
  /** How much ease factor is gained per quality point above the pass threshold (as a fraction of 100). */
  easeBonusPerQualityAboveThreshold: number;
  /** Points of quality lost per recorded mistake, capped at the base quality itself (never goes negative). */
  mistakePenaltyPoints: number;
  initialIntervalDays: number;
  minEaseFactor: number;
  defaultEaseFactor: number;
  maxIntervalDays: number;
}

/**
 * Starting points, not empirically tuned — every value is a named,
 * overridable field (see MemorizationThresholds for the same rationale),
 * satisfying "review scheduling configurable".
 */
export const DEFAULT_REVIEW_SCHEDULER_CONFIG: ReviewSchedulerConfig = {
  passQualityThreshold: 65,
  easePenaltyOnFail: 0.2,
  easeBonusPerQualityAboveThreshold: 0.15,
  mistakePenaltyPoints: 8,
  initialIntervalDays: 1,
  minEaseFactor: 1.3,
  defaultEaseFactor: 2.5,
  maxIntervalDays: 180,
};

export interface ReviewScheduleEntry {
  surahId: number;
  ayahNumber: number;
  intervalDays: number;
  easeFactor: number;
  dueDateIso: string;
  lastReviewedIso: string;
  lastReviewScore: number;
}

export interface ReviewQualityInput {
  accuracy: number;
  tajweedScore: number;
  averageConfidence: number;
  mistakes: number;
}

/** A single 0-100 review-quality figure combining accuracy, tajweed, and confidence, penalized by mistake count — the raw signal the interval/ease adjustment reacts to. */
export function computeReviewQuality(input: ReviewQualityInput, config: ReviewSchedulerConfig = DEFAULT_REVIEW_SCHEDULER_CONFIG): number {
  const base = Math.round(input.accuracy * 0.4 + input.tajweedScore * 0.3 + input.averageConfidence * 0.3);
  const mistakePenalty = Math.min(base, input.mistakes * config.mistakePenaltyPoints);
  return Math.max(0, base - mistakePenalty);
}

function addDays(iso: string, days: number): string {
  return new Date(new Date(iso).getTime() + days * 24 * 60 * 60 * 1000).toISOString();
}

/**
 * Computes the next review entry from the previous one (or none, for a
 * first-time review) and this attempt's quality. A failed review
 * (quality below passQualityThreshold) resets the interval back to the
 * initial value and shrinks the ease factor — exactly the "review it more
 * frequently when the user struggles" requirement. A passed review grows
 * both the interval (scaled by ease) and the ease factor itself, capped at
 * maxIntervalDays so nothing ever drifts into "never again".
 */
export function scheduleNextReview(
  existing: ReviewScheduleEntry | null,
  surahId: number,
  ayahNumber: number,
  quality: number,
  dateIso: string,
  config: ReviewSchedulerConfig = DEFAULT_REVIEW_SCHEDULER_CONFIG
): ReviewScheduleEntry {
  const previousEase = existing?.easeFactor ?? config.defaultEaseFactor;
  const previousInterval = existing?.intervalDays ?? 0;

  let easeFactor: number;
  let intervalDays: number;

  if (quality < config.passQualityThreshold) {
    intervalDays = config.initialIntervalDays;
    easeFactor = Math.max(config.minEaseFactor, previousEase - config.easePenaltyOnFail);
  } else {
    easeFactor = Math.max(
      config.minEaseFactor,
      previousEase + config.easeBonusPerQualityAboveThreshold * ((quality - config.passQualityThreshold) / 100)
    );
    intervalDays = previousInterval <= 0 ? config.initialIntervalDays : Math.round(previousInterval * easeFactor);
  }

  intervalDays = Math.min(intervalDays, config.maxIntervalDays);

  return {
    surahId,
    ayahNumber,
    intervalDays,
    easeFactor,
    dueDateIso: addDays(dateIso, intervalDays),
    lastReviewedIso: dateIso,
    lastReviewScore: quality,
  };
}

/** Every schedule entry whose due date has already passed, as of `nowIso` — the Practice Queue and Session Builder both consume this directly. */
export function getDueReviews(schedule: ReviewScheduleEntry[], nowIso: string): ReviewScheduleEntry[] {
  const now = new Date(nowIso).getTime();
  return schedule.filter((entry) => new Date(entry.dueDateIso).getTime() <= now);
}

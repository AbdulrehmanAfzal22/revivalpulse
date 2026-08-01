import type { StoredSessionSummary } from './learningProfileEngine';

/**
 * The Memorization Engine: tracks per-ayah memorization progress over
 * time. Deliberately keyed per (surahId, ayahNumber) rather than per
 * session — the Quran has a fixed ~6236 ayahs, so this storage is bounded
 * regardless of how many thousands of sessions a user accumulates, unlike
 * session history (which Phase 6 already caps for exactly that reason).
 * Consumes only plain per-ayah score fields (accuracy/tajweedScore/
 * fluency/mistakes) — the same shape Phase 5's AyahScoreAnalysis already
 * exposes in-memory at session completion — never Scoring's internals.
 */

export type MemorizationStatus = 'new' | 'learning' | 'practicing' | 'memorized' | 'needs-review' | 'forgotten';

export interface AyahMemorizationRecord {
  surahId: number;
  ayahNumber: number;
  /** 0-100, a smoothed (exponential-moving-average) quality signal — a single great or poor attempt nudges it, never snaps it. */
  masteryScore: number;
  practiceCount: number;
  /** Consecutive attempts meeting the "good attempt" bar — resets to 0 on any attempt that doesn't. Required (alongside masteryScore) before "memorized" is granted, so one lucky high-scoring attempt after many mediocre ones isn't enough on its own. */
  consecutiveGoodAttempts: number;
  lastPracticedIso: string;
  /** Running average accuracy across every attempt ever recorded for this ayah. */
  averageAccuracy: number;
}

export interface MemorizationThresholds {
  /** Combined accuracy/tajweed/fluency score (and zero mistakes) required for an attempt to count as "good". */
  goodAttemptQuality: number;
  practicingMastery: number;
  memorizedMastery: number;
  memorizedStreak: number;
  /** 0-1 — how much a single attempt's quality moves masteryScore toward it. */
  masterySmoothing: number;
  /** Days since last practice before a practicing/memorized ayah is flagged "needs review". */
  needsReviewDays: number;
  /** Days since last practice before it's flagged "forgotten" instead. */
  forgottenDays: number;
  /** Days of grace after last practice before mastery starts decaying at all. */
  decayGraceDays: number;
  /** Mastery points lost per day once past the grace period. */
  decayRatePerDay: number;
}

/**
 * Starting points, not empirically tuned (no real usage data exists in
 * this environment) — every threshold is a named, overridable field so a
 * future model or product decision can retune this without touching the
 * calculation logic itself, per the "review scheduling configurable"
 * requirement.
 */
export const DEFAULT_MEMORIZATION_THRESHOLDS: MemorizationThresholds = {
  goodAttemptQuality: 80,
  practicingMastery: 60,
  memorizedMastery: 85,
  memorizedStreak: 3,
  masterySmoothing: 0.3,
  needsReviewDays: 14,
  forgottenDays: 45,
  decayGraceDays: 10,
  decayRatePerDay: 1.5,
};

function average(values: number[]): number {
  return values.length > 0 ? values.reduce((sum, value) => sum + value, 0) / values.length : 0;
}

function daysBetween(fromIso: string, toIso: string): number {
  return Math.max(0, (new Date(toIso).getTime() - new Date(fromIso).getTime()) / (24 * 60 * 60 * 1000));
}

export interface AyahAttemptQuality {
  accuracy: number;
  tajweedScore: number;
  fluency: number;
  mistakes: number;
}

/** Updates one ayah's record from a single freshly-completed attempt. Pure — the caller supplies `dateIso` rather than this function reading the clock, so it's fully deterministic and testable. */
export function updateAyahMemorization(
  existing: AyahMemorizationRecord | null,
  ayah: AyahAttemptQuality,
  surahId: number,
  ayahNumber: number,
  dateIso: string,
  thresholds: MemorizationThresholds = DEFAULT_MEMORIZATION_THRESHOLDS
): AyahMemorizationRecord {
  const combinedQuality = Math.round((ayah.accuracy + ayah.tajweedScore + ayah.fluency) / 3);
  const isGoodAttempt = combinedQuality >= thresholds.goodAttemptQuality && ayah.mistakes === 0;

  const previousMastery = existing?.masteryScore ?? 0;
  const masteryScore = Math.round(previousMastery + thresholds.masterySmoothing * (combinedQuality - previousMastery));

  const practiceCount = (existing?.practiceCount ?? 0) + 1;
  const previousAverage = existing?.averageAccuracy ?? 0;
  const averageAccuracy = Math.round(previousAverage + (ayah.accuracy - previousAverage) / practiceCount);

  const consecutiveGoodAttempts = isGoodAttempt ? (existing?.consecutiveGoodAttempts ?? 0) + 1 : 0;

  return { surahId, ayahNumber, masteryScore, practiceCount, consecutiveGoodAttempts, lastPracticedIso: dateIso, averageAccuracy };
}

/** Applies time-based decay to a record's mastery score — practicing/memorized status earned long ago erodes if untouched, rather than staying frozen forever after a single good streak. */
export function effectiveMasteryScore(
  record: AyahMemorizationRecord,
  nowIso: string,
  thresholds: MemorizationThresholds = DEFAULT_MEMORIZATION_THRESHOLDS
): number {
  const days = daysBetween(record.lastPracticedIso, nowIso);
  if (days <= thresholds.decayGraceDays) return record.masteryScore;
  const decayed = record.masteryScore - (days - thresholds.decayGraceDays) * thresholds.decayRatePerDay;
  return Math.max(0, Math.round(decayed));
}

function baseStatusFromMastery(
  masteryScore: number,
  consecutiveGoodAttempts: number,
  thresholds: MemorizationThresholds
): Exclude<MemorizationStatus, 'new' | 'needs-review' | 'forgotten'> {
  if (masteryScore >= thresholds.memorizedMastery && consecutiveGoodAttempts >= thresholds.memorizedStreak) return 'memorized';
  if (masteryScore >= thresholds.practicingMastery) return 'practicing';
  return 'learning';
}

/**
 * The full status a caller should display: 'new' when there's no record at
 * all, otherwise a performance-based status with a time-based overlay — an
 * ayah that *reached* practicing/memorized but hasn't been touched in a
 * while reads as "needs review" or "forgotten" instead, since that's more
 * actionable than silently showing a stale "memorized" label.
 *
 * Deliberately uses the *undecayed* mastery score to decide whether the
 * ayah ever reached practicing/memorized in the first place — using the
 * decayed score here would be self-defeating: by the time enough days have
 * passed for "forgotten" to apply, decay has often already pulled the
 * score below the practicing threshold too, which would make this function
 * report "learning" instead of "forgotten" in exactly the cases the
 * overlay exists for. Decay still applies to the *numeric* mastery score
 * shown elsewhere (see effectiveMasteryScore) — it just isn't what gates
 * this categorical status.
 */
export function effectiveStatus(
  record: AyahMemorizationRecord | null,
  nowIso: string,
  thresholds: MemorizationThresholds = DEFAULT_MEMORIZATION_THRESHOLDS
): MemorizationStatus {
  if (!record) return 'new';
  const everReachedStatus = baseStatusFromMastery(record.masteryScore, record.consecutiveGoodAttempts, thresholds);
  if (everReachedStatus === 'learning') return 'learning';

  const days = daysBetween(record.lastPracticedIso, nowIso);
  if (days >= thresholds.forgottenDays) return 'forgotten';
  if (days >= thresholds.needsReviewDays) return 'needs-review';
  return everReachedStatus;
}

// --- Surah-level rollup ---

export interface SurahMastery {
  surahId: number;
  masteryScore: number;
  ayahsMemorized: number;
  /** Ayahs with at least one recorded attempt — distinct from the surah's total verse count, which this engine deliberately doesn't know (that's SURAHS data, a UI/data concern, not a scoring concern). */
  ayahsTracked: number;
  status: 'new' | 'learning' | 'practicing' | 'memorized';
}

export function computeSurahMastery(
  surahId: number,
  records: AyahMemorizationRecord[],
  nowIso: string,
  thresholds: MemorizationThresholds = DEFAULT_MEMORIZATION_THRESHOLDS
): SurahMastery {
  const relevant = records.filter((record) => record.surahId === surahId);
  if (relevant.length === 0) return { surahId, masteryScore: 0, ayahsMemorized: 0, ayahsTracked: 0, status: 'new' };

  const masteryScore = Math.round(average(relevant.map((record) => effectiveMasteryScore(record, nowIso, thresholds))));
  const ayahsMemorized = relevant.filter((record) => effectiveStatus(record, nowIso, thresholds) === 'memorized').length;
  const status: SurahMastery['status'] =
    ayahsMemorized === relevant.length ? 'memorized' : masteryScore >= thresholds.practicingMastery ? 'practicing' : 'learning';

  return { surahId, masteryScore, ayahsMemorized, ayahsTracked: relevant.length, status };
}

// --- Word-level mastery, derived from Phase 6's existing session history (no new per-word storage needed) ---

export interface WordMastery {
  surahId: number;
  ayahNumber: number;
  wordIndex: number;
  /** 0-100 — the share of recorded attempts at this exact word position that were *not* flagged as mistakes, across every stored session. */
  masteryScore: number;
  totalAttempts: number;
}

/** Reuses Phase 6's already-stored `mostDifficultWords` (position + attempt/mistake counts per session) rather than persisting a new per-word structure — the same underlying data, aggregated across history instead of within one session. */
export function computeWordMasteryFromHistory(history: StoredSessionSummary[]): WordMastery[] {
  const byKey = new Map<string, { surahId: number; ayahNumber: number; wordIndex: number; attempts: number; mistakeAttempts: number }>();

  for (const session of history) {
    for (const word of session.mostDifficultWords) {
      const key = `${session.surahId}:${word.ayahNumber}:${word.wordIndex}`;
      const entry = byKey.get(key) ?? { surahId: session.surahId, ayahNumber: word.ayahNumber, wordIndex: word.wordIndex, attempts: 0, mistakeAttempts: 0 };
      entry.attempts += word.attempts;
      entry.mistakeAttempts += word.mistakeAttempts;
      byKey.set(key, entry);
    }
  }

  return Array.from(byKey.values()).map((entry) => ({
    surahId: entry.surahId,
    ayahNumber: entry.ayahNumber,
    wordIndex: entry.wordIndex,
    masteryScore: entry.attempts > 0 ? Math.round(((entry.attempts - entry.mistakeAttempts) / entry.attempts) * 100) : 100,
    totalAttempts: entry.attempts,
  }));
}

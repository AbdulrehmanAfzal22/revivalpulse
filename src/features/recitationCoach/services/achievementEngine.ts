import type { LearningProfile, StoredSessionSummary } from './learningProfileEngine';

/**
 * The Achievement Engine: evaluates a fixed set of milestone detectors
 * against the just-completed session (using Phase 5's fresh in-memory
 * per-ayah data, the same way the Memorization Engine does) plus the
 * long-term history/profile Phase 6 already maintains. Framed entirely
 * around personal milestones (first perfect ayah, a practice streak, a
 * mistake-free session) rather than any comparison to other users, per
 * "encourage learning rather than competition".
 */

export type AchievementId =
  | 'first-perfect-ayah'
  | 'first-perfect-surah'
  | 'seven-day-streak'
  | 'hundred-ayahs-practiced'
  | 'zero-mistakes-session'
  | 'tajweed-master'
  | 'consistency-champion';

export const ALL_ACHIEVEMENT_IDS: AchievementId[] = [
  'first-perfect-ayah',
  'first-perfect-surah',
  'seven-day-streak',
  'hundred-ayahs-practiced',
  'zero-mistakes-session',
  'tajweed-master',
  'consistency-champion',
];

export interface LatestAyahQuality {
  accuracy: number;
  mistakes: number;
}

export interface AchievementEvaluationContext {
  latestSessionSummary: StoredSessionSummary;
  /** Fresh, in-memory-only per-ayah results from the session that just completed — not persisted long-term by Phase 6, so achievements that need per-ayah detail (a specific ayah scoring 100%) must be checked right when this data is still available, exactly like the Memorization Engine. */
  latestAyahQualities: LatestAyahQuality[];
  /** Includes latestSessionSummary as its final entry. */
  history: StoredSessionSummary[];
  profile: LearningProfile;
}

function toDateOnly(iso: string): string {
  return iso.slice(0, 10);
}

function isConsecutiveDay(earlier: string, later: string): boolean {
  const diffMs = new Date(later).getTime() - new Date(earlier).getTime();
  return Math.round(diffMs / (24 * 60 * 60 * 1000)) === 1;
}

/** The current practice streak (consecutive calendar days with at least one session) ending at the most recently practiced day — not the best-ever streak, since the achievement is about reaching 7 *now*. */
export function computeCurrentPracticeStreak(history: StoredSessionSummary[]): number {
  const days = Array.from(new Set(history.map((session) => toDateOnly(session.dateIso)))).sort();
  if (days.length === 0) return 0;
  let streak = 1;
  for (let i = days.length - 1; i > 0; i -= 1) {
    if (isConsecutiveDay(days[i - 1]!, days[i]!)) streak += 1;
    else break;
  }
  return streak;
}

/** How many distinct calendar days out of the most recent 7 had at least one session — a "consistency" signal distinct from an unbroken streak (this tolerates the occasional skipped day). */
export function practicedDaysInLastWeek(history: StoredSessionSummary[], nowIso: string): number {
  const now = new Date(nowIso).getTime();
  const sevenDaysMs = 7 * 24 * 60 * 60 * 1000;
  const recentDays = new Set(
    history.filter((session) => now - new Date(session.dateIso).getTime() < sevenDaysMs).map((session) => toDateOnly(session.dateIso))
  );
  return recentDays.size;
}

function hasZeroMistakes(session: StoredSessionSummary): boolean {
  return Object.values(session.mistakeTypeBreakdown).every((count) => !count);
}

const CONSISTENCY_DAYS_REQUIRED = 5;
const TAJWEED_MASTER_SCORE = 90;
const TAJWEED_MASTER_MIN_SESSIONS = 10;
const HUNDRED_AYAHS = 100;
const STREAK_DAYS_REQUIRED = 7;

type AchievementDetector = (context: AchievementEvaluationContext) => boolean;

/**
 * One entry point per achievement — consistent with every other registry
 * in this feature (scoringEngine's DIMENSION_CALCULATORS,
 * learningProfileEngine's WEAKNESS_DETECTORS, etc.) so adding a new
 * achievement is a new entry here, never a change to how achievements are
 * evaluated or unlocked.
 */
const ACHIEVEMENT_DETECTORS: Record<AchievementId, AchievementDetector> = {
  'first-perfect-ayah': (context) => context.latestAyahQualities.some((ayah) => ayah.accuracy === 100 && ayah.mistakes === 0),
  'first-perfect-surah': (context) =>
    context.latestAyahQualities.length > 0 && context.latestAyahQualities.every((ayah) => ayah.accuracy === 100 && ayah.mistakes === 0),
  'zero-mistakes-session': (context) => hasZeroMistakes(context.latestSessionSummary),
  'hundred-ayahs-practiced': (context) => context.profile.totalAyahsCompleted >= HUNDRED_AYAHS,
  'seven-day-streak': (context) => computeCurrentPracticeStreak(context.history) >= STREAK_DAYS_REQUIRED,
  'tajweed-master': (context) => context.profile.totalSessions >= TAJWEED_MASTER_MIN_SESSIONS && context.profile.averageTajweedScore >= TAJWEED_MASTER_SCORE,
  'consistency-champion': (context) =>
    practicedDaysInLastWeek(context.history, context.latestSessionSummary.dateIso) >= CONSISTENCY_DAYS_REQUIRED,
};

/** Returns only the achievement IDs that are newly satisfied by this evaluation and weren't already unlocked — callers persist these via memorizationStorage.addUnlockedAchievements. */
export function evaluateNewAchievements(context: AchievementEvaluationContext, alreadyUnlocked: AchievementId[]): AchievementId[] {
  return ALL_ACHIEVEMENT_IDS.filter((id) => !alreadyUnlocked.includes(id) && ACHIEVEMENT_DETECTORS[id](context));
}

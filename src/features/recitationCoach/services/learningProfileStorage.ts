import { createEmptyTotals, updateTotalsWithSession } from './learningProfileEngine';
import type { LearningProfileTotals, StoredSessionSummary } from './learningProfileEngine';

/**
 * The one impure module in the learning-profile feature set — everywhere
 * else (learningProfileEngine, recommendationEngine, practiceQueueEngine,
 * adaptiveCoachingEngine) is a pure function of plain data, exactly like
 * every other engine in this feature. This module's only job is getting
 * that plain data in and out of localStorage, mirroring how whisperClient/
 * tajweedClient are the "impure adapter" layer around otherwise-pure
 * parsing/analysis code.
 *
 * Entirely offline and local: no network call is made anywhere in this
 * file, satisfying "privacy-friendly, fully offline" by construction. The
 * stored shape is plain, versioned JSON, so a future cloud-sync feature can
 * serialize the exact same data over the wire without transformation.
 */

const STORAGE_KEY = 'recitationCoach.learningProfile.v1';
const STORAGE_VERSION = 1;

/**
 * Long-term totals (Requirement 1) are kept forever via O(1) incremental
 * updates (see learningProfileEngine.ts), but the richer per-session
 * history used for weakness/trend/queue analysis is capped — "long-term
 * trends" meaningfully means "recent, actionable history", not literally
 * every session since first use. Capping here is also what keeps
 * localStorage usage bounded regardless of how many thousands of sessions
 * a long-time user eventually accumulates.
 */
export const MAX_HISTORY_ENTRIES = 200;

export interface LearningStoreData {
  version: typeof STORAGE_VERSION;
  totals: LearningProfileTotals;
  history: StoredSessionSummary[];
}

export function createEmptyStore(): LearningStoreData {
  return { version: STORAGE_VERSION, totals: createEmptyTotals(), history: [] };
}

function isValidStore(value: unknown): value is LearningStoreData {
  if (!value || typeof value !== 'object') return false;
  const candidate = value as Partial<LearningStoreData>;
  return candidate.version === STORAGE_VERSION && Array.isArray(candidate.history) && typeof candidate.totals === 'object';
}

/** Never throws — a corrupted, missing, or version-mismatched entry falls back to a fresh empty store rather than breaking the page. Losing locally-stored learning history is recoverable (it just starts accumulating again); crashing the recitation coach page over it would not be. */
export function loadLearningStore(): LearningStoreData {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return createEmptyStore();
    const parsed: unknown = JSON.parse(raw);
    return isValidStore(parsed) ? parsed : createEmptyStore();
  } catch {
    return createEmptyStore();
  }
}

/** Best-effort — a full localStorage quota (or private-browsing restrictions) shouldn't crash the session; the in-memory profile for the current session still works, it just won't persist. */
export function saveLearningStore(data: LearningStoreData): void {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {
    // Ignored deliberately — see docstring above.
  }
}

export function appendSessionToStore(store: LearningStoreData, summary: StoredSessionSummary): LearningStoreData {
  return {
    version: STORAGE_VERSION,
    totals: updateTotalsWithSession(store.totals, summary),
    history: [...store.history, summary].slice(-MAX_HISTORY_ENTRIES),
  };
}

/** Clears all locally-stored learning history and totals — the one user-facing "forget my progress" escape hatch, kept explicit and separate from ordinary session flow. */
export function clearLearningStore(): void {
  try {
    window.localStorage.removeItem(STORAGE_KEY);
  } catch {
    // Ignored — see saveLearningStore.
  }
}

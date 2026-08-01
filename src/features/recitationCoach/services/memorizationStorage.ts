import type { AyahMemorizationRecord } from './memorizationEngine';
import type { ReviewScheduleEntry } from './reviewScheduler';
import type { AchievementId } from './achievementEngine';

/**
 * The impure persistence adapter for Phase 7 — mirrors
 * learningProfileStorage.ts's role exactly (plain JSON in localStorage,
 * never throws, no network calls anywhere in this file), but kept as its
 * own storage key and module rather than folded into Phase 6's already-
 * shipped store. The two concerns are genuinely different: Phase 6 tracks
 * a capped *session history* for trend/weakness analysis; Phase 7 tracks
 * *per-ayah* memorization state, which needs to persist forever (bounded
 * by the Quran's fixed ayah count, not by session count) and must never be
 * silently dropped by Phase 6's history cap.
 */

const STORAGE_KEY = 'recitationCoach.memorization.v1';
const STORAGE_VERSION = 1;

export interface MemorizationStoreData {
  version: typeof STORAGE_VERSION;
  ayahRecords: AyahMemorizationRecord[];
  reviewSchedule: ReviewScheduleEntry[];
  unlockedAchievements: AchievementId[];
}

export function createEmptyMemorizationStore(): MemorizationStoreData {
  return { version: STORAGE_VERSION, ayahRecords: [], reviewSchedule: [], unlockedAchievements: [] };
}

function isValidStore(value: unknown): value is MemorizationStoreData {
  if (!value || typeof value !== 'object') return false;
  const candidate = value as Partial<MemorizationStoreData>;
  return (
    candidate.version === STORAGE_VERSION &&
    Array.isArray(candidate.ayahRecords) &&
    Array.isArray(candidate.reviewSchedule) &&
    Array.isArray(candidate.unlockedAchievements)
  );
}

/** Never throws — a corrupted or version-mismatched entry falls back to an empty store, the same recoverability tradeoff learningProfileStorage.ts makes. */
export function loadMemorizationStore(): MemorizationStoreData {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return createEmptyMemorizationStore();
    const parsed: unknown = JSON.parse(raw);
    return isValidStore(parsed) ? parsed : createEmptyMemorizationStore();
  } catch {
    return createEmptyMemorizationStore();
  }
}

/** Best-effort — a full quota or private-browsing restriction shouldn't crash the session, it just means this update won't persist. */
export function saveMemorizationStore(data: MemorizationStoreData): void {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {
    // Ignored deliberately — see docstring above.
  }
}

/** Replaces the record for this exact (surahId, ayahNumber), or appends a new one — records are keyed by position, not appended per attempt, so this store's size is bounded by the Quran's fixed ayah count, never by session count. */
export function upsertAyahRecord(store: MemorizationStoreData, record: AyahMemorizationRecord): MemorizationStoreData {
  const index = store.ayahRecords.findIndex((r) => r.surahId === record.surahId && r.ayahNumber === record.ayahNumber);
  const ayahRecords =
    index >= 0
      ? store.ayahRecords.map((r, i) => (i === index ? record : r))
      : [...store.ayahRecords, record];
  return { ...store, ayahRecords };
}

export function upsertReviewScheduleEntry(store: MemorizationStoreData, entry: ReviewScheduleEntry): MemorizationStoreData {
  const index = store.reviewSchedule.findIndex((e) => e.surahId === entry.surahId && e.ayahNumber === entry.ayahNumber);
  const reviewSchedule =
    index >= 0
      ? store.reviewSchedule.map((e, i) => (i === index ? entry : e))
      : [...store.reviewSchedule, entry];
  return { ...store, reviewSchedule };
}

export function addUnlockedAchievements(store: MemorizationStoreData, achievementIds: AchievementId[]): MemorizationStoreData {
  if (achievementIds.length === 0) return store;
  const merged = new Set([...store.unlockedAchievements, ...achievementIds]);
  return { ...store, unlockedAchievements: Array.from(merged) };
}

/** The one user-facing "reset my memorization progress" escape hatch — explicit and separate from ordinary session flow, same pattern as learningProfileStorage's clearLearningStore. */
export function clearMemorizationStore(): void {
  try {
    window.localStorage.removeItem(STORAGE_KEY);
  } catch {
    // Ignored — see saveMemorizationStore.
  }
}

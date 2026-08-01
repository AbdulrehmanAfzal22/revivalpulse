import {
  addUnlockedAchievements,
  clearMemorizationStore,
  createEmptyMemorizationStore,
  loadMemorizationStore,
  saveMemorizationStore,
  upsertAyahRecord,
  upsertReviewScheduleEntry,
} from './memorizationStorage';
import type { AyahMemorizationRecord } from './memorizationEngine';
import type { ReviewScheduleEntry } from './reviewScheduler';

const BASE_DATE = '2026-01-01T00:00:00.000Z';

function ayahRecord(overrides: Partial<AyahMemorizationRecord> = {}): AyahMemorizationRecord {
  return { surahId: 1, ayahNumber: 1, masteryScore: 50, practiceCount: 1, consecutiveGoodAttempts: 0, lastPracticedIso: BASE_DATE, averageAccuracy: 80, ...overrides };
}

function reviewEntry(overrides: Partial<ReviewScheduleEntry> = {}): ReviewScheduleEntry {
  return { surahId: 1, ayahNumber: 1, intervalDays: 1, easeFactor: 2.5, dueDateIso: BASE_DATE, lastReviewedIso: BASE_DATE, lastReviewScore: 80, ...overrides };
}

beforeEach(() => {
  window.localStorage.clear();
});

describe('loadMemorizationStore', () => {
  it('returns an empty store when nothing has been saved', () => {
    expect(loadMemorizationStore()).toEqual(createEmptyMemorizationStore());
  });

  it('falls back to empty on corrupted JSON', () => {
    window.localStorage.setItem('recitationCoach.memorization.v1', '{not valid json');
    expect(() => loadMemorizationStore()).not.toThrow();
    expect(loadMemorizationStore()).toEqual(createEmptyMemorizationStore());
  });

  it('falls back to empty on a version mismatch', () => {
    window.localStorage.setItem('recitationCoach.memorization.v1', JSON.stringify({ version: 999, ayahRecords: [], reviewSchedule: [], unlockedAchievements: [] }));
    expect(loadMemorizationStore()).toEqual(createEmptyMemorizationStore());
  });

  it('round-trips a saved store exactly', () => {
    const store = upsertAyahRecord(createEmptyMemorizationStore(), ayahRecord());
    saveMemorizationStore(store);
    expect(loadMemorizationStore()).toEqual(store);
  });
});

describe('upsertAyahRecord', () => {
  it('appends a new record for a position not yet tracked', () => {
    const store = upsertAyahRecord(createEmptyMemorizationStore(), ayahRecord());
    expect(store.ayahRecords).toHaveLength(1);
  });

  it('replaces (not duplicates) the record for the same surah+ayah position', () => {
    let store = upsertAyahRecord(createEmptyMemorizationStore(), ayahRecord({ masteryScore: 40 }));
    store = upsertAyahRecord(store, ayahRecord({ masteryScore: 60 }));
    expect(store.ayahRecords).toHaveLength(1);
    expect(store.ayahRecords[0]!.masteryScore).toBe(60);
  });

  it('keeps records for different ayahs separate', () => {
    let store = upsertAyahRecord(createEmptyMemorizationStore(), ayahRecord({ ayahNumber: 1 }));
    store = upsertAyahRecord(store, ayahRecord({ ayahNumber: 2 }));
    expect(store.ayahRecords).toHaveLength(2);
  });
});

describe('upsertReviewScheduleEntry', () => {
  it('replaces the schedule entry for the same ayah rather than duplicating it', () => {
    let store = upsertReviewScheduleEntry(createEmptyMemorizationStore(), reviewEntry({ intervalDays: 1 }));
    store = upsertReviewScheduleEntry(store, reviewEntry({ intervalDays: 5 }));
    expect(store.reviewSchedule).toHaveLength(1);
    expect(store.reviewSchedule[0]!.intervalDays).toBe(5);
  });
});

describe('addUnlockedAchievements', () => {
  it('adds new achievement ids without duplicating existing ones', () => {
    let store = addUnlockedAchievements(createEmptyMemorizationStore(), ['zero-mistakes-session']);
    store = addUnlockedAchievements(store, ['zero-mistakes-session', 'first-perfect-ayah']);
    expect(store.unlockedAchievements.sort()).toEqual(['first-perfect-ayah', 'zero-mistakes-session'].sort());
  });

  it('is a no-op with an empty list', () => {
    const store = createEmptyMemorizationStore();
    expect(addUnlockedAchievements(store, [])).toBe(store);
  });
});

describe('clearMemorizationStore', () => {
  it('removes persisted data so a subsequent load starts fresh', () => {
    saveMemorizationStore(upsertAyahRecord(createEmptyMemorizationStore(), ayahRecord()));
    clearMemorizationStore();
    expect(loadMemorizationStore()).toEqual(createEmptyMemorizationStore());
  });
});

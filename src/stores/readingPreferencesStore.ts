import { create } from 'zustand';
import { useAuthStore } from './authStore';
import { readLocal, syncDomain, upsertLocal } from 'services/syncEngine';
import { DEFAULT_READING_PREFERENCES } from 'constants/readingPreferences';
import { READING_MODE_PRESETS } from 'constants/readingModes';
import type { ReadingMode, ReadingPreferences } from 'types/readingPreferences.types';

const PREFERENCES_RECORD_ID = 'reading-preferences';

function currentUserId(): string | null {
  return useAuthStore.getState().user?.id ?? null;
}

function loadInitialPreferences(): ReadingPreferences {
  const [record] = readLocal<ReadingPreferences>('settings', currentUserId());
  return record ? { ...DEFAULT_READING_PREFERENCES, ...record.payload } : DEFAULT_READING_PREFERENCES;
}

function persist(preferences: ReadingPreferences): void {
  const userId = currentUserId();
  upsertLocal<ReadingPreferences>('settings', userId, {
    id: PREFERENCES_RECORD_ID,
    updatedAt: Date.now(),
    deleted: false,
    payload: preferences,
  });
  if (userId) {
    void syncDomain<ReadingPreferences>('settings', userId);
  }
}

interface ReadingPreferencesStoreState {
  preferences: ReadingPreferences;
  update: (patch: Partial<ReadingPreferences>) => void;
  applyMode: (mode: ReadingMode) => void;
}

export const useReadingPreferencesStore = create<ReadingPreferencesStoreState>((set, get) => ({
  preferences: loadInitialPreferences(),

  update: (patch) => {
    const next = { ...get().preferences, ...patch };
    set({ preferences: next });
    persist(next);
  },

  applyMode: (mode) => {
    const next = { ...get().preferences, ...READING_MODE_PRESETS[mode], readingMode: mode };
    set({ preferences: next });
    persist(next);
  },
}));

/**
 * Re-hydrate from the server once a guest signs in, merging with whatever
 * local prefs already exist (last-write-wins, per services/syncEngine).
 */
let lastSyncedUserId: string | null = currentUserId();

useAuthStore.subscribe((state) => {
  const userId = state.user?.id ?? null;
  if (userId === lastSyncedUserId) return;
  lastSyncedUserId = userId;
  if (!userId) return;

  void syncDomain<ReadingPreferences>('settings', userId).then((records) => {
    const record = records.find((item) => item.id === PREFERENCES_RECORD_ID);
    if (record) {
      useReadingPreferencesStore.setState({
        preferences: { ...DEFAULT_READING_PREFERENCES, ...record.payload },
      });
    }
  });
});

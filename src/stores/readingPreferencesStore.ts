import { create } from 'zustand';
import { useAuthStore } from './authStore';
import { readLocal, syncDomain, upsertLocal } from 'services/syncEngine';
import { DEFAULT_READING_PREFERENCES } from 'constants/readingPreferences';
import { TRANSLATIONS } from 'constants/translations';
import { READING_MODE_PRESETS } from 'constants/readingModes';
import type { ReadingMode, ReadingPreferences } from 'types/readingPreferences.types';

const PREFERENCES_RECORD_ID = 'reading-preferences';

function currentUserId(): string | null {
  return useAuthStore.getState().user?.id ?? null;
}

function normalizeTranslationIds(ids: unknown): string[] {
  if (!Array.isArray(ids)) return DEFAULT_READING_PREFERENCES.activeTranslationIds;
  const validIds = ids.filter((id): id is string =>
    typeof id === 'string' && TRANSLATIONS.some((translation) => translation.id === id)
  );
  if (validIds.length === 0 || (validIds.length === 1 && validIds[0] === 'azizul-haque')) {
    return DEFAULT_READING_PREFERENCES.activeTranslationIds;
  }
  return validIds.slice(0, 1);
}

function loadInitialPreferences(): ReadingPreferences {
  const [record] = readLocal<ReadingPreferences>('settings', currentUserId());
  if (!record) return DEFAULT_READING_PREFERENCES;

  const activeTranslationIds = normalizeTranslationIds(record.payload.activeTranslationIds);

  return {
    ...DEFAULT_READING_PREFERENCES,
    ...record.payload,
    activeTranslationIds: activeTranslationIds.length > 0
      ? activeTranslationIds
      : DEFAULT_READING_PREFERENCES.activeTranslationIds,
  };
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
 * Re-hydrate from the server once a signed-in user's id becomes known,
 * merging with whatever local prefs already exist (last-write-wins, per
 * services/syncEngine).
 *
 * This isn't just for guests signing in — it's load-bearing on every
 * reload for already-signed-in users too. `loadInitialPreferences()` above
 * runs synchronously at module-eval time, before `useAuthStore`'s
 * `getSession()` call resolves, so `currentUserId()` always reads `null`
 * at that point and the store boots from the *guest* local record (or
 * DEFAULT_READING_PREFERENCES/English if there isn't one) even for a
 * signed-in user whose real preferences (e.g. an Urdu translation) live
 * under their own key. This subscriber is what corrects that once the
 * real user id arrives.
 */
let lastSyncedUserId: string | null = currentUserId();

function resyncPreferencesForUser(userId: string, attempt = 1): void {
  syncDomain<ReadingPreferences>('settings', userId)
    .then((records) => {
      const record = records.find((item) => item.id === PREFERENCES_RECORD_ID);
      if (record) {
        const activeTranslationIds = normalizeTranslationIds(record.payload.activeTranslationIds);
        useReadingPreferencesStore.setState({
          preferences: {
            ...DEFAULT_READING_PREFERENCES,
            ...record.payload,
            activeTranslationIds,
          },
        });
      }
    })
    .catch((error) => {
      // Without this, a single transient failure (network blip, a slow
      // Supabase round-trip) silently leaves the store stuck on whatever
      // loadInitialPreferences() guessed — e.g. the English default —
      // for the rest of the session, which reads as "my Urdu selection
      // randomly switched to English." One retry covers the common
      // transient case; if it still fails we at least log it instead of
      // failing silently.
      if (attempt < 2) {
        resyncPreferencesForUser(userId, attempt + 1);
        return;
      }
      console.warn('Failed to sync reading preferences for the signed-in user; keeping local defaults.', error);
    });
}

useAuthStore.subscribe((state) => {
  const userId = state.user?.id ?? null;
  if (userId === lastSyncedUserId) return;
  lastSyncedUserId = userId;
  if (!userId) return;

  resyncPreferencesForUser(userId);
});

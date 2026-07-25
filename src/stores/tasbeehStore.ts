import { create } from 'zustand';
import { useAuthStore } from './authStore';
import { readLocal, syncDomain, upsertLocal } from 'services/syncEngine';
import { HISTORY_SYNC_DEBOUNCE_MS } from 'constants/tasbeeh';
import type { SyncRecord } from 'types/sync.types';
import type { TasbeehHistoryPayload } from 'types/tasbeeh.types';

function currentUserId(): string | null {
  return useAuthStore.getState().user?.id ?? null;
}

function todayKey(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function historyRecordId(date: string, dhikrKey: string): string {
  return `${date}:${dhikrKey}`;
}

// Taps happen far more often than a remote write should — local writes stay
// instant, but the push to Supabase (services/syncEngine.ts) is debounced so
// a rapid tapping session doesn't fire a network call per tap.
let pushTimer: ReturnType<typeof setTimeout> | null = null;

function schedulePush(): void {
  const userId = currentUserId();
  if (!userId) return;

  if (pushTimer) clearTimeout(pushTimer);
  pushTimer = setTimeout(() => {
    void syncDomain('tasbeehProgress', userId);
  }, HISTORY_SYNC_DEBOUNCE_MS);
}

/** Sends any pending history write immediately — call on page unmount so a debounce window is never lost. */
export function flushTasbeehSync(): void {
  if (pushTimer) {
    clearTimeout(pushTimer);
    pushTimer = null;
  }
  const userId = currentUserId();
  if (userId) void syncDomain('tasbeehProgress', userId);
}

function persistLocal(record: SyncRecord<TasbeehHistoryPayload>): SyncRecord<TasbeehHistoryPayload>[] {
  const next = upsertLocal<TasbeehHistoryPayload>('tasbeehProgress', currentUserId(), record);
  schedulePush();
  return next;
}

interface TasbeehStoreState {
  dailyHistory: SyncRecord<TasbeehHistoryPayload>[];
  tap: (dhikrKey: string, label: string) => void;
  reset: (dhikrKey: string) => void;
}

export const useTasbeehStore = create<TasbeehStoreState>((set, get) => ({
  dailyHistory: readLocal<TasbeehHistoryPayload>('tasbeehProgress', currentUserId()),

  tap: (dhikrKey, label) => {
    const date = todayKey();
    const id = historyRecordId(date, dhikrKey);
    const existing = get().dailyHistory.find((item) => item.id === id && !item.deleted);
    const record: SyncRecord<TasbeehHistoryPayload> = {
      id,
      updatedAt: Date.now(),
      deleted: false,
      payload: { date, dhikrKey, label, count: (existing?.payload.count ?? 0) + 1 },
    };
    set({ dailyHistory: persistLocal(record) });
  },

  reset: (dhikrKey) => {
    const date = todayKey();
    const id = historyRecordId(date, dhikrKey);
    const existing = get().dailyHistory.find((item) => item.id === id);
    const record: SyncRecord<TasbeehHistoryPayload> = {
      id,
      updatedAt: Date.now(),
      deleted: false,
      payload: { date, dhikrKey, label: existing?.payload.label ?? dhikrKey, count: 0 },
    };
    set({ dailyHistory: persistLocal(record) });
  },
}));

// --- pure selectors ---

export function getTodayCount(history: SyncRecord<TasbeehHistoryPayload>[], dhikrKey: string): number {
  const id = historyRecordId(todayKey(), dhikrKey);
  return history.find((item) => item.id === id && !item.deleted)?.payload.count ?? 0;
}

/** Most recent entries first, newest `limit` calendar days across all dhikr types. */
export function getRecentHistory(
  history: SyncRecord<TasbeehHistoryPayload>[],
  limit: number
): SyncRecord<TasbeehHistoryPayload>[] {
  return [...history]
    .filter((item) => !item.deleted && item.payload.count > 0)
    .sort((a, b) => (a.payload.date < b.payload.date ? 1 : a.payload.date > b.payload.date ? -1 : b.updatedAt - a.updatedAt))
    .slice(0, limit);
}

// --- re-hydrate from the server once a guest signs in (mirrors collectionsStore.ts) ---

let lastSyncedUserId: string | null = currentUserId();

useAuthStore.subscribe((state) => {
  const userId = state.user?.id ?? null;
  if (userId === lastSyncedUserId) return;
  lastSyncedUserId = userId;
  if (!userId) return;

  void syncDomain<TasbeehHistoryPayload>('tasbeehProgress', userId).then((dailyHistory) => {
    useTasbeehStore.setState({ dailyHistory });
  });
});

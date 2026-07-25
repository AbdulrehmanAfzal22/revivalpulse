import { create } from 'zustand';
import { useAuthStore } from './authStore';
import { syncDomain } from 'services/syncEngine';
import { SYNC_DOMAINS } from 'constants/sync';
import type { SyncDomain, SyncSnapshot } from 'types/sync.types';

type SnapshotMap = Record<SyncDomain, SyncSnapshot>;

function createInitialSnapshots(): SnapshotMap {
  return SYNC_DOMAINS.reduce((snapshots, domain) => {
    snapshots[domain] = { domain, state: 'idle', lastSyncedAt: null, error: null };
    return snapshots;
  }, {} as SnapshotMap);
}

interface SyncStoreState {
  snapshots: SnapshotMap;
  syncOne: (domain: SyncDomain) => Promise<void>;
  syncAll: () => Promise<void>;
}

export const useSyncStore = create<SyncStoreState>((set, get) => ({
  snapshots: createInitialSnapshots(),

  syncOne: async (domain) => {
    const userId = useAuthStore.getState().user?.id ?? null;

    if (!userId) {
      set((state) => ({
        snapshots: {
          ...state.snapshots,
          [domain]: { domain, state: 'idle', lastSyncedAt: null, error: null },
        },
      }));
      return;
    }

    set((state) => ({
      snapshots: {
        ...state.snapshots,
        [domain]: { ...state.snapshots[domain], state: 'syncing', error: null },
      },
    }));

    try {
      await syncDomain(domain, userId);
      set((state) => ({
        snapshots: {
          ...state.snapshots,
          [domain]: { domain, state: 'synced', lastSyncedAt: Date.now(), error: null },
        },
      }));
    } catch (error) {
      set((state) => ({
        snapshots: {
          ...state.snapshots,
          [domain]: {
            ...state.snapshots[domain],
            state: 'error',
            error: error instanceof Error ? error.message : 'Sync failed.',
          },
        },
      }));
    }
  },

  syncAll: async () => {
    await Promise.all(SYNC_DOMAINS.map((domain) => get().syncOne(domain)));
  },
}));

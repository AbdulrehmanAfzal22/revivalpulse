import { QueryClient } from '@tanstack/react-query';
import { get, set, del } from 'idb-keyval';
import type { Persister, PersistedClient } from '@tanstack/react-query-persist-client';

const INDEXED_DB_CACHE_KEY = 'islamic-web:query-cache';
const ONE_DAY_MS = 1000 * 60 * 60 * 24;

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Quran text/structure is effectively static — don't refetch aggressively.
      staleTime: ONE_DAY_MS,
      gcTime: ONE_DAY_MS * 30,
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

export const indexedDbPersister: Persister = {
  persistClient: async (persistedClient: PersistedClient) => {
    try {
      await set(INDEXED_DB_CACHE_KEY, persistedClient);
    } catch (error) {
      // Persistence is a best-effort optimization (e.g. a value IndexedDB's
      // structured clone can't handle slips through) — it must never crash
      // the app or surface as an uncaught runtime error.
      console.error('Failed to persist query cache to IndexedDB', error);
    }
  },
  restoreClient: async () => {
    return get<PersistedClient>(INDEXED_DB_CACHE_KEY);
  },
  removeClient: async () => {
    await del(INDEXED_DB_CACHE_KEY);
  },
};

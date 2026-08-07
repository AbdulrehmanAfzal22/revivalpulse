/**
 * Minimal IndexedDB-backed zustand storage (Phase 8).
 *
 * The rewards store persists through `persist(createJSONStorage(indexedDbStorage))`
 * so a kid's stars/badges/streak survive reloads and private-browsing-agnostic
 * like localStorage but with a larger, async home. Falls back to in-memory
 * (non-persisting) when IndexedDB is unavailable (tests, some webviews) so the
 * app still works — persistence is progressive enhancement.
 */

export interface PersistedValue {
  state: unknown;
  version?: number;
}

const DB_NAME = 'islamic-web';
const STORE_NAME = 'kv';
const VERSION = 1;

function openDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, VERSION);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

function idbGet(key: string): Promise<unknown> {
  return openDb().then(
    (db) =>
      new Promise((resolve, reject) => {
        const tx = db.transaction(STORE_NAME, 'readonly');
        const get = tx.objectStore(STORE_NAME).get(key);
        get.onsuccess = () => resolve(get.result);
        get.onerror = () => reject(get.error);
        tx.oncomplete = () => db.close();
      }),
  );
}

function idbSet(key: string, value: unknown): Promise<void> {
  return openDb().then(
    (db) =>
      new Promise((resolve, reject) => {
        const tx = db.transaction(STORE_NAME, 'readwrite');
        tx.objectStore(STORE_NAME).put(value, key);
        tx.oncomplete = () => {
          db.close();
          resolve();
        };
        tx.onerror = () => reject(tx.error);
      }),
  );
}

function idbRemove(key: string): Promise<void> {
  return openDb().then(
    (db) =>
      new Promise((resolve, reject) => {
        const tx = db.transaction(STORE_NAME, 'readwrite');
        tx.objectStore(STORE_NAME).delete(key);
        tx.oncomplete = () => {
          db.close();
          resolve();
        };
        tx.onerror = () => reject(tx.error);
      }),
  );
}

/** zustand persist Storage — getItem/setItem/removeItem with JSON envelope. */
export const indexedDbStorage: {
  getItem: (name: string) => Promise<string | null>;
  setItem: (name: string, value: string) => Promise<void>;
  removeItem: (name: string) => Promise<void>;
} = {
  getItem: async (name) => {
    try {
      const row = (await idbGet(name)) as PersistedValue | undefined;
      return row ? JSON.stringify(row.state) : null;
    } catch {
      return null;
    }
  },
  setItem: async (name, value) => {
    const envelope: PersistedValue = { state: JSON.parse(value) };
    try {
      await idbSet(name, envelope);
    } catch {
      // Non-fatal: session-only mode keeps working.
    }
  },
  removeItem: async (name) => {
    try {
      await idbRemove(name);
    } catch {
      // Non-fatal.
    }
  },
};

/** True when IndexedDB is actually available in this environment. */
export function isIndexedDbAvailable(): boolean {
  try {
    return typeof indexedDB !== 'undefined' && indexedDB !== null;
  } catch {
    return false;
  }
}
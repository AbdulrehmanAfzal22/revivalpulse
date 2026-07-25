import { openDB } from 'idb';
import type { DBSchema, IDBPDatabase } from 'idb';

interface AudioCacheSchema extends DBSchema {
  audio: {
    key: string;
    value: { url: string; blob: Blob; cachedAt: number };
    indexes: { cachedAt: number };
  };
}

const DB_NAME = 'islamic-web-audio-cache';
const STORE_NAME = 'audio';
const DB_VERSION = 1;
/** Simple cap on cached word clips — oldest evicted first once exceeded. */
const MAX_ENTRIES = 300;

let dbPromise: Promise<IDBPDatabase<AudioCacheSchema>> | null = null;

function getDb(): Promise<IDBPDatabase<AudioCacheSchema>> {
  if (!dbPromise) {
    dbPromise = openDB<AudioCacheSchema>(DB_NAME, DB_VERSION, {
      upgrade(db) {
        const store = db.createObjectStore(STORE_NAME, { keyPath: 'url' });
        store.createIndex('cachedAt', 'cachedAt');
      },
    });
  }
  return dbPromise;
}

async function evictOldest(db: IDBPDatabase<AudioCacheSchema>): Promise<void> {
  const overflow = (await db.count(STORE_NAME)) - MAX_ENTRIES;
  if (overflow <= 0) return;

  const tx = db.transaction(STORE_NAME, 'readwrite');
  let cursor = await tx.store.index('cachedAt').openCursor();
  let deleted = 0;
  while (cursor && deleted < overflow) {
    await cursor.delete();
    deleted += 1;
    cursor = await cursor.continue();
  }
  await tx.done;
}

/** Read-only introspection for the Developer Mode panel — never used by the playback path itself. */
export async function getAudioCacheStats(): Promise<{ count: number; maxEntries: number }> {
  const db = await getDb();
  const count = await db.count(STORE_NAME);
  return { count, maxEntries: MAX_ENTRIES };
}

/** Returns a playable object URL, fetching once and reusing the cached blob on repeat calls. */
export async function getOrFetchAudio(url: string): Promise<string> {
  const db = await getDb();
  const existing = await db.get(STORE_NAME, url);
  if (existing) {
    return URL.createObjectURL(existing.blob);
  }

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch audio (status ${response.status})`);
  }
  const blob = await response.blob();

  await db.put(STORE_NAME, { url, blob, cachedAt: Date.now() });
  await evictOldest(db);

  return URL.createObjectURL(blob);
}

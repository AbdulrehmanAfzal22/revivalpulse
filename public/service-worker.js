/**
 * Hand-rolled (no Workbox dependency in this project) — deliberately scoped
 * to same-origin requests only, i.e. the app shell (JS/CSS/HTML/manifest/
 * icon). It is NOT what makes Quran text, hadith text, or audio available
 * offline — that's already handled by the data layer independently of any
 * service worker:
 *   - Quran/hadith/dua/tafsir data: TanStack Query persisted to IndexedDB
 *     (src/services/queryClient.ts)
 *   - Word-by-word audio: src/services/audioCache.ts (IndexedDB, capped/evicted)
 *   - Downloaded surah audio: src/features/quranReader/services/surahAudioCache.ts
 *     (IndexedDB, explicit downloads)
 * All of those work with zero service worker involvement. This file's only
 * job is making the page itself loadable while offline — without it, a
 * fully offline reload would just fail before any of that data-layer
 * caching ever gets a chance to run.
 */

const CACHE_NAME = 'islamic-web-shell-v1';
const OFFLINE_FALLBACK_URL = '/index.html';

self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  if (request.method !== 'GET') return;

  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return; // cross-origin (every API this app calls) — leave untouched

  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request).catch(() => caches.match(OFFLINE_FALLBACK_URL).then((cached) => cached || caches.match(request)))
    );
    return;
  }

  // Stale-while-revalidate: serve the cached asset instantly if we have one, refresh it in the background.
  event.respondWith(
    caches.open(CACHE_NAME).then((cache) =>
      cache.match(request).then((cachedResponse) => {
        const networkFetch = fetch(request)
          .then((networkResponse) => {
            if (networkResponse.ok) cache.put(request, networkResponse.clone());
            return networkResponse;
          })
          .catch(() => cachedResponse);
        return cachedResponse || networkFetch;
      })
    )
  );
});

/**
 * Background Sync for the global tasbeeh counter (Chromium browsers only —
 * feature-detected client-side in globalCounterQueue.ts, which always keeps
 * its own online-event fallback too). The client can't hand this worker a
 * live Supabase SDK instance, so this re-implements the one RPC call it
 * needs as a plain fetch — Supabase's REST API is just HTTP, no SDK
 * required for a single RPC POST.
 */

const CONFIG_CACHE_NAME = 'islamic-web-sync-config-v1';
const CONFIG_CACHE_KEY = '/__sync-config__';
const IDB_QUEUE_DB = 'keyval-store';
const IDB_QUEUE_STORE = 'keyval';
const IDB_QUEUE_KEY = 'tasbeeh-global-queue';

self.addEventListener('message', (event) => {
  if (!event.data || event.data.type !== 'INIT_SYNC_CONFIG') return;
  const { supabaseUrl, supabaseAnonKey } = event.data;
  event.waitUntil(
    caches
      .open(CONFIG_CACHE_NAME)
      .then((cache) => cache.put(CONFIG_CACHE_KEY, new Response(JSON.stringify({ supabaseUrl, supabaseAnonKey }))))
  );
});

async function readSyncConfig() {
  const cache = await caches.open(CONFIG_CACHE_NAME);
  const response = await cache.match(CONFIG_CACHE_KEY);
  if (!response) return null;
  const config = await response.json();
  return config.supabaseUrl && config.supabaseAnonKey ? config : null;
}

/** Reads the queue idb-keyval mirror (src/features/tasbeeh/services/globalCounterQueue.ts) directly via IndexedDB — idb-keyval isn't importable into an unbundled public/ script, so this matches its on-disk shape by hand instead. Best-effort: any failure here just means this sync attempt finds nothing to flush. */
function readQueueFromIndexedDb() {
  return new Promise((resolve) => {
    const openRequest = indexedDB.open(IDB_QUEUE_DB);
    openRequest.onerror = () => resolve(null);
    openRequest.onupgradeneeded = () => {
      // Nothing written yet from this origin — nothing to flush.
      openRequest.result.createObjectStore(IDB_QUEUE_STORE);
    };
    openRequest.onsuccess = () => {
      const db = openRequest.result;
      if (!db.objectStoreNames.contains(IDB_QUEUE_STORE)) {
        resolve(null);
        return;
      }
      const getRequest = db.transaction(IDB_QUEUE_STORE, 'readonly').objectStore(IDB_QUEUE_STORE).get(IDB_QUEUE_KEY);
      getRequest.onsuccess = () => resolve(getRequest.result || null);
      getRequest.onerror = () => resolve(null);
    };
  });
}

/** Writes back to the same idb-keyval-shaped record — used to clear flushed
 *  amounts so a tab opened later doesn't find stale counts and re-send them. */
function writeQueueToIndexedDb(value) {
  return new Promise((resolve) => {
    const openRequest = indexedDB.open(IDB_QUEUE_DB);
    openRequest.onerror = () => resolve(false);
    openRequest.onupgradeneeded = () => {
      openRequest.result.createObjectStore(IDB_QUEUE_STORE);
    };
    openRequest.onsuccess = () => {
      const db = openRequest.result;
      const putRequest = db.transaction(IDB_QUEUE_STORE, 'readwrite').objectStore(IDB_QUEUE_STORE).put(value, IDB_QUEUE_KEY);
      putRequest.onsuccess = () => resolve(true);
      putRequest.onerror = () => resolve(false);
    };
  });
}

async function callIncrementRpc(config, dhikrKey, sessionId, amount) {
  const response = await fetch(`${config.supabaseUrl}/rest/v1/rpc/increment_dhikr_count`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      apikey: config.supabaseAnonKey,
      Authorization: `Bearer ${config.supabaseAnonKey}`,
    },
    body: JSON.stringify({ p_dhikr_key: dhikrKey, p_session_id: sessionId, p_amount: amount }),
  });
  if (!response.ok) throw new Error(`increment_dhikr_count failed: ${response.status}`);
}

async function flushTasbeehQueueInBackground() {
  const config = await readSyncConfig();
  if (!config) return;

  const stored = await readQueueFromIndexedDb();
  if (!stored || !stored.pending || !stored.sessionId) return;

  // Zeroed out (not deleted) as each call succeeds, and written back to IndexedDB
  // immediately — critical so that if a tab opens mid-loop (or this worker is killed
  // partway through), the reconciliation check in globalCounterQueue.ts sees exactly
  // what's genuinely still unsent, never re-sending amounts this worker already flushed.
  const remaining = { ...stored.pending };
  const entries = Object.entries(stored.pending).filter(([, amount]) => amount > 0);

  for (const [dhikrKey, amount] of entries) {
    // Sequential on purpose — same per-session rate limit the foreground queue respects.
    // eslint-disable-next-line no-await-in-loop
    await callIncrementRpc(config, dhikrKey, stored.sessionId, amount);
    remaining[dhikrKey] = 0;
    // eslint-disable-next-line no-await-in-loop
    await writeQueueToIndexedDb({ pending: remaining, sessionId: stored.sessionId });
  }
}

self.addEventListener('sync', (event) => {
  if (event.tag === 'flush-tasbeeh-queue') {
    event.waitUntil(flushTasbeehQueueInBackground());
  }
});

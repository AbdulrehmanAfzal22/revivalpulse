import { get as idbGet, set as idbSet } from 'idb-keyval';
import { incrementGlobalCount } from 'api/realtime/realtimeClient';
import { getOrCreateSessionId } from 'services/anonymousSession';
import { isOnline } from 'services/connectivity';
import { GLOBAL_QUEUE_DEBOUNCE_MS, GLOBAL_QUEUE_MAX_WAIT_MS } from 'constants/tasbeeh';

const QUEUE_STORAGE_KEY = 'islamic-web:tasbeeh-global-queue';

/** Mirrored into IndexedDB (not just localStorage) under this key — a service
 *  worker can't read localStorage, only IndexedDB, and needs this to flush
 *  the queue during a real Background Sync event. See registerBackgroundSync()
 *  below and public/service-worker.js. */
const IDB_QUEUE_KEY = 'tasbeeh-global-queue';
const BACKGROUND_SYNC_TAG = 'flush-tasbeeh-queue';

/**
 * Batches taps for the global counter instead of hitting the RPC on every
 * tap: cheaper on the server, comfortably clears the per-session rate limit
 * (0003_dhikr_global_counter.sql), and doubles as the offline queue — a tap
 * made while offline just sits in `pending` (persisted to localStorage)
 * until the next successful flush, triggered by reconnect.
 *
 * Module-level singleton (not a hook) so taps keep accumulating correctly
 * even if the component that reads them re-renders or briefly unmounts.
 */

let pending: Record<string, number> = loadPending();
let debounceTimer: ReturnType<typeof setTimeout> | null = null;
let maxWaitTimer: ReturnType<typeof setTimeout> | null = null;
let flushing = false;
const listeners = new Set<() => void>();

function loadPending(): Record<string, number> {
  try {
    const raw = window.localStorage.getItem(QUEUE_STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Record<string, number>) : {};
  } catch {
    return {};
  }
}

function persistPending(): void {
  window.localStorage.setItem(QUEUE_STORAGE_KEY, JSON.stringify(pending));
  // Best-effort mirror — the localStorage write above is the source of truth for
  // this tab; this copy only matters if a background sync event reads it later.
  void idbSet(IDB_QUEUE_KEY, { pending, sessionId: getOrCreateSessionId() }).catch(() => {});
}

/** Registers a real Background Sync event so the queue can flush even if this tab closes before reconnecting — Chromium browsers only (feature-detected), and only ever a supplement to the online-event fallback below, never a replacement for it. */
function registerBackgroundSync(): void {
  if (!('serviceWorker' in navigator) || !('SyncManager' in window)) return;
  navigator.serviceWorker.ready
    .then((registration) => (registration as ServiceWorkerRegistration & { sync: { register: (tag: string) => Promise<void> } }).sync.register(BACKGROUND_SYNC_TAG))
    .catch(() => {});
}

function notify(): void {
  listeners.forEach((listener) => listener());
}

function clearTimers(): void {
  if (debounceTimer) clearTimeout(debounceTimer);
  if (maxWaitTimer) clearTimeout(maxWaitTimer);
  debounceTimer = null;
  maxWaitTimer = null;
}

function scheduleFlush(): void {
  if (debounceTimer) clearTimeout(debounceTimer);
  debounceTimer = setTimeout(() => void flushQueue(), GLOBAL_QUEUE_DEBOUNCE_MS);

  if (!maxWaitTimer) {
    maxWaitTimer = setTimeout(() => void flushQueue(), GLOBAL_QUEUE_MAX_WAIT_MS);
  }
}

export function queueGlobalTap(dhikrKey: string, amount = 1): void {
  pending[dhikrKey] = (pending[dhikrKey] ?? 0) + amount;
  persistPending();
  notify();
  if (isOnline()) {
    scheduleFlush();
  } else {
    // No point debounce-scheduling a flush we know will fail — hand off to Background
    // Sync (or, lacking that, the 'online' listener at the bottom of this file).
    registerBackgroundSync();
  }
}

export function hasPendingGlobalTaps(): boolean {
  return Object.values(pending).some((amount) => amount > 0);
}

export function subscribeToQueue(listener: () => void): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

/** Sends whatever is currently queued. Safe to call repeatedly — a no-op while empty or already in flight. */
export async function flushQueue(): Promise<void> {
  clearTimers();
  if (flushing || !isOnline()) return;

  const entries = Object.entries(pending).filter(([, amount]) => amount > 0);
  if (entries.length === 0) return;

  flushing = true;
  const sessionId = getOrCreateSessionId();

  try {
    for (const [dhikrKey, amount] of entries) {
      // eslint-disable-next-line no-await-in-loop -- each call must respect the server's per-session rate limit in order
      await incrementGlobalCount(dhikrKey, sessionId, amount);
      pending[dhikrKey] = Math.max(0, (pending[dhikrKey] ?? 0) - amount);
      persistPending();
      notify();
    }
  } catch {
    // Offline, unconfigured, or rate-limited — leave the remainder queued and retry on the next trigger.
    if (hasPendingGlobalTaps()) scheduleFlush();
  } finally {
    flushing = false;
  }
}

window.addEventListener('online', () => void flushQueue());

/**
 * Reconciles with the IndexedDB mirror once on load: if a Background Sync
 * event flushed some or all of this queue while no tab was open, the
 * service worker zeroed those amounts out in IndexedDB (public/service-worker.js)
 * but had no way to touch this tab's localStorage — without this, a later
 * tab open would find the old, already-sent amounts in localStorage and
 * queue them up to be sent again. Per key, IndexedDB's value is only ever
 * lower than or equal to localStorage's (writes keep them equal; only the
 * service worker's flush ever decreases the IndexedDB side), so taking the
 * minimum of the two is always the correct reconciliation.
 */
void idbGet<{ pending: Record<string, number>; sessionId: string }>(IDB_QUEUE_KEY).then((stored) => {
  if (!stored?.pending) return;

  let changed = false;
  for (const [dhikrKey, idbAmount] of Object.entries(stored.pending)) {
    const localAmount = pending[dhikrKey] ?? 0;
    if (idbAmount < localAmount) {
      pending[dhikrKey] = idbAmount;
      changed = true;
    }
  }

  if (changed) {
    window.localStorage.setItem(QUEUE_STORAGE_KEY, JSON.stringify(pending));
    notify();
  }
});

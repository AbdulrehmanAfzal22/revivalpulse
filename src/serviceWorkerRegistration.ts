/**
 * The service worker's background-sync handler (public/service-worker.js)
 * needs the Supabase URL/anon key to flush the tasbeeh queue itself, but a
 * static public/ file can't read process.env (that's build-time injection
 * for bundled src/ code only) — so the running page hands them over once,
 * here, right after registration. Harmless to send even when Supabase isn't
 * configured (both are undefined; the SW just won't be able to sync, same
 * as the rest of the app treating sync as unconfigured).
 */
function sendSyncConfig(registration: ServiceWorkerRegistration): void {
  registration.active?.postMessage({
    type: 'INIT_SYNC_CONFIG',
    supabaseUrl: process.env.REACT_APP_SUPABASE_URL ?? null,
    supabaseAnonKey: process.env.REACT_APP_SUPABASE_ANON_KEY ?? null,
  });
}

type UpdateListener = () => void;
let updateListener: UpdateListener | null = null;

/**
 * Subscribe to "a new build has taken over this page" events. Fires once per
 * deployment the browser applies mid-session (the new worker calls
 * skipWaiting + clients.claim), so the app can offer a one-tap refresh
 * instead of letting users keep running the old bundle unknowingly.
 * Returns an unsubscribe function.
 */
export function subscribeToServiceWorkerUpdates(listener: UpdateListener): () => void {
  updateListener = listener;
  return () => {
    if (updateListener === listener) updateListener = null;
  };
}

export function register(): void {
  if (!('serviceWorker' in navigator)) return;

  // Production only: in dev, CRA serves unbundled modules whose requests a
  // stale-while-revalidate worker can fight (and redirect quirks made the
  // deployed false alarm next to impossible to reproduce locally, too).
  if (process.env.NODE_ENV !== 'production') return;

  // controllerchange fires when a NEW worker takes control — which on a
  // first-ever install is just the initial takeover (no controller existed
  // yet), not the arrival of a newer build. That flag tells them apart.
  const hadController = Boolean(navigator.serviceWorker.controller);
  navigator.serviceWorker.addEventListener('controllerchange', () => {
    if (hadController) updateListener?.();
  });

  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register(`${process.env.PUBLIC_URL}/service-worker.js`)
      .then((registration) => {
        sendSyncConfig(registration);
        registration.addEventListener('updatefound', () => {
          const installing = registration.installing;
          installing?.addEventListener('statechange', () => {
            if (installing.state === 'activated') sendSyncConfig(registration);
          });
        });
      })
      .catch((error: unknown) => {
        // eslint-disable-next-line no-console -- registration failures are worth surfacing, no error-reporting service exists here
        console.error('Service worker registration failed:', error);
      });
  });
}
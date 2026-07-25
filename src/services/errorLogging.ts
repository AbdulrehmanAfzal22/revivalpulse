import { useDevModeStore } from 'stores/devModeStore';

let installed = false;

/** Called once at app startup (App.tsx) — feeds the Developer Mode error log, nothing else observes this. */
export function installGlobalErrorLogging(): void {
  if (installed) return;
  installed = true;

  window.addEventListener('error', (event: ErrorEvent) => {
    useDevModeStore.getState().logError({
      message: event.error instanceof Error ? event.error.message : event.message,
      stack: event.error instanceof Error ? event.error.stack : undefined,
      source: 'window.onerror',
    });
  });

  window.addEventListener('unhandledrejection', (event: PromiseRejectionEvent) => {
    const reason: unknown = event.reason;
    useDevModeStore.getState().logError({
      message: reason instanceof Error ? reason.message : String(reason),
      stack: reason instanceof Error ? reason.stack : undefined,
      source: 'unhandledrejection',
    });
  });
}

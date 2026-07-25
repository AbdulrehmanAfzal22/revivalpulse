import { useDevModeStore } from 'stores/devModeStore';

/** navigator.onLine, unless Developer Mode's "force offline" flag is on — the one place both should be checked together. */
export function isOnline(): boolean {
  if (useDevModeStore.getState().flags.forceOffline) return false;
  return navigator.onLine;
}

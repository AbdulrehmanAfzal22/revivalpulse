import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { PRAYERS } from 'constants/prayerNames';
import type { PrayerName } from 'types/prayerTimes.types';

interface NotificationPreferencesState {
  /** Off by default — enabling triggers a real browser permission prompt, never requested silently. */
  enabled: boolean;
  enabledPrayers: PrayerName[];
  setEnabled: (enabled: boolean) => void;
  togglePrayer: (prayer: PrayerName) => void;
}

/** Local-only — notification permission is inherently per-browser/per-device, not something to sync. */
export const useNotificationPreferencesStore = create<NotificationPreferencesState>()(
  persist(
    (set, get) => ({
      enabled: false,
      enabledPrayers: [...PRAYERS],

      setEnabled: (enabled) => set({ enabled }),
      togglePrayer: (prayer) => {
        const current = get().enabledPrayers;
        const next = current.includes(prayer) ? current.filter((item) => item !== prayer) : [...current, prayer];
        set({ enabledPrayers: next });
      },
    }),
    { name: 'islamic-web:notification-preferences' }
  )
);

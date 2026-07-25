import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { DEFAULT_DHIKR_ID, DEFAULT_TARGET } from 'constants/tasbeeh';

interface TasbeehPreferencesState {
  activeDhikrKey: string;
  target: number;
  vibrationEnabled: boolean;
  setActiveDhikrKey: (key: string) => void;
  setTarget: (target: number) => void;
  setVibrationEnabled: (enabled: boolean) => void;
}

/**
 * Local-only (zustand persist), same reasoning as prayerTimesPreferencesStore:
 * which zikr you're tapping right now and your target are per-device session
 * choices, not something that should follow you to another device. The
 * *history* of counts (stores/tasbeehStore.ts) is what's cross-device synced.
 */
export const useTasbeehPreferencesStore = create<TasbeehPreferencesState>()(
  persist(
    (set) => ({
      activeDhikrKey: DEFAULT_DHIKR_ID,
      target: DEFAULT_TARGET,
      vibrationEnabled: true,

      setActiveDhikrKey: (key) => set({ activeDhikrKey: key }),
      setTarget: (target) => set({ target: Math.max(1, Math.round(target)) }),
      setVibrationEnabled: (enabled) => set({ vibrationEnabled: enabled }),
    }),
    {
      name: 'islamic-web:tasbeeh-preferences',
      // Bumped so `migrate` actually runs once for devices with data
      // persisted under the old (unversioned = version 0) shape.
      version: 1,
      // The custom-dhikr feature (and its generated `custom-<slug>-<ts>` keys)
      // was removed; any device with one of those still persisted as
      // activeDhikrKey needs to fall back to a real preset, since it no
      // longer resolves to anything in DHIKR_PRESETS.
      migrate: (persisted) => {
        const state = persisted as TasbeehPreferencesState;
        if (typeof state?.activeDhikrKey === 'string' && state.activeDhikrKey.startsWith('custom-')) {
          return { ...state, activeDhikrKey: DEFAULT_DHIKR_ID };
        }
        return state;
      },
    }
  )
);

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { DEFAULT_CALCULATION_METHOD_ID } from 'constants/calculationMethods';
import type { PrayerLocation } from 'types/prayerTimes.types';

interface PrayerTimesPreferencesState {
  calculationMethodId: number;
  /** Set only when the user picks a city/coordinates manually; null means "use device location". */
  manualLocation: PrayerLocation | null;
  setCalculationMethodId: (id: number) => void;
  setManualLocation: (location: PrayerLocation | null) => void;
}

/**
 * Local-only (plain localStorage via zustand persist), not routed through
 * Phase 3's cross-device sync engine — location is inherently
 * device/session-specific (where you are right now), not something that
 * should follow you to another device the way reading preferences do.
 */
export const usePrayerTimesPreferencesStore = create<PrayerTimesPreferencesState>()(
  persist(
    (set) => ({
      calculationMethodId: DEFAULT_CALCULATION_METHOD_ID,
      manualLocation: null,
      setCalculationMethodId: (id) => set({ calculationMethodId: id }),
      setManualLocation: (location) => set({ manualLocation: location }),
    }),
    { name: 'islamic-web:prayer-times-preferences' }
  )
);

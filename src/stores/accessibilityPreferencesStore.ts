import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const TEXT_SCALE_STEPS = [0.875, 1, 1.125, 1.25, 1.5] as const;
export const DEFAULT_TEXT_SCALE = 1;

interface AccessibilityPreferencesState {
  highContrast: boolean;
  textScale: number;
  setHighContrast: (enabled: boolean) => void;
  setTextScale: (scale: number) => void;
}

/** Local-only, same reasoning as every other device-local preference store — display accommodations are per-device, not something to carry across a shared/family device. */
export const useAccessibilityPreferencesStore = create<AccessibilityPreferencesState>()(
  persist(
    (set) => ({
      highContrast: false,
      textScale: DEFAULT_TEXT_SCALE,
      setHighContrast: (enabled) => set({ highContrast: enabled }),
      setTextScale: (scale) => set({ textScale: scale }),
    }),
    { name: 'islamic-web:accessibility-preferences' }
  )
);

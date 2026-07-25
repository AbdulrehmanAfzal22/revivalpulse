import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const DEFAULT_DAILY_GOAL = 3;

interface KidsPreferencesState {
  dailyGoalTarget: number;
  /**
   * Off by default. This build ships no nasheed audio at all — turning this
   * on doesn't unlock anything, it only reflects that licensed nasheed audio
   * would need per-track licensing this project doesn't have. See the toggle
   * itself (features/kids/components/NasheedToggle.tsx) for the user-facing note.
   */
  nasheedsEnabled: boolean;
  setDailyGoalTarget: (target: number) => void;
  setNasheedsEnabled: (enabled: boolean) => void;
}

/** Local-only, same reasoning as prayerTimesPreferencesStore/tasbeehPreferencesStore. */
export const useKidsPreferencesStore = create<KidsPreferencesState>()(
  persist(
    (set) => ({
      dailyGoalTarget: DEFAULT_DAILY_GOAL,
      nasheedsEnabled: false,
      setDailyGoalTarget: (target) => set({ dailyGoalTarget: Math.max(1, Math.round(target)) }),
      setNasheedsEnabled: (enabled) => set({ nasheedsEnabled: enabled }),
    }),
    { name: 'islamic-web:kids-preferences' }
  )
);

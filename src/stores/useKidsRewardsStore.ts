import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { useKidsProgressStore, getEarnedBadgeIds } from 'stores/kidsProgressStore';
import { indexedDbStorage } from 'services/indexedDbStorage';
import type { BadgeId } from 'types/kids.types';

/**
 * Rewards & progress (Phase 8) — stars, badges, streak.
 *
 * - Zustand, persisted to IndexedDB (services/indexedDbStorage.ts). Hydration
 *   is async, so a freshly-loaded page briefly shows the initial (0) state
 *   before the stored values arrive — acceptable for a kids app.
 * - POINTS: fixed values for now (tune later) —
 *       +10 stars per CORRECT quiz answer,
 *       +50 stars per completed mini game.
 * - Streak = consecutive calendar days (ending today or yesterday) on which
 *   the child earned any reward.
 * - Badges: the single source of truth stays kidsProgressStore (it evaluates
 *   all badge rules); this store mirrors the earned ids into its own persisted
 *   snapshot for the dashboard + badge-unlock modal, re-reconciling on every
 *   award so the two can never drift.
 */
export const STARS_PER_CORRECT_ANSWER = 10;
export const STARS_PER_GAME_COMPLETION = 50;

export interface KidsRewardsState {
  stars: number;
  daysPlayed: string[];
  unlockedBadges: BadgeId[];
  gamesCompleted: Record<string, number>;

  awardStars: (points: number) => void;
  recordQuizAnswer: (correct: boolean) => void;
  recordGameCompleted: (gameId: string) => void;
  reconcileBadges: () => void;
}

function dateKey(date: Date = new Date()): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}

/** Consecutive days ending today or yesterday. */
export function computeStreak(daysPlayed: string[]): number {
  if (daysPlayed.length === 0) return 0;
  const days = new Set(daysPlayed);
  const cursor = new Date();
  if (!days.has(dateKey(cursor))) {
    cursor.setDate(cursor.getDate() - 1);
    if (!days.has(dateKey(cursor))) return 0;
  }
  let streak = 0;
  while (days.has(dateKey(cursor))) {
    streak += 1;
    cursor.setDate(cursor.getDate() - 1);
  }
  return streak;
}

export const useKidsRewardsStore = create<KidsRewardsState>()(
  persist(
    (set, get) => ({
      stars: 0,
      daysPlayed: [],
      unlockedBadges: [],
      gamesCompleted: {},

      awardStars: (points) => {
        const today = dateKey();
        const daysPlayed = get().daysPlayed.includes(today)
          ? get().daysPlayed
          : [...get().daysPlayed, today];
        set({ stars: get().stars + points, daysPlayed });
        get().reconcileBadges();
      },

      recordQuizAnswer: (correct) => {
        if (correct) get().awardStars(STARS_PER_CORRECT_ANSWER);
      },

      recordGameCompleted: (gameId) => {
        get().awardStars(STARS_PER_GAME_COMPLETION);
        set({
          gamesCompleted: {
            ...get().gamesCompleted,
            [gameId]: (get().gamesCompleted[gameId] ?? 0) + 1,
          },
        });
        get().reconcileBadges();
      },

      reconcileBadges: () => {
        const earned = getEarnedBadgeIds(useKidsProgressStore.getState().records);
        const merged = Array.from(new Set([...get().unlockedBadges, ...earned])).sort();
        const current = Array.from(new Set(get().unlockedBadges)).sort();
        if (merged.join(',') !== current.join(',')) {
          set({ unlockedBadges: merged });
        }
      },
    }),
    {
      name: 'kids-rewards',
      storage: createJSONStorage(() => indexedDbStorage),
      partialize: (state) => ({
        stars: state.stars,
        daysPlayed: state.daysPlayed,
        unlockedBadges: state.unlockedBadges,
        gamesCompleted: state.gamesCompleted,
      }),
    }
  )
);

// Keep the badge snapshot in sync with progress records at startup.
useKidsRewardsStore.getState().reconcileBadges();

import { create } from 'zustand';
import {
  fetchAllTimeTotals,
  fetchMyContribution,
  fetchTotalsSince,
  isGlobalCounterAvailable,
  subscribeToGlobalCounts,
} from 'api/realtime/realtimeClient';
import { queueGlobalTap, subscribeToQueue, hasPendingGlobalTaps } from 'features/tasbeeh/services/globalCounterQueue';
import { getOrCreateSessionId } from 'services/anonymousSession';
import type { GlobalConnectionStatus, GlobalTimeRange } from 'types/tasbeeh.types';

/** Rolling windows relative to now, not calendar-aligned buckets — there's no
 *  single "local time" for a counter aggregating every visitor worldwide. */
function rangeSince(range: GlobalTimeRange): Date | null {
  const now = Date.now();
  switch (range) {
    case 'today':
      return new Date(now - 24 * 60 * 60 * 1000);
    case 'week':
      return new Date(now - 7 * 24 * 60 * 60 * 1000);
    case 'month':
      return new Date(now - 30 * 24 * 60 * 60 * 1000);
    case 'allTime':
      return null;
  }
}

interface GlobalCounterState {
  isAvailable: boolean;
  connectionStatus: GlobalConnectionStatus;
  selectedRange: GlobalTimeRange;
  /** Live, realtime-backed all-time total per dhikr. */
  allTimeTotals: Record<string, number>;
  /** Total per dhikr for `selectedRange`; equals allTimeTotals when the range is 'allTime'. */
  rangeTotals: Record<string, number>;
  myContribution: Record<string, number>;
  hasPendingTaps: boolean;
  isLoadingRange: boolean;

  start: () => void;
  stop: () => void;
  setRange: (range: GlobalTimeRange) => void;
  tap: (dhikrKey: string) => void;
}

let stopRealtime: (() => void) | null = null;
let stopQueueListener: (() => void) | null = null;

export const useGlobalCounterStore = create<GlobalCounterState>((set, get) => ({
  isAvailable: isGlobalCounterAvailable(),
  connectionStatus: isGlobalCounterAvailable() ? 'connecting' : 'unavailable',
  selectedRange: 'today',
  allTimeTotals: {},
  rangeTotals: {},
  myContribution: {},
  hasPendingTaps: hasPendingGlobalTaps(),
  isLoadingRange: false,

  start: () => {
    if (!get().isAvailable) return;

    stopRealtime?.();
    stopRealtime = subscribeToGlobalCounts(
      (row) => {
        set((state) => {
          const nextAllTime = { ...state.allTimeTotals, [row.dhikrKey]: row.count };
          const nextRange =
            state.selectedRange === 'allTime'
              ? nextAllTime
              : { ...state.rangeTotals, [row.dhikrKey]: row.count };
          return { allTimeTotals: nextAllTime, rangeTotals: state.selectedRange === 'allTime' ? nextRange : state.rangeTotals };
        });
      },
      (status) => set({ connectionStatus: status })
    );

    stopQueueListener?.();
    stopQueueListener = subscribeToQueue(() => set({ hasPendingTaps: hasPendingGlobalTaps() }));

    void fetchAllTimeTotals().then((totals) => {
      const map = Object.fromEntries(totals.map((t) => [t.dhikrKey, t.count]));
      set((state) => ({
        allTimeTotals: map,
        rangeTotals: state.selectedRange === 'allTime' ? map : state.rangeTotals,
      }));
    });

    void fetchMyContribution(getOrCreateSessionId()).then((totals) => {
      set({ myContribution: Object.fromEntries(totals.map((t) => [t.dhikrKey, t.count])) });
    });

    void get().setRange(get().selectedRange);
  },

  stop: () => {
    stopRealtime?.();
    stopRealtime = null;
    stopQueueListener?.();
    stopQueueListener = null;
  },

  setRange: (range) => {
    set({ selectedRange: range });
    if (!get().isAvailable) return;

    if (range === 'allTime') {
      set({ rangeTotals: get().allTimeTotals });
      return;
    }

    const since = rangeSince(range);
    if (!since) return;

    set({ isLoadingRange: true });
    void fetchTotalsSince(since)
      .then((totals) => {
        if (get().selectedRange !== range) return;
        set({ rangeTotals: Object.fromEntries(totals.map((t) => [t.dhikrKey, t.count])) });
      })
      .finally(() => set({ isLoadingRange: false }));
  },

  tap: (dhikrKey) => {
    if (!get().isAvailable) return;

    set((state) => ({
      allTimeTotals: { ...state.allTimeTotals, [dhikrKey]: (state.allTimeTotals[dhikrKey] ?? 0) + 1 },
      rangeTotals: { ...state.rangeTotals, [dhikrKey]: (state.rangeTotals[dhikrKey] ?? 0) + 1 },
      myContribution: { ...state.myContribution, [dhikrKey]: (state.myContribution[dhikrKey] ?? 0) + 1 },
    }));
    queueGlobalTap(dhikrKey, 1);
  },
}));

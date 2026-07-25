import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface ErrorLogEntry {
  id: string;
  message: string;
  stack?: string;
  source: 'window.onerror' | 'unhandledrejection' | 'ErrorBoundary';
  timestamp: number;
}

export interface DevFeatureFlags {
  /** Makes the app behave as if navigator.onLine were false, regardless of real connectivity — for testing offline UI paths. */
  forceOffline: boolean;
  /** Forces RTL layout regardless of the selected language — for visual RTL testing without switching content language. */
  forceRtl: boolean;
  /** A couple of API clients return canned fixture data instead of hitting the network when this is on — see features/devMode/services/mockData.ts. */
  mockDataMode: boolean;
}

const MAX_ERROR_LOG_ENTRIES = 50;

export interface WebVitalMetric {
  name: string;
  value: number;
  id: string;
}

interface DevModeState {
  errorLog: ErrorLogEntry[];
  flags: DevFeatureFlags;
  webVitals: Record<string, WebVitalMetric>;
  logError: (entry: Omit<ErrorLogEntry, 'id' | 'timestamp'>) => void;
  clearErrorLog: () => void;
  setFlag: <K extends keyof DevFeatureFlags>(key: K, value: DevFeatureFlags[K]) => void;
  recordWebVital: (metric: WebVitalMetric) => void;
}

export const useDevModeStore = create<DevModeState>()(
  persist(
    (set, get) => ({
      errorLog: [],
      flags: {
        forceOffline: false,
        forceRtl: false,
        mockDataMode: false,
      },
      webVitals: {},

      logError: (entry) => {
        const next: ErrorLogEntry = { ...entry, id: crypto.randomUUID(), timestamp: Date.now() };
        set({ errorLog: [next, ...get().errorLog].slice(0, MAX_ERROR_LOG_ENTRIES) });
      },
      clearErrorLog: () => set({ errorLog: [] }),
      setFlag: (key, value) => set({ flags: { ...get().flags, [key]: value } }),
      recordWebVital: (metric) => set({ webVitals: { ...get().webVitals, [metric.name]: metric } }),
    }),
    {
      name: 'islamic-web:dev-mode',
      // webVitals describes the page load that just happened — stale and meaningless after a reload.
      partialize: (state) => ({ errorLog: state.errorLog, flags: state.flags }),
    }
  )
);

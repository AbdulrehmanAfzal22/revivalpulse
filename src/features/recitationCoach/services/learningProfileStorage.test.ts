import {
  MAX_HISTORY_ENTRIES,
  appendSessionToStore,
  clearLearningStore,
  createEmptyStore,
  loadLearningStore,
  saveLearningStore,
} from './learningProfileStorage';
import type { StoredSessionSummary } from './learningProfileEngine';
import type { ScoreDimension } from './scoringEngine';

function dimensionScores(): Record<ScoreDimension, number> {
  return { wordAccuracy: 80, pronunciation: 80, tajweed: 80, fluency: 80, recovery: 80, consistency: 80, confidence: 80 };
}

function summary(overrides: Partial<StoredSessionSummary> = {}): StoredSessionSummary {
  return {
    id: 's1',
    dateIso: '2026-01-01T00:00:00.000Z',
    surahId: 1,
    ayahRange: { start: 1, end: 7 },
    durationMs: 60000,
    overallScore: 80,
    overallConfidence: 80,
    dimensionScores: dimensionScores(),
    mistakeTypeBreakdown: {},
    weakestTajweedRules: [],
    mostDifficultWords: [],
    weakestAyahs: [],
    recoveryRate: 80,
    longAyahFluencyDropDetected: false,
    hesitationAfterMistakeCount: 0,
    coachingEventCounts: {},
    insights: [],
    recommendations: [],
    ...overrides,
  };
}

beforeEach(() => {
  window.localStorage.clear();
});

describe('loadLearningStore', () => {
  it('returns an empty store when nothing has been saved yet', () => {
    const store = loadLearningStore();
    expect(store.history).toEqual([]);
    expect(store.totals.totalSessions).toBe(0);
  });

  it('falls back to an empty store on corrupted JSON rather than throwing', () => {
    window.localStorage.setItem('recitationCoach.learningProfile.v1', '{not valid json');
    expect(() => loadLearningStore()).not.toThrow();
    expect(loadLearningStore().history).toEqual([]);
  });

  it('falls back to an empty store when the version does not match', () => {
    window.localStorage.setItem('recitationCoach.learningProfile.v1', JSON.stringify({ version: 999, totals: {}, history: [] }));
    expect(loadLearningStore().history).toEqual([]);
  });

  it('round-trips a saved store exactly', () => {
    const store = appendSessionToStore(createEmptyStore(), summary());
    saveLearningStore(store);
    expect(loadLearningStore()).toEqual(store);
  });
});

describe('appendSessionToStore', () => {
  it('updates totals and appends to history in one call', () => {
    const next = appendSessionToStore(createEmptyStore(), summary());
    expect(next.totals.totalSessions).toBe(1);
    expect(next.history).toHaveLength(1);
  });

  it('caps stored history at MAX_HISTORY_ENTRIES while totals keep growing past the cap', () => {
    let store = createEmptyStore();
    for (let i = 0; i < MAX_HISTORY_ENTRIES + 20; i += 1) {
      store = appendSessionToStore(store, summary({ id: `s${i}` }));
    }
    expect(store.history).toHaveLength(MAX_HISTORY_ENTRIES);
    expect(store.totals.totalSessions).toBe(MAX_HISTORY_ENTRIES + 20); // totals unaffected by the history cap
    expect(store.history[0]!.id).toBe(`s${20}`); // oldest entries rolled off, not the newest
  });
});

describe('clearLearningStore', () => {
  it('removes any persisted data, so a subsequent load starts fresh', () => {
    saveLearningStore(appendSessionToStore(createEmptyStore(), summary()));
    clearLearningStore();
    expect(loadLearningStore().history).toEqual([]);
  });
});

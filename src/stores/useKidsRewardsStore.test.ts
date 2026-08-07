import {
  useKidsRewardsStore,
  computeStreak,
  STARS_PER_CORRECT_ANSWER,
  STARS_PER_GAME_COMPLETION,
} from './useKidsRewardsStore';

/**
 * Phase 8 — rewards store unit tests. The store persists to IndexedDB
 * (fake-indexeddb in tests); these tests drive state directly via setState
 * and assert the actions/derived logic.
 */
function todayKey(): string {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
}

function daysAgo(n: number): string {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

describe('computeStreak', () => {
  it('returns 0 for no activity', () => {
    expect(computeStreak([])).toBe(0);
  });

  it('counts today alone as a 1-day streak', () => {
    expect(computeStreak([todayKey()])).toBe(1);
  });

  it('counts consecutive days ending today', () => {
    expect(computeStreak([todayKey(), daysAgo(1), daysAgo(2)])).toBe(3);
  });

  it('counts today alone even when the chain broke yesterday', () => {
    expect(computeStreak([todayKey(), daysAgo(2)])).toBe(1);
  });

  it('accepts a streak ending yesterday as still alive', () => {
    expect(computeStreak([daysAgo(1), daysAgo(2)])).toBe(2);
  });
});

describe('useKidsRewardsStore', () => {
  beforeEach(() => {
    useKidsRewardsStore.setState({
      stars: 0,
      daysPlayed: [],
      unlockedBadges: [],
      gamesCompleted: {},
    });
  });

  it('awards stars and stamps today into daysPlayed', () => {
    const store = useKidsRewardsStore.getState();
    store.awardStars(25);
    expect(useKidsRewardsStore.getState().stars).toBe(25);
    expect(useKidsRewardsStore.getState().daysPlayed).toContain(todayKey());
  });

  it('does not double-count today', () => {
    useKidsRewardsStore.getState().awardStars(10);
    useKidsRewardsStore.getState().awardStars(10);
    expect(useKidsRewardsStore.getState().daysPlayed.filter((d) => d === todayKey())).toHaveLength(1);
    expect(useKidsRewardsStore.getState().stars).toBe(20);
  });

  it('recordQuizAnswer awards the fixed amount only on correct answers', () => {
    useKidsRewardsStore.getState().recordQuizAnswer(true);
    useKidsRewardsStore.getState().recordQuizAnswer(false);
    expect(useKidsRewardsStore.getState().stars).toBe(STARS_PER_CORRECT_ANSWER);
  });

  it('recordGameCompleted awards game stars and tallies per game', () => {
    useKidsRewardsStore.getState().recordGameCompleted('matching');
    useKidsRewardsStore.getState().recordGameCompleted('matching');
    useKidsRewardsStore.getState().recordGameCompleted('memory');
    const state = useKidsRewardsStore.getState();
    expect(state.stars).toBe(STARS_PER_GAME_COMPLETION * 3);
    expect(state.gamesCompleted).toEqual({ matching: 2, memory: 1 });
  });
});

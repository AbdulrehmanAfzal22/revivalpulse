import {
  COACHING_LEVEL_CONFIG,
  advanceCoachingState,
  classificationToMistakeType,
  createInitialCoachingState,
  selectMessage,
} from './coachingEngine';
import type { CoachingEngineState, CoachingLevel } from './coachingEngine';

/** A fixed, deterministic "random" source so message-selection tests never flake and can assert exact picks. */
function fixedRandom(value: number): () => number {
  return () => value;
}

describe('classificationToMistakeType', () => {
  test('maps every Phase 1 mistake classification to a coaching mistake type', () => {
    expect(classificationToMistakeType('wrong-word')).toBe('wrong-word');
    expect(classificationToMistakeType('missing-word')).toBe('missing-word');
    expect(classificationToMistakeType('extra-word')).toBe('extra-word');
    expect(classificationToMistakeType('repeated-word')).toBe('repeated-word');
    expect(classificationToMistakeType('out-of-sequence')).toBe('out-of-order');
  });

  test('non-mistake classifications map to null, not a mistake type', () => {
    expect(classificationToMistakeType('correct')).toBeNull();
    expect(classificationToMistakeType('probably-correct')).toBeNull();
    expect(classificationToMistakeType('probably-whisper-error')).toBeNull();
  });
});

describe('selectMessage: anti-repeat rotation', () => {
  test('excludes the most recently shown message when other candidates exist', () => {
    const picked = selectMessage(['a', 'b', 'c'], ['a'], fixedRandom(0));
    expect(picked).not.toBe('a');
  });

  test('falls back to allowing a repeat when every candidate was recently shown', () => {
    const picked = selectMessage(['a', 'b'], ['a', 'b'], fixedRandom(0));
    expect(['a', 'b']).toContain(picked);
  });

  test('a single-candidate pool always returns that candidate, even if recently shown', () => {
    expect(selectMessage(['only'], ['only'], fixedRandom(0.9))).toBe('only');
  });
});

describe('advanceCoachingState: listening (default, no notable event)', () => {
  test('an ordinary correct word below the encouragement streak stays in listening', () => {
    const state = createInitialCoachingState();
    const { state: next, analyticsEvent } = advanceCoachingState(
      state,
      { type: 'word-classified', classification: 'correct', timestamp: 1 },
      'beginner'
    );
    expect(next.coachingState).toBe('listening');
    expect(next.correctStreak).toBe(1);
    expect(analyticsEvent).toBeNull();
  });
});

describe('advanceCoachingState: analyzing', () => {
  test('the very first tick of a new, still-tiny silence gap enters analyzing', () => {
    const state = createInitialCoachingState();
    const { state: next, analyticsEvent } = advanceCoachingState(
      state,
      { type: 'silence-tick', silentMs: 200, timestamp: 1000 },
      'beginner'
    );
    expect(next.coachingState).toBe('analyzing');
    expect(analyticsEvent).toBeNull();
  });

  test('a later still-below-threshold tick within the same pause episode does not re-enter analyzing repeatedly or regress state', () => {
    const state = createInitialCoachingState();
    const { state: afterFirst } = advanceCoachingState(state, { type: 'silence-tick', silentMs: 200, timestamp: 1000 }, 'beginner');
    const { state: afterSecond } = advanceCoachingState(
      { ...afterFirst, coachingState: 'encouraging' }, // simulate something else having happened in between
      { type: 'silence-tick', silentMs: 400, timestamp: 1200 },
      'beginner'
    );
    // Still below hesitation threshold and not a new episode (pauseStartedAt already set) — must not clobber an unrelated state.
    expect(afterSecond.coachingState).toBe('encouraging');
  });
});

describe('advanceCoachingState: correcting (mistake types)', () => {
  test.each([
    ['wrong-word', 'wrong-word'],
    ['missing-word', 'missing-word'],
    ['extra-word', 'extra-word'],
    ['repeated-word', 'repeated-word'],
    ['out-of-sequence', 'out-of-order'],
  ] as const)('classification %s enters correcting with mistake type %s (beginner, nothing suppressed)', (classification, mistakeType) => {
    const state = createInitialCoachingState();
    const { state: next, analyticsEvent } = advanceCoachingState(
      state,
      { type: 'word-classified', classification, timestamp: 5 },
      'beginner'
    );
    expect(next.coachingState).toBe('correcting');
    expect(next.lastMistakeType).toBe(mistakeType);
    expect(next.message).not.toBeNull();
    expect(analyticsEvent).toEqual({ type: 'mistake-detected', mistakeType, suppressed: false, timestamp: 5 });
  });

  test('a mistake resets the correct streak', () => {
    let state = createInitialCoachingState();
    state = advanceCoachingState(state, { type: 'word-classified', classification: 'correct', timestamp: 1 }, 'beginner').state;
    state = advanceCoachingState(state, { type: 'word-classified', classification: 'correct', timestamp: 2 }, 'beginner').state;
    expect(state.correctStreak).toBe(2);
    state = advanceCoachingState(state, { type: 'word-classified', classification: 'wrong-word', timestamp: 3 }, 'beginner').state;
    expect(state.correctStreak).toBe(0);
  });
});

describe('advanceCoachingState: waiting (uncertain classification)', () => {
  test("'probably-whisper-error' does not accuse a mistake — it holds in waiting, matching the tracker's own uncertain-streak tolerance", () => {
    const state = createInitialCoachingState();
    const { state: next, analyticsEvent } = advanceCoachingState(
      state,
      { type: 'word-classified', classification: 'probably-whisper-error', timestamp: 1 },
      'beginner'
    );
    expect(next.coachingState).toBe('waiting');
    expect(analyticsEvent).toBeNull();
  });

  test('a hesitation nudge (crossed the lighter threshold, not the full pause one) also lands in waiting', () => {
    const state = createInitialCoachingState();
    const config = COACHING_LEVEL_CONFIG.beginner;
    const { state: next, analyticsEvent } = advanceCoachingState(
      state,
      { type: 'silence-tick', silentMs: config.hesitationThresholdMs, timestamp: 10_000 },
      'beginner'
    );
    expect(next.coachingState).toBe('waiting');
    expect(next.lastMistakeType).toBe('hesitation');
    expect(analyticsEvent).toEqual({ type: 'pause-detected', tier: 'hesitation', silentMs: config.hesitationThresholdMs, timestamp: 10_000 });
  });

  test('the hesitation nudge fires only once per pause episode, not on every subsequent tick', () => {
    const config = COACHING_LEVEL_CONFIG.beginner;
    let state = createInitialCoachingState();
    let result = advanceCoachingState(state, { type: 'silence-tick', silentMs: config.hesitationThresholdMs, timestamp: 1000 }, 'beginner');
    state = result.state;
    expect(result.analyticsEvent).not.toBeNull();

    result = advanceCoachingState(state, { type: 'silence-tick', silentMs: config.hesitationThresholdMs + 500, timestamp: 1500 }, 'beginner');
    expect(result.analyticsEvent).toBeNull(); // same episode, already shown
  });

  test('speech-resumed also clears an in-progress analyzing state (a nascent, not-yet-classified pause)', () => {
    let state = createInitialCoachingState();
    state = advanceCoachingState(state, { type: 'silence-tick', silentMs: 100, timestamp: 1 }, 'beginner').state;
    expect(state.coachingState).toBe('analyzing');

    state = advanceCoachingState(state, { type: 'speech-resumed', timestamp: 2 }, 'beginner').state;
    expect(state.coachingState).toBe('listening');
  });
});

describe('advanceCoachingState: paused (long pause)', () => {
  test('crossing the full pause threshold enters paused with a pause-detected analytics event', () => {
    const config = COACHING_LEVEL_CONFIG.beginner;
    const state = createInitialCoachingState();
    const { state: next, analyticsEvent } = advanceCoachingState(
      state,
      { type: 'silence-tick', silentMs: config.pauseThresholdMs, timestamp: 20_000 },
      'beginner'
    );
    expect(next.coachingState).toBe('paused');
    expect(next.lastMistakeType).toBe('long-pause');
    expect(analyticsEvent).toEqual({ type: 'pause-detected', tier: 'long-pause', silentMs: config.pauseThresholdMs, timestamp: 20_000 });
  });

  test('speech-resumed clears the pause and returns to listening', () => {
    const config = COACHING_LEVEL_CONFIG.beginner;
    let state = createInitialCoachingState();
    state = advanceCoachingState(state, { type: 'silence-tick', silentMs: config.pauseThresholdMs, timestamp: 1 }, 'beginner').state;
    expect(state.coachingState).toBe('paused');

    state = advanceCoachingState(state, { type: 'speech-resumed', timestamp: 2 }, 'beginner').state;
    expect(state.coachingState).toBe('listening');
    expect(state.pauseStartedAt).toBeNull();
    expect(state.hesitationShownThisPause).toBe(false);
  });
});

describe('advanceCoachingState: encouraging', () => {
  test('reaching the encouragement streak threshold shows encouragement and resets the streak', () => {
    const level: CoachingLevel = 'beginner';
    const threshold = COACHING_LEVEL_CONFIG[level].encouragementStreak;
    let state = createInitialCoachingState();
    let lastResult: ReturnType<typeof advanceCoachingState> | undefined;
    for (let i = 0; i < threshold; i += 1) {
      lastResult = advanceCoachingState(state, { type: 'word-classified', classification: 'correct', timestamp: i }, level);
      state = lastResult.state;
    }
    expect(state.coachingState).toBe('encouraging');
    expect(state.correctStreak).toBe(0);
    expect(lastResult!.analyticsEvent?.type).toBe('encouragement-shown');
  });

  test('recovery (mistake clearing) also produces encouragement, independent of the correct streak', () => {
    const state = createInitialCoachingState();
    const { state: next, analyticsEvent } = advanceCoachingState(state, { type: 'recovery', timestamp: 1 }, 'beginner');
    expect(next.coachingState).toBe('encouraging');
    expect(next.lastMistakeType).toBe('recovery');
    expect(analyticsEvent).toEqual({ type: 'recovery-detected', timestamp: 1 });
  });
});

describe('advanceCoachingState: completed', () => {
  test('a completed event transitions to completed with a session-completed analytics event', () => {
    const state = createInitialCoachingState();
    const { state: next, analyticsEvent } = advanceCoachingState(state, { type: 'completed', timestamp: 99 }, 'beginner');
    expect(next.coachingState).toBe('completed');
    expect(analyticsEvent).toEqual({ type: 'session-completed', timestamp: 99 });
  });
});

describe('advanceCoachingState: session-reset', () => {
  test('resets to the exact initial state regardless of what came before', () => {
    let state = createInitialCoachingState();
    state = advanceCoachingState(state, { type: 'word-classified', classification: 'wrong-word', timestamp: 1 }, 'beginner').state;
    expect(state.coachingState).toBe('correcting');

    const { state: reset, analyticsEvent } = advanceCoachingState(state, { type: 'session-reset' }, 'beginner');
    expect(reset).toEqual(createInitialCoachingState());
    expect(analyticsEvent).toBeNull();
  });
});

describe('coaching level behavior', () => {
  test('beginner surfaces every mistake type, including extra/repeated word noise', () => {
    const state = createInitialCoachingState();
    const { analyticsEvent } = advanceCoachingState(state, { type: 'word-classified', classification: 'extra-word', timestamp: 1 }, 'beginner');
    expect(analyticsEvent).toEqual({ type: 'mistake-detected', mistakeType: 'extra-word', suppressed: false, timestamp: 1 });
  });

  test('intermediate suppresses extra-word/repeated-word noise but still shows wrong-word', () => {
    const state = createInitialCoachingState();
    const extra = advanceCoachingState(state, { type: 'word-classified', classification: 'extra-word', timestamp: 1 }, 'intermediate');
    expect(extra.state.coachingState).toBe('listening'); // suppressed — no interrupting message
    expect(extra.analyticsEvent).toEqual({ type: 'mistake-detected', mistakeType: 'extra-word', suppressed: true, timestamp: 1 });

    const wrong = advanceCoachingState(state, { type: 'word-classified', classification: 'wrong-word', timestamp: 2 }, 'intermediate');
    expect(wrong.state.coachingState).toBe('correcting');
  });

  test('advanced suppresses missing-word and hesitation too — only the most significant mistakes interrupt', () => {
    const state = createInitialCoachingState();
    const missing = advanceCoachingState(state, { type: 'word-classified', classification: 'missing-word', timestamp: 1 }, 'advanced');
    expect(missing.state.coachingState).toBe('listening');
    expect(missing.analyticsEvent).toMatchObject({ suppressed: true });

    const wrong = advanceCoachingState(state, { type: 'word-classified', classification: 'wrong-word', timestamp: 2 }, 'advanced');
    expect(wrong.state.coachingState).toBe('correcting'); // never suppressed at any level
  });

  test('advanced requires a much longer correct streak before encouraging than beginner', () => {
    expect(COACHING_LEVEL_CONFIG.advanced.encouragementStreak).toBeGreaterThan(COACHING_LEVEL_CONFIG.beginner.encouragementStreak);
  });

  test('advanced tolerates longer pauses before nudging than beginner (less hand-holding)', () => {
    expect(COACHING_LEVEL_CONFIG.advanced.pauseThresholdMs).toBeGreaterThan(COACHING_LEVEL_CONFIG.beginner.pauseThresholdMs);
    expect(COACHING_LEVEL_CONFIG.advanced.hesitationThresholdMs).toBeGreaterThan(COACHING_LEVEL_CONFIG.beginner.hesitationThresholdMs);
  });

  test('every level config is self-consistent: hesitation always fires strictly before the full pause threshold', () => {
    (Object.keys(COACHING_LEVEL_CONFIG) as CoachingLevel[]).forEach((level) => {
      const config = COACHING_LEVEL_CONFIG[level];
      expect(config.hesitationThresholdMs).toBeLessThan(config.pauseThresholdMs);
    });
  });
});

describe('state transitions do not conflict — only one coaching event active at a time', () => {
  test('a mistake followed immediately by a correct word cleanly transitions out of correcting', () => {
    let state: CoachingEngineState = createInitialCoachingState();
    state = advanceCoachingState(state, { type: 'word-classified', classification: 'wrong-word', timestamp: 1 }, 'beginner').state;
    expect(state.coachingState).toBe('correcting');

    state = advanceCoachingState(state, { type: 'word-classified', classification: 'correct', timestamp: 2 }, 'beginner').state;
    expect(state.coachingState).toBe('listening');
    expect(state.correctStreak).toBe(1);
  });
});

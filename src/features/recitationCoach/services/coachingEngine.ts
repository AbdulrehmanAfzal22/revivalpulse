import type { WordMatchClassification } from './wordMatcher';
import type { TranslationKey } from 'i18n/types';

/**
 * A dedicated coaching state, kept separate from RecitationPhase
 * (idle/loading-model/listening/locked/...) in useRecitationSession — that
 * state machine answers "what is the tracking pipeline doing", this one
 * answers "what should the coach say right now". Conflating them would mean
 * every future coaching nuance (a new kind of encouragement, a new pause
 * tier) forces a change to the tracking state machine too.
 */
export type CoachingState = 'listening' | 'analyzing' | 'encouraging' | 'waiting' | 'correcting' | 'paused' | 'completed';

/**
 * Everything the coach can react to. 'wrong-word' | 'missing-word' |
 * 'extra-word' | 'repeated-word' | 'out-of-order' come straight from Phase
 * 1's WordMatchClassification (see classificationToMistakeType below) —
 * 'hesitation' | 'long-pause' come from silence timing, and 'recovery' comes
 * from the tracker's own hasMistakeAtCursor clearing. Kept as one flat type
 * (not one enum per source) because the coach picks a message from the same
 * kind of pool regardless of which signal produced the mistake.
 */
export type MistakeType =
  | 'wrong-word'
  | 'missing-word'
  | 'extra-word'
  | 'repeated-word'
  | 'out-of-order'
  | 'hesitation'
  | 'long-pause'
  | 'recovery';

export type CoachingTone = 'positive' | 'warning' | 'neutral';

export interface CoachingMessage {
  /** i18n key — the engine never produces literal display text (it has no access to translations); the consuming UI resolves this via t(). */
  textKey: TranslationKey;
  tone: CoachingTone;
}

export type CoachingLevel = 'beginner' | 'intermediate' | 'advanced';

/**
 * Every field a future level needs is already here — adding a new level is
 * one new entry in LEVEL_CONFIG, never a change to the reducer itself. This
 * is what "design the architecture so additional levels can be added later"
 * means in practice: the reducer only ever reads from this config, it never
 * branches on the level name directly.
 */
interface CoachingLevelConfig {
  /** How many consecutive correct/probably-correct words trigger an encouragement message. */
  encouragementStreak: number;
  /** Silence duration (ms) before a gentle "take your time" hesitation nudge. */
  hesitationThresholdMs: number;
  /** Silence duration (ms) before the firmer "continue from the highlighted word" pause message. */
  pauseThresholdMs: number;
  /** Mistake types this level doesn't interrupt recitation for — still tracked (mistakeCount, analytics), just not surfaced as a coaching message. "Advanced: only significant mistakes" is expressed entirely by what's in this set. */
  suppressedMistakeTypes: ReadonlySet<MistakeType>;
}

export const COACHING_LEVEL_CONFIG: Record<CoachingLevel, CoachingLevelConfig> = {
  beginner: {
    encouragementStreak: 3,
    hesitationThresholdMs: 2000,
    pauseThresholdMs: 4000,
    suppressedMistakeTypes: new Set(),
  },
  intermediate: {
    encouragementStreak: 5,
    hesitationThresholdMs: 3000,
    pauseThresholdMs: 6000,
    suppressedMistakeTypes: new Set<MistakeType>(['extra-word', 'repeated-word']),
  },
  advanced: {
    encouragementStreak: 8,
    hesitationThresholdMs: 4000,
    pauseThresholdMs: 8000,
    suppressedMistakeTypes: new Set<MistakeType>(['extra-word', 'repeated-word', 'missing-word', 'hesitation']),
  },
};

/** Maps Phase 1's alignment classification to a coaching mistake type. Classifications with no entry here (correct, probably-correct, probably-whisper-error) aren't mistakes from the coach's point of view — they drive encouragement or a quiet "waiting" state instead, handled directly in advanceCoachingState. */
const MISTAKE_TYPE_BY_CLASSIFICATION: Partial<Record<WordMatchClassification, MistakeType>> = {
  'wrong-word': 'wrong-word',
  'missing-word': 'missing-word',
  'extra-word': 'extra-word',
  'repeated-word': 'repeated-word',
  'out-of-sequence': 'out-of-order',
};

export function classificationToMistakeType(classification: WordMatchClassification): MistakeType | null {
  return MISTAKE_TYPE_BY_CLASSIFICATION[classification] ?? null;
}

/**
 * Message pools — each entry is a full i18n key. Multiple entries per
 * category exist purely so selectMessage (below) has something to rotate
 * between; the *content* of each message lives in the locale files, not
 * here.
 */
const ENCOURAGEMENT_MESSAGE_KEYS: TranslationKey[] = [
  'recitationCoach.coaching.encourage1',
  'recitationCoach.coaching.encourage2',
  'recitationCoach.coaching.encourage3',
  'recitationCoach.coaching.encourage4',
];
const RECOVERY_MESSAGE_KEYS: TranslationKey[] = ['recitationCoach.coaching.recovery1', 'recitationCoach.coaching.recovery2'];
const MISTAKE_MESSAGE_KEYS: Record<Exclude<MistakeType, 'recovery'>, TranslationKey[]> = {
  'wrong-word': ['recitationCoach.coaching.wrongWord1', 'recitationCoach.coaching.wrongWord2'],
  'missing-word': ['recitationCoach.coaching.missingWord1', 'recitationCoach.coaching.missingWord2'],
  'extra-word': ['recitationCoach.coaching.extraWord1'],
  'repeated-word': ['recitationCoach.coaching.repeatedWord1'],
  'out-of-order': ['recitationCoach.coaching.outOfOrder1'],
  hesitation: ['recitationCoach.coaching.hesitation1', 'recitationCoach.coaching.hesitation2'],
  'long-pause': ['recitationCoach.coaching.longPause1', 'recitationCoach.coaching.longPause2'],
};

/**
 * Picks one candidate, excluding whatever was shown most recently (up to
 * however many the pool can spare) so the same line doesn't repeat back to
 * back — this is "avoid repeating the same message frequently" in its
 * entirety; there's no hidden frequency timer, just this exclusion.
 * `random` is injected (defaults to Math.random) so tests can supply a
 * deterministic source instead of asserting on real randomness. Generic
 * over the candidate type so tests can exercise it with plain strings
 * without needing real i18n keys.
 */
export function selectMessage<T extends string>(candidates: T[], recentKeys: readonly string[], random: () => number = Math.random): T {
  if (candidates.length === 0) throw new Error('selectMessage called with an empty candidate pool');
  const notRecent = candidates.filter((key) => !recentKeys.includes(key));
  const pool = notRecent.length > 0 ? notRecent : candidates;
  const index = Math.floor(random() * pool.length) % pool.length;
  return pool[index]!;
}

const RECENT_MESSAGE_HISTORY_SIZE = 3;

function pushRecent(recentKeys: readonly string[], key: string): string[] {
  return [...recentKeys, key].slice(-RECENT_MESSAGE_HISTORY_SIZE);
}

export interface CoachingEngineState {
  coachingState: CoachingState;
  message: CoachingMessage | null;
  lastMistakeType: MistakeType | null;
  recentMessageKeys: string[];
  /** Consecutive correct/probably-correct words since the last mistake or encouragement — reset by either. */
  correctStreak: number;
  /** Wall-clock time (ms) the current silence episode started, or null while speech is ongoing. */
  pauseStartedAt: number | null;
  /** Whether the lighter hesitation nudge has already been shown for the *current* silence episode — without this, every subsequent silence-tick would re-fire it once the threshold is crossed. */
  hesitationShownThisPause: boolean;
}

export function createInitialCoachingState(): CoachingEngineState {
  return {
    coachingState: 'listening',
    message: null,
    lastMistakeType: null,
    recentMessageKeys: [],
    correctStreak: 0,
    pauseStartedAt: null,
    hesitationShownThisPause: false,
  };
}

export type CoachingInputEvent =
  | { type: 'word-classified'; classification: WordMatchClassification; timestamp: number }
  | { type: 'recovery'; timestamp: number }
  | { type: 'silence-tick'; silentMs: number; timestamp: number }
  | { type: 'speech-resumed'; timestamp: number }
  | { type: 'completed'; timestamp: number }
  | { type: 'session-reset' };

/**
 * Structured for future progress analytics, per Phase 3's requirement —
 * deliberately a flat, serializable union so it can be logged/persisted
 * without any transformation. Emitted at most once per advanceCoachingState
 * call (null when nothing analytics-worthy happened, e.g. an ordinary
 * correct word that didn't cross the encouragement streak threshold).
 */
export type CoachingAnalyticsEvent =
  | { type: 'mistake-detected'; mistakeType: MistakeType; suppressed: boolean; timestamp: number }
  | { type: 'recovery-detected'; timestamp: number }
  | { type: 'pause-detected'; tier: 'hesitation' | 'long-pause'; silentMs: number; timestamp: number }
  | { type: 'encouragement-shown'; messageKey: string; timestamp: number }
  | { type: 'session-completed'; timestamp: number };

export interface CoachingAdvanceResult {
  state: CoachingEngineState;
  analyticsEvent: CoachingAnalyticsEvent | null;
}

function withMessage(
  state: CoachingEngineState,
  coachingState: CoachingState,
  messageKey: TranslationKey,
  tone: CoachingTone,
  timestamp: number,
  analyticsEvent: CoachingAnalyticsEvent
): CoachingAdvanceResult {
  return {
    state: { ...state, coachingState, message: { textKey: messageKey, tone } },
    analyticsEvent,
  };
}

/**
 * The whole coaching state machine, as one pure function: (current state,
 * new event, active level) -> (next state, at most one analytics event).
 * No timers, no randomness beyond the injectable `random` parameter, no
 * side effects — everything time-sensitive (the pause timer) or impure
 * (actually playing a sound) lives in useCoachingEngine, which calls this.
 */
export function advanceCoachingState(
  state: CoachingEngineState,
  event: CoachingInputEvent,
  level: CoachingLevel,
  random: () => number = Math.random
): CoachingAdvanceResult {
  const config = COACHING_LEVEL_CONFIG[level];

  switch (event.type) {
    case 'word-classified': {
      if (event.classification === 'correct' || event.classification === 'probably-correct') {
        const correctStreak = state.correctStreak + 1;
        if (correctStreak >= config.encouragementStreak) {
          const messageKey = selectMessage(ENCOURAGEMENT_MESSAGE_KEYS, state.recentMessageKeys, random);
          return withMessage(
            { ...state, correctStreak: 0, recentMessageKeys: pushRecent(state.recentMessageKeys, messageKey) },
            'encouraging',
            messageKey,
            'positive',
            event.timestamp,
            { type: 'encouragement-shown', messageKey, timestamp: event.timestamp }
          );
        }
        return { state: { ...state, coachingState: 'listening', correctStreak }, analyticsEvent: null };
      }

      const mistakeType = classificationToMistakeType(event.classification);
      if (!mistakeType) {
        // e.g. 'probably-whisper-error' — genuinely uncertain, matches
        // wordTracker's own "hold and wait" for this classification.
        return { state: { ...state, coachingState: 'waiting', correctStreak: 0 }, analyticsEvent: null };
      }

      if (config.suppressedMistakeTypes.has(mistakeType)) {
        return {
          state: { ...state, coachingState: 'listening', correctStreak: 0, lastMistakeType: mistakeType },
          analyticsEvent: { type: 'mistake-detected', mistakeType, suppressed: true, timestamp: event.timestamp },
        };
      }

      const pool = MISTAKE_MESSAGE_KEYS[mistakeType as Exclude<MistakeType, 'recovery'>];
      const messageKey = selectMessage(pool, state.recentMessageKeys, random);
      const result = withMessage(
        {
          ...state,
          correctStreak: 0,
          lastMistakeType: mistakeType,
          recentMessageKeys: pushRecent(state.recentMessageKeys, messageKey),
        },
        'correcting',
        messageKey,
        'warning',
        event.timestamp,
        { type: 'mistake-detected', mistakeType, suppressed: false, timestamp: event.timestamp }
      );
      return result;
    }

    case 'recovery': {
      const messageKey = selectMessage(RECOVERY_MESSAGE_KEYS, state.recentMessageKeys, random);
      return withMessage(
        { ...state, lastMistakeType: 'recovery', recentMessageKeys: pushRecent(state.recentMessageKeys, messageKey) },
        'encouraging',
        messageKey,
        'positive',
        event.timestamp,
        { type: 'recovery-detected', timestamp: event.timestamp }
      );
    }

    case 'silence-tick': {
      const isNewPauseEpisode = state.pauseStartedAt === null;
      const pauseStartedAt = state.pauseStartedAt ?? event.timestamp - event.silentMs;

      if (event.silentMs >= config.pauseThresholdMs) {
        const messageKey = selectMessage(MISTAKE_MESSAGE_KEYS['long-pause'], state.recentMessageKeys, random);
        return withMessage(
          {
            ...state,
            pauseStartedAt,
            lastMistakeType: 'long-pause',
            recentMessageKeys: pushRecent(state.recentMessageKeys, messageKey),
          },
          'paused',
          messageKey,
          'neutral',
          event.timestamp,
          { type: 'pause-detected', tier: 'long-pause', silentMs: event.silentMs, timestamp: event.timestamp }
        );
      }

      if (event.silentMs >= config.hesitationThresholdMs && !state.hesitationShownThisPause) {
        const messageKey = selectMessage(MISTAKE_MESSAGE_KEYS.hesitation, state.recentMessageKeys, random);
        const withHesitation = withMessage(
          {
            ...state,
            pauseStartedAt,
            hesitationShownThisPause: true,
            lastMistakeType: 'hesitation',
            recentMessageKeys: pushRecent(state.recentMessageKeys, messageKey),
          },
          'waiting',
          messageKey,
          'neutral',
          event.timestamp,
          { type: 'pause-detected', tier: 'hesitation', silentMs: event.silentMs, timestamp: event.timestamp }
        );
        return withHesitation;
      }

      // Below both thresholds: a nascent, not-yet-meaningful gap. The very
      // first tick of a fresh pause episode surfaces as 'analyzing' — the
      // coach has noticed *something* and is watching it, distinct from
      // ordinary 'listening' (nothing happening) and from actually having
      // decided to say something ('waiting'/'paused'). Currently this is
      // the only path into 'analyzing'; it's kept as its own state (rather
      // than folded into 'listening') so a future async step — e.g.
      // deciding whether to interrupt with TTS mid-recitation — has a state
      // to occupy without a breaking enum change.
      return {
        state: { ...state, pauseStartedAt, coachingState: isNewPauseEpisode ? 'analyzing' : state.coachingState },
        analyticsEvent: null,
      };
    }

    case 'speech-resumed': {
      const wasSilenceRelated =
        state.coachingState === 'paused' || state.coachingState === 'waiting' || state.coachingState === 'analyzing';
      return {
        state: {
          ...state,
          coachingState: wasSilenceRelated ? 'listening' : state.coachingState,
          pauseStartedAt: null,
          hesitationShownThisPause: false,
        },
        analyticsEvent: null,
      };
    }

    case 'completed':
      return {
        state: { ...state, coachingState: 'completed' },
        analyticsEvent: { type: 'session-completed', timestamp: event.timestamp },
      };

    case 'session-reset':
      return { state: createInitialCoachingState(), analyticsEvent: null };
  }
}

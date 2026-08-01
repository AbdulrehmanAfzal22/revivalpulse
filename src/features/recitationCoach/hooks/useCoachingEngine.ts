import { useEffect, useRef, useState } from 'react';
import { playEncouragementChime, playMistakeTone } from '../services/alertSound';
import {
  advanceCoachingState,
  createInitialCoachingState,
  type CoachingAnalyticsEvent,
  type CoachingEngineState,
  type CoachingLevel,
} from '../services/coachingEngine';
import type { RecitationSession } from './useRecitationSession';
import type { TranslationKey } from 'i18n/types';

/** How often the pause timer re-checks elapsed silence — well below even the beginner hesitation threshold, so a pause is never noticed meaningfully late. */
const PAUSE_CHECK_INTERVAL_MS = 500;

/** Bounded so a long session's analytics log can't grow without limit — the debug panel only ever needs recent history, not the whole session. */
const MAX_ANALYTICS_EVENTS = 50;

/**
 * Abstraction for how a coaching message is actually delivered, beyond the
 * on-screen text every CoachingMessage already carries. Two implementations
 * exist today (silent, and a short synthesized tone per tone category) —
 * swapping in a future Text-to-Speech implementation means providing a
 * third one here and passing it in, never touching the reducer, the hook's
 * effect wiring, or any UI component.
 */
export interface CoachingVoiceFeedback {
  onMessage(message: { tone: 'positive' | 'warning' | 'neutral' }): void;
}

export const silentVoiceFeedback: CoachingVoiceFeedback = { onMessage: () => undefined };

export const toneVoiceFeedback: CoachingVoiceFeedback = {
  onMessage: (message) => {
    if (message.tone === 'positive') playEncouragementChime();
    else if (message.tone === 'warning') playMistakeTone();
    // 'neutral' (pause guidance) stays text-only — a sound for every pause would be noisier than helpful.
  },
};

export interface UseCoachingEngineOptions {
  level: CoachingLevel;
  voiceFeedback?: CoachingVoiceFeedback;
}

export interface CoachingEngineDebugInfo {
  coachingState: CoachingEngineState['coachingState'];
  lastMistakeType: CoachingEngineState['lastMistakeType'];
  messageKey: TranslationKey | null;
  currentSilenceMs: number;
  recentEvents: CoachingAnalyticsEvent[];
}

export interface UseCoachingEngineResult extends CoachingEngineState {
  debugInfo: CoachingEngineDebugInfo;
}

/**
 * Wraps the pure coachingEngine reducer with everything it needs from the
 * live world: reacting to tracker/word updates from useRecitationSession,
 * polling elapsed silence on a timer, resetting on a fresh session, and
 * dispatching voice feedback. All time-sensitivity and side effects live
 * here specifically so coachingEngine.ts itself can stay a pure, trivially
 * testable function.
 */
export function useCoachingEngine(session: RecitationSession, options: UseCoachingEngineOptions): UseCoachingEngineResult {
  const { level, voiceFeedback = toneVoiceFeedback } = options;
  const [engineState, setEngineState] = useState<CoachingEngineState>(createInitialCoachingState());
  const [recentEvents, setRecentEvents] = useState<CoachingAnalyticsEvent[]>([]);
  const [currentSilenceMs, setCurrentSilenceMs] = useState(0);

  const previousHasMistakeRef = useRef(false);
  const lastProcessedWordTimestampRef = useRef<number | null>(null);
  const previousSurahIdRef = useRef<number | null>(null);
  const levelRef = useRef(level);
  levelRef.current = level;
  const voiceFeedbackRef = useRef(voiceFeedback);
  voiceFeedbackRef.current = voiceFeedback;

  const dispatch = useRef((event: Parameters<typeof advanceCoachingState>[1]) => {
    setEngineState((prev) => {
      const { state: next, analyticsEvent } = advanceCoachingState(prev, event, levelRef.current);
      if (analyticsEvent) {
        setRecentEvents((events) => [...events, analyticsEvent].slice(-MAX_ANALYTICS_EVENTS));
      }
      if (next.message && next.message !== prev.message) {
        voiceFeedbackRef.current.onMessage(next.message);
      }
      return next;
    });
  }).current;

  // Fresh session (surah changed, or restarted) — the coaching state must
  // not carry over stale streaks/messages/pause timers from a previous
  // recitation attempt.
  useEffect(() => {
    if (session.detectedSurahId === previousSurahIdRef.current) return;
    previousSurahIdRef.current = session.detectedSurahId;
    if (session.detectedSurahId === null) return; // session ended, not a new one starting
    previousHasMistakeRef.current = false;
    lastProcessedWordTimestampRef.current = null;
    dispatch({ type: 'session-reset' });
  }, [session.detectedSurahId, dispatch]);

  // Word-level events: recovery takes precedence over an ordinary
  // word-classified dispatch for the exact same tracker update — otherwise
  // the positive "recovery" resolution would be immediately overwritten by
  // a plain "correct" classification landing back in 'listening'.
  useEffect(() => {
    if (!session.tracker) return;
    const wasRecovery = previousHasMistakeRef.current && !session.tracker.hasMistakeAtCursor;
    previousHasMistakeRef.current = session.tracker.hasMistakeAtCursor;

    if (session.lastWordEvent && session.lastWordEvent.timestamp !== lastProcessedWordTimestampRef.current) {
      lastProcessedWordTimestampRef.current = session.lastWordEvent.timestamp;
      dispatch({ type: 'speech-resumed', timestamp: session.lastWordEvent.timestamp });
      if (wasRecovery) {
        dispatch({ type: 'recovery', timestamp: session.lastWordEvent.timestamp });
      } else {
        dispatch({ type: 'word-classified', classification: session.lastWordEvent.classification, timestamp: session.lastWordEvent.timestamp });
      }
    }
  }, [session.tracker, session.lastWordEvent, dispatch]);

  // Session completion.
  useEffect(() => {
    if (session.tracker?.completed) {
      dispatch({ type: 'completed', timestamp: Date.now() });
    }
  }, [session.tracker?.completed, dispatch]);

  // Pause polling — the only place elapsed real time is measured. Chunks
  // keep arriving from the microphone every ~1.5s regardless of silence, so
  // "no chunk arrived" can't signal a pause; this instead measures time
  // since the last chunk that actually contained recognized words.
  useEffect(() => {
    if (session.phase !== 'locked' || session.tracker?.completed) {
      setCurrentSilenceMs(0);
      return undefined;
    }

    const interval = window.setInterval(() => {
      const anchor = lastProcessedWordTimestampRef.current ?? Date.now();
      const silentMs = Date.now() - anchor;
      setCurrentSilenceMs(silentMs);
      dispatch({ type: 'silence-tick', silentMs, timestamp: Date.now() });
    }, PAUSE_CHECK_INTERVAL_MS);

    return () => window.clearInterval(interval);
  }, [session.phase, session.tracker?.completed, dispatch]);

  return {
    ...engineState,
    debugInfo: {
      coachingState: engineState.coachingState,
      lastMistakeType: engineState.lastMistakeType,
      messageKey: engineState.message?.textKey ?? null,
      currentSilenceMs,
      recentEvents,
    },
  };
}

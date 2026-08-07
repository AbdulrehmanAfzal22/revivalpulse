import { useCallback, useState } from 'react';
import { playCorrect, playWrong } from 'services/kidSounds';

/**
 * Phase 9 — per-answer feedback orchestrator for quiz plays.
 *
 * Owns the transient "just answered" UI state (which answer was correct, and
 * where to put the celebratory burst) plus the matching sound. Quiz pages feed
 * it the near-miss-worthy verdicts and it returns what to render.
 *
 * This stays a small value object (not a provider) on purpose: the games use
 * their own WinOverlay, and only the engine-consuming quiz pages need it.
 */
export interface CorrectSpot {
  x: number;
  y: number;
}

export interface AnswerFeedback {
  lastCorrect: boolean;
  burstSpot: CorrectSpot | null;
  /** The 'Almost! Keep going.' gentle nudge label appears for a beat. */
  gentleNudge: boolean;
}

export interface AnswerFeedbackController extends AnswerFeedback {
  /** Call from the engine's onAnswer with the click coordinates. */
  handleAnswer: (correct: boolean, clicked: { x: number; y: number }) => void;
  /** Dismiss the gentle wrong-answer nudge early (e.g. after a beat). */
  clearNudge: () => void;
}

export default function useAnswerFeedback(): AnswerFeedbackController {
  const [lastCorrect, setLastCorrect] = useState(false);
  const [burstSpot, setBurstSpot] = useState<CorrectSpot | null>(null);
  const [gentleNudge, setGentleNudge] = useState(false);

  const handleAnswer = useCallback((correct: boolean, point: { x: number; y: number }) => {
    if (correct) {
      playCorrect();
      setBurstSpot({ x: point.x, y: point.y });
      setGentleNudge(false);
    } else {
      playWrong();
      setBurstSpot(null);
      setGentleNudge(true);
    }
    setLastCorrect(correct);
  }, []);

  const clearNudge = useCallback(() => setGentleNudge(false), []);

  return { lastCorrect, burstSpot, gentleNudge, handleAnswer, clearNudge };
}
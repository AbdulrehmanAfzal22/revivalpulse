/**
 * Generic quiz model (Phase 4).
 *
 * Deliberately content-agnostic: any feature (kids alphabet, stories, general
 * knowledge, future Phase 14 categories…) can hand a QuizEngine an array of
 * these and get a working quiz. Nothing here mentions Islamic content — new
 * categories later mean NEW QUESTION DATA, not new engine code.
 */

/** Coarse difficulty tier; 'any' lets a consumer mix difficulties. */
export type QuizDifficulty = 'easy' | 'medium' | 'hard';

/**
 * A single multiple-choice question. `correctIndex` points into `options`.
 */
export interface QuizQuestion {
  /** Stable unique id within the deck. */
  id: string;
  /** The question itself, rendered verbatim. */
  prompt: string;
  /** Answer choices, in display order. */
  options: string[];
  /** Index into `options` of the correct answer. */
  correctIndex: number;
  /** Loose grouping tag — the engine never interprets its value. */
  category: string;
  difficulty: QuizDifficulty;
}

/** Immutable digest of how the user did on one question. */
export interface QuizAnswer {
  questionId: string;
  selectedIndex: number;
  correct: boolean;
}

/** Full result summary produced once the deck is finished. */
export interface QuizResult {
  /** Total answered (equals questions.length when finished). */
  total: number;
  /** Count of correct answers. */
  score: number;
  /** One entry per question, in deck order. */
  answers: QuizAnswer[];
  /** Percentage 0..100. */
  percent: number;
}
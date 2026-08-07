import { useMemo, useState } from 'react';
import { Volume2 } from 'lucide-react';
import Button from 'components/ui/Button';
import EmptyState from 'components/feedback/EmptyState';
import Typography from 'components/ui/Typography';
import type { QuizAnswer, QuizQuestion, QuizResult } from 'types/quiz.types';
import styles from './QuizEngine.module.css';

/**
 * Generic QuizEngine (Phase 4) — runs ANY question deck handed to it.
 *
 * The engine owns the quiz flow and knows NOTHING about the subject matter:
 * current question, one-shot answer selection, scoring, results screen, play
 * again. Consuming features only supply `questions` and optionally:
 *  - `labels` — UI strings (kept as props so the engine stays content- and
 *    locale-agnostic; the app wires its i18n keys at the call site),
 *  - `onFinish` — notified with a QuizResult when the deck completes,
 *  - `onAnswer` — notified per answer (rewards/feedback live in the consumer),
 *  - `onReadAloud` — Phase 12: when provided, the engine renders a small
 *    speaker button on the prompt and each option and delegates the actual
 *    text-to-speech to the consumer's hook (engine stays framework-neutral).
 *
 * New categories in Phase 14 are just new question data — no engine changes.
 */
export interface QuizLabels {
  /** Renders "Question 3 of 10" — defaults to English if omitted. */
  questionCounter?: (current: number, total: number) => string;
  /** Button that advances to the next question. */
  next: string;
  /** Button that shows results after the last question. */
  finish: string;
  /** Result heading, e.g. "You scored 7 of 10". */
  scoreLabel: (score: number, total: number) => string;
  /** Reset-and-restart button on the results screen. */
  playAgain: string;
  /** Accessible label for the read-aloud speaker buttons (Phase 12). */
  readAloud?: (text: string) => string;
}

const DEFAULT_LABELS: Required<QuizLabels> = {
  questionCounter: (current, total) => `Question ${current} of ${total}`,
  next: 'Next',
  finish: 'Finish',
  scoreLabel: (score, total) => `You scored ${score} of ${total}`,
  playAgain: 'Play again',
  readAloud: (text) => `Hear: ${text}`,
};

export interface QuizEngineProps {
  questions: QuizQuestion[];
  labels?: QuizLabels;
  onFinish?: (result: QuizResult) => void;
  /** Phase 9: fired once per answered question with its verdict. */
  onAnswer?: (answer: QuizAnswer, correct: boolean) => void;
  /** Phase 12: when provided, renders speaker buttons that call back with the text to read aloud. */
  onReadAloud?: (text: string) => void;
}

export default function QuizEngine({
  questions,
  labels,
  onFinish,
  onAnswer,
  onReadAloud,
}: QuizEngineProps) {
  const merged = useMemo<Required<QuizLabels>>(
    () => ({
      ...DEFAULT_LABELS,
      questionCounter: labels?.questionCounter ?? DEFAULT_LABELS.questionCounter,
      next: labels?.next ?? DEFAULT_LABELS.next,
      finish: labels?.finish ?? DEFAULT_LABELS.finish,
      scoreLabel: labels?.scoreLabel ?? DEFAULT_LABELS.scoreLabel,
      playAgain: labels?.playAgain ?? DEFAULT_LABELS.playAgain,
      readAloud: labels?.readAloud ?? DEFAULT_LABELS.readAloud,
    }),
    [labels],
  );
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selections, setSelections] = useState<(number | null)[]>(() =>
    questions.map(() => null),
  );
  const [showResults, setShowResults] = useState(false);

  const current = questions[currentIndex];
  const selected = current ? selections[currentIndex] : null;
  const answered = selected !== null;

  const score = useMemo(
    () =>
      selections.reduce(
        (sum: number, pick: number | null, i) => sum + (pick === questions[i]?.correctIndex ? 1 : 0),
        0,
      ),
    [selections, questions],
  );

  const choose = (optionIndex: number): void => {
    if (!current || answered) return; // one attempt per question
    setSelections((prev) => {
      const next = [...prev];
      next[currentIndex] = optionIndex;
      return next;
    });
    onAnswer?.(
      {
        questionId: current.id,
        selectedIndex: optionIndex,
        correct: optionIndex === current.correctIndex,
      },
      optionIndex === current.correctIndex,
    );
  };

  const advance = (): void => {
    if (!answered) return;
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((i) => i + 1);
      return;
    }
    setShowResults(true);
    const result: QuizResult = {
      total: questions.length,
      score,
      answers: questions.map((q, i) => ({
        questionId: q.id,
        selectedIndex: selections[i] ?? -1,
        correct: selections[i] === q.correctIndex,
      })),
      percent: questions.length ? Math.round((score / questions.length) * 100) : 0,
    };
    onFinish?.(result);
  };

  const restart = (): void => {
    setCurrentIndex(0);
    setSelections(questions.map(() => null));
    setShowResults(false);
  };

  if (questions.length === 0) {
    return <EmptyState title={merged.questionCounter(0, 0)} />;
  }

  // After the empty-guard above, a current question is guaranteed to exist.
  // (noUncheckedIndexedAccess is unaware of the guard, so narrow explicitly.)
  const currentQuestion: QuizQuestion = current!;

  if (showResults) {
    return (
      <div className={styles.results} role="status">
        <Typography variant="h3">{merged.scoreLabel(score, questions.length)}</Typography>
        {questions.map((question, i) => {
          const pick = selections[i];
          const isCorrect = pick === question.correctIndex;
          return (
            <div key={question.id} className={styles.resultRow}>
              <span
                className={isCorrect ? styles.markerCorrect : styles.markerWrong}
                aria-label={isCorrect ? 'correct' : 'wrong'}
              >
                {isCorrect ? '✓' : '✗'}
              </span>
              <div>
                <Typography variant="body">{question.prompt}</Typography>
                <Typography variant="caption" className={styles.resultDetail}>
                  {question.options[pick ?? -1] ?? '—'} / {question.options[question.correctIndex] ?? '—'}
                </Typography>
              </div>
            </div>
          );
        })}
        <Button variant="primary" onClick={restart}>
          {merged.playAgain}
        </Button>
      </div>
    );
  }

  return (
    <fieldset className={styles.fieldset}>
      <legend className={styles.counter}>{merged.questionCounter(currentIndex + 1, questions.length)}</legend>

      <div className={styles.promptRow}>
        <Typography variant="h3" className={styles.prompt}>
          {currentQuestion.prompt}
        </Typography>
        {onReadAloud && (
          <button
            type="button"
            className={styles.speaker}
            onClick={() => onReadAloud(currentQuestion.prompt)}
            aria-label={merged.readAloud(currentQuestion.prompt)}
          >
            <Volume2 size={20} aria-hidden="true" />
          </button>
        )}
      </div>

      <div className={styles.options}>
        {currentQuestion.options.map((option, i) => {
          const isPicked = selected === i;
          const showCorrect = answered && i === currentQuestion.correctIndex;
          const showWrong = answered && isPicked && i !== currentQuestion.correctIndex;
          return (
            <div key={`${currentQuestion.id}-${i}`} className={styles.optionRow}>
              <button
                type="button"
                className={[
                  styles.option,
                  showCorrect && styles.optionCorrect,
                  showWrong && styles.optionWrong,
                ]
                  .filter(Boolean)
                  .join(' ')}
                onClick={() => choose(i)}
                disabled={answered}
                aria-pressed={isPicked}
                aria-label={
                  showCorrect
                    ? `${option} (correct)`
                    : showWrong
                      ? `${option} (wrong)`
                      : option
                }
              >
                <span className={styles.optionIndex}>{String.fromCharCode(65 + i)}</span>
                <span>{option}</span>
              </button>
              {onReadAloud && !answered && (
                <button
                  type="button"
                  className={styles.speakButton}
                  onClick={() => onReadAloud(option)}
                  aria-label={merged.readAloud(option)}
                >
                  <Volume2 size={16} aria-hidden="true" />
                </button>
              )}
            </div>
          );
        })}
      </div>

      {answered && (
        <div className={styles.actions}>
          <Button variant="primary" onClick={advance}>
            {currentIndex < questions.length - 1 ? merged.next : merged.finish}
          </Button>
        </div>
      )}
    </fieldset>
  );
}
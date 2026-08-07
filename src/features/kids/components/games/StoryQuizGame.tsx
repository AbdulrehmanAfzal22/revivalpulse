import { useState } from 'react';
import MiniGameShell from 'features/kids/components/games/MiniGameShell';
import SparkleBurst from 'features/kids/components/rewards/SparkleBurst';
import EmptyState from 'components/feedback/EmptyState';
import { QUIZ_BANK } from 'data/kids/quizBank';
import type { QuizQuestion } from 'types/quiz.types';
import type { PlayDifficulty } from 'features/kids/components/setup/PlaySetup';
import { playCorrect, playWrong } from 'services/kidSounds';
import useTranslation from 'hooks/useTranslation';
import styles from './StoryQuizGame.module.css';

/** Story Quiz Blitz: quick-fire questions straight from the kids quiz bank. */
export const STORY_QUIZ_GAME_ID = 'story-quiz';

/** Only play questions that can actually be answered: a non-empty option set
 *  and a correctIndex that points at one of them. A malformed entry can never
 *  soft-lock a session (every answer would be "wrong" forever). */
function isAnswerable(question: QuizQuestion): boolean {
  return (
    question.options.length > 0 &&
    question.correctIndex >= 0 &&
    question.correctIndex < question.options.length
  );
}

const DECK = QUIZ_BANK.filter(isAnswerable);

function deckForDifficulty(difficulty: PlayDifficulty): QuizQuestion[] {
  if (difficulty === 'medium') {
    const medium = DECK.filter((question) => question.difficulty === 'medium');
    if (medium.length > 0) return medium;
  }
  return DECK.filter((question) => question.difficulty === 'easy');
}

export interface StoryQuizGameProps {
  difficulty?: PlayDifficulty;
}

export default function StoryQuizGame({ difficulty = 'easy' }: StoryQuizGameProps) {
  const { t } = useTranslation();
  const deck = deckForDifficulty(difficulty);
  const ROUNDS = Math.min(8, deck.length);
  const [round, setRound] = useState(0);
  const [burst, setBurst] = useState<{ key: number; x: number; y: number } | null>(null);
  const [nudge, setNudge] = useState(false);

  const won = ROUNDS > 0 && round >= ROUNDS;
  const question = deck[round % deck.length];

  const restart = () => {
    setRound(0);
    setBurst(null);
    setNudge(false);
  };

  const pick = (index: number, x: number, y: number) => {
    if (won || !question) return;
    const isValidTap = index >= 0 && index < question.options.length;
    if (isValidTap && index === question.correctIndex) {
      playCorrect();
      setBurst({ key: Date.now(), x, y });
      setRound((prev) => prev + 1);
    } else {
      playWrong();
      setNudge(true);
      window.setTimeout(() => setNudge(false), 1000);
    }
  };

  const progressLabel = t('kids.gameRoundProgress', { current: Math.min(round + 1, ROUNDS), total: ROUNDS });

  return (
    <MiniGameShell
      gameId={STORY_QUIZ_GAME_ID}
      title={t('kids.gameStoryQuiz')}
      won={won}
      onRestart={restart}
      headerExtra={<span className={styles.attempts}>{progressLabel}</span>}
    >
      <div className={styles.board}>
        {burst && <SparkleBurst burstKey={burst.key} x={burst.x} y={burst.y} />}
        {nudge && (
          <div className={styles.nudge} role="status">
            {t('kids.gentleNudge')}
          </div>
        )}
        {question ? (
          <>
            <div className={styles.prompt} role="status" dir="auto">
              {question.prompt}
            </div>
            <div className={styles.grid}>
              {question.options.map((option, index) => (
                <button
                  key={`${question.id}-${index}`}
                  type="button"
                  className={styles.option}
                  onClick={(event) => {
                    const rect = event.currentTarget.getBoundingClientRect();
                    pick(index, rect.left + rect.width / 2, rect.top + rect.height / 2);
                  }}
                >
                  <span className={styles.optionNumber} aria-hidden="true">
                    {index + 1}
                  </span>
                  <span className={styles.optionText} dir="auto">
                    {option}
                  </span>
                </button>
              ))}
            </div>
          </>
        ) : (
          <EmptyState title={t('emptyState.kids.gameNotFound')} />
        )}
      </div>
    </MiniGameShell>
  );
}
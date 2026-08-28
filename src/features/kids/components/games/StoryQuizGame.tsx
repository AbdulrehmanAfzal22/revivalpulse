import { useState, useEffect } from 'react';
import MiniGameShell from 'features/kids/components/games/MiniGameShell';
import SparkleBurst from 'features/kids/components/rewards/SparkleBurst';
import EmptyState from 'components/feedback/EmptyState';
import { shuffle } from 'features/kids/games/engineUtils';
import { QUIZ_BANK } from 'data/kids/quizBank';
import type { QuizQuestion } from 'types/quiz.types';
import type { Tier } from 'features/kids/games/difficultyConfig';
import { getDifficultyConfig } from 'features/kids/games/difficultyConfig';
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

/** Shuffle a question's options and remap correctIndex so the correct answer
 *  moves to a fresh position. The authored order must never reach the screen,
 *  otherwise the right answer always sits in the same slot. */
export function shuffleOptions(question: QuizQuestion): QuizQuestion {
  const positions = shuffle(question.options.map((_, index) => index));
  return {
    ...question,
    options: positions.map((index) => question.options[index] as string),
    correctIndex: positions.indexOf(question.correctIndex),
  };
}

const BANK = QUIZ_BANK.filter(isAnswerable);

export function deckForDifficulty(filterDifficulty: string): QuizQuestion[] {
  let pool: QuizQuestion[];
  if (filterDifficulty === 'hard') {
    const hard = BANK.filter((question) => question.difficulty === 'hard');
    pool = hard.length > 0 ? hard : BANK;
  } else if (filterDifficulty === 'medium') {
    const medium = BANK.filter((question) => question.difficulty === 'medium');
    pool = medium.length > 0 ? medium : BANK;
  } else {
    const easy = BANK.filter((question) => question.difficulty === 'easy');
    pool = easy.length > 0 ? easy : BANK;
  }
  return pool.map(shuffleOptions);
}

export interface StoryQuizGameProps {
  difficulty?: Tier;
  tier?: Tier;
}

export default function StoryQuizGame({ difficulty = 'easy', tier = 'easy' }: StoryQuizGameProps) {
  const { t } = useTranslation();
  const config = getDifficultyConfig('storyquiz', tier) as {
    filterDifficulty: string;
    roundsToWin: number;
    timeLimit: number;
  };
  const [deck, setDeck] = useState<QuizQuestion[]>(() => shuffle(deckForDifficulty(config.filterDifficulty)));
  const [round, setRound] = useState(0);
  const [burst, setBurst] = useState<{ key: number; x: number; y: number } | null>(null);
  const [nudge, setNudge] = useState(false);
  const [timeLeft, setTimeLeft] = useState(config.timeLimit);

  const roundsToWin = config.roundsToWin;
  const isTimed = config.timeLimit > 0;

  const won = deck.length > 0 && round >= roundsToWin;
  const lost = isTimed && timeLeft <= 0 && !won;
  const question = deck[round % deck.length];

  // Timer
  useEffect(() => {
    if (!isTimed || won || lost) return;
    const id = window.setInterval(() => {
      setTimeLeft((prev) => {
        const next = prev - 100;
        if (next <= 0) {
          return 0;
        }
        return next;
      });
    }, 100);
    return () => window.clearInterval(id);
  }, [isTimed, won, lost]);

  const restart = () => {
    setDeck(shuffle(deckForDifficulty(config.filterDifficulty)));
    setRound(0);
    setBurst(null);
    setNudge(false);
    if (isTimed) setTimeLeft(config.timeLimit);
  };

  const pick = (index: number, x: number, y: number) => {
    if (won || lost || !question) return;
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

  const progressLabel = t('kids.gameRoundProgress', { current: Math.min(round + 1, roundsToWin), total: roundsToWin });

  return (
    <MiniGameShell
      gameId={STORY_QUIZ_GAME_ID}
      title={t('kids.gameStoryQuiz')}
      won={won}
      onRestart={restart}
      headerExtra={
        <>
          <span className={styles.attempts}>{progressLabel}</span>
          {isTimed && <span className={styles.timer} role="timer">{Math.ceil(timeLeft / 1000)}s</span>}
        </>
      }
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
        {lost && <div className={styles.timeUp}>{t('kids.gameTimeUp')}</div>}
      </div>
    </MiniGameShell>
  );
}
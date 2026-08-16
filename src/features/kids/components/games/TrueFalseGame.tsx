import { useState, useEffect } from 'react';
import { Check, X } from 'lucide-react';
import MiniGameShell from 'features/kids/components/games/MiniGameShell';
import SparkleBurst from 'features/kids/components/rewards/SparkleBurst';
import { buildTrueFalseDeck } from 'features/kids/games/trueFalseDeck';
import type { TrueFalseQuestion } from 'types/quiz.types';
import type { Tier } from 'features/kids/games/difficultyConfig';
import { getDifficultyConfig } from 'features/kids/games/difficultyConfig';
import { playCorrect, playWrong } from 'services/kidSounds';
import useTranslation from 'hooks/useTranslation';
import styles from './TrueFalseGame.module.css';

/** True or False: decide if the statement about Islam is true or false. */
export const TRUE_FALSE_GAME_ID = 'true-false';

export interface TrueFalseGameProps {
  difficulty?: Tier;
  tier?: Tier;
}

export default function TrueFalseGame({ difficulty = 'easy', tier = 'easy' }: TrueFalseGameProps) {
  const { t } = useTranslation();
  const config = getDifficultyConfig('truefalse', tier) as {
    roundsToWin: number;
    timeLimit: number;
  };
  const roundsToWin = config.roundsToWin;
  const isTimed = config.timeLimit > 0;

  const [deck, setDeck] = useState<TrueFalseQuestion[]>(() =>
    buildTrueFalseDeck(tier, roundsToWin),
  );
  const [round, setRound] = useState(0);
  const [burst, setBurst] = useState<{ key: number; x: number; y: number } | null>(null);
  const [nudge, setNudge] = useState(false);
  const [timeLeft, setTimeLeft] = useState(config.timeLimit);
  const [timerActive, setTimerActive] = useState(false);

  const won = deck.length > 0 && round >= roundsToWin;
  const lost = isTimed && timeLeft <= 0 && !won;
  const statement = deck[round % deck.length];

  // Timer
  useEffect(() => {
    if (!isTimed || won || lost) return;
    setTimerActive(true);
    const id = window.setInterval(() => {
      setTimeLeft((prev) => {
        const next = prev - 100;
        if (next <= 0) {
          setTimerActive(false);
          return 0;
        }
        return next;
      });
    }, 100);
    return () => window.clearInterval(id);
  }, [isTimed, won, lost]);

  const restart = () => {
    setDeck(buildTrueFalseDeck(tier, roundsToWin));
    setRound(0);
    setBurst(null);
    setNudge(false);
    if (isTimed) setTimeLeft(config.timeLimit);
  };

  const answer = (chosen: boolean, x: number, y: number) => {
    if (won || lost || !statement) return;
    if (chosen === statement.answer) {
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
      gameId={TRUE_FALSE_GAME_ID}
      title={t('kids.gameTrueFalse')}
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
        <div className={styles.statement} role="status" dir="auto">
          {statement?.prompt}
        </div>
        <div className={styles.actions}>
          <button
            type="button"
            className={styles.trueButton}
            onClick={(event) => {
              const rect = event.currentTarget.getBoundingClientRect();
              answer(true, rect.left + rect.width / 2, rect.top + rect.height / 2);
            }}
            aria-label={t('kids.true')}
          >
            <Check size={30} strokeWidth={3} aria-hidden="true" />
            <span>{t('kids.true')}</span>
          </button>
          <button
            type="button"
            className={styles.falseButton}
            onClick={(event) => {
              const rect = event.currentTarget.getBoundingClientRect();
              answer(false, rect.left + rect.width / 2, rect.top + rect.height / 2);
            }}
            aria-label={t('kids.false')}
          >
            <X size={30} strokeWidth={3} aria-hidden="true" />
            <span>{t('kids.false')}</span>
          </button>
        </div>
        {lost && <div className={styles.timeUp}>{t('kids.gameTimeUp')}</div>}
      </div>
    </MiniGameShell>
  );
}
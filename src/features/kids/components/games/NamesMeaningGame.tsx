import { useState, useEffect } from 'react';
import MiniGameShell from 'features/kids/components/games/MiniGameShell';
import SparkleBurst from 'features/kids/components/rewards/SparkleBurst';
import { shuffle } from 'features/kids/games/engineUtils';
import { getNamesMeaningItems } from 'data/kids/namesMeaning';
import type { NamesMeaningItem } from 'data/kids/namesMeaning';
import type { Tier } from 'features/kids/games/difficultyConfig';
import { getDifficultyConfig } from 'features/kids/games/difficultyConfig';
import { playCorrect, playWrong } from 'services/kidSounds';
import useTranslation from 'hooks/useTranslation';
import styles from './NamesMeaningGame.module.css';

/** 99 Names Meaning Match: given a Name, tap its correct meaning */
export const NAMES_MEANING_GAME_ID = 'names-meaning';

interface RoundState {
  name: NamesMeaningItem;
  options: NamesMeaningItem['meaningOptions'];
}

function makeRound(pool: NamesMeaningItem[], optionCount: number): RoundState {
  if (pool.length === 0) {
    throw new Error('No names available for the selected difficulty');
  }
  const name = pool[Math.floor(Math.random() * pool.length)] as NamesMeaningItem;
  const correctMeaning = name.meaning;
  const otherMeanings = pool.filter(n => n.id !== name.id).map(n => n.meaning);
  const shuffled = shuffle(otherMeanings);
  const decoys = shuffled.slice(0, optionCount - 1);
  const options = shuffle([correctMeaning, ...decoys]);
  return { name, options };
}

export interface NamesMeaningGameProps {
  difficulty?: Tier;
  tier?: Tier;
}

export default function NamesMeaningGame({ difficulty = 'easy', tier = 'easy' }: NamesMeaningGameProps) {
  const { t } = useTranslation();
  const config = getDifficultyConfig('namesmeaning', tier) as {
    optionCount: number;
    roundsToWin: number;
    timeLimit: number;
    scoreMultiplier: number;
    showArabic: boolean;
    showTransliteration: boolean;
  };
  const optionCount = config.optionCount;
  const roundsToWin = config.roundsToWin;
  const isTimed = config.timeLimit > 0;
  const showArabic = config.showArabic;
  const showTransliteration = config.showTransliteration;

  const pool = getNamesMeaningItems();

  const [round, setRound] = useState(0);
  const [state, setState] = useState<RoundState>(() => makeRound(pool, optionCount));
  const [burst, setBurst] = useState<{ key: number; x: number; y: number } | null>(null);
  const [nudge, setNudge] = useState(false);
  const [timeLeft, setTimeLeft] = useState(config.timeLimit);

  const won = round >= roundsToWin;
  const lost = isTimed && timeLeft <= 0 && !won;

  // Timer
  useEffect(() => {
    if (!isTimed || won || lost) return;
    const id = window.setInterval(() => {
      setTimeLeft(prev => {
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
    setRound(0);
    setState(makeRound(pool, optionCount));
    setBurst(null);
    setNudge(false);
    if (isTimed) setTimeLeft(config.timeLimit);
  };

  const pick = (meaning: string, x: number, y: number) => {
    if (won || lost) return;
    if (meaning === state.name.meaning) {
      playCorrect();
      setBurst({ key: Date.now(), x, y });
      setTimeout(() => {
        setRound(r => r + 1);
        setState(makeRound(pool, optionCount));
        setBurst(null);
        setNudge(false);
      }, 800);
    } else {
      playWrong();
      setNudge(true);
      window.setTimeout(() => setNudge(false), 1000);
    }
  };

  const progressLabel = t('kids.gameRoundProgress', { current: Math.min(round + 1, roundsToWin), total: roundsToWin });

  return (
    <MiniGameShell
      gameId={NAMES_MEANING_GAME_ID}
      title={t('kids.gameNamesMeaning')}
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
        <div className={styles.nameCard} role="status">
          {showArabic && (
            <div className={styles.nameArabic} dir="rtl" lang="ar">
              {state.name.arabic}
            </div>
          )}
          {showTransliteration && (
            <div className={styles.nameTransliteration}>
              {state.name.transliteration}
            </div>
          )}
          <div className={styles.nameNumber}>
            {t('kids.nameNumber', { number: state.name.number })}
          </div>
        </div>
        <div className={styles.prompt}>
          {t('kids.namesMeaningPrompt')}
        </div>
        <div className={styles.optionsGrid}>
          {state.options.map((meaning, index) => (
            <button
              key={meaning}
              type="button"
              className={styles.option}
              onClick={e => {
                const rect = e.currentTarget.getBoundingClientRect();
                pick(meaning, rect.left + rect.width / 2, rect.top + rect.height / 2);
              }}
              disabled={won || lost}
            >
              <span className={styles.optionNumber} aria-hidden="true">
                {index + 1}
              </span>
              <span className={styles.optionText}>{meaning}</span>
            </button>
          ))}
        </div>
        {lost && <div className={styles.timeUp}>{t('kids.gameTimeUp')}</div>}
      </div>
    </MiniGameShell>
  );
}
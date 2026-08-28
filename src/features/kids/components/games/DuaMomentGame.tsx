import { useState, useEffect, useRef, useCallback } from 'react';
import MiniGameShell from 'features/kids/components/games/MiniGameShell';
import SparkleBurst from 'features/kids/components/rewards/SparkleBurst';
import { shuffle } from 'features/kids/games/engineUtils';
import { getDuaMomentItems } from 'data/kids/duaMoment';
import type { DuaMomentItem } from 'data/kids/duaMoment';
import type { Tier } from 'features/kids/games/difficultyConfig';
import { getDifficultyConfig } from 'features/kids/games/difficultyConfig';
import { playCorrect, playWrong } from 'services/kidSounds';
import useTranslation from 'hooks/useTranslation';
import styles from './DuaMomentGame.module.css';

/** Dua for the Moment: given situation icon, tap matching short dua */
export const DUA_MOMENT_GAME_ID = 'dua-moment';

interface RoundState {
  situation: DuaMomentItem['situation'];
  correctDua: DuaMomentItem['dua'];
  options: DuaMomentItem['dua'][];
}

/**
 * Build the round for the given target item. Decoys are drawn from the full
 * difficulty pool and never include an item whose Arabic text equals the
 * target's (two buttons with identical Arabic would both be "correct").
 */
function makeRound(correctItem: DuaMomentItem, optionCount: number, decoyPool: DuaMomentItem[]): RoundState {
  const correctDua = correctItem.dua;
  const otherDuas = decoyPool
    .filter(d => d.id !== correctItem.id && d.dua.arabic !== correctItem.dua.arabic)
    .map(d => d.dua);
  const decoys = shuffle(otherDuas).slice(0, optionCount - 1);
  const options = shuffle([correctDua, ...decoys]);
  return {
    situation: correctItem.situation,
    correctDua,
    options,
  };
}

export interface DuaMomentGameProps {
  difficulty?: Tier;
  tier?: Tier;
}

export default function DuaMomentGame({ difficulty = 'easy', tier = 'easy' }: DuaMomentGameProps) {
  const { t } = useTranslation();
  const config = getDifficultyConfig('duamoment', tier) as {
    optionCount: number;
    roundsToWin: number;
    timeLimit: number;
    scoreMultiplier: number;
    showArabic: boolean;
    showTranslation: boolean;
  };
  const optionCount = config.optionCount;
  const roundsToWin = config.roundsToWin;
  const isTimed = config.timeLimit > 0;
  const showArabic = config.showArabic;
  const showTranslation = config.showTranslation;

  // Decoys may come from the whole difficulty pool; targets are drawn from a
  // shuffled deck without replacement so a session never repeats a situation.
  const decoyPool = getDuaMomentItems(200, tier as 'easy' | 'medium' | 'hard');
  const deckRef = useRef<DuaMomentItem[]>([]);

  const drawItem = useCallback((): DuaMomentItem => {
    if (deckRef.current.length === 0) {
      deckRef.current = shuffle(decoyPool);
    }
    return deckRef.current.pop() as DuaMomentItem;
  }, [decoyPool]);

  const [round, setRound] = useState(0);
  const [state, setState] = useState<RoundState>(() => makeRound(drawItem(), optionCount, decoyPool));
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
    setState(makeRound(drawItem(), optionCount, decoyPool));
    setBurst(null);
    setNudge(false);
    if (isTimed) setTimeLeft(config.timeLimit);
  };

  const nextRound = () => {
    setRound(r => r + 1);
    setState(makeRound(drawItem(), optionCount, decoyPool));
    setBurst(null);
    setNudge(false);
  };

  const pick = (dua: DuaMomentItem['dua'], x: number, y: number) => {
    if (won || lost) return;
    if (dua.arabic === state.correctDua.arabic) {
      playCorrect();
      setBurst({ key: Date.now(), x, y });
      setTimeout(nextRound, 800);
    } else {
      playWrong();
      setNudge(true);
      window.setTimeout(() => setNudge(false), 1000);
    }
  };

  const progressLabel = t('kids.gameRoundProgress', { current: Math.min(round + 1, roundsToWin), total: roundsToWin });

  return (
    <MiniGameShell
      gameId={DUA_MOMENT_GAME_ID}
      title={t('kids.gameDuaMoment')}
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
        <div className={styles.situationCard} role="status">
          <span className={styles.situationIcon}>{state.situation.icon}</span>
          <span className={styles.situationText}>{state.situation.en}</span>
        </div>
        <div className={styles.prompt}>
          {t('kids.duaMomentPrompt')}
        </div>
        <div className={styles.optionsGrid}>
          {state.options.map((dua, index) => (
            <button
              key={dua.arabic}
              type="button"
              className={styles.option}
              onClick={e => {
                const rect = e.currentTarget.getBoundingClientRect();
                pick(dua, rect.left + rect.width / 2, rect.top + rect.height / 2);
              }}
              disabled={won || lost}
            >
              <span className={styles.optionNumber} aria-hidden="true">
                {index + 1}
              </span>
              <div className={styles.optionContent}>
                {showArabic && (
                  <div className={styles.optionArabic} dir="rtl" lang="ar">
                    {dua.arabic}
                  </div>
                )}
                {showTranslation && (
                  <div className={styles.optionTranslation}>
                    {dua.translation.en}
                  </div>
                )}
                <div className={styles.optionTransliteration}>
                  {dua.transliteration}
                </div>
              </div>
            </button>
          ))}
        </div>
        {lost && <div className={styles.timeUp}>{t('kids.gameTimeUp')}</div>}
      </div>
    </MiniGameShell>
  );
}
import { useState } from 'react';
import { Star } from 'lucide-react';
import MiniGameShell from 'features/kids/components/games/MiniGameShell';
import SparkleBurst from 'features/kids/components/rewards/SparkleBurst';
import { shuffle } from 'features/kids/games/engineUtils';
import type { Tier } from 'features/kids/games/difficultyConfig';
import { getDifficultyConfig } from 'features/kids/games/difficultyConfig';
import { playCorrect, playWrong } from 'services/kidSounds';
import useTranslation from 'hooks/useTranslation';
import styles from './CountStarsGame.module.css';

/** Count the Stars: count the stars, tap the matching Arabic numeral. Numbers pack. */
export const COUNT_STARS_GAME_ID = 'count-stars';

const ROUNDS = 8;

interface RoundState {
  count: number;
  options: number[];
}

function makeRound(round: number, config: { minCount: number; maxCount: number; spread: number }): RoundState {
  const min = config.minCount;
  const count = min + (round % (config.maxCount + 1 - min));
  const spread = config.spread;
  const candidates = [...new Set([count - spread, count, count + spread])].filter(
    (n) => n >= 1 && n <= 10,
  );
  return { count, options: shuffle(candidates) };
}

export interface CountStarsGameProps {
  difficulty?: Tier;
}

function toArabicNumeral(n: number): string {
  return String(n).replace(/\d/g, (d) => '٠١٢٣٤٥٦٧٨٩'[Number(d)] as string);
}

export default function CountStarsGame({ difficulty = 'easy' }: CountStarsGameProps) {
  const { t } = useTranslation();
  const config = getDifficultyConfig('countstars', difficulty) as { minCount: number; maxCount: number; spread: number };
  const [round, setRound] = useState(0);
  const [state, setState] = useState<RoundState>(() => makeRound(0, config));
  const [burst, setBurst] = useState<{ key: number; x: number; y: number } | null>(null);
  const [nudge, setNudge] = useState(false);

  const won = round >= ROUNDS;

  const restart = () => {
    setRound(0);
    setState(makeRound(0, config));
    setBurst(null);
    setNudge(false);
  };

  const pick = (value: number, x: number, y: number) => {
    if (won) return;
    if (value === state.count) {
      playCorrect();
      setBurst({ key: Date.now(), x, y });
      const nextRound = round + 1;
      setRound(nextRound);
      setState(makeRound(nextRound, config));
    } else {
      playWrong();
      setNudge(true);
      window.setTimeout(() => setNudge(false), 1000);
    }
  };

  const progressLabel = t('kids.gameRoundProgress', { current: Math.min(round + 1, ROUNDS), total: ROUNDS });

  return (
    <MiniGameShell
      gameId={COUNT_STARS_GAME_ID}
      title={t('kids.gameCountStars')}
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
        <div className={styles.prompt}>{t('kids.gameCountPrompt')}</div>
        <div className={styles.starField} role="img" aria-label={String(state.count)}>
          {Array.from({ length: state.count }, (_, index) => (
            <Star key={index} size={44} fill="currentColor" strokeWidth={1.5} aria-hidden="true" />
          ))}
        </div>
        <div className={styles.grid}>
          {state.options.map((value) => (
            <button
              key={value}
              type="button"
              className={styles.option}
              onClick={(event) => {
                const rect = event.currentTarget.getBoundingClientRect();
                pick(value, rect.left + rect.width / 2, rect.top + rect.height / 2);
              }}
              aria-label={String(value)}
            >
              <span className={styles.optionText} dir="rtl">
                {toArabicNumeral(value)}
              </span>
            </button>
          ))}
        </div>
      </div>
    </MiniGameShell>
  );
}
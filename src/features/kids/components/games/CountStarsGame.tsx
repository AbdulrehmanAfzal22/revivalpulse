import { useState } from 'react';
import { Star } from 'lucide-react';
import MiniGameShell from 'features/kids/components/games/MiniGameShell';
import SparkleBurst from 'features/kids/components/rewards/SparkleBurst';
import { shuffle } from 'features/kids/games/engineUtils';
import type { PlayDifficulty } from 'features/kids/components/setup/PlaySetup';
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

function makeRound(round: number, difficulty: PlayDifficulty): RoundState {
  const min = difficulty === 'medium' ? 4 : 2;
  const count = min + (round % (11 - min));
  const spread = difficulty === 'medium' ? 2 : 1;
  const candidates = [...new Set([count - spread, count, count + spread])].filter(
    (n) => n >= 1 && n <= 10,
  );
  return { count, options: shuffle(candidates) };
}

export interface CountStarsGameProps {
  difficulty?: PlayDifficulty;
}

function toArabicNumeral(n: number): string {
  return String(n).replace(/\d/g, (d) => '٠١٢٣٤٥٦٧٨٩'[Number(d)] as string);
}

export default function CountStarsGame({ difficulty = 'easy' }: CountStarsGameProps) {
  const { t } = useTranslation();
  const [round, setRound] = useState(0);
  const [state, setState] = useState<RoundState>(() => makeRound(0, difficulty));
  const [burst, setBurst] = useState<{ key: number; x: number; y: number } | null>(null);
  const [nudge, setNudge] = useState(false);

  const won = round >= ROUNDS;

  const restart = () => {
    setRound(0);
    setState(makeRound(0, difficulty));
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
      setState(makeRound(nextRound, difficulty));
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
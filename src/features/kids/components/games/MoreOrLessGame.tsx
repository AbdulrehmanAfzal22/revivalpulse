import { useState } from 'react';
import { Star } from 'lucide-react';
import MiniGameShell from 'features/kids/components/games/MiniGameShell';
import SparkleBurst from 'features/kids/components/rewards/SparkleBurst';
import type { PlayDifficulty } from 'features/kids/components/setup/PlaySetup';
import { playCorrect, playWrong } from 'services/kidSounds';
import useTranslation from 'hooks/useTranslation';
import styles from './MoreOrLessGame.module.css';

/** More or Less: compare two star groups, tap the side with more (or fewer). */
export const MORE_LESS_GAME_ID = 'more-or-less';

const ROUNDS = 8;

interface RoundState {
  a: number;
  b: number;
  wantMore: boolean;
  correct: 'a' | 'b';
}

function makeRound(round: number, difficulty: PlayDifficulty): RoundState {
  const a = 2 + Math.floor(Math.random() * 8);
  if (difficulty === 'medium') {
    // Groups are 1 apart — the child must actually count both groups.
    let b = Math.min(10, Math.max(2, a + (Math.random() < 0.5 ? -1 : 1)));
    if (b === a) b = a < 10 ? a + 1 : a - 1;
    const wantMore = round % 2 === 0;
    const correct: 'a' | 'b' = wantMore ? (a > b ? 'a' : 'b') : a < b ? 'a' : 'b';
    return { a, b, wantMore, correct };
  }
  // Easy keeps a clear visual gap (>= 3) so the bigger side pops out.
  let b = 2 + Math.floor(Math.random() * 8);
  if (Math.abs(a - b) < 3) b = Math.min(10, Math.max(2, a + (a > b ? -3 : 3)));
  const wantMore = round % 2 === 0;
  const correct: 'a' | 'b' = wantMore ? (a > b ? 'a' : 'b') : a < b ? 'a' : 'b';
  return { a, b, wantMore, correct };
}

export interface MoreLittleGameProps {
  difficulty?: PlayDifficulty;
}

export default function MoreOrLessGame({ difficulty = 'easy' }: MoreLittleGameProps) {
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

  const pick = (side: 'a' | 'b', x: number, y: number) => {
    if (won) return;
    if (side === state.correct) {
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

  const promptLabel = state.wantMore ? t('kids.gameMorePrompt') : t('kids.gameLessPrompt');
  const progressLabel = t('kids.gameRoundProgress', { current: Math.min(round + 1, ROUNDS), total: ROUNDS });

  const group = (side: 'a' | 'b'): number => (side === 'a' ? state.a : state.b);

  return (
    <MiniGameShell
      gameId={MORE_LESS_GAME_ID}
      title={t('kids.gameMoreLess')}
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
        <div className={styles.prompt}>{promptLabel}</div>
        <div className={styles.grid}>
          {(['a', 'b'] as const).map((side) => (
            <button
              key={side}
              type="button"
              className={styles.option}
              onClick={(event) => {
                const rect = event.currentTarget.getBoundingClientRect();
                pick(side, rect.left + rect.width / 2, rect.top + rect.height / 2);
              }}
              aria-label={String(group(side))}
            >
              <div className={styles.stars} aria-hidden="true">
                {Array.from({ length: group(side) }, (_, index) => (
                  <Star key={index} size={26} fill="currentColor" strokeWidth={1.5} />
                ))}
              </div>
            </button>
          ))}
        </div>
      </div>
    </MiniGameShell>
  );
}
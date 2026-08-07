import { useState } from 'react';
import MiniGameShell from 'features/kids/components/games/MiniGameShell';
import SparkleBurst from 'features/kids/components/rewards/SparkleBurst';
import { pickTarget, pickDecoys } from 'features/kids/games/engineUtils';
import { KIDS_STUDY_NUMBERS } from 'data/kids/gameContent';
import type { StudyItem } from 'data/kids/gameContent';
import type { PlayDifficulty } from 'features/kids/components/setup/PlaySetup';
import { playCorrect, playWrong } from 'services/kidSounds';
import useTranslation from 'hooks/useTranslation';
import styles from './BigSmallGame.module.css';

/** Big or Small: which numeral is bigger (or smaller)? Numbers pack only. */
export const BIG_SMALL_GAME_ID = 'big-small';

const ROUNDS = 10;

interface Round {
  a: StudyItem;
  b: StudyItem;
  wantBigger: boolean;
}

function adjacentNumeral(item: StudyItem): StudyItem {
  const index = KIDS_STUDY_NUMBERS.findIndex((n) => n.id === item.id);
  if (index < 0) return (pickDecoys('numbers', item, 1)[0] as StudyItem) ?? item;
  const next = KIDS_STUDY_NUMBERS[index + 1];
  const prev = KIDS_STUDY_NUMBERS[index - 1];
  const candidate = next ?? prev;
  return candidate ?? item;
}

function makeRound(round: number, difficulty: PlayDifficulty): Round {
  const a = pickTarget('numbers', round);
  // Medium pairs the numeral with its direct neighbour, so the child has to
  // really know the values; easy offers a clear, distant comparison.
  const b =
    difficulty === 'medium'
      ? adjacentNumeral(a)
      : (pickDecoys('numbers', a, 1)[0] as StudyItem);
  return { a, b, wantBigger: round % 2 === 0 };
}

export interface BigSmallGameProps {
  difficulty?: PlayDifficulty;
}

export default function BigSmallGame({ difficulty = 'easy' }: BigSmallGameProps) {
  const { t } = useTranslation();
  const [round, setRound] = useState(0);
  const [state, setState] = useState<Round>(() => makeRound(0, difficulty));
  const [burst, setBurst] = useState<{ key: number; x: number; y: number } | null>(null);
  const [nudge, setNudge] = useState(false);

  const won = round >= ROUNDS;

  const restart = () => {
    setRound(0);
    setState(makeRound(0, difficulty));
    setBurst(null);
    setNudge(false);
  };

  const pick = (item: StudyItem, x: number, y: number) => {
    if (won) return;
    const correct =
      state.wantBigger
        ? item.order === Math.max(state.a.order, state.b.order)
        : item.order === Math.min(state.a.order, state.b.order);
    if (correct) {
      playCorrect();
      setBurst({ key: Date.now(), x, y });
      setRound((r) => r + 1);
      setState(makeRound(round + 1, difficulty));
    } else {
      playWrong();
      setNudge(true);
      window.setTimeout(() => setNudge(false), 1000);
    }
  };

  const promptLabel = state.wantBigger ? t('kids.gameWhichBigger') : t('kids.gameWhichSmaller');
  const progressLabel = t('kids.gameRoundProgress', {
    current: Math.min(round + 1, ROUNDS),
    total: ROUNDS,
  });

  return (
    <MiniGameShell
      gameId={BIG_SMALL_GAME_ID}
      title={t('kids.gameBigSmall')}
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
        <div className={styles.prompt} role="status">
          {promptLabel}
        </div>
        <div className={styles.grid}>
          {[state.a, state.b].map((item) => (
            <button
              key={item.id}
              type="button"
              className={styles.option}
              onClick={(event) => {
                const rect = event.currentTarget.getBoundingClientRect();
                pick(item, rect.left + rect.width / 2, rect.top + rect.height / 2);
              }}
              aria-label={item.face}
            >
              <span className={styles.optionText} dir="rtl">
                {item.face}
              </span>
            </button>
          ))}
        </div>
      </div>
    </MiniGameShell>
  );
}

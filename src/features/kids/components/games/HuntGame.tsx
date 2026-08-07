import { useState } from 'react';
import MiniGameShell from 'features/kids/components/games/MiniGameShell';
import SparkleBurst from 'features/kids/components/rewards/SparkleBurst';
import StudyTopicChips from 'features/kids/components/games/StudyTopicChips';
import { pickTarget, pickDecoys, shuffle } from 'features/kids/games/engineUtils';
import { KIDS_STUDY_SETS } from 'data/kids/gameContent';
import type { KidsStudyTopic, StudyItem } from 'data/kids/gameContent';
import type { PlayDifficulty } from 'features/kids/components/setup/PlaySetup';
import { playCorrect, playWrong } from 'services/kidSounds';
import useTranslation from 'hooks/useTranslation';
import styles from './HuntGame.module.css';

/** Letter Hunt: find every tile showing the target face hidden in a field. */
export const HUNT_GAME_ID = 'letter-hunt';

const CELL_COUNT = 20;
const MEDIUM_CELL_COUNT = 25;
const TARGET_COUNT = 5;

export interface HuntGameProps {
  difficulty?: PlayDifficulty;
}

interface BoardCell {
  key: string;
  item: StudyItem;
}

function buildBoard(
  pack: KidsStudyTopic,
  difficulty: PlayDifficulty,
): { cells: BoardCell[]; target: StudyItem } {
  const target = pickTarget(pack, Math.floor(Math.random() * KIDS_STUDY_SETS[pack].length));
  // Medium widens the grid to 25 cells so there is more to scan — but only
  // when the pool can fill it without shrinking (numbers=10, words=14 items).
  const wanted = difficulty === 'medium' ? MEDIUM_CELL_COUNT : CELL_COUNT;
  // Cap the grid to what the pool can actually fill. pickDecoys clips at the
  // pool size, so asking for more than the pool holds would silently shrink
  // the board below CELL_COUNT (e.g. numbers=10, words=14 items).
  const gridSize = Math.min(wanted, KIDS_STUDY_SETS[pack].length);
  const decoyCount = Math.max(0, gridSize - TARGET_COUNT);
  const decoys = pickDecoys(pack, target, decoyCount);
  const cells = shuffle([
    ...Array.from({ length: TARGET_COUNT }, (_, i) => ({ key: `t-${i}`, item: target })),
    ...decoys.map((item, i) => ({ key: `d-${i}`, item })),
  ]);
  return { cells, target };
}

export default function HuntGame({ difficulty = 'easy' }: HuntGameProps) {
  const { t } = useTranslation();
  const [pack, setPack] = useState<KidsStudyTopic>('letters');
  const [board, setBoard] = useState<{ cells: BoardCell[]; target: StudyItem }>(() =>
    buildBoard('letters', difficulty),
  );
  const [found, setFound] = useState<string[]>([]);
  const [burst, setBurst] = useState<{ key: number; x: number; y: number } | null>(null);
  const [nudge, setNudge] = useState(false);

  const won = found.length === TARGET_COUNT;

  const restart = () => {
    setBoard(buildBoard(pack, difficulty));
    setFound([]);
    setBurst(null);
    setNudge(false);
  };

  const changePack = (next: KidsStudyTopic) => {
    if (next === pack) return;
    setPack(next);
    setBoard(buildBoard(next, difficulty));
    setFound([]);
    setBurst(null);
    setNudge(false);
  };

  const tap = (cell: BoardCell, x: number, y: number) => {
    if (won || found.includes(cell.key)) return;
    if (cell.item.id === board.target.id) {
      playCorrect();
      setFound((prev) => [...prev, cell.key]);
      setBurst({ key: Date.now(), x, y });
      setNudge(false);
    } else {
      playWrong();
      setNudge(true);
      window.setTimeout(() => setNudge(false), 900);
    }
  };

  const findLabel = t('kids.gameFindAll', { count: TARGET_COUNT, item: board.target.name });

  return (
    <MiniGameShell
      gameId={HUNT_GAME_ID}
      title={t('kids.gameHunt')}
      won={won}
      onRestart={restart}
    >
      <StudyTopicChips topic={pack} onChange={changePack} />

      <div className={styles.board}>
        {burst && <SparkleBurst burstKey={burst.key} x={burst.x} y={burst.y} />}
        {nudge && (
          <div className={styles.nudge} role="status">
            {t('kids.gentleNudge')}
          </div>
        )}
        <div className={styles.prompt} role="status">
          {findLabel}
        </div>
        <div className={styles.grid}>
          {board.cells.map((cell) => {
            const isFound = found.includes(cell.key);
            return (
              <button
                key={cell.key}
                type="button"
                className={[styles.cell, isFound && styles.cellFound].filter(Boolean).join(' ')}
                onClick={(event) => {
                  const rect = event.currentTarget.getBoundingClientRect();
                  tap(cell, rect.left + rect.width / 2, rect.top + rect.height / 2);
                }}
                aria-label={isFound ? t('kids.gameHuntFound') : cell.item.face}
              >
                <span className={styles.cellText} dir="rtl">
                  {cell.item.face}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </MiniGameShell>
  );
}

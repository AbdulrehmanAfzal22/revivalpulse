import { useEffect, useState } from 'react';
import MiniGameShell from 'features/kids/components/games/MiniGameShell';
import SparkleBurst from 'features/kids/components/rewards/SparkleBurst';
import StudyTopicChips from 'features/kids/components/games/StudyTopicChips';
import { pickTarget, pickDecoys, shuffle } from 'features/kids/games/engineUtils';
import { KIDS_STUDY_SETS } from 'data/kids/gameContent';
import type { KidsStudyTopic, StudyItem } from 'data/kids/gameContent';
import type { Tier } from 'features/kids/games/difficultyConfig';
import { getDifficultyConfig } from 'features/kids/games/difficultyConfig';
import { playCorrect, playWrong } from 'services/kidSounds';
import useTranslation from 'hooks/useTranslation';
import styles from './HuntGame.module.css';

/** Letter Hunt: find every tile showing the target face hidden in a field. */
export const HUNT_GAME_ID = 'letter-hunt';

interface BoardCell {
  key: string;
  item: StudyItem;
}

function buildBoard(
  pack: KidsStudyTopic,
  config: { cellCount: number; targetCount: number },
): { cells: BoardCell[]; target: StudyItem } {
  const target = pickTarget(pack, Math.floor(Math.random() * KIDS_STUDY_SETS[pack].length));
  const wanted = config.cellCount;
  const targetCount = config.targetCount;
  const gridSize = Math.min(wanted, KIDS_STUDY_SETS[pack].length);
  const decoyCount = Math.max(0, gridSize - targetCount);
  const decoys = pickDecoys(pack, target, decoyCount);
  const cells = shuffle([
    ...Array.from({ length: targetCount }, (_, i) => ({ key: `t-${i}`, item: target })),
    ...decoys.map((item, i) => ({ key: `d-${i}`, item })),
  ]);
  return { cells, target };
}

export interface HuntGameProps {
  difficulty?: Tier;
  tier?: Tier;
}

export default function HuntGame({ difficulty = 'easy', tier = 'easy' }: HuntGameProps) {
  const { t } = useTranslation();
  const config = getDifficultyConfig('hunt', tier) as {
    cellCount: number;
    targetCount: number;
    timeLimit: number;
    scoreMultiplier: number;
    highlightTarget: boolean;
  };
  const [pack, setPack] = useState<KidsStudyTopic>('letters');
  const [board, setBoard] = useState<{ cells: BoardCell[]; target: StudyItem }>(() =>
    buildBoard('letters', config),
  );
  const [found, setFound] = useState<string[]>([]);
  const [burst, setBurst] = useState<{ key: number; x: number; y: number } | null>(null);
  const [nudge, setNudge] = useState(false);
  const [timeLeft, setTimeLeft] = useState(config.timeLimit);
  const [timerActive, setTimerActive] = useState(false);

  const targetCount = config.targetCount;
  const isTimed = config.timeLimit > 0;

  const won = found.length === targetCount;
  const lost = isTimed && timeLeft <= 0 && !won;

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
    setBoard(buildBoard(pack, config));
    setFound([]);
    setBurst(null);
    setNudge(false);
    if (isTimed) {
      setTimeLeft(config.timeLimit);
    }
  };

  const changePack = (next: KidsStudyTopic) => {
    if (next === pack) return;
    setPack(next);
    setBoard(buildBoard(next, config));
    setFound([]);
    setBurst(null);
    setNudge(false);
    if (isTimed) {
      setTimeLeft(config.timeLimit);
    }
  };

  const tap = (cell: BoardCell, x: number, y: number) => {
    if (won || lost || found.includes(cell.key)) return;
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

  const findLabel = t('kids.gameFindAll', { count: targetCount, item: board.target.name });

  return (
    <MiniGameShell
      gameId={HUNT_GAME_ID}
      title={t('kids.gameHunt')}
      won={won}
      onRestart={restart}
      headerExtra={isTimed && <span className={styles.timer} role="timer">{Math.ceil(timeLeft / 1000)}s</span>}
    >
      <StudyTopicChips topic={pack} onChange={changePack} />

      <div className={styles.board}>
        {burst && <SparkleBurst burstKey={burst.key} x={burst.x} y={burst.y} />}
        {nudge && (
          <div className={styles.nudge} role="status">
            {t('kids.gentleNudge')}
          </div>
        )}
        {config.highlightTarget && !won && (
          <div className={styles.targetHint} role="status">
            {t('kids.gameHuntTargetHint', { item: board.target.face })}
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
                disabled={won || lost}
              >
                <span className={styles.cellText} dir="rtl">
                  {cell.item.face}
                </span>
              </button>
            );
          })}
        </div>
        {lost && <div className={styles.timeUp}>{t('kids.gameTimeUp')}</div>}
      </div>
    </MiniGameShell>
  );
}
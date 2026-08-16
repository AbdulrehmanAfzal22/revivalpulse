import { useState } from 'react';
import MiniGameShell from 'features/kids/components/games/MiniGameShell';
import SparkleBurst from 'features/kids/components/rewards/SparkleBurst';
import StudyTopicChips from 'features/kids/components/games/StudyTopicChips';
import { sample, shuffle } from 'features/kids/games/engineUtils';
import { KIDS_STUDY_SETS } from 'data/kids/gameContent';
import type { KidsStudyTopic, StudyItem } from 'data/kids/gameContent';
import type { Tier } from 'features/kids/games/difficultyConfig';
import { getDifficultyConfig } from 'features/kids/games/difficultyConfig';
import { playCorrect, playWrong } from 'services/kidSounds';
import useTranslation from 'hooks/useTranslation';
import styles from './OrderGame.module.css';

/** Put It in Order: tap the tiles in the right sequence (alphabet, counting). */
export const ORDER_GAME_ID = 'order-line';

interface Round {
  ordered: StudyItem[];
  pool: StudyItem[];
}

function makeRound(pack: KidsStudyTopic, count: number): Round {
  const ordered = [...sample(KIDS_STUDY_SETS[pack], count)].sort((a, b) => a.order - b.order);
  return { ordered, pool: shuffle(ordered) };
}

export interface OrderGameProps {
  difficulty?: Tier;
}

export default function OrderGame({ difficulty = 'easy' }: OrderGameProps) {
  const { t } = useTranslation();
  const config = getDifficultyConfig('order', difficulty) as { itemCount: number; maxGap: number };
  const tileCount = config.itemCount;
  const [pack, setPack] = useState<KidsStudyTopic>('letters');
  const [state, setState] = useState<Round>(() => makeRound('letters', tileCount));
  const [placedCount, setPlacedCount] = useState(0);
  const [burst, setBurst] = useState<{ key: number; x: number; y: number } | null>(null);
  const [nudge, setNudge] = useState(false);

  const won = placedCount >= state.ordered.length;

  const restart = () => {
    setState(makeRound(pack, tileCount));
    setPlacedCount(0);
    setBurst(null);
    setNudge(false);
  };

  const changePack = (next: KidsStudyTopic) => {
    if (next === pack) return;
    setPack(next);
    setState(makeRound(next, tileCount));
    setPlacedCount(0);
    setBurst(null);
    setNudge(false);
  };

  const tap = (item: StudyItem, x: number, y: number) => {
    if (won) return;
    if (item.id === state.ordered[placedCount]?.id) {
      playCorrect();
      setPlacedCount((prev) => prev + 1);
      setBurst({ key: Date.now(), x, y });
      setNudge(false);
    } else {
      playWrong();
      setNudge(true);
      window.setTimeout(() => setNudge(false), 1000);
    }
  };

  const promptLabel = t('kids.gameTapInOrder');
  const progressLabel = t('kids.gameRoundProgress', {
    current: placedCount,
    total: state.ordered.length,
  });

  return (
    <MiniGameShell
      gameId={ORDER_GAME_ID}
      title={t('kids.gameOrder')}
      won={won}
      onRestart={restart}
      headerExtra={<span className={styles.attempts}>{progressLabel}</span>}
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
          {promptLabel}
        </div>

        <div className={styles.slots} aria-label={progressLabel}>
          {state.ordered.map((item, index) => (
            <span
              key={`${item.id}-${index}`}
              className={[
                styles.slot,
                index < placedCount && styles.slotFilled,
              ]
                .filter(Boolean)
                .join(' ')}
            >
              {index < placedCount && (
                <span className={styles.slotText} dir="rtl">
                  {item.face}
                </span>
              )}
            </span>
          ))}
        </div>

        <div className={styles.pool}>
          {state.pool.map((item) => {
            const placed = state.ordered
              .slice(0, placedCount)
              .some((placedItem) => placedItem.id === item.id);
            return (
              <button
                key={item.id}
                type="button"
                className={[styles.tile, placed && styles.tilePlaced].filter(Boolean).join(' ')}
                onClick={(event) => {
                  const rect = event.currentTarget.getBoundingClientRect();
                  tap(item, rect.left + rect.width / 2, rect.top + rect.height / 2);
                }}
                aria-label={placed ? t('kids.gamePlaced') : item.face}
              >
                <span className={styles.tileText} dir="rtl">
                  {item.face}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </MiniGameShell>
  );
}
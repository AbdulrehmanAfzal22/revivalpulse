import { useState } from 'react';
import MiniGameShell from 'features/kids/components/games/MiniGameShell';
import SparkleBurst from 'features/kids/components/rewards/SparkleBurst';
import StudyTopicChips from 'features/kids/components/games/StudyTopicChips';
import { shuffle } from 'features/kids/games/engineUtils';
import { KIDS_STUDY_SETS } from 'data/kids/gameContent';
import type { KidsStudyTopic, StudyItem } from 'data/kids/gameContent';
import type { PlayDifficulty } from 'features/kids/components/setup/PlaySetup';
import { playCorrect, playWrong } from 'services/kidSounds';
import useTranslation from 'hooks/useTranslation';
import styles from './FallingCatchGame.module.css';

/** Phase 15 — arcade study game: catch the falling star with the right answer. */
export const CATCH_GAME_ID = 'catch';

const CATCHES_TO_WIN = 8;
const FALLER_COLORS = ['#ffc94d', '#5ec8e0', '#b08be0', '#4caf6d', '#ff8965', '#f06292'];

interface Faller {
  id: string;
  item: StudyItem;
  isTarget: boolean;
  x: number;
  dur: number;
  delay: number;
  color: string;
}

function randomBetween(min: number, max: number): number {
  return min + Math.random() * (max - min);
}

function makeWave(topic: KidsStudyTopic, wave: number, fallerCount: number): Faller[] {
  const pool = KIDS_STUDY_SETS[topic];
  const target = pool[wave % pool.length] as StudyItem;
  const decoys = shuffle(pool.filter((item) => item.id !== target.id)).slice(0, fallerCount - 1);

  return shuffle([...decoys, target])
    .map((item, index) => ({
      id: `${wave}-${item.id}-${index}`,
      item,
      isTarget: item.id === target.id,
      x: 5 + Math.random() * 78,
      dur: randomBetween(6, 10),
      delay: randomBetween(0, 2.5),
      color: FALLER_COLORS[Math.floor(Math.random() * FALLER_COLORS.length)] as string,
    }));
}

export interface FallingCatchGameProps {
  /** Easy = 4 falling cards, slower; Medium = 6 falling cards, faster (Phase 11 difficulty). */
  difficulty?: PlayDifficulty;
}

export default function FallingCatchGame({ difficulty = 'easy' }: FallingCatchGameProps) {
  const { t } = useTranslation();
  const fallerCount = difficulty === 'medium' ? 6 : 4;
  const [topic, setTopic] = useState<KidsStudyTopic>('letters');
  const [wave, setWave] = useState(0);
  const [fallers, setFallers] = useState<Faller[]>(() => makeWave('letters', 0, fallerCount));
  const [catches, setCatches] = useState(0);
  const [burst, setBurst] = useState<{ key: number; x: number; y: number } | null>(null);
  const [nudge, setNudge] = useState(false);

  const won = catches >= CATCHES_TO_WIN;
  const target = KIDS_STUDY_SETS[topic][wave % KIDS_STUDY_SETS[topic].length] as StudyItem;

  const nextWave = (next: number, nextTopic: KidsStudyTopic, count: number) => {
    setWave(next);
    setFallers(makeWave(nextTopic, next, count));
    setBurst(null);
    setNudge(false);
  };

  const restart = () => {
    nextWave(0, topic, fallerCount);
    setCatches(0);
  };

  const changeTopic = (next: KidsStudyTopic) => {
    if (next === topic) return;
    setTopic(next);
    nextWave(0, next, fallerCount);
    setCatches(0);
  };

  const tap = (faller: Faller, x: number, y: number) => {
    if (won) return;
    if (faller.isTarget) {
      playCorrect();
      setBurst({ key: Date.now(), x, y });
      const nextCatches = catches + 1;
      setCatches(nextCatches);
      if (nextCatches < CATCHES_TO_WIN) {
        nextWave(wave + 1, topic, fallerCount);
      }
    } else {
      playWrong();
      setNudge(true);
      window.setTimeout(() => setNudge(false), 1200);
    }
  };

  const findLabel = t('kids.gameFindPrompt', { item: target.name });
  const caughtLabel = t('kids.gameCaught', { count: catches, total: CATCHES_TO_WIN });

  return (
    <MiniGameShell
      gameId={CATCH_GAME_ID}
      title={t('kids.gameCatch')}
      won={won}
      onRestart={restart}
      headerExtra={<span className={styles.attempts}>{caughtLabel}</span>}
    >
      <StudyTopicChips topic={topic} onChange={changeTopic} />

      <div className={styles.stage}>
        {burst && <SparkleBurst burstKey={burst.key} x={burst.x} y={burst.y} />}
        <div className={styles.prompt} role="status">
          {findLabel}
        </div>
        {nudge && (
          <div className={styles.nudge} role="status">
            {t('kids.gentleNudge')}
          </div>
        )}
        {fallers.map((faller) => (
          <button
            key={faller.id}
            type="button"
            className={styles.faller}
            style={
              {
                '--x': `${faller.x}%`,
                '--dur': `${faller.dur}s`,
                '--delay': `${faller.delay}s`,
                '--faller-color': faller.color,
              } as React.CSSProperties
            }
            onClick={(event) => {
              const rect = event.currentTarget.getBoundingClientRect();
              tap(faller, rect.left + rect.width / 2, rect.top + rect.height / 2);
            }}
            aria-label={faller.item.face}
          >
            <span className={styles.fallerStar} aria-hidden="true">
              ★
            </span>
            <span className={styles.fallerText} dir="rtl">
              {faller.item.face}
            </span>
          </button>
        ))}
      </div>
    </MiniGameShell>
  );
}

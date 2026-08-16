import { useState } from 'react';
import MiniGameShell from 'features/kids/components/games/MiniGameShell';
import SparkleBurst from 'features/kids/components/rewards/SparkleBurst';
import StudyTopicChips from 'features/kids/components/games/StudyTopicChips';
import { shuffle } from 'features/kids/games/engineUtils';
import { KIDS_STUDY_SETS } from 'data/kids/gameContent';
import type { KidsStudyTopic, StudyItem } from 'data/kids/gameContent';
import type { Tier } from 'features/kids/games/difficultyConfig';
import { getDifficultyConfig } from 'features/kids/games/difficultyConfig';
import { playWrong, playPop } from 'services/kidSounds';
import useTranslation from 'hooks/useTranslation';
import styles from './BalloonPopGame.module.css';

/** Phase 15 — arcade study game: pop the balloon that shows the right answer. */
export const BALLOON_POP_GAME_ID = 'balloon-pop';

const ROUNDS = 8;
const BALLOON_COLORS = ['#ff6b6b', '#ffc94d', '#5ec8e0', '#b08be0', '#4caf6d', '#ff8c5a', '#f06292', '#8dd0ff'];

interface Balloon {
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

function makeRound(
  topic: KidsStudyTopic,
  round: number,
  balloonCount: number,
  riseSpeedMultiplier: number,
): Balloon[] {
  const pool = KIDS_STUDY_SETS[topic];
  const target = pool[round % pool.length] as StudyItem;
  const decoys = shuffle(pool.filter((item) => item.id !== target.id)).slice(0, balloonCount - 1);

  return shuffle([...decoys, target])
    .map((item, index) => ({
      id: `${round}-${item.id}-${index}`,
      item,
      isTarget: item.id === target.id,
      x: 4 + Math.random() * 78,
      dur: randomBetween(6.5 * riseSpeedMultiplier, 13 * riseSpeedMultiplier),
      delay: randomBetween(0, 4),
      color: BALLOON_COLORS[Math.floor(Math.random() * BALLOON_COLORS.length)] as string,
    }));
}

export interface BalloonPopGameProps {
  difficulty?: Tier;
}

export default function BalloonPopGame({ difficulty = 'easy' }: BalloonPopGameProps) {
  const { t } = useTranslation();
  const config = getDifficultyConfig('pop', difficulty);
  const balloonCount = config.balloonCount as number;
  const riseSpeedMultiplier = config.riseSpeedMultiplier as number;

  const [topic, setTopic] = useState<KidsStudyTopic>('letters');
  const [round, setRound] = useState(0);
  const [balloons, setBalloons] = useState<Balloon[]>(() =>
    makeRound('letters', 0, balloonCount, riseSpeedMultiplier),
  );
  const [burst, setBurst] = useState<{ key: number; x: number; y: number } | null>(null);
  const [nudge, setNudge] = useState(false);

  const won = round >= ROUNDS;
  const target = KIDS_STUDY_SETS[topic][round % KIDS_STUDY_SETS[topic].length] as StudyItem;

  const startNextRound = (next: number, nextTopic: KidsStudyTopic, count: number, speed: number) => {
    setRound(next);
    setBalloons(makeRound(nextTopic, next, count, speed));
    setBurst(null);
    setNudge(false);
  };

  const restart = () => {
    startNextRound(0, topic, balloonCount, riseSpeedMultiplier);
  };

  const changeTopic = (next: KidsStudyTopic) => {
    if (next === topic) return;
    setTopic(next);
    startNextRound(0, next, balloonCount, riseSpeedMultiplier);
  };

  const pop = (balloon: Balloon, x: number, y: number) => {
    if (won) return;
    if (balloon.isTarget) {
      playPop();
      setBurst({ key: Date.now(), x, y });
      startNextRound(round + 1, topic, balloonCount, riseSpeedMultiplier);
    } else {
      playWrong();
      setNudge(true);
      window.setTimeout(() => setNudge(false), 1200);
    }
  };

  const findLabel = t('kids.gameFindPrompt', { item: target.name });
  const progressLabel = t('kids.gameRoundProgress', { current: Math.min(round + 1, ROUNDS), total: ROUNDS });

  return (
    <MiniGameShell
      gameId={BALLOON_POP_GAME_ID}
      title={t('kids.gameBalloon')}
      won={won}
      onRestart={restart}
      headerExtra={<span className={styles.attempts}>{progressLabel}</span>}
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
        {balloons.map((balloon) => (
          <button
            key={balloon.id}
            type="button"
            className={styles.balloon}
            style={
              {
                '--x': `${balloon.x}%`,
                '--dur': `${balloon.dur}s`,
                '--delay': `${balloon.delay}s`,
                '--balloon-color': balloon.color,
              } as React.CSSProperties
            }
            onClick={(event) => {
              const rect = event.currentTarget.getBoundingClientRect();
              pop(balloon, rect.left + rect.width / 2, rect.top + rect.height / 2);
            }}
            aria-label={balloon.item.face}
          >
            <span className={styles.balloonKnot} aria-hidden="true" />
            <span className={styles.balloonString} aria-hidden="true" />
            <span className={styles.balloonText} dir="rtl">
              {balloon.item.face}
            </span>
          </button>
        ))}
      </div>
    </MiniGameShell>
  );
}

import { useState } from 'react';
import MiniGameShell from 'features/kids/components/games/MiniGameShell';
import SparkleBurst from 'features/kids/components/rewards/SparkleBurst';
import StudyTopicChips from 'features/kids/components/games/StudyTopicChips';
import { pickTarget, pickDecoys, shuffle } from 'features/kids/games/engineUtils';
import type { KidsStudyTopic, StudyItem } from 'data/kids/gameContent';
import type { Tier } from 'features/kids/games/difficultyConfig';
import { getDifficultyConfig } from 'features/kids/games/difficultyConfig';
import { playCorrect, playWrong } from 'services/kidSounds';
import useTranslation from 'hooks/useTranslation';
import styles from './SpotGame.module.css';

/** Spot the Same: one prompt tile — find its twin among the options. */
export const SPOT_GAME_ID = 'spot-same';

const ROUNDS = 10;

export interface SpotGameProps {
  difficulty?: Tier;
}

export default function SpotGame({ difficulty = 'easy' }: SpotGameProps) {
  const { t } = useTranslation();
  const config = getDifficultyConfig('spot', difficulty);
  const optionCount = config.optionCount as number;
  const [pack, setPack] = useState<KidsStudyTopic>('letters');
  const [round, setRound] = useState(0);
  const [target, setTarget] = useState<StudyItem>(() => pickTarget('letters', 0));
  const [options, setOptions] = useState<StudyItem[]>(() => {
    const init = pickTarget('letters', 0);
    return shuffle([init, ...pickDecoys('letters', init, optionCount - 1)]);
  });
  const [burst, setBurst] = useState<{ key: number; x: number; y: number } | null>(null);
  const [nudge, setNudge] = useState(false);

  const won = round >= ROUNDS;

  const beginRound = (nextRound: number, nextPack: KidsStudyTopic) => {
    const nextTarget = pickTarget(nextPack, nextRound);
    setTarget(nextTarget);
    setOptions(shuffle([nextTarget, ...pickDecoys(nextPack, nextTarget, optionCount - 1)]));
    setBurst(null);
    setNudge(false);
  };

  const restart = () => {
    setRound(0);
    beginRound(0, pack);
  };

  const changePack = (next: KidsStudyTopic) => {
    if (next === pack) return;
    setPack(next);
    setRound(0);
    beginRound(0, next);
  };

  const pick = (option: StudyItem, x: number, y: number) => {
    if (won) return;
    if (option.id === target.id) {
      playCorrect();
      setBurst({ key: Date.now(), x, y });
      setRound((r) => r + 1);
      beginRound(round + 1, pack);
    } else {
      playWrong();
      setNudge(true);
      window.setTimeout(() => setNudge(false), 1000);
    }
  };

  const findLabel = t('kids.gameFindPrompt', { item: target.name });
  const progressLabel = t('kids.gameRoundProgress', {
    current: Math.min(round + 1, ROUNDS),
    total: ROUNDS,
  });

  return (
    <MiniGameShell
      gameId={SPOT_GAME_ID}
      title={t('kids.gameSpot')}
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
        <div className={styles.promptCard} role="status">
          <span className={styles.promptFace} dir="rtl">
            {target.face}
          </span>
          <span className={styles.promptName}>{findLabel}</span>
        </div>
        <div className={styles.grid}>
          {options.map((option) => (
            <button
              key={option.id}
              type="button"
              className={styles.option}
              onClick={(event) => {
                const rect = event.currentTarget.getBoundingClientRect();
                pick(option, rect.left + rect.width / 2, rect.top + rect.height / 2);
              }}
              aria-label={option.face}
            >
              <span className={styles.optionText} dir="rtl">
                {option.face}
              </span>
            </button>
          ))}
        </div>
      </div>
    </MiniGameShell>
  );
}
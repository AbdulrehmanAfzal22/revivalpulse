import { useEffect, useState } from 'react';
import MiniGameShell from 'features/kids/components/games/MiniGameShell';
import SparkleBurst from 'features/kids/components/rewards/SparkleBurst';
import StudyTopicChips from 'features/kids/components/games/StudyTopicChips';
import { sample } from 'features/kids/games/engineUtils';
import { KIDS_STUDY_SETS } from 'data/kids/gameContent';
import type { KidsStudyTopic, StudyItem } from 'data/kids/gameContent';
import type { PlayDifficulty } from 'features/kids/components/setup/PlaySetup';
import { playCorrect, playWrong } from 'services/kidSounds';
import useTranslation from 'hooks/useTranslation';
import styles from './WhatMissingGame.module.css';

/** What's Missing?: watch three tiles, one hides, tap the one that disappeared. */
export const WHAT_MISSING_GAME_ID = 'whats-missing';

const ROUNDS = 8;
const TILE_COUNT = 3;

interface RoundState {
  items: StudyItem[];
  hiddenIndex: number;
}

function makeRound(pack: KidsStudyTopic, round: number): RoundState {
  void round;
  return {
    items: sample(KIDS_STUDY_SETS[pack], TILE_COUNT),
    hiddenIndex: Math.floor(Math.random() * TILE_COUNT),
  };
}

export interface WhatMissingGameProps {
  difficulty?: PlayDifficulty;
}

export default function WhatMissingGame({ difficulty = 'easy' }: WhatMissingGameProps) {
  const { t } = useTranslation();
  const showMs = difficulty === 'medium' ? 1200 : 1700;
  const [pack, setPack] = useState<KidsStudyTopic>('letters');
  const [round, setRound] = useState(0);
  const [phase, setPhase] = useState<'watch' | 'pick'>('watch');
  const [state, setState] = useState<RoundState>(() => makeRound('letters', 0));
  const [burst, setBurst] = useState<{ key: number; x: number; y: number } | null>(null);
  const [nudge, setNudge] = useState(false);

  const won = round >= ROUNDS;

  useEffect(() => {
    if (won || phase !== 'watch') return undefined;
    const id = window.setTimeout(() => setPhase('pick'), showMs);
    return () => window.clearTimeout(id);
  }, [phase, won, showMs, round]);

  const newRound = (nextRound: number, nextPack: KidsStudyTopic) => {
    setRound(nextRound);
    setState(makeRound(nextPack, nextRound));
    setPhase('watch');
    setBurst(null);
    setNudge(false);
  };

  const restart = () => newRound(0, pack);

  const changePack = (next: KidsStudyTopic) => {
    if (next === pack) return;
    setPack(next);
    newRound(0, next);
  };

  const pick = (item: StudyItem, x: number, y: number) => {
    if (won || phase !== 'pick') return;
    const hidden = state.items[state.hiddenIndex] as StudyItem;
    if (item.id === hidden.id) {
      playCorrect();
      setBurst({ key: Date.now(), x, y });
      newRound(round + 1, pack);
    } else {
      playWrong();
      setNudge(true);
      window.setTimeout(() => setNudge(false), 1000);
    }
  };

  const progressLabel = t('kids.gameRoundProgress', { current: Math.min(round + 1, ROUNDS), total: ROUNDS });

  return (
    <MiniGameShell
      gameId={WHAT_MISSING_GAME_ID}
      title={t('kids.gameWhatMissing')}
      won={won}
      onRestart={restart}
      headerExtra={<span className={styles.attempts}>{progressLabel}</span>}
    >
      <StudyTopicChips topic={pack} onChange={changePack} />

      <div className={styles.board}>
        {burst && <SparkleBurst burstKey={burst.key} x={burst.x} y={burst.y} />}
        {phase === 'watch' && (
          <div className={styles.watchLabel} role="status">
            {t('kids.gameWatch')}
          </div>
        )}
        {nudge && (
          <div className={styles.nudge} role="status">
            {t('kids.gentleNudge')}
          </div>
        )}
        <div className={styles.prompt}>{t('kids.gameMissingPrompt')}</div>
        <div className={styles.grid}>
          {state.items.map((item, index) => (
            <button
              key={item.id}
              type="button"
              className={styles.option}
              onClick={(event) => {
                const rect = event.currentTarget.getBoundingClientRect();
                pick(item, rect.left + rect.width / 2, rect.top + rect.height / 2);
              }}
              aria-label={item.name}
            >
              {phase === 'pick' && index === state.hiddenIndex ? (
                <span className={styles.hiddenMark}>?</span>
              ) : (
                <span className={styles.optionText} dir="rtl">
                  {item.face}
                </span>
              )}
            </button>
          ))}
        </div>
        {phase === 'watch' && <p className={styles.hint}>{t('kids.gameWatchHint')}</p>}
      </div>
    </MiniGameShell>
  );
}
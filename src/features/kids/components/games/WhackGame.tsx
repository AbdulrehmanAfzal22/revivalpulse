import { useEffect, useState } from 'react';
import MiniGameShell from 'features/kids/components/games/MiniGameShell';
import SparkleBurst from 'features/kids/components/rewards/SparkleBurst';
import StudyTopicChips from 'features/kids/components/games/StudyTopicChips';
import { pickTarget, pickDecoys } from 'features/kids/games/engineUtils';
import type { KidsStudyTopic, StudyItem } from 'data/kids/gameContent';
import type { PlayDifficulty } from 'features/kids/components/setup/PlaySetup';
import { playCorrect, playWrong, playTap } from 'services/kidSounds';
import useTranslation from 'hooks/useTranslation';
import styles from './WhackGame.module.css';

/** Whack-a-Letter: one letter pops up at a time among the holes — bonk the match. */
export const WHACK_GAME_ID = 'whack';

const CELL_COUNT = 9;
const ROUNDS_TO_WIN = 10;

interface RoundState {
  target: StudyItem;
  shown: StudyItem;
  activeIndex: number;
  bonked: number | null;
}

function makeRound(pack: KidsStudyTopic, round: number): RoundState {
  const target = pickTarget(pack, round);
  const decoys = pickDecoys(pack, target, 1);
  const shown = Math.random() < 0.7 ? target : (decoys[0] ?? target);
  return {
    target,
    shown,
    activeIndex: Math.floor(Math.random() * CELL_COUNT),
    bonked: null,
  };
}

export interface WhackGameProps {
  difficulty?: PlayDifficulty;
}

export default function WhackGame({ difficulty = 'easy' }: WhackGameProps) {
  const { t } = useTranslation();
  const popMs = difficulty === 'medium' ? 900 : 1400;
  const [pack, setPack] = useState<KidsStudyTopic>('letters');
  const [round, setRound] = useState(0);
  const [hits, setHits] = useState(0);
  const [state, setState] = useState<RoundState>(() => makeRound('letters', 0));
  const [burst, setBurst] = useState<{ key: number; x: number; y: number } | null>(null);
  const [nudge, setNudge] = useState(false);

  const won = hits >= ROUNDS_TO_WIN;

  useEffect(() => {
    if (won) return undefined;
    const id = window.setInterval(() => {
      setState((prev) => ({
        ...prev,
        activeIndex: Math.floor(Math.random() * CELL_COUNT),
        bonked: null,
      }));
    }, popMs);
    return () => window.clearInterval(id);
  }, [won, popMs, round]);

  const resetAll = () => {
    setRound(0);
    setHits(0);
    setState(makeRound(pack, 0));
    setBurst(null);
    setNudge(false);
  };

  const restart = resetAll;

  const changePack = (next: KidsStudyTopic) => {
    if (next === pack) return;
    setPack(next);
    resetAll();
  };

  const whack = (index: number, x: number, y: number) => {
    if (won) return;
    if (index !== state.activeIndex) {
      playTap();
      return;
    }
    if (state.shown.id === state.target.id) {
      playCorrect();
      setBurst({ key: Date.now(), x, y });
      setHits((prev) => Math.min(prev + 1, ROUNDS_TO_WIN));
      setRound((prev) => prev + 1);
      setState({ ...makeRound(pack, round + 1), bonked: index });
      window.setTimeout(() => {
        setState((prev) => ({ ...prev, bonked: null }));
      }, 480);
    } else {
      playWrong();
      setNudge(true);
      window.setTimeout(() => setNudge(false), 900);
      setState((prev) => ({
        ...prev,
        activeIndex: (prev.activeIndex + 1 + Math.floor(Math.random() * (CELL_COUNT - 1))) % CELL_COUNT,
      }));
    }
  };

  const targetLabel = t('kids.gameTapPrompt', { item: state.target.name });
  const progressLabel = t('kids.gameRoundProgress', {
    current: Math.min(hits + 1, ROUNDS_TO_WIN),
    total: ROUNDS_TO_WIN,
  });

  return (
    <MiniGameShell
      gameId={WHACK_GAME_ID}
      title={t('kids.gameWhack')}
      won={won}
      onRestart={restart}
      headerExtra={<span className={styles.attempts}>{progressLabel}</span>}
    >
      <StudyTopicChips topic={pack} onChange={changePack} />

      <div className={styles.board}>
        {burst && <SparkleBurst burstKey={burst.key} x={burst.x} y={burst.y} />}
        <div className={styles.prompt} role="status">
          <span className={styles.promptFace} dir="rtl">
            {state.target.face}
          </span>
          <span className={styles.promptName}>{targetLabel}</span>
        </div>
        {nudge && (
          <div className={styles.nudge} role="status">
            {t('kids.gentleNudge')}
          </div>
        )}
        <div className={styles.grid}>
          {Array.from({ length: CELL_COUNT }, (_, index) => {
            const active = index === state.activeIndex;
            const bonked = state.bonked === index;
            const className = [styles.hole, bonked && styles.holeBonked].filter(Boolean).join(' ');
            return (
              <button
                key={index}
                type="button"
                className={className}
                onClick={(event) => {
                  const rect = event.currentTarget.getBoundingClientRect();
                  whack(index, rect.left + rect.width / 2, rect.top + rect.height / 2);
                }}
                aria-label={active ? state.shown.face : t('kids.gameWhackHole')}
              >
                {active && (
                  <span className={styles.mole} dir="rtl">
                    {state.shown.face}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </MiniGameShell>
  );
}
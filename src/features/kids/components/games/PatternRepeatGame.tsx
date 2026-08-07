import { useEffect, useRef, useState } from 'react';
import MiniGameShell from 'features/kids/components/games/MiniGameShell';
import SparkleBurst from 'features/kids/components/rewards/SparkleBurst';
import StudyTopicChips from 'features/kids/components/games/StudyTopicChips';
import { sample } from 'features/kids/games/engineUtils';
import { KIDS_STUDY_SETS } from 'data/kids/gameContent';
import type { KidsStudyTopic, StudyItem } from 'data/kids/gameContent';
import type { PlayDifficulty } from 'features/kids/components/setup/PlaySetup';
import { playCorrect, playWrong, playTap } from 'services/kidSounds';
import useTranslation from 'hooks/useTranslation';
import styles from './PatternRepeatGame.module.css';

/** Copy the Pattern: watch the tiles light up, then tap them in the same order. */
export const PATTERN_GAME_ID = 'pattern-repeat';

const ROUNDS = 6;
const CELL_COUNT = 6;
const WATCH_MS = 850;

interface RoundState {
  items: StudyItem[];
  sequence: number[];
}

function makeRound(pack: KidsStudyTopic, round: number, difficulty: PlayDifficulty): RoundState {
  const length = difficulty === 'medium' ? 4 : 3;
  const indexes = sample(Array.from({ length: CELL_COUNT }, (_, i) => i), length);
  return {
    items: indexes.map((_, position) => KIDS_STUDY_SETS[pack][(round + position) % KIDS_STUDY_SETS[pack].length] as StudyItem),
    sequence: indexes,
  };
}

export interface PatternRepeatGameProps {
  difficulty?: PlayDifficulty;
}

export default function PatternRepeatGame({ difficulty = 'easy' }: PatternRepeatGameProps) {
  const { t } = useTranslation();
  const [pack, setPack] = useState<KidsStudyTopic>('letters');
  const [round, setRound] = useState(0);
  const [state, setState] = useState<RoundState>(() => makeRound('letters', 0, difficulty));
  const [phase, setPhase] = useState<'watch' | 'play'>('watch');
  const [litIndex, setLitIndex] = useState<number | null>(null);
  const [placedCount, setPlacedCount] = useState(0);
  const [burst, setBurst] = useState<{ key: number; x: number; y: number } | null>(null);
  const [nudge, setNudge] = useState(false);

  /** Mirrors placedCount so rapid/duplicate taps can't double-advance a round. */
  const placedRef = useRef(0);
  const playTransitionRef = useRef<number | null>(null);
  const nudgeTimeoutRef = useRef<number | null>(null);

  const won = round >= ROUNDS;

  useEffect(() => {
    if (won || phase !== 'watch') return undefined;
    let position = 0;
    const id = window.setInterval(() => {
      const current = state.sequence[position] ?? null;
      setLitIndex(current);
      position += 1;
      if (position >= state.sequence.length) {
        window.clearInterval(id);
        // Tracked so a re-render between rounds can't leave a stale timeout
        // firing into the WRONG round and ending its watch phase early.
        playTransitionRef.current = window.setTimeout(() => {
          playTransitionRef.current = null;
          setLitIndex(null);
          setPhase('play');
        }, 550);
      }
    }, WATCH_MS);
    return () => {
      window.clearInterval(id);
      if (playTransitionRef.current !== null) {
        window.clearTimeout(playTransitionRef.current);
        playTransitionRef.current = null;
      }
    };
  }, [phase, won, state]);

  useEffect(
    () => () => {
      if (playTransitionRef.current !== null) window.clearTimeout(playTransitionRef.current);
      if (nudgeTimeoutRef.current !== null) window.clearTimeout(nudgeTimeoutRef.current);
    },
    [],
  );

  const newRound = (nextRound: number, nextPack: KidsStudyTopic) => {
    placedRef.current = 0;
    setRound(nextRound);
    setState(makeRound(nextPack, nextRound, difficulty));
    setPhase('watch');
    setPlacedCount(0);
    setBurst(null);
    setNudge(false);
  };

  const restart = () => newRound(0, pack);

  const changePack = (next: KidsStudyTopic) => {
    if (next === pack) return;
    setPack(next);
    newRound(0, next);
  };

  const tapCell = (index: number, x: number, y: number) => {
    if (won || phase !== 'play') return;
    const position = placedRef.current;
    const expected = state.sequence[position];
    if (expected === undefined) return;
    if (index === expected) {
      const nextPlaced = position + 1;
      placedRef.current = nextPlaced;
      setPlacedCount(nextPlaced);
      if (nextPlaced >= state.sequence.length) {
        playCorrect();
        setBurst({ key: Date.now(), x, y });
        newRound(round + 1, pack);
      } else {
        playTap();
      }
    } else {
      playWrong();
      setNudge(true);
      if (nudgeTimeoutRef.current !== null) window.clearTimeout(nudgeTimeoutRef.current);
      nudgeTimeoutRef.current = window.setTimeout(() => {
        nudgeTimeoutRef.current = null;
        setNudge(false);
      }, 1000);
    }
  };

  const progressLabel = t('kids.gameRoundProgress', { current: Math.min(round + 1, ROUNDS), total: ROUNDS });

  return (
    <MiniGameShell
      gameId={PATTERN_GAME_ID}
      title={t('kids.gamePattern')}
      won={won}
      onRestart={restart}
      headerExtra={<span className={styles.attempts}>{progressLabel}</span>}
    >
      <StudyTopicChips topic={pack} onChange={changePack} />

      <div className={styles.board}>
        {burst && <SparkleBurst burstKey={burst.key} x={burst.x} y={burst.y} />}
        {phase === 'watch' && (
          <div className={styles.watchLabel} role="status">
            {t('kids.gamePatternPrompt')}
          </div>
        )}
        {nudge && (
          <div className={styles.nudge} role="status">
            {t('kids.gentleNudge')}
          </div>
        )}
        <div className={styles.grid}>
          {state.items.map((item, index) => {
            const lit = litIndex === index;
            const matched = phase === 'play' && state.sequence.indexOf(index) < placedCount;
            const className = [
              styles.cell,
              lit && styles.cellLit,
              matched && styles.cellMatched,
            ]
              .filter(Boolean)
              .join(' ');
            return (
              <button
                key={`${index}-${round}`}
                type="button"
                className={className}
                onClick={(event) => {
                  const rect = event.currentTarget.getBoundingClientRect();
                  tapCell(index, rect.left + rect.width / 2, rect.top + rect.height / 2);
                }}
                aria-label={item.name}
              >
                <span className={styles.cellText} dir="rtl">
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
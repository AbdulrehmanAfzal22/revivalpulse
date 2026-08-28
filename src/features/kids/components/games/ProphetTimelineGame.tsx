import { useState, useEffect } from 'react';
import MiniGameShell from 'features/kids/components/games/MiniGameShell';
import SparkleBurst from 'features/kids/components/rewards/SparkleBurst';
import { getProphetTimelineItemsShuffled } from 'data/kids/prophetTimeline';
import type { ProphetTimelineItem } from 'data/kids/prophetTimeline';
import type { Tier } from 'features/kids/games/difficultyConfig';
import { getDifficultyConfig } from 'features/kids/games/difficultyConfig';
import { playCorrect, playWrong } from 'services/kidSounds';
import useTranslation from 'hooks/useTranslation';
import type { TranslationKey } from 'i18n';
import styles from './ProphetTimelineGame.module.css';

/** Prophet Timeline Sort: drag Prophet cards onto a rough chronological slider */
export const PROPHET_TIMELINE_GAME_ID = 'prophet-timeline';

/**
 * There is exactly one correct chronology, so round variety comes from how a
 * round is presented: a different random subset of Prophets each round (already
 * handled by getProphetTimelineItemsShuffled) and rotating prompt framing.
 */
const PROPHET_PROMPTS: TranslationKey[] = [
  'kids.prophetPrompt1',
  'kids.prophetPrompt2',
  'kids.prophetPrompt3',
];

interface RoundState {
  prophets: ProphetTimelineItem[];
  placed: Record<string, number | null>; // prophetId -> position index
  /** Index into PROPHET_PROMPTS for this round's framing. */
  frame: number;
}

function makeRound(prophetCount: number): RoundState {
  const shuffled = getProphetTimelineItemsShuffled(prophetCount);
  const placed: Record<string, number | null> = {};
  shuffled.forEach(p => { placed[p.id] = null; });
  const frame = Math.floor(Math.random() * PROPHET_PROMPTS.length);
  return { prophets: shuffled, placed, frame };
}

export interface ProphetTimelineGameProps {
  difficulty?: Tier;
  tier?: Tier;
}

export default function ProphetTimelineGame({ difficulty = 'easy', tier = 'easy' }: ProphetTimelineGameProps) {
  const { t } = useTranslation();
  const config = getDifficultyConfig('prophettimeline', tier) as {
    prophetCount: number;
    roundsToWin: number;
    timeLimit: number;
    scoreMultiplier: number;
    showDates: boolean;
    snapTolerance: number;
  };
  const prophetCount = config.prophetCount;
  const roundsToWin = config.roundsToWin;
  const isTimed = config.timeLimit > 0;
  const showDates = config.showDates;
  const snapTolerance = config.snapTolerance;

  const [round, setRound] = useState(0);
  const [state, setState] = useState<RoundState>(() => makeRound(prophetCount));
  const [burst, setBurst] = useState<{ key: number; x: number; y: number } | null>(null);
  const [nudge, setNudge] = useState(false);
  const [timeLeft, setTimeLeft] = useState(config.timeLimit);
  const [correctPlaced, setCorrectPlaced] = useState(0);

  const won = round >= roundsToWin;
  const lost = isTimed && timeLeft <= 0 && !won;

  // Timer
  useEffect(() => {
    if (!isTimed || won || lost) return;
    const id = window.setInterval(() => {
      setTimeLeft(prev => {
        const next = prev - 100;
        if (next <= 0) {
          return 0;
        }
        return next;
      });
    }, 100);
    return () => window.clearInterval(id);
  }, [isTimed, won, lost]);

  const restart = () => {
    setState(makeRound(prophetCount));
    setBurst(null);
    setNudge(false);
    setCorrectPlaced(0);
    if (isTimed) setTimeLeft(config.timeLimit);
  };

  const placeProphet = (prophetId: string, position: number, x: number, y: number) => {
    if (won || lost || state.placed[prophetId] !== null) return;

    const prophet = state.prophets.find(p => p.id === prophetId);
    if (!prophet) return;

    // Correct position is the card's rank in chronological order (0-indexed)
    const correctPosition = [...state.prophets].sort((a, b) => a.order - b.order).findIndex(p => p.id === prophetId);
    const snapped = Math.abs(position - correctPosition) <= snapTolerance;
    const finalPosition = snapped ? correctPosition : position;
    const isCorrect = snapped;

    setState(prev => ({
      ...prev,
      placed: { ...prev.placed, [prophetId]: finalPosition }
    }));

    if (isCorrect) {
      playCorrect();
      setCorrectPlaced(prev => prev + 1);
      setBurst({ key: Date.now(), x, y });
    } else {
      playWrong();
      setNudge(true);
      window.setTimeout(() => setNudge(false), 1000);
    }

    // Check if round complete
    const newPlacedCount = Object.values(state.placed).filter(v => v !== null).length + 1;
    if (newPlacedCount === state.prophets.length) {
      if (correctPlaced + (isCorrect ? 1 : 0) === state.prophets.length) {
        // Perfect round
        setTimeout(() => {
          setRound(r => r + 1);
          setState(makeRound(prophetCount));
          setBurst(null);
          setNudge(false);
          setCorrectPlaced(0);
          if (isTimed) setTimeLeft(config.timeLimit);
        }, 800);
      } else {
        // Some wrong - restart round
        setTimeout(() => {
          setState(makeRound(prophetCount));
          setBurst(null);
          setNudge(false);
          setCorrectPlaced(0);
        }, 1200);
      }
    }
  };

  const progressLabel = t('kids.gameRoundProgress', { current: Math.min(round + 1, roundsToWin), total: roundsToWin });

  // Generate slot positions for the timeline
  const slotCount = state.prophets.length;
  const slots = Array.from({ length: slotCount }, (_, i) => i);
  const sortedIds = [...state.prophets].sort((a, b) => a.order - b.order).map(p => p.id);

  return (
    <MiniGameShell
      gameId={PROPHET_TIMELINE_GAME_ID}
      title={t('kids.gameProphetTimeline')}
      won={won}
      onRestart={restart}
      headerExtra={
        <>
          <span className={styles.attempts}>{progressLabel}</span>
          {isTimed && <span className={styles.timer} role="timer">{Math.ceil(timeLeft / 1000)}s</span>}
        </>
      }
    >
      <div className={styles.board}>
        {burst && <SparkleBurst burstKey={burst.key} x={burst.x} y={burst.y} />}
        {nudge && (
          <div className={styles.nudge} role="status">
            {t('kids.gentleNudge')}
          </div>
        )}
        <div className={styles.prompt} role="status">
          {t(PROPHET_PROMPTS[state.frame] ?? 'kids.gameProphetTimeline')}
        </div>
        <div className={styles.timeline}>
          <div className={styles.slots} role="list" aria-label={t('kids.prophetTimelineSlots')}>
            {slots.map(slotIndex => {
              const placedProphet = state.prophets.find(p => state.placed[p.id] === slotIndex);
              const isCorrect = placedProphet && sortedIds.indexOf(placedProphet.id) === slotIndex;
              return (
                <div
                  key={slotIndex}
                  className={[
                    styles.slot,
                    placedProphet && styles.slotFilled,
                    isCorrect && styles.slotCorrect,
                    placedProphet && !isCorrect && styles.slotWrong
                  ].filter(Boolean).join(' ')}
                  onDrop={e => {
                    e.preventDefault();
                    const prophetId = e.dataTransfer.getData('prophetId');
                    if (prophetId) {
                      const rect = e.currentTarget.getBoundingClientRect();
                      placeProphet(prophetId, slotIndex, rect.left + rect.width / 2, rect.top + rect.height / 2);
                    }
                  }}
                  onDragOver={e => e.preventDefault()}
                  role="listitem"
                  aria-label={placedProphet ? `${placedProphet.nameEnglish} (placed)` : t('kids.emptySlot', { number: slotIndex + 1 })}
                >
                  {showDates && (
                    <div className={styles.slotNumber}>{slotIndex + 1}</div>
                  )}
                  {placedProphet && (
                    <div className={styles.placedCard}>
                      <span className={styles.placedIcon}>{placedProphet.icon}</span>
                      <span className={styles.placedName}>{placedProphet.nameEnglish}</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
        <div className={styles.cardsArea}>
          <div className={styles.cardsGrid}>
            {state.prophets
              .filter(p => state.placed[p.id] === null)
              .map(prophet => (
                <div
                  key={prophet.id}
                  className={styles.prophetCard}
                  draggable
                  onDragStart={e => e.dataTransfer.setData('prophetId', prophet.id)}
                >
                  <span className={styles.prophetIcon}>{prophet.icon}</span>
                  <div className={styles.prophetInfo}>
                    <span className={styles.prophetNameEnglish}>{prophet.nameEnglish}</span>
                    <span className={styles.prophetNameArabic} dir="rtl">{prophet.nameArabic}</span>
                    {showDates && <span className={styles.prophetPeriod}>{prophet.period}</span>}
                  </div>
                </div>
              ))}
          </div>
        </div>
        {lost && <div className={styles.timeUp}>{t('kids.gameTimeUp')}</div>}
      </div>
    </MiniGameShell>
  );
}
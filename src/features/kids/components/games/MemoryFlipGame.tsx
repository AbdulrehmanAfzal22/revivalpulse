import { useEffect, useRef, useState } from 'react';
import MiniGameShell from 'features/kids/components/games/MiniGameShell';
import SparkleBurst from 'features/kids/components/rewards/SparkleBurst';
import StudyTopicChips from 'features/kids/components/games/StudyTopicChips';
import { KIDS_STUDY_SETS } from 'data/kids/gameContent';
import type { KidsStudyTopic, StudyItem } from 'data/kids/gameContent';
import type { PlayDifficulty } from 'features/kids/components/setup/PlaySetup';
import { playCorrect, playWrong } from 'services/kidSounds';
import useTranslation from 'hooks/useTranslation';
import styles from './MemoryFlipGame.module.css';

/** Phase 7 — concentration with study content: flip and match letter/name pairs. */
export const MEMORY_GAME_ID = 'memory';

function shuffle<T>(items: T[]): T[] {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j] as T, copy[i] as T];
  }
  return copy;
}

interface MemoryCard {
  id: string;
  item: StudyItem;
  side: 'face' | 'name';
  itemId: string;
}

function buildDeck(topic: KidsStudyTopic, pairCount: number): MemoryCard[] {
  const pool = shuffle(KIDS_STUDY_SETS[topic]).slice(0, pairCount);
  return shuffle(
    pool.flatMap((item) => [
      { id: `${item.id}--face`, item, side: 'face' as const, itemId: item.id },
      { id: `${item.id}--name`, item, side: 'name' as const, itemId: item.id },
    ]),
  );
}

export interface MemoryFlipGameProps {
  /** Easy = 4 pairs, Medium = 6 pairs (Phase 11 difficulty). */
  difficulty?: PlayDifficulty;
}

export default function MemoryFlipGame({ difficulty = 'easy' }: MemoryFlipGameProps) {
  const { t } = useTranslation();
  const pairCount = difficulty === 'medium' ? 6 : 4;
  const [topic, setTopic] = useState<KidsStudyTopic>('letters');
  const [deck, setDeck] = useState<MemoryCard[]>(() => buildDeck('letters', pairCount));
  const [flipped, setFlipped] = useState<string[]>([]);
  const [matched, setMatched] = useState<string[]>([]);
  const [lock, setLock] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [burst, setBurst] = useState<{ key: number; x: number; y: number } | null>(null);
  /** Single slot for the "flip cards back" timer so a pending timeout can never
   *  fire against a newer deck (e.g. after a restart/topic change mid-flip). */
  const flipTimeoutRef = useRef<number | null>(null);

  const won = matched.length === deck.length;

  useEffect(() => {
    return () => {
      if (flipTimeoutRef.current !== null) window.clearTimeout(flipTimeoutRef.current);
    };
  }, []);

  const clearFlipTimeout = () => {
    if (flipTimeoutRef.current !== null) {
      window.clearTimeout(flipTimeoutRef.current);
      flipTimeoutRef.current = null;
    }
  };

  const restart = () => {
    clearFlipTimeout();
    setDeck(buildDeck(topic, pairCount));
    setFlipped([]);
    setMatched([]);
    setLock(false);
    setAttempts(0);
    setBurst(null);
  };

  const changeTopic = (next: KidsStudyTopic) => {
    clearFlipTimeout();
    if (next === topic) return;
    setTopic(next);
    setDeck(buildDeck(next, pairCount));
    setFlipped([]);
    setMatched([]);
    setLock(false);
    setAttempts(0);
    setBurst(null);
  };

  const flip = (card: MemoryCard, x: number, y: number) => {
    if (lock || won || matched.includes(card.id) || flipped.includes(card.id)) return;
    if (flipped.length === 2) return;

    const nextFlipped = [...flipped, card.id];
    setFlipped(nextFlipped);
    setBurst(null);

    if (nextFlipped.length === 2) {
      const [firstId, secondId] = nextFlipped;
      const first = deck.find((c) => c.id === firstId);
      const second = deck.find((c) => c.id === secondId);

      if (first && second && first.itemId === second.itemId) {
        setAttempts((a) => a + 1);
        setLock(true);
        clearFlipTimeout();
        flipTimeoutRef.current = window.setTimeout(() => {
          flipTimeoutRef.current = null;
          setMatched((prev) => [...prev, first.id, second.id]);
          setFlipped([]);
          setLock(false);
        }, 350);
        playCorrect();
        setBurst({ key: Date.now(), x, y });
      } else {
        setAttempts((a) => a + 1);
        setLock(true);
        clearFlipTimeout();
        flipTimeoutRef.current = window.setTimeout(() => {
          flipTimeoutRef.current = null;
          setFlipped([]);
          setLock(false);
        }, 800);
        playWrong();
      }
    }
  };

  const attemptsLabel = t('kids.gameAttempts', { count: attempts });

  return (
    <MiniGameShell
      gameId={MEMORY_GAME_ID}
      title={t('kids.gameMemory')}
      won={won}
      onRestart={restart}
      headerExtra={<span className={styles.attempts}>{attemptsLabel}</span>}
    >
      <StudyTopicChips topic={topic} onChange={changeTopic} />

      <div className={styles.grid}>
        {burst && <SparkleBurst burstKey={burst.key} x={burst.x} y={burst.y} />}
        {deck.map((card) => {
          const isFlipped = flipped.includes(card.id) || matched.includes(card.id);
          return (
            <button
              key={card.id}
              type="button"
              className={[styles.card, isFlipped && styles.cardFlipped].filter(Boolean).join(' ')}
              onClick={(event) => {
                const rect = event.currentTarget.getBoundingClientRect();
                flip(card, rect.left + rect.width / 2, rect.top + rect.height / 2);
              }}
              aria-label={
                isFlipped
                  ? card.side === 'face'
                    ? card.item.face
                    : card.item.name
                  : t('kids.gameMemoryHidden')
              }
            >
              <span className={styles.cardInner}>
                <span className={styles.cardBack} aria-hidden="true">
                  <span className={styles.cardBackStar}>★</span>
                </span>
                <span className={styles.cardFace}>
                  {card.side === 'face' ? (
                    <span className={styles.cardText} dir="rtl">
                      {card.item.face}
                    </span>
                  ) : (
                    <span className={styles.cardName}>{card.item.name}</span>
                  )}
                </span>
              </span>
            </button>
          );
        })}
      </div>
    </MiniGameShell>
  );
}

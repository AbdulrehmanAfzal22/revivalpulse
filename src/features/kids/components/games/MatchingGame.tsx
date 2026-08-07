import { useMemo, useState } from 'react';
import MiniGameShell from 'features/kids/components/games/MiniGameShell';
import SparkleBurst from 'features/kids/components/rewards/SparkleBurst';
import StudyTopicChips from 'features/kids/components/games/StudyTopicChips';
import { KIDS_STUDY_SETS } from 'data/kids/gameContent';
import type { KidsStudyTopic, StudyItem } from 'data/kids/gameContent';
import type { PlayDifficulty } from 'features/kids/components/setup/PlaySetup';
import { playCorrect, playWrong } from 'services/kidSounds';
import useTranslation from 'hooks/useTranslation';
import styles from './MatchingGame.module.css';

/** Phase 7 — study matching: match each Arabic letter/number/word to its English name. */
export const MATCHING_GAME_ID = 'matching';

function shuffle<T>(items: T[]): T[] {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j] as T, copy[i] as T];
  }
  return copy;
}

/** One face-up card: either the Arabic "face" or the English "name" side of a study item. */
interface MatchCard {
  id: string;
  item: StudyItem;
  side: 'face' | 'name';
  paired: boolean;
}

function buildCards(topic: KidsStudyTopic, itemCount: number): MatchCard[] {
  const pool = shuffle(KIDS_STUDY_SETS[topic]).slice(0, itemCount);
  const cards: MatchCard[] = pool.flatMap((item) => [
    { id: `${item.id}--face`, item, side: 'face', paired: false },
    { id: `${item.id}--name`, item, side: 'name', paired: false },
  ]);
  return shuffle(cards);
}

export interface MatchingGameProps {
  /** Easy = 3 pairs, Medium = 5 pairs (Phase 11 difficulty). */
  difficulty?: PlayDifficulty;
}

export default function MatchingGame({ difficulty = 'easy' }: MatchingGameProps) {
  const { t } = useTranslation();
  const pairCount = difficulty === 'medium' ? 5 : 3;
  const [topic, setTopic] = useState<KidsStudyTopic>('letters');
  const [cards, setCards] = useState<MatchCard[]>(() => buildCards('letters', pairCount));
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [burst, setBurst] = useState<{ key: number; x: number; y: number } | null>(null);
  const [nudge, setNudge] = useState(false);
  const [attempts, setAttempts] = useState(0);

  const won = cards.every((card) => card.paired);

  const pairsRemaining = useMemo(
    () => cards.filter((card) => !card.paired).length / 2,
    [cards],
  );

  const resetRound = () => {
    setSelectedId(null);
    setBurst(null);
    setNudge(false);
    setAttempts(0);
  };

  const restart = () => {
    setCards(buildCards(topic, pairCount));
    resetRound();
  };

  const changeTopic = (next: KidsStudyTopic) => {
    if (next === topic) return;
    setTopic(next);
    setCards(buildCards(next, pairCount));
    resetRound();
  };

  const pick = (card: MatchCard, x: number, y: number) => {
    if (card.paired || won) return;
    if (selectedId === card.id) {
      setSelectedId(null);
      return;
    }
    if (selectedId === null) {
      setSelectedId(card.id);
      setNudge(false);
      return;
    }

    const first = cards.find((c) => c.id === selectedId);
    setAttempts((a) => a + 1);
    setSelectedId(null);

    if (first && first.item.id === card.item.id) {
      playCorrect();
      setCards((prev) =>
        prev.map((c) => (c.item.id === card.item.id ? { ...c, paired: true } : c)),
      );
      setBurst({ key: Date.now(), x, y });
      setNudge(false);
    } else {
      playWrong();
      setNudge(true);
    }
  };

  const remainingLabel = t('kids.gamePairsLeft', { count: pairsRemaining });
  const attemptsLabel = t('kids.gameAttempts', { count: attempts });

  return (
    <MiniGameShell
      gameId={MATCHING_GAME_ID}
      title={t('kids.gameMatching')}
      won={won}
      onRestart={restart}
      headerExtra={
        <span className={styles.attempts}>
          {remainingLabel} · {attemptsLabel}
        </span>
      }
    >
      <StudyTopicChips topic={topic} onChange={changeTopic} />

      <div className={styles.grid}>
        {burst && <SparkleBurst burstKey={burst.key} x={burst.x} y={burst.y} />}
        {nudge && (
          <div className={styles.nudge} role="status">
            {t('kids.gentleNudge')}
          </div>
        )}
        {cards.map((card) => {
          const isSelected = selectedId === card.id;
          return (
            <button
              key={card.id}
              type="button"
              className={[styles.card, isSelected && styles.cardSelected, card.paired && styles.cardPaired]
                .filter(Boolean)
                .join(' ')}
              onClick={(event) => {
                const rect = event.currentTarget.getBoundingClientRect();
                pick(card, rect.left + rect.width / 2, rect.top + rect.height / 2);
              }}
              aria-pressed={isSelected}
              aria-label={card.side === 'face' ? card.item.face : card.item.name}
            >
              {card.side === 'face' ? (
                <span className={styles.cardText} dir="rtl">
                  {card.item.face}
                </span>
              ) : (
                <span className={styles.cardName}>{card.item.name}</span>
              )}
              <span className={styles.cardCheck} aria-hidden="true">
                ✓
              </span>
            </button>
          );
        })}
      </div>
    </MiniGameShell>
  );
}

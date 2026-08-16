import { useCallback, useEffect, useRef, useState } from 'react';
import MiniGameShell from 'features/kids/components/games/MiniGameShell';
import SparkleBurst from 'features/kids/components/rewards/SparkleBurst';
import { getHalalHaramItems } from 'data/kids/halalHaram';
import type { HalalHaramItem } from 'data/kids/halalHaram';
import type { Tier } from 'features/kids/games/difficultyConfig';
import { getDifficultyConfig } from 'features/kids/games/difficultyConfig';
import { playCorrect, playWrong } from 'services/kidSounds';
import useTranslation from 'hooks/useTranslation';
import styles from './HalalHaramGame.module.css';

/** Halal or Haram: tap or drag items into two baskets — basic fiqh categorization */
export const HALAL_HARAM_GAME_ID = 'halal-haram';

interface RoundState {
  items: HalalHaramItem[];
  placed: Record<string, 'halal' | 'haram' | null>;
}

function makeRound(itemCount: number): RoundState {
  const items = getHalalHaramItems(itemCount);
  const placed: Record<string, 'halal' | 'haram' | null> = {};
  items.forEach(item => { placed[item.id] = null; });
  return { items, placed };
}

export interface HalalHaramGameProps {
  difficulty?: Tier;
  tier?: Tier;
}

export default function HalalHaramGame({ difficulty = 'easy', tier = 'easy' }: HalalHaramGameProps) {
  const { t } = useTranslation();
  const config = getDifficultyConfig('halalharam', tier) as {
    itemCount: number;
    optionCount: number;
    roundsToWin: number;
    timeLimit: number;
    scoreMultiplier: number;
    showCategoryHint: boolean;
  };
  const itemCount = config.itemCount;
  const roundsToWin = config.roundsToWin;
  const isTimed = config.timeLimit > 0;
  const showHint = config.showCategoryHint;

  const [round, setRound] = useState(0);
  const [state, setState] = useState<RoundState>(() => makeRound(itemCount));
  const [burst, setBurst] = useState<{ key: number; x: number; y: number } | null>(null);
  const [nudge, setNudge] = useState(false);
  const [timeLeft, setTimeLeft] = useState(config.timeLimit);
  const [correctPlaced, setCorrectPlaced] = useState(0);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const boardRef = useRef<HTMLDivElement>(null);

  const won = round >= roundsToWin;
  const lost = isTimed && timeLeft <= 0 && !won;
  const allPlaced = state.items.every(item => state.placed[item.id] !== null);
  const roundComplete = allPlaced && correctPlaced === state.items.length;
  const roundFailed = allPlaced && correctPlaced < state.items.length;

  // Timer
  useEffect(() => {
    if (!isTimed || won || lost) return;
    const id = window.setInterval(() => {
      setTimeLeft(prev => {
        const next = prev - 100;
        return next <= 0 ? 0 : next;
      });
    }, 100);
    return () => window.clearInterval(id);
  }, [isTimed, won, lost]);

  const resetRound = useCallback(() => {
    setState(makeRound(itemCount));
    setBurst(null);
    setNudge(false);
    setCorrectPlaced(0);
    setSelectedId(null);
    if (isTimed) setTimeLeft(config.timeLimit);
  }, [itemCount, isTimed, config.timeLimit]);

  // Perfect round → advance to the next round
  useEffect(() => {
    if (!roundComplete || won || lost) return;
    const id = window.setTimeout(() => {
      setRound(r => r + 1);
      resetRound();
    }, 800);
    return () => window.clearTimeout(id);
  }, [roundComplete, won, lost, resetRound]);

  // Any wrong placement → replay the round
  useEffect(() => {
    if (!roundFailed || won || lost) return;
    const id = window.setTimeout(resetRound, 1200);
    return () => window.clearTimeout(id);
  }, [roundFailed, won, lost, resetRound]);

  const restart = () => {
    setRound(0);
    resetRound();
  };

  const burstPoint = (clientX: number, clientY: number) => {
    const rect = boardRef.current?.getBoundingClientRect();
    if (!rect) return { x: 0, y: 0 };
    return { x: clientX - rect.left, y: clientY - rect.top };
  };

  const placeItem = (itemId: string, category: 'halal' | 'haram', clientX: number, clientY: number) => {
    if (won || lost || state.placed[itemId] !== null) return;

    const item = state.items.find(i => i.id === itemId);
    if (!item) return;

    const point = burstPoint(clientX, clientY);
    const isCorrect = item.category === category;

    setState(prev => ({
      ...prev,
      placed: { ...prev.placed, [itemId]: category }
    }));
    setSelectedId(null);

    if (isCorrect) {
      playCorrect();
      setCorrectPlaced(prev => prev + 1);
      setBurst({ key: Date.now(), x: point.x, y: point.y });
    } else {
      playWrong();
      setNudge(true);
      window.setTimeout(() => setNudge(false), 1000);
    }
  };

  const toggleSelect = (item: HalalHaramItem) => {
    if (won || lost || state.placed[item.id] !== null) return;
    setSelectedId(prev => (prev === item.id ? null : item.id));
  };

  const placeSelected = (category: 'halal' | 'haram', clientX: number, clientY: number) => {
    if (!selectedId) return;
    placeItem(selectedId, category, clientX, clientY);
  };

  const basketCenter = (e: { currentTarget: HTMLElement }) => {
    const rect = e.currentTarget.getBoundingClientRect();
    return { clientX: rect.left + rect.width / 2, clientY: rect.top + rect.height / 2 };
  };

  const placeInBasket = (category: 'halal' | 'haram', e: { currentTarget: HTMLElement }) => {
    const { clientX, clientY } = basketCenter(e);
    placeSelected(category, clientX, clientY);
  };

  const progressLabel = t('kids.gameRoundProgress', { current: Math.min(round + 1, roundsToWin), total: roundsToWin });

  return (
    <MiniGameShell
      gameId={HALAL_HARAM_GAME_ID}
      title={t('kids.gameHalalHaram')}
      won={won}
      onRestart={restart}
      headerExtra={
        <>
          <span className={styles.attempts}>{progressLabel}</span>
          {isTimed && <span className={styles.timer} role="timer">{Math.ceil(timeLeft / 1000)}s</span>}
        </>
      }
    >
      <div className={styles.board} ref={boardRef}>
        {burst && <SparkleBurst burstKey={burst.key} x={burst.x} y={burst.y} />}
        {nudge && (
          <div className={styles.nudge} role="status">
            {t('kids.gentleNudge')}
          </div>
        )}
        <div className={styles.baskets}>
          <div className={styles.basket} data-category="halal" role="region" aria-label={t('kids.halalBasket')}>
            <div className={styles.basketLabel}>
              <span className={styles.basketIcon}>✅</span>
              <span>{t('kids.halal')}</span>
            </div>
            <div
              className={styles.basketDropZone}
              role="button"
              tabIndex={0}
              aria-label={t('kids.halalBasket')}
              onClick={e => placeInBasket('halal', e)}
              onKeyDown={e => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  placeInBasket('halal', e);
                }
              }}
              onDragOver={e => e.preventDefault()}
              onDrop={e => {
                e.preventDefault();
                const itemId = e.dataTransfer.getData('itemId');
                if (itemId) placeItem(itemId, 'halal', e.clientX, e.clientY);
              }}
            >
              {state.items
                .filter(item => state.placed[item.id] === 'halal')
                .map(item => (
                  <div key={item.id} className={styles.placedItem}>
                    <span>{item.icon}</span>
                    <span>{item.name.en}</span>
                  </div>
                ))}
            </div>
          </div>
          <div className={styles.basket} data-category="haram" role="region" aria-label={t('kids.haramBasket')}>
            <div className={styles.basketLabel}>
              <span className={styles.basketIcon}>❌</span>
              <span>{t('kids.haram')}</span>
            </div>
            <div
              className={styles.basketDropZone}
              role="button"
              tabIndex={0}
              aria-label={t('kids.haramBasket')}
              onClick={e => placeInBasket('haram', e)}
              onKeyDown={e => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  placeInBasket('haram', e);
                }
              }}
              onDragOver={e => e.preventDefault()}
              onDrop={e => {
                e.preventDefault();
                const itemId = e.dataTransfer.getData('itemId');
                if (itemId) placeItem(itemId, 'haram', e.clientX, e.clientY);
              }}
            >
              {state.items
                .filter(item => state.placed[item.id] === 'haram')
                .map(item => (
                  <div key={item.id} className={styles.placedItem}>
                    <span>{item.icon}</span>
                    <span>{item.name.en}</span>
                  </div>
                ))}
            </div>
          </div>
        </div>
        <div className={styles.itemsArea}>
          {showHint && (
            <div className={styles.hint}>
              {t('kids.halalHaramHint')}
            </div>
          )}
          <div className={styles.itemsGrid}>
            {state.items
              .filter(item => state.placed[item.id] === null)
              .map(item => (
                <button
                  key={item.id}
                  type="button"
                  className={[styles.itemCard, selectedId === item.id && styles.itemSelected].filter(Boolean).join(' ')}
                  aria-pressed={selectedId === item.id}
                  onClick={() => toggleSelect(item)}
                  draggable
                  onDragStart={e => e.dataTransfer.setData('itemId', item.id)}
                >
                  <span className={styles.itemIcon}>{item.icon}</span>
                  <span className={styles.itemName} dir="auto">{item.name.en}</span>

                </button>
              ))}
          </div>
        </div>
        {lost && <div className={styles.timeUp}>{t('kids.gameTimeUp')}</div>}
      </div>
    </MiniGameShell>
  );
}

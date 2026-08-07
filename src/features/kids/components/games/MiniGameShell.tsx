import { useEffect, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Home, RotateCcw, Star } from 'lucide-react';
import Button from 'components/ui/Button';
import Typography from 'components/ui/Typography';
import SparkleBurst from 'features/kids/components/rewards/SparkleBurst';
import { playWin } from 'services/kidSounds';
import { useKidsRewardsStore, STARS_PER_GAME_COMPLETION } from 'stores/useKidsRewardsStore';
import useTranslation from 'hooks/useTranslation';
import styles from './MiniGameShell.module.css';

export interface MiniGameShellProps {
  /** Stable game id used for per-game completion tallies, e.g. 'matching'. */
  gameId: string;
  /** Game title shown in the header. */
  title: string;
  /** The interactive game board. */
  children: ReactNode;
  /** Header-side extras (attempts counter, timer…) rendered next to the stars. */
  headerExtra?: ReactNode;
  /** Flipped to true by the game when the player wins. */
  won: boolean;
  /** Resets the board for another round. */
  onRestart: () => void;
  /** Rendered label for the restart control. */
  restartLabel?: string;
}

/**
 * Phase 6 — shared shell for all mini games.
 *
 * Owns everything every game needs and nothing game-specific:
 *  - consistent kids chrome (back home, title, live star balance),
 *  - the celebratory win overlay (+50 stars callout + sparkle burst),
 *  - the one-time rewards call (recordGameCompleted fires exactly once per
 *    win, guarded by a ref so React StrictMode double-renders can't double
 *    award).
 *
 * Games plug their board into `children` and simply flip `won`.
 */
export default function MiniGameShell({
  gameId,
  title,
  children,
  headerExtra,
  won,
  onRestart,
  restartLabel,
}: MiniGameShellProps) {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const stars = useKidsRewardsStore((state) => state.stars);
  const recordGameCompleted = useKidsRewardsStore((state) => state.recordGameCompleted);
  const [celebrating, setCelebrating] = useState(false);
  const awardedRef = useRef(false);

  useEffect(() => {
    if (won && !awardedRef.current) {
      awardedRef.current = true;
      recordGameCompleted(gameId);
      playWin();
      setCelebrating(true);
      const timeout = window.setTimeout(() => setCelebrating(false), 900);
      return () => window.clearTimeout(timeout);
    }
  }, [won, gameId, recordGameCompleted]);

  const goHome = () => navigate(-1);

  return (
    <section className={styles.shell} aria-label={title}>
      <header className={styles.header}>
        <Button
          variant="icon"
          onClick={goHome}
          aria-label={t('kids.backToGames')}
          leadingIcon={<ArrowLeft size={22} />}
        />
        <Typography variant="h2" as="h1" className={styles.title}>
          {title}
        </Typography>
        <div className={styles.headerRight}>
          {headerExtra}
          <span className={styles.stars} aria-label={t('kids.starsEarned', { count: stars })}>
            <Star size={20} fill="currentColor" aria-hidden="true" />
            {stars}
          </span>
        </div>
      </header>

      <div className={styles.board}>
        {celebrating && <SparkleBurst burstKey={`win-${gameId}`} x="50%" y="40%" />}
        {children}
      </div>

      {won && (
        <div className={styles.winOverlay} role="status">
          <div className={styles.winCard}>
            <SparkleBurst burstKey={`win-${gameId}`} />
            <Typography variant="h2" className={styles.winTitle}>
              {t('kids.gameWin')}
            </Typography>
            <Typography variant="body" muted className={styles.winCallout}>
              {t('kids.gameStarsEarned', { count: STARS_PER_GAME_COMPLETION })}
            </Typography>
            <div className={styles.winActions}>
              <Button variant="primary" onClick={onRestart} leadingIcon={<RotateCcw size={18} />}>
                {restartLabel ?? t('kids.gamePlayAgain')}
              </Button>
              <Button variant="secondary" onClick={goHome} leadingIcon={<Home size={18} />}>
                {t('kids.gameGoHome')}
              </Button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

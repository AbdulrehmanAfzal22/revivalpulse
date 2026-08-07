import { Flame, Gamepad2, Star, Trophy } from 'lucide-react';
import Typography from 'components/ui/Typography';
import BadgeShowcase from 'features/kids/components/BadgeShowcase';
import { useKidsRewardsStore, computeStreak } from 'stores/useKidsRewardsStore';
import useTranslation from 'hooks/useTranslation';
import styles from './MyStarsDashboard.module.css';

/**
 * Phase 10 — "My Stars" dashboard: everything a child earned, at a glance.
 *
 * Deliberately picture-led (huge star count, flame for streak, badge shelf)
 * with only a few short words, so early readers can still read their own
 * progress. Data comes from the Phase 8 rewards store (IndexedDB-persisted).
 */
export default function MyStarsDashboard() {
  const { t } = useTranslation();
  const stars = useKidsRewardsStore((state) => state.stars);
  const daysPlayed = useKidsRewardsStore((state) => state.daysPlayed);
  const unlockedBadges = useKidsRewardsStore((state) => state.unlockedBadges);
  const gamesCompleted = useKidsRewardsStore((state) => state.gamesCompleted);

  const streak = computeStreak(daysPlayed);
  const gamesCount = Object.values(gamesCompleted).reduce((sum, count) => sum + count, 0);

  return (
    <section className={styles.dashboard} aria-label={t('kids.myStars')}>
      <div className={styles.starCard}>
        <span className={styles.bigStar} aria-hidden="true">
          <Star size={44} fill="currentColor" />
        </span>
        <Typography variant="h2" className={styles.starCount} aria-label={t('kids.starsEarned', { count: stars })}>
          {stars}
        </Typography>
        <Typography variant="body" muted>
          {t('kids.starsEarned', { count: stars })}
        </Typography>
      </div>

      <div className={styles.statGrid}>
        <div className={styles.statCard}>
          <span className={styles.statIcon}>
            <Flame size={30} aria-hidden="true" />
          </span>
          <span className={styles.statValue}>{streak}</span>
          <Typography variant="caption" muted className={styles.statLabel}>
            {t('kids.dayStreak')}
          </Typography>
        </div>
        <div className={styles.statCard}>
          <span className={styles.statIcon}>
            <Gamepad2 size={30} aria-hidden="true" />
          </span>
          <span className={styles.statValue}>{gamesCount}</span>
          <Typography variant="caption" muted className={styles.statLabel}>
            {t('kids.gamesCompleted')}
          </Typography>
        </div>
        <div className={styles.statCard}>
          <span className={styles.statIcon}>
            <Trophy size={30} aria-hidden="true" />
          </span>
          <span className={styles.statValue}>{unlockedBadges.length}</span>
          <Typography variant="caption" muted className={styles.statLabel}>
            {t('kids.badges')}
          </Typography>
        </div>
      </div>

      <div className={styles.badgeShelf}>
        <Typography variant="h4" as="h2">
          {t('kids.yourBadges')}
        </Typography>
        <BadgeShowcase earnedBadgeIds={unlockedBadges} />
      </div>
    </section>
  );
}

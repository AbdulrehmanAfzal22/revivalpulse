import { Link } from 'react-router-dom';
import { BookOpen, GraduationCap, HeartHandshake, ShieldCheck, Type } from 'lucide-react';
import Typography from 'components/ui/Typography';
import Card from 'components/ui/Card';
import BadgeShowcase from 'features/kids/components/BadgeShowcase';
import NasheedToggle from 'features/kids/components/NasheedToggle';
import { useKidsProgressStore, getEarnedBadgeIds, getStreak, getTodayActivityCount } from 'stores/kidsProgressStore';
import { useKidsPreferencesStore } from 'stores/kidsPreferencesStore';
import { ROUTES } from 'constants/routes';
import useTranslation from 'hooks/useTranslation';
import type { TranslationKey } from 'i18n';
import styles from './KidsPage.module.css';

const SECTIONS: { to: string; labelKey: TranslationKey; icon: typeof Type; color: string }[] = [
  { to: ROUTES.KIDS_ALPHABET, labelKey: 'kids.nav.letters', icon: Type, color: '#ff7a3d' },
  { to: ROUTES.KIDS_STORIES, labelKey: 'kids.nav.stories', icon: BookOpen, color: '#5c6bc0' },
  { to: ROUTES.KIDS_LESSONS, labelKey: 'kids.nav.lessons', icon: GraduationCap, color: '#3e9e83' },
  { to: ROUTES.KIDS_MANNERS, labelKey: 'kids.nav.manners', icon: HeartHandshake, color: '#d1637a' },
  { to: ROUTES.KIDS_PARENT, labelKey: 'kids.nav.parents', icon: ShieldCheck, color: '#6a5acd' },
];

export default function KidsPage() {
  const records = useKidsProgressStore((state) => state.records);
  const dailyGoalTarget = useKidsPreferencesStore((state) => state.dailyGoalTarget);
  const { t } = useTranslation();

  const earnedBadgeIds = getEarnedBadgeIds(records);
  const todayCount = getTodayActivityCount(records);
  const streak = getStreak(records);
  const goalProgress = Math.min(100, Math.round((todayCount / dailyGoalTarget) * 100));

  return (
    <div className={styles.page}>
      <Typography variant="h1" as="h1" className={styles.greeting}>
        {t('kids.greeting')}
      </Typography>

      <Card elevation="raised" className={styles.goalCard}>
        <div className={styles.goalHeader}>
          <Typography variant="body">{t('kids.todaysGoal')}</Typography>
          <Typography variant="caption" muted>
            {t('kids.goalProgress', { count: todayCount, target: dailyGoalTarget })}
          </Typography>
        </div>
        <div className={styles.progressTrack}>
          <div className={styles.progressFill} style={{ width: `${goalProgress}%` }} />
        </div>
        {streak > 0 && (
          <Typography variant="caption" muted>
            {t('kids.streak', { count: streak })}
          </Typography>
        )}
      </Card>

      <div className={styles.grid}>
        {SECTIONS.map((section) => (
          <Link key={section.to} to={section.to} className={styles.tileLink}>
            <Card elevation="raised" className={styles.tile} style={{ borderColor: section.color }}>
              <section.icon size={28} color={section.color} />
              <Typography variant="body">{t(section.labelKey)}</Typography>
            </Card>
          </Link>
        ))}
      </div>

      <div>
        <Typography variant="h4" as="h2" className={styles.sectionTitle}>
          {t('kids.yourBadges')}
        </Typography>
        <BadgeShowcase earnedBadgeIds={earnedBadgeIds} />
      </div>

      <NasheedToggle />
    </div>
  );
}

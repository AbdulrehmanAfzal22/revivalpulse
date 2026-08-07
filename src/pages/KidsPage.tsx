import { Link } from 'react-router-dom';
import {
  BookOpen,
  CloudSun,
  Gamepad2,
  GraduationCap,
  HeartHandshake,
  ListChecks,
  ShieldCheck,
  Sparkles,
  Star,
  Type,
  Users,
} from 'lucide-react';
import Typography from 'components/ui/Typography';
import Card from 'components/ui/Card';
import BadgeShowcase from 'features/kids/components/BadgeShowcase';
import NasheedToggle from 'features/kids/components/NasheedToggle';
import { useKidsProgressStore, getEarnedBadgeIds, getStreak, getTodayActivityCount } from 'stores/kidsProgressStore';
import { useKidsRewardsStore } from 'stores/useKidsRewardsStore';
import { useKidsPreferencesStore } from 'stores/kidsPreferencesStore';
import { ROUTES } from 'constants/routes';
import useTranslation from 'hooks/useTranslation';
import type { TranslationKey } from 'i18n';
import styles from './KidsPage.module.css';

const SECTIONS: { to: string; labelKey: TranslationKey; icon: typeof Type; color: string }[] = [
  { to: ROUTES.KIDS_ALPHABET, labelKey: 'kids.nav.letters', icon: Type, color: '#ff7a3d' },
  { to: ROUTES.KIDS_STORIES, labelKey: 'kids.nav.stories', icon: BookOpen, color: '#5c6bc0' },
  { to: ROUTES.KIDS_SAHABI, labelKey: 'kids.nav.sahabi', icon: Users, color: '#e0902f' },
  { to: ROUTES.KIDS_LESSONS, labelKey: 'kids.nav.lessons', icon: GraduationCap, color: '#3e9e83' },
  { to: ROUTES.KIDS_MANNERS, labelKey: 'kids.nav.manners', icon: HeartHandshake, color: '#d1637a' },
  { to: ROUTES.KIDS_PARENT, labelKey: 'kids.nav.parents', icon: ShieldCheck, color: '#6a5acd' },
  { to: ROUTES.KIDS_QUIZ, labelKey: 'kids.nav.quiz', icon: ListChecks, color: '#2a9d8f' },
  { to: ROUTES.KIDS_GAMES, labelKey: 'kids.nav.games', icon: Gamepad2, color: '#e76f51' },
  { to: ROUTES.KIDS_STARS, labelKey: 'kids.nav.stars', icon: Star, color: '#f4a261' },
];

const FLOATING_DECORATIONS: { icon: typeof Star; style: React.CSSProperties; delay?: string }[] = [
  { icon: Star, style: { top: '12%', left: '8%', width: 26, height: 26 } },
  { icon: Sparkles, style: { top: '22%', right: '10%', width: 30, height: 30 }, delay: '1.2s' },
  { icon: CloudSun, style: { bottom: '14%', left: '12%', width: 34, height: 34 }, delay: '0.6s' },
  { icon: Star, style: { bottom: '20%', right: '14%', width: 20, height: 20 }, delay: '2s' },
];

export default function KidsPage() {
  const records = useKidsProgressStore((state) => state.records);
  const stars = useKidsRewardsStore((state) => state.stars);
  const dailyGoalTarget = useKidsPreferencesStore((state) => state.dailyGoalTarget);
  const { t } = useTranslation();

  const earnedBadgeIds = getEarnedBadgeIds(records);
  const todayCount = getTodayActivityCount(records);
  const streak = getStreak(records);
  const goalProgress = Math.min(100, Math.round((todayCount / dailyGoalTarget) * 100));

  return (
    <div className="container">
      <div className={styles.page}>
      <section className={styles.hero}>
        {FLOATING_DECORATIONS.map((decoration, index) => {
          const Decoration = decoration.icon;
          return (
            <Decoration
              key={index}
              className={styles.heroFloat}
              style={{ ...decoration.style, animationDelay: decoration.delay }}
              aria-hidden="true"
            />
          );
        })}
        <Typography variant="h1" as="h1" className={styles.heroTitle}>
          {t('kids.greeting')}
        </Typography>
        <span className={styles.heroBadge}>
          <Star size={16} fill="currentColor" aria-hidden="true" />
          <Typography variant="caption" as="span">
            {t('kids.starsEarned', { count: stars })}
          </Typography>
        </span>
      </section>

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
            <Card
              elevation="raised"
              className={styles.tile}
              style={{
                borderColor: section.color,
                background: `linear-gradient(135deg, ${section.color}22, ${section.color}0d)`,
              }}
            >
              <span className={styles.tileIcon}>
                <section.icon size={26} color={section.color} />
              </span>
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
    </div>
  );
}

import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  BookOpen,
  Flame,
  Gamepad2,
  GraduationCap,
  HeartHandshake,
  ListChecks,
  Moon,
  ShieldCheck,
  Sparkles,
  Star,
  Trophy,
  Type,
  Users,
} from 'lucide-react';
import Typography from 'components/ui/Typography';
import Card from 'components/ui/Card';
import BadgeShowcase from 'features/kids/components/BadgeShowcase';
import KidsMascot from 'features/kids/components/KidsMascot';
import NasheedToggle from 'features/kids/components/NasheedToggle';
import { useKidsProgressStore, getEarnedBadgeIds, getStreak, getTodayActivityCount } from 'stores/kidsProgressStore';
import { useKidsRewardsStore } from 'stores/useKidsRewardsStore';
import { useKidsPreferencesStore } from 'stores/kidsPreferencesStore';
import { ROUTES } from 'constants/routes';
import useTranslation from 'hooks/useTranslation';
import type { TranslationKey } from 'i18n';
import styles from './KidsPage.module.css';

/** Every accent is a kids alias of a main-site token, so tiles follow light/dark. */
const SECTIONS: { to: string; labelKey: TranslationKey; icon: typeof Type; accent: string }[] = [
  { to: ROUTES.KIDS_ALPHABET, labelKey: 'kids.nav.letters', icon: Type, accent: 'var(--kids-emerald)' },
  { to: ROUTES.KIDS_STORIES, labelKey: 'kids.nav.stories', icon: BookOpen, accent: 'var(--kids-sunshine)' },
  { to: ROUTES.KIDS_SAHABI, labelKey: 'kids.nav.sahabi', icon: Users, accent: 'var(--kids-coral)' },
  { to: ROUTES.KIDS_LESSONS, labelKey: 'kids.nav.lessons', icon: GraduationCap, accent: 'var(--kids-sky)' },
  { to: ROUTES.KIDS_MANNERS, labelKey: 'kids.nav.manners', icon: HeartHandshake, accent: 'var(--kids-purple)' },
  { to: ROUTES.KIDS_PARENT, labelKey: 'kids.nav.parents', icon: ShieldCheck, accent: 'var(--kids-emerald)' },
  { to: ROUTES.KIDS_QUIZ, labelKey: 'kids.nav.quiz', icon: ListChecks, accent: 'var(--kids-sunshine)' },
  { to: ROUTES.KIDS_GAMES, labelKey: 'kids.nav.games', icon: Gamepad2, accent: 'var(--kids-coral)' },
  { to: ROUTES.KIDS_STARS, labelKey: 'kids.nav.stars', icon: Star, accent: 'var(--kids-sunshine)' },
];

const HERO_MESSAGES = [
  'Ready to learn today?',
  "Let's explore the Quran together.",
  "You're doing amazing — keep going!",
];

export default function KidsPage() {
  const records = useKidsProgressStore((state) => state.records);
  const stars = useKidsRewardsStore((state) => state.stars);
  const dailyGoalTarget = useKidsPreferencesStore((state) => state.dailyGoalTarget);
  const { t } = useTranslation();
  const [messageIndex, setMessageIndex] = useState(0);
  const [starsPulse, setStarsPulse] = useState(false);
  const previousStars = useRef(stars);

  useEffect(() => {
    const interval = window.setInterval(() => setMessageIndex((index) => (index + 1) % HERO_MESSAGES.length), 4200);
    return () => window.clearInterval(interval);
  }, []);

  useEffect(() => {
    if (previousStars.current === stars) return;
    previousStars.current = stars;
    setStarsPulse(true);
    const timeout = window.setTimeout(() => setStarsPulse(false), 900);
    return () => window.clearTimeout(timeout);
  }, [stars]);

  const timeGreeting = new Date().getHours() < 12 ? 'Good morning' : new Date().getHours() < 18 ? 'Good afternoon' : 'Good evening';

  const earnedBadgeIds = getEarnedBadgeIds(records);
  const todayCount = getTodayActivityCount(records);
  const streak = getStreak(records);
  const goalProgress = Math.min(100, Math.round((todayCount / dailyGoalTarget) * 100));

  return (
    <div className={styles.page}>
      <section className={styles.hero}>
        <span className={styles.ornaments} aria-hidden="true">
          <Moon size={28} className={`${styles.ornament} ${styles.ornamentMoon}`} />
          <Star size={15} className={`${styles.ornament} ${styles.ornamentStarOne}`} fill="currentColor" />
          <Star size={11} className={`${styles.ornament} ${styles.ornamentStarTwo}`} fill="currentColor" />
          <Sparkles size={20} className={`${styles.ornament} ${styles.ornamentSparkle}`} />
          <Star size={13} className={`${styles.ornament} ${styles.ornamentStarThree}`} fill="currentColor" />
        </span>

        <span className={styles.heroStage}>
          <KidsMascot className={styles.heroMascot} />
        </span>
        <Typography variant="h1" as="h1" className={styles.heroTitle}>
          {Array.from(t('kids.greeting')).map((character, index) => (
            <span
              key={`${character}-${index}`}
              className={styles.greetingCharacter}
              style={{ '--char-index': index } as React.CSSProperties}
            >
              {character === ' ' ? '\u00a0' : character}
            </span>
          ))}
        </Typography>
        <span className={styles.heroOrnament} aria-hidden="true" />
        <span className={styles.heroMessage} key={messageIndex}>
          {messageIndex === HERO_MESSAGES.length - 1 ? `${timeGreeting}! ` : ''}{HERO_MESSAGES[messageIndex]}
        </span>
        <span className={[styles.heroBadge, starsPulse && styles.heroBadgePulse].filter(Boolean).join(' ')}>
          <Star size={16} fill="currentColor" aria-hidden="true" />
          <Typography variant="caption" as="span">
            {t('kids.starsEarned', { count: stars })}
          </Typography>
          {starsPulse && <Sparkles size={18} className={styles.starBurst} aria-hidden="true" />}
        </span>
      </section>

      <Card elevation="raised" className={[styles.goalCard, goalProgress >= 100 ? styles.goalComplete : ''].filter(Boolean).join(' ')}>
        <div className={styles.goalHeader}>
          <Typography variant="body">{t('kids.todaysGoal')}</Typography>
          <span className={styles.goalStatus}>
            <Typography variant="caption" muted>
              {t('kids.goalProgress', { count: todayCount, target: dailyGoalTarget })}
            </Typography>
            {goalProgress >= 100 && <Sparkles size={20} className={styles.goalBurst} aria-hidden="true" />}
          </span>
        </div>
        <div className={styles.progressTrack}>
          <div className={styles.progressFill} style={{ width: `${goalProgress}%` }}>
            <Star size={14} fill="currentColor" className={styles.progressKnob} aria-hidden="true" />
          </div>
        </div>
        {streak > 0 && (
          <Typography variant="caption" muted className={styles.streakLine}>
            <Flame size={15} className={styles.streakFlame} aria-hidden="true" />
            {t('kids.streak', { count: streak })}
          </Typography>
        )}
      </Card>

      <div className={styles.grid}>
        {SECTIONS.map((section) => (
          <Link key={section.to} to={section.to} className={styles.tileLink}>
            <Card elevation="raised" className={styles.tile} style={{ '--tile-accent': section.accent } as React.CSSProperties}>
              <span className={styles.tileIcon}>
                <section.icon size={26} />
              </span>
              <Typography variant="body">{t(section.labelKey)}</Typography>
            </Card>
          </Link>
        ))}
      </div>

      <div>
        <Typography variant="h4" as="h2" className={styles.sectionTitle}>
          <Trophy size={18} className={styles.sectionTitleIcon} aria-hidden="true" />
          {t('kids.yourBadges')}
        </Typography>
        <BadgeShowcase earnedBadgeIds={earnedBadgeIds} />
      </div>

      <NasheedToggle />
    </div>
  );
}

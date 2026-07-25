import { BookOpen, Flame, GraduationCap, HeartHandshake, Trophy, Type } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import Typography from 'components/ui/Typography';
import { BADGE_DEFINITIONS } from 'data/kids/badges';
import type { BadgeId } from 'types/kids.types';
import useTranslation from 'hooks/useTranslation';
import styles from './BadgeShowcase.module.css';

const BADGE_ICONS: Record<BadgeId, LucideIcon> = {
  'alphabet-explorer': Type,
  'quiz-whiz': Trophy,
  'story-time': BookOpen,
  'daily-learner': Flame,
  'quran-beginner': GraduationCap,
  'good-manners': HeartHandshake,
};

export interface BadgeShowcaseProps {
  earnedBadgeIds: BadgeId[];
}

export default function BadgeShowcase({ earnedBadgeIds }: BadgeShowcaseProps) {
  const { t } = useTranslation();

  return (
    <div className={styles.grid}>
      {BADGE_DEFINITIONS.map((badge) => {
        const isEarned = earnedBadgeIds.includes(badge.id);
        const Icon = BADGE_ICONS[badge.id];
        return (
          <div
            key={badge.id}
            className={[styles.badge, isEarned && styles.earned].filter(Boolean).join(' ')}
            title={t(badge.descriptionKey)}
          >
            <Icon size={24} />
            <Typography variant="caption" className={styles.label}>
              {t(badge.labelKey)}
            </Typography>
          </div>
        );
      })}
    </div>
  );
}

import { useEffect } from 'react';
import { Sparkles } from 'lucide-react';
import Dialog from 'components/ui/Dialog';
import Button from 'components/ui/Button';
import BadgeShowcase from 'features/kids/components/BadgeShowcase';
import { playWin } from 'services/kidSounds';
import type { BadgeId } from 'types/kids.types';
import useTranslation from 'hooks/useTranslation';
import styles from './BadgeUnlockModal.module.css';

export interface BadgeUnlockModalProps {
  /** Badge ids unlocked since the last time the modal was shown. */
  badgeIds: BadgeId[];
  onClose: () => void;
}

/**
 * Phase 9 — celebratory badge moment. Shows the newly-earned badge(s) with a
 * win jingle and a sparkle flourish, reusing BadgeShowcase so the badge
 * artwork/names stay defined in exactly one place.
 */
export default function BadgeUnlockModal({ badgeIds, onClose }: BadgeUnlockModalProps) {
  const { t } = useTranslation();
  const isOpen = badgeIds.length > 0;

  useEffect(() => {
    if (isOpen) playWin();
  }, [isOpen]);

  return (
    <Dialog isOpen={isOpen} onClose={onClose} title={t('kids.badgeUnlocked')}>
      <div className={styles.body}>
        <div className={styles.hero}>
          <Sparkles size={36} aria-hidden="true" />
        </div>
        <BadgeShowcase earnedBadgeIds={badgeIds} />
        <Button variant="primary" onClick={onClose} className={styles.doneButton}>
          {t('kids.badgeUnlockContinue')}
        </Button>
      </div>
    </Dialog>
  );
}

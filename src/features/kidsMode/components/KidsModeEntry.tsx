import { Link } from 'react-router-dom';
import { Sparkles } from 'lucide-react';
import { ROUTES } from 'constants/routes';
import KidsMascot from 'features/kids/components/KidsMascot';
import Typography from 'components/ui/Typography';
import useTranslation from 'hooks/useTranslation';
import styles from './KidsModeEntry.module.css';

/**
 * Home-page entry point into Kids Mode (Phase 3): one LARGE illustrated button
 * (not a plain text link). Links to the already-lazy-loaded /kids section. The
 * kid's routes get their own theme via KidsLayout; this tile only *points*
 * there — nothing here leaks kids styles onto main site surfaces.
 */
export default function KidsModeEntry() {
  const { t } = useTranslation();

  return (
    <Link to={ROUTES.KIDS} className={styles.entry} data-testid="kids-mode-entry">
      <KidsMascot className={styles.mascot} />
      <span className={styles.text}>
        <Typography variant="h2" as="span" className={styles.title}>
          {t('kids.kidsMode')}
        </Typography>
        <Typography variant="body" className={styles.tagline}>
          {t('kids.entryTagline')}
        </Typography>
        <span className={styles.cta}>
          <Sparkles size={16} aria-hidden="true" />
          {t('kids.enterKidsMode')}
        </span>
      </span>
    </Link>
  );
}
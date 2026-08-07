import { Link } from 'react-router-dom';
import { Sparkles } from 'lucide-react';
import { ROUTES } from 'constants/routes';
import Typography from 'components/ui/Typography';
import useTranslation from 'hooks/useTranslation';
import styles from './KidsModeEntry.module.css';

/**
 * Inline "mascot" illustration — a cheerful sun-faced friend in the kids
 * palette. There is no bundled character/mascot image yet (see
 * types/kidsSection.types.ts: all public/assets photos are landscapes), so
 * this SVG IS the character art right now: self-contained, no download,
 * always on-brand. When a real mascot image is added, register it in
 * KIDS_ASSETS (category 'character') and swap the <svg> here for an <img>.
 */
function KidsMascot() {
  return (
    <svg
      className={styles.mascot}
      viewBox="0 0 120 120"
      role="img"
      aria-hidden="true"
      focusable="false"
    >
      {/* Glow halo */}
      <circle cx="60" cy="60" r="54" fill="var(--kids-sky, #5ec8e0)" opacity="0.35" />
      {/* Face */}
      <circle cx="60" cy="62" r="40" fill="var(--kids-sunshine, #ffc94d)" />
      {/* Rosy cheeks */}
      <circle cx="42" cy="70" r="6" fill="var(--kids-coral, #ff8965)" opacity="0.7" />
      <circle cx="78" cy="70" r="6" fill="var(--kids-coral, #ff8965)" opacity="0.7" />
      {/* Closed happy eyes */}
      <path d="M42 58 q6 -8 12 0" stroke="#3a2a1a" strokeWidth="4" strokeLinecap="round" fill="none" />
      <path d="M66 58 q6 -8 12 0" stroke="#3a2a1a" strokeWidth="4" strokeLinecap="round" fill="none" />
      {/* Smile */}
      <path d="M46 74 q14 14 28 0" stroke="#3a2a1a" strokeWidth="4" strokeLinecap="round" fill="none" />
      {/* Scarf — the connecting emerald accent */}
      <path
        d="M40 84 Q60 98 80 84 L80 88 Q60 104 40 88 Z"
        fill="var(--kids-emerald, #146356)"
      />
    </svg>
  );
}

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
      <KidsMascot />
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
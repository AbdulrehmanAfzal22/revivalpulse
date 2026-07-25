import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Typography from 'components/ui/Typography';
import { ROUTES } from 'constants/routes';
import useTranslation from 'hooks/useTranslation';
import styles from './Footer.module.css';

const UNLOCK_TAP_COUNT = 5;
const UNLOCK_WINDOW_MS = 3000;

/** Tapping the copyright line 5 times within 3 seconds opens Developer Mode — unlinked from any real navigation on purpose. */
export default function Footer() {
  const year = new Date().getFullYear();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [tapCount, setTapCount] = useState(0);
  const resetTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  function handleTap() {
    if (resetTimer.current) clearTimeout(resetTimer.current);

    const next = tapCount + 1;
    if (next >= UNLOCK_TAP_COUNT) {
      setTapCount(0);
      navigate(ROUTES.DEV_MODE);
      return;
    }

    setTapCount(next);
    resetTimer.current = setTimeout(() => setTapCount(0), UNLOCK_WINDOW_MS);
  }

  return (
    <footer className={styles.footer}>
      <Typography variant="caption" muted onClick={handleTap} className={styles.tapTarget}>
        {t('footer.copyright', { year })}
      </Typography>
    </footer>
  );
}

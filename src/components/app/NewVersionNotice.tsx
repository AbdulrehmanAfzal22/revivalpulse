import { useEffect, useState } from 'react';
import { RotateCw, X } from 'lucide-react';
import Button from 'components/ui/Button';
import { subscribeToServiceWorkerUpdates } from 'serviceWorkerRegistration';
import useTranslation from 'hooks/useTranslation';
import styles from './NewVersionNotice.module.css';

/**
 * Dismissible "a new build is ready" banner. The deployment's new service
 * worker takes control mid-session (skipWaiting + clients.claim); this is the
 * one-tap refresh that moves the user onto it, so nobody lingers on a stale
 * cached bundle after a redeploy.
 */
export default function NewVersionNotice() {
  const { t } = useTranslation();
  const [visible, setVisible] = useState(false);

  useEffect(() => subscribeToServiceWorkerUpdates(() => setVisible(true)), []);

  if (!visible) return null;

  return (
    <div className={styles.notice} role="status" aria-live="polite">
      <span className={styles.message}>
        <RotateCw className={styles.icon} aria-hidden />
        {t('common.newVersionAvailable')}
      </span>
      <span className={styles.actions}>
        <Button variant="primary" size="sm" onClick={() => window.location.reload()}>
          {t('common.refresh')}
        </Button>
        <Button variant="ghost" size="sm" onClick={() => setVisible(false)} aria-label={t('common.close')}>
          <X aria-hidden />
        </Button>
      </span>
    </div>
  );
}
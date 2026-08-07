import { Suspense } from 'react';
import { Outlet } from 'react-router-dom';
import ErrorBoundary from 'components/feedback/ErrorBoundary';
import LoadingSpinner from 'components/feedback/LoadingSpinner';
import useTranslation from 'hooks/useTranslation';
import styles from './ImmersiveLayout.module.css';

/**
 * Immersive Recitation's own shell — no main Navbar/Footer, no global
 * AudioPlayer, no assistant launcher. A full-viewport canvas for the
 * background video + timed name overlay. Kept separate on purpose: like the
 * KidsMode shell, this is a "near-separate app skinned inside the SPA shell".
 */
export default function ImmersiveLayout() {
  const { t } = useTranslation();

  return (
    <div className={styles.shell}>
      <main className={styles.content}>
        <ErrorBoundary>
          <Suspense
            fallback={
              <div className={styles.loading}>
                <LoadingSpinner size="lg" label={t('common.loading')} />
              </div>
            }
          >
            <Outlet />
          </Suspense>
        </ErrorBoundary>
      </main>
    </div>
  );
}
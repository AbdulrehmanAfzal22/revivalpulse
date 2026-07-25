import { Suspense } from 'react';
import { Outlet } from 'react-router-dom';
import ErrorBoundary from 'components/feedback/ErrorBoundary';
import LoadingSpinner from 'components/feedback/LoadingSpinner';
import KidsNav from 'features/kids/components/KidsNav';
import useTranslation from 'hooks/useTranslation';
import 'styles/kidsTheme.css';
import styles from './KidsLayout.module.css';

/**
 * Kids Mode's own shell — no main Navbar/Footer, a bottom tab bar instead,
 * and the .kidsTheme palette (styles/kidsTheme.css) reskinning every
 * components/ui/* primitive used inside it. Phase 14: "a near-separate app
 * skinned inside the main shell — treat it that way."
 */
export default function KidsLayout() {
  const { t } = useTranslation();

  return (
    <div className={`kidsTheme ${styles.shell}`}>
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
      <KidsNav />
    </div>
  );
}

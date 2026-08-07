import { Suspense, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import ErrorBoundary from 'components/feedback/ErrorBoundary';
import LoadingSpinner from 'components/feedback/LoadingSpinner';
import KidsNav from 'features/kids/components/KidsNav';
import SafeExitGate from 'features/kids/components/SafeExitGate';
import useTranslation from 'hooks/useTranslation';
import 'styles/kidsTheme.css';
import styles from './KidsLayout.module.css';

/**
 * Kids Mode's own shell — no main Navbar/Footer, a bottom tab bar instead,
 * and the .kidsTheme palette (styles/kidsTheme.css) reskinning every
 * components/ui/* primitive used inside it. Phase 14: "a near-separate app
 * skinned inside the main shell — treat it that way."
 *
 * While mounted we tag <html> with `.kids-active` (see kidsTheme.css) which
 * bumps the root font-size from 16px to 18px, so every rem-based element on
 * these routes renders with the larger kids type scale. The class is removed
 * on unmount so the adult scale returns immediately.
 */
export default function KidsLayout() {
  const { t } = useTranslation();

  useEffect(() => {
    document.documentElement.classList.add('kids-active');
    return () => document.documentElement.classList.remove('kids-active');
  }, []);

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
      <SafeExitGate />
    </div>
  );
}

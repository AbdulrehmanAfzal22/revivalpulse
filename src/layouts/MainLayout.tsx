import { lazy, Suspense } from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from 'components/layout/Navbar';
import Footer from 'components/layout/Footer';
import ErrorBoundary from 'components/feedback/ErrorBoundary';
import LoadingSpinner from 'components/feedback/LoadingSpinner';
import AudioPlayer from 'features/quranReader/components/AudioPlayer';
import PrayerNotificationScheduler from 'features/notifications/components/PrayerNotificationScheduler';
import useTranslation from 'hooks/useTranslation';
import styles from './MainLayout.module.css';

const AssistantPanel = lazy(() => import('features/assistant/components/AssistantPanel'));

export default function MainLayout() {
  const { t } = useTranslation();

  return (
    <div className="page-shell">
      <Navbar />
      <main className="content">
        <ErrorBoundary>
          <Suspense
            fallback={
              <div className={styles.loading}>
                <LoadingSpinner size="lg" label={t('common.loadingPage')} />
              </div>
            }
          >
            <Outlet />
          </Suspense>
        </ErrorBoundary>
      </main>
      <Footer />
      <AudioPlayer />
      <Suspense fallback={null}>
        <AssistantPanel />
      </Suspense>
      <PrayerNotificationScheduler />
    </div>
  );
}

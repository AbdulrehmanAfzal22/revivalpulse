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

// Optional/on-demand — no need in the main bundle everyone downloads to read a surah.
const AssistantLauncherButton = lazy(() => import('features/assistant/components/AssistantLauncherButton'));
const AssistantPanel = lazy(() => import('features/assistant/components/AssistantPanel'));

export default function MainLayout() {
  const { t } = useTranslation();

  return (
    <div className={styles.shell}>
      <Navbar />
      <main className={styles.content}>
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
        <AssistantLauncherButton />
        <AssistantPanel />
      </Suspense>
      <PrayerNotificationScheduler />
    </div>
  );
}

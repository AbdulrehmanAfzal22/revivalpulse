import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from 'constants/routes';
import useTranslation from 'hooks/useTranslation';
import styles from './BackButton.module.css';

/**
 * Phase 10 — top-left back button for the immersive session.
 *
 * Returns to the 99-Names grid. It ONLY navigates: pausing/unmounting the
 * audio + video and resetting the session is handled by cleanup on unmount
 * (FullScreenLayout exits fullscreen + resets the store, useAudioEngine
 * pauses and tears down the <audio> element, BackgroundVideoPlayer's videos
 * are removed from the DOM). Browser/hardware back (mobile) goes through the
 * same React Router popstate -> unmount path, so it behaves identically.
 *
 * Always visible (not part of the auto-hiding controls tray) and high-contrast:
 * dark translucent pill + blur + white text/icon, legible over any video frame.
 */
export default function BackButton() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <button
      type="button"
      className={styles.back}
      onClick={() => navigate(ROUTES.NAMES_OF_ALLAH)}
      aria-label={t('common.back')}
    >
      <ArrowLeft className={styles.icon} aria-hidden="true" />
      <span>{t('common.back')}</span>
    </button>
  );
}
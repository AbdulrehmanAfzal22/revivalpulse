import { useCallback, useMemo, useRef } from 'react';
import ErrorBoundary from 'components/feedback/ErrorBoundary';
import FullScreenLayout from 'features/immersiveRecitation/components/FullScreenLayout';
import type { FullScreenLayoutHandle } from 'features/immersiveRecitation/components/FullScreenLayout';
import BackgroundImagePlayer from 'features/immersiveRecitation/components/BackgroundImagePlayer';
import Overlay from 'features/immersiveRecitation/components/Overlay';
import NameOverlay from 'features/immersiveRecitation/components/NameOverlay';
import BackButton from 'features/immersiveRecitation/components/BackButton';
import PlaybackControls from 'features/immersiveRecitation/components/PlaybackControls';
import ProgressBar from 'features/immersiveRecitation/components/ProgressBar';
import useAudioEngine from 'features/immersiveRecitation/hooks/useAudioEngine';
import useTimestampSync from 'features/immersiveRecitation/hooks/useTimestampSync';
import useAutoHide from 'features/immersiveRecitation/hooks/useAutoHide';
import usePlaybackShortcuts from 'features/immersiveRecitation/hooks/usePlaybackShortcuts';
import useDivineNames from 'features/namesOfAllah/hooks/useDivineNames';
import { buildAllahNames, ACTIVE_RECITER } from 'config/recitationConfig';
import { useImmersiveRecitationStore } from 'stores/immersiveRecitationStore';
import styles from './ImmersiveRecitationPage.module.css';

/**
 * Immersive 99-Names recitation route.
 *
 * Composition (bottom-to-top):
 * - BackgroundImagePlayer: two stacked stills (public/assets/pic1..8.jpg)
 *   crossfading on every 10 names, driven by currentNameIndex.
 * - Overlay: dimming gradient for legibility.
 * - NameOverlay: centered name, synced via useTimestampSync.
 * - Auto-hiding bottom tray: ProgressBar (seek) + PlaybackControls.
 *
 * The audio engine (useAudioEngine) owns the hidden <audio> element; the
 * timestamp synchronizer (useTimestampSync) is the single source of truth for
 * which name is on screen (and therefore which background image is active).
 * Video/audio media files are placeholders (config/recitationConfig.ts) until
 * real licensed assets are added.
 *
 * Name data: intentionally the SAME source as the 99-Names grid page — this
 * page calls `useDivineNames()` (features/namesOfAllah/hooks/useDivineNames,
 * backed by `getDivineNames()`, staleTime: Infinity) and only ADDS timing via
 * `buildAllahNames()` (config/recitationConfig.ts). There is no second data
 * source for names/Arabic/meaning and no new API call.
 */
export default function ImmersiveRecitationPage() {
  const fullScreenRef = useRef<FullScreenLayoutHandle | null>(null);
  const isFullscreen = useImmersiveRecitationStore((state) => state.isFullscreen);

  const { data: divineNames } = useDivineNames();
  const names = useMemo(() => (divineNames ? buildAllahNames(divineNames) : []), [divineNames]);

  const engine = useAudioEngine();
  // Frame-accurate sync: the engine exposes the live <audio> element so the
  // synchronizer can read its real currentTime every animation frame (native
  // `timeupdate` is only ~4Hz). `engine.getElement` is stable (useMemo'd).
  useTimestampSync(names, ACTIVE_RECITER.introSeconds, engine.getElement);
  const controlsVisible = useAutoHide();

  // Stable identity so the global keyboard-shortcut listener never re-subscribes
  // at 4Hz (the progress bar updates the store that often while playing).
  const toggleFullscreen = useCallback(() => {
    const handle = fullScreenRef.current;
    if (handle) {
      handle.toggleFullscreen();
    } else {
      const state = useImmersiveRecitationStore.getState();
      state.setFullscreen(!state.isFullscreen);
    }
  }, []);
  usePlaybackShortcuts({ engine, onToggleFullscreen: toggleFullscreen });

  return (
    <FullScreenLayout ref={fullScreenRef}>
      {/* In-page boundary: a crash in any single child (video/name/controls)
          shows the fallback ON the black shell instead of leaving the whole
          route as an empty black screen. The layout-level boundary in
          ImmersiveLayout is a second net but replaces the entire page. */}
      <ErrorBoundary>
        {/* Layer 0: rotating static images (crossfade; driven by currentNameIndex) */}
        <BackgroundImagePlayer />
        {/* Layer 1: dimming gradient */}
        <Overlay intensity={0.62} />
        {/* Layer 2: centered name (fades in/out with currentNameIndex) */}
        <NameOverlay names={names} />

        <div className={styles.page}>
          {/* Top-left back button (safe-area aware; sits above the name overlay). */}
          <BackButton />

          <div className={controlsVisible ? styles.bottom : `${styles.bottom} ${styles.hidden}`}>
            <ProgressBar names={names} />
            <PlaybackControls
              engine={engine}
              isFullscreen={isFullscreen}
              onToggleFullscreen={toggleFullscreen}
            />
          </div>
        </div>
      </ErrorBoundary>
    </FullScreenLayout>
  );
}
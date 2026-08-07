import { forwardRef, useCallback, useEffect, useImperativeHandle, useRef } from 'react';
import type { ReactNode } from 'react';
import { useImmersiveRecitationStore } from 'stores/immersiveRecitationStore';
import styles from './FullScreenLayout.module.css';

/**
 * Fixed, full-viewport container for the immersive experience.
 *
 * - Enter/exit TRUE browser fullscreen (Fullscreen API) where supported.
 * - Where fullscreen isn't available (iOS Safari has no standard Fullscreen
 *   API for arbitrary elements), the fixed `inset: 0` layout IS the fallback —
 *   the experience is indistinguishable from fullscreen without the API.
 * - Applies `env(safe-area-inset-*)` padding for notched devices (see CSS).
 * - On unmount (route change / back navigation): leaves fullscreen if WE
 *   initiated it and resets the page-scoped playback store so the next visit
 *   starts clean.
 */
export interface FullScreenLayoutHandle {
  requestFullscreen: () => void;
  exitFullscreen: () => void;
  toggleFullscreen: () => void;
}

export interface FullScreenLayoutProps {
  children: ReactNode;
  className?: string;
}

export const FullScreenLayout = forwardRef<FullScreenLayoutHandle, FullScreenLayoutProps>(
  ({ children, className }, ref) => {
    const setFullscreen = useImmersiveRecitationStore((state) => state.setFullscreen);
    /** True only when THIS component called requestFullscreen — so unmount cleanup
     *  never yanks the user out of a fullscreen state some other UI entered. */
    const initiatedRef = useRef(false);

    // Keep the store's isFullscreen in sync with the real browser state
    // (covers the Esc key, browser UI exits, and programmatic exits).
    useEffect(() => {
      const handleChange = (): void => {
        const isFullscreen = Boolean(document.fullscreenElement);
        if (!isFullscreen) {
          initiatedRef.current = false;
        }
        setFullscreen(isFullscreen);
      };
      document.addEventListener('fullscreenchange', handleChange);
      return () => document.removeEventListener('fullscreenchange', handleChange);
    }, [setFullscreen]);

    const requestFullscreen = useCallback(() => {
      if (!document.fullscreenEnabled || document.fullscreenElement) {
        return;
      }
      initiatedRef.current = true;
      void document.documentElement
        .requestFullscreen()
        .catch(() => {
          // Rejected (e.g. permissions policy or a transient iOS refusal) —
          // the fixed layout fallback keeps the experience intact.
          initiatedRef.current = false;
        });
    }, []);

    const exitFullscreen = useCallback(() => {
      if (!document.fullscreenElement) {
        return;
      }
      void document.exitFullscreen().catch(() => {});
    }, []);

    const toggleFullscreen = useCallback(() => {
      if (document.fullscreenElement) {
        exitFullscreen();
      } else {
        requestFullscreen();
      }
    }, [exitFullscreen, requestFullscreen]);

    useImperativeHandle(
      ref,
      () => ({ requestFullscreen, exitFullscreen, toggleFullscreen }),
      [requestFullscreen, exitFullscreen, toggleFullscreen]
    );

    // Cleanup on unmount: leave fullscreen (if we started it) and reset the
    // page-scoped playback state (isPlaying/currentTime/index/...).
    useEffect(() => {
      return () => {
        if (initiatedRef.current && document.fullscreenElement) {
          void document.exitFullscreen().catch(() => {});
        }
        useImmersiveRecitationStore.getState().reset();
      };
    }, []);

    return (
      <div className={`${styles.shell}${className ? ` ${className}` : ''}`}>{children}</div>
    );
  }
);

FullScreenLayout.displayName = 'FullScreenLayout';

export default FullScreenLayout;
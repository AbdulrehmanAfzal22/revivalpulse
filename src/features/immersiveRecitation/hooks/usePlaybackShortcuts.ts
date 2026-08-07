import { useEffect } from 'react';
import { useImmersiveRecitationStore } from 'stores/immersiveRecitationStore';
import type { AudioEngine } from './useAudioEngine';

/** Seconds stepped by the arrow-key shortcuts. */
const ARROW_SEEK_SECONDS = 5;

export interface PlaybackShortcutOptions {
  engine: AudioEngine;
  onToggleFullscreen: () => void;
}

/**
 * Phase 13 — keyboard shortcuts for the immersive session.
 *
 * - Space: toggle play/pause
 * - ArrowLeft/ArrowRight: seek ∓/± 5 seconds
 * - M: toggle mute
 * - F: toggle fullscreen
 *
 * Handlers are suppressed while a form control or interactive widget is
 * focused, so the shortcuts never fight the app's own controls (and the
 * Space bar still activates a focused button natively).
 */
export default function usePlaybackShortcuts({
  engine,
  onToggleFullscreen,
}: PlaybackShortcutOptions): void {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent): void => {
      const target = event.target as HTMLElement | null;
      const interactive =
        target !== null &&
        target.closest(
          'input, textarea, select, button, [role="slider"], [contenteditable="true"]',
        ) !== null;
      if (interactive) {
        return;
      }

      switch (event.key.toLowerCase()) {
        case ' ':
          event.preventDefault();
          if (useImmersiveRecitationStore.getState().isPlaying) {
            engine.pause();
          } else {
            engine.play();
          }
          break;
        case 'arrowleft':
          event.preventDefault();
          engine.seekTo(useImmersiveRecitationStore.getState().currentTime - ARROW_SEEK_SECONDS);
          break;
        case 'arrowright':
          event.preventDefault();
          engine.seekTo(useImmersiveRecitationStore.getState().currentTime + ARROW_SEEK_SECONDS);
          break;
        case 'm':
          engine.setMuted(!useImmersiveRecitationStore.getState().isMuted);
          break;
        case 'f':
          event.preventDefault();
          onToggleFullscreen();
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [engine, onToggleFullscreen]);
}
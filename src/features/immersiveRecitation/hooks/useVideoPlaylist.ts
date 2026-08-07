import { useCallback } from 'react';
import { useImmersiveRecitationStore } from 'stores/immersiveRecitationStore';
import type { BackgroundVideoAsset } from 'types/immersiveRecitation.types';

export interface UseVideoPlaylistResult {
  /** Asset currently on screen (null only for an empty playlist). */
  current: BackgroundVideoAsset | null;
  /** Asset to crossfade to next — preloaded by the player while `current` plays. */
  next: BackgroundVideoAsset | null;
  /** Index of `current` into the playlist (mirrors the store, wrapped). */
  currentIndex: number;
  /** Call on the active video's `ended` event to advance the playlist. */
  handleEnded: () => void;
  /** Jump to a specific playlist entry (any integer; wrapping handled here). */
  goToIndex: (index: number) => void;
}

/** Correct modulo for negative indexes. */
function wrappedIndex(index: number, length: number): number {
  return ((index % length) + length) % length;
}

/**
 * Playlist / "video transition manager" logic for the immersive background.
 *
 * The active index lives in useImmersiveRecitationStore (`currentVideoIndex`)
 * and *this* hook derives the wrapped current/next assets from it:
 *
 * - `next` is ALWAYS the asset AFTER `current` in the playlist, so the player
 *   knows exactly which clip to preload during the current one.
 * - Looping is playlist-driven, NOT per-file: elements keep `loop` off, the
 *   active clip fires `ended`, and `handleEnded` advances the index. At the
 *   end of the playlist the modulo wraps back to the first asset — an
 *   infinite ambient loop with no per-clip loop attribute involved.
 * - `goToIndex` allows skipping around (e.g. a future scene picker).
 *
 * DOM concerns (element refs, `load()`/`play()`, opacity crossfade) are owned
 * by BackgroundVideoPlayer; this hook only decides WHICH assets are on screen.
 */
export default function useVideoPlaylist(playlist: BackgroundVideoAsset[]): UseVideoPlaylistResult {
  const rawIndex = useImmersiveRecitationStore((state) => state.currentVideoIndex);
  const nextVideo = useImmersiveRecitationStore((state) => state.nextVideo);
  const setVideoIndex = useImmersiveRecitationStore((state) => state.setVideoIndex);

  const count = playlist.length;
  const currentIndex = count > 0 ? wrappedIndex(rawIndex, count) : 0;
  const current = count > 0 ? playlist[currentIndex] ?? null : null;
  const next = count > 0 ? playlist[wrappedIndex(currentIndex + 1, count)] ?? null : null;

  const handleEnded = useCallback(() => {
    nextVideo();
  }, [nextVideo]);

  const goToIndex = useCallback(
    (index: number) => {
      setVideoIndex(index);
    },
    [setVideoIndex]
  );

  return { current, next, currentIndex, handleEnded, goToIndex };
}
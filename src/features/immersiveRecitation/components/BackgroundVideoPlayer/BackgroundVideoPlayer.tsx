import { useCallback, useEffect, useRef } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { VIDEO_PLAYLIST } from 'config/recitationConfig';
import type { BackgroundVideoAsset } from 'types/immersiveRecitation.types';
import { useImmersiveRecitationStore } from 'stores/immersiveRecitationStore';
import useVideoPlaylist from '../../hooks/useVideoPlaylist';
import styles from './BackgroundVideoPlayer.module.css';

/** Crossfade duration in seconds for a scene change. */
const CROSSFADE_DURATION = 1;

export interface BackgroundVideoPlayerProps {
  /**
   * Themed playlist from useThemedVideoPlaylist (Phase 8). Defaults to
   * VIDEO_PLAYLIST so the component still composes standalone (tests, docs).
   */
  playlist?: BackgroundVideoAsset[];
}

/**
 * Two stacked <video> elements rendering the ambient background for the
 * immersive recitation, driven by the playlist from config/recitationConfig.ts.
 *
 * Transition model (why there is never a black flash):
 * - Slot A always holds even-index playlist assets, slot B odd-index ones, so
 *   on an index change the newly-visible element ALREADY has the right clip
 *   loaded (it was preloading as the standby slot) — we only call play().
 * - The swap is a Framer Motion opacity crossfade: the outgoing clip animates
 *   1 -> 0 while the incoming animates 0 -> 1 (incoming starts immediately,
 *   outgoing lingers 0.1s). At every instant at least one element is opaque,
 *   so both are never 0 together — that is the black-flash guard.
 * - Loop is playlist-driven: `loop` is deliberately NOT set on the elements.
 *   When the active clip fires `ended`, useVideoPlaylist advances the store
 *   index; at the end of the playlist it wraps back to the first clip.
 * - Both videos are muted + playsInline; playback follows the store's
 *   `isPlaying` so the audio/video session starts and stops together.
 */
export default function BackgroundVideoPlayer({
  playlist = VIDEO_PLAYLIST,
}: BackgroundVideoPlayerProps) {
  const { current, next, currentIndex, handleEnded } = useVideoPlaylist(playlist);
  const isPlaying = useImmersiveRecitationStore((state) => state.isPlaying);
  const reduceMotion = useReducedMotion();

  const videoARef = useRef<HTMLVideoElement | null>(null);
  const videoBRef = useRef<HTMLVideoElement | null>(null);
  // Track the URL each slot was assigned so we never re-assign (and reload)
  // a URL the element already has — vital for seamless preload continuity.
  const srcARef = useRef<string | null>(null);
  const srcBRef = useRef<string | null>(null);

  const activeIsA = currentIndex % 2 === 0;
  const activeRef = activeIsA ? videoARef : videoBRef;
  const standbyRef = activeIsA ? videoBRef : videoARef;
  const activeSrcRef = activeIsA ? srcARef : srcBRef;
  const standbySrcRef = activeIsA ? srcBRef : srcARef;

  // Keep the active slot pointed at the current asset and playing.
  useEffect(() => {
    const video = activeRef.current;
    if (!video || !current) {
      return;
    }
    if (activeSrcRef.current !== current.url) {
      activeSrcRef.current = current.url;
      video.src = current.url;
      video.load();
    }
    if (isPlaying && video.paused) {
      void video.play().catch(() => {});
    }
  }, [current, currentIndex, isPlaying, activeRef, activeSrcRef]);

  // Preload the NEXT asset into the standby slot (load-only, never plays).
  // This is deliberately the ONLY preloaded video — the rest of the playlist is
  // not fetched, so memory/bandwidth stay bounded to the active pair + 1.
  useEffect(() => {
    const video = standbyRef.current;
    if (!video || !next) {
      return;
    }
    if (standbySrcRef.current !== next.url) {
      standbySrcRef.current = next.url;
      video.src = next.url;
      video.load();
    }
    if (!video.paused) {
      video.pause();
    }
  }, [next, activeIsA, standbyRef, standbySrcRef]);

  // Follow the store's play/pause for the visible slot.
  useEffect(() => {
    const video = activeRef.current;
    if (!video) {
      return;
    }
    if (isPlaying) {
      if (video.paused) {
        void video.play().catch(() => {});
      }
    } else {
      video.pause();
    }
  }, [isPlaying, activeRef]);

  /**
   * Once a transition completes, release any clip the standby slot still holds
   * that is neither current nor next (a "scrolled out" clip) — its decoded
   * frames are dropped instead of lingering in memory. In steady state the
   * standby perpetually holds `next` (re-src'd on advance), so this is a
   * defensive release for edge cases (wrap replay, mid-transition change).
   */
  useEffect(() => {
    if (currentIndex === 0) {
      return undefined;
    }
    const delayMs = reduceMotion ? 0 : (CROSSFADE_DURATION + 0.2) * 1000;
    const timer = window.setTimeout(() => {
      const video = standbyRef.current;
      if (!video || !next) {
        return;
      }
      if (standbySrcRef.current !== next.url) {
        standbySrcRef.current = null;
        video.removeAttribute('src');
        video.load();
      }
    }, delayMs);
    return () => window.clearTimeout(timer);
  }, [currentIndex, next, standbyRef, standbySrcRef, reduceMotion]);

  // On unmount (route exit / back navigation): stop both elements so nothing
  // keeps decoding or playing in the background after leaving the session.
  useEffect(() => {
    const videoA = videoARef.current;
    const videoB = videoBRef.current;
    return () => {
      videoA?.pause();
      videoB?.pause();
    };
  }, []);

  /**
   * `ended` on the active clip advances the playlist. For wraps where the
   * asset repeats (single-clip playlist, or cycling back to a slot whose src
   * never changed), no render input changes, so replay the element manually.
   */
  const handleEndedReplaySafe = useCallback(() => {
    handleEnded();
    const video = activeRef.current;
    if (video) {
      video.currentTime = 0;
      if (isPlaying) {
        void video.play().catch(() => {});
      }
    }
  }, [handleEnded, activeRef, isPlaying]);

  if (!current) {
    return null;
  }

  return (
    <div className={styles.player} aria-hidden="true">
      <motion.video
        ref={videoARef}
        className={styles.video}
        muted
        playsInline
        preload="auto"
        disablePictureInPicture
        poster={activeIsA ? current.posterUrl : next?.posterUrl}
        initial={false}
        animate={{ opacity: activeIsA ? 1 : 0 }}
        transition={{
          duration: reduceMotion ? 0 : CROSSFADE_DURATION,
          delay: reduceMotion ? 0 : activeIsA ? 0 : 0.1,
          ease: 'easeInOut',
        }}
        onEnded={activeIsA ? handleEndedReplaySafe : undefined}
      />
      <motion.video
        ref={videoBRef}
        className={styles.video}
        muted
        playsInline
        preload="auto"
        disablePictureInPicture
        poster={activeIsA ? next?.posterUrl : current.posterUrl}
        initial={false}
        animate={{ opacity: activeIsA ? 0 : 1 }}
        transition={{
          duration: reduceMotion ? 0 : CROSSFADE_DURATION,
          delay: reduceMotion ? 0 : activeIsA ? 0.1 : 0,
          ease: 'easeInOut',
        }}
        onEnded={activeIsA ? undefined : handleEndedReplaySafe}
      />
    </div>
  );
}
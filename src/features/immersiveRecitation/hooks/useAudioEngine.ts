import { useEffect, useMemo, useRef } from 'react';
import { ACTIVE_RECITER } from 'config/recitationConfig';
import { useImmersiveRecitationStore } from 'stores/immersiveRecitationStore';

/**
 * Imperative API of the hidden native <audio> engine. Every method applies the
 * intent to the element immediately AND dispatches the matching store action,
 * so the store stays the single source of state while the element (a DOM sink,
 * never a store) cannot drift.
 */
export interface AudioEngine {
  play: () => void;
  pause: () => void;
  seekTo: (time: number) => void;
  replay: () => void;
  setVolume: (volume: number) => void;
  setMuted: (muted: boolean) => void;
  setPlaybackSpeed: (speed: number) => void;
  /** Current hidden <audio> element (null until mounted). For the synchronizer. */
  getElement: () => HTMLAudioElement | null;
}

/**
 * If the store position and the element disagree by more than this (seconds),
 * treat the store value as a user-initiated seek and apply it to the element.
 */
export const SEEK_TOLERANCE_SECONDS = 0.3;

/**
 * Only movement (seconds) that must pass before a `timeupdate` value is pushed
 * into the store. Throttles store writes so re-renders stay cheap (the element's
 * native `timeupdate` cadence is ~4Hz, far below what the progress bar needs).
 */
const TIME_UPDATE_MIN_DELTA_SECONDS = 0.1;

/**
 * Fresh-pass flags per element. Chromium sometimes DROPS a currentTime
 * assignment issued immediately before play() (verified in browser QA: the
 * write reads back fine, yet playback starts at 0). The flag marks "this pass
 * has not reached the intro yet"; on the element's `playing` event the guard
 * below re-asserts the intro once, so the melodic opening is skipped even when
 * the in-gesture seek was discarded. Cleared as soon as playback actually
 * begins at or past the intro, so pause/resume never re-triggers it.
 */
const freshPassByElement = new WeakMap<HTMLAudioElement, boolean>();

/**
 * Normalized timeline — fresh-pass seek with a safety-net.
 *
 * Assigning `currentTime` to an audio element whose resource has not arrived yet
 * is silently IGNORED by Chromium (the assignment reads as nothing; playing then starts
 * at 0). The primary seek MUST still be attempted inside the user's click handler
 * gesture (mobile browsers only honor a seek+play reliably in the same activation), so
 * the caller invokes this synchronously; if it did not stick, one-shot listeners
 * re-assert the position as soon as the element can take it. They self-remove
 * after the first successful application and never re-arm: post-seek the
 * position is always >= the intro until a fresh pass, so pause/resume never re-triggers.
 */
function applyFreshStartPosition(audio: HTMLAudioElement): void {
  // NULL-GUARD: never touch the element blindly — callers may pass a ref that
  // has not been attached yet (the creation effect runs after the first render
  // pass). Bailing out makes a premature seek a no-op instead of a crash.
  if (!audio) {
    return;
  }
  const intro = ACTIVE_RECITER.introSeconds;
  const apply = () => {
    try {
      audio.currentTime = intro;
    } catch (error) {
      // Element not ready for a seek; the listeners below will retry when possible.
    }
  };

  apply();

  if (audio.currentTime < intro) {
    const cleanup = () => {
      audio.removeEventListener('seeked', onReady);
      audio.removeEventListener('canplay', onReady);
      audio.removeEventListener('loadedmetadata', onReady);
    };
    const onReady = () => {
      if (audio.currentTime < intro) apply();
      cleanup();
    };
    audio.addEventListener('seeked', onReady);
    audio.addEventListener('canplay', onReady);
    audio.addEventListener('loadedmetadata', onReady);
  }
}

/**
 * useAudioEngine — Phase 8 "AudioPlayer".
 *
 * Owns the (never rendered) native `<audio>` element for the immersive
 * recitation and keeps it in lock-step with the page-scoped store:
 *   - element -> store: `timeupdate` (throttled) pushes `currentTime`;
 *     `loadedmetadata` pushes `duration`; `ended`/`error` pause.
 *   - store -> element: `isPlaying` toggles play/pause; a `currentTime` that
 *     diverges beyond `SEEK_TOLERANCE_SECONDS` is applied (user seek/reset);
 *     volume/mute/speed are mirrored one-way.
 *
 * The store -> element writes are deliberately idempotent (tolerance + paused
 * guards), so the engine's own immediate element writes never double-apply.
 *
 * The derived `currentNameIndex` is NOT written here — that is exclusively the
 * TimestampSynchronizer's job (`useTimestampSync`, the single source of truth).
 */
export default function useAudioEngine(): AudioEngine {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const lastPushedRef = useRef(0);

  const isPlaying = useImmersiveRecitationStore((state) => state.isPlaying);
  const currentTime = useImmersiveRecitationStore((state) => state.currentTime);
  const volume = useImmersiveRecitationStore((state) => state.volume);
  const isMuted = useImmersiveRecitationStore((state) => state.isMuted);
  const playbackSpeed = useImmersiveRecitationStore((state) => state.playbackSpeed);

  const engine = useMemo<AudioEngine>(() => {
    const store = () => useImmersiveRecitationStore.getState();
    return {
      play: () => {
        const audio = audioRef.current;
        if (audio) {
          // Normalized timeline: a fresh pass starts AT the melodic intro, not
          // at literal 0. The seek happens HERE, synchronously inside the
          // user's play gesture — mobile browsers only reliably honor a seek
          // before play() within the same user activation, and doing it
          // element-first means the first timeupdate already reports ≥ intro
          // so the store's seek effect (divergence > tolerance) never fights it.
          // This only fires on a fresh play: after the first skip the position
          // can never drop below the intro again except a loop/ended reset
          // (also a fresh pass), so pause/resume never re-triggers it.
          freshPassByElement.set(audio, true);
          if (audio.currentTime < ACTIVE_RECITER.introSeconds) {
            applyFreshStartPosition(audio);
          }
          if (audio.paused) void audio.play();
        }
        store().play();
      },
      pause: () => {
        const audio = audioRef.current;
        if (audio && !audio.paused) audio.pause();
        store().pause();
      },
      seekTo: (time) => {
        if (!Number.isFinite(time)) return;
        const clamped = Math.max(0, time);
        const audio = audioRef.current;
        if (audio) audio.currentTime = clamped;
        store().seek(clamped);
      },
      replay: () => {
        // Replay = restart a fresh melodic pass: land on the intro (17s), not
        // literal 0, so even replay skips the same instrumental opening. The
        // store mirror sets the same real position so its seek effect (which
        // rewrites the element on divergence > tolerance) stays aligned.
        const audio = audioRef.current;
        if (audio) {
          freshPassByElement.set(audio, true);
          applyFreshStartPosition(audio);
          if (audio.paused) void audio.play();
        }
        store().replay();
      },
      setVolume: (value) => {
        const clamped = Math.min(1, Math.max(0, value));
        const audio = audioRef.current;
        if (audio) audio.volume = clamped;
        store().setVolume(clamped);
      },
      setMuted: (muted) => {
        const audio = audioRef.current;
        if (audio) audio.muted = muted;
        store().toggleMute();
      },
      setPlaybackSpeed: (speed) => {
        const audio = audioRef.current;
        if (audio) audio.playbackRate = speed;
        store().setSpeed(speed);
      },
      getElement: () => audioRef.current,
    };
  }, []);

  // Create the element and wire its events once.
  useEffect(() => {
    const audio = new Audio(ACTIVE_RECITER.audioUrl);
    audio.preload = 'metadata';
    // Seed from the store so mount order never matters.
    const initial = useImmersiveRecitationStore.getState();
    audio.volume = initial.volume;
    audio.muted = initial.isMuted;
    audio.playbackRate = initial.playbackSpeed;
    audioRef.current = audio;

    const handleLoadedMetadata = () => {
      // Chrome reports `duration = Infinity` for the concatenated headerless
      // CBR stream (see ReciterConfig.durationSeconds) — only a finite value is
      // useful to the progress bar and to seeking. Fall back to the measured
      // config value until/unless the browser reports something finite.
      const raw = audio.duration;
      useImmersiveRecitationStore.setState({
        duration: Number.isFinite(raw) && raw > 0 ? raw : ACTIVE_RECITER.durationSeconds,
      });
    };

    // Some media report a placeholder duration first, then refine it (a second
    // `durationchange` with the real number). Keep the finite one.
    const handleDurationChange = handleLoadedMetadata;

    const handleTimeUpdate = () => {
      const delta = audio.currentTime - lastPushedRef.current;
      if (Math.abs(delta) < TIME_UPDATE_MIN_DELTA_SECONDS) return;
      lastPushedRef.current = audio.currentTime;
      useImmersiveRecitationStore.getState().setCurrentTime(audio.currentTime);
    };

    const handleEnded = () => {
      // Phase 5 loop mode: seamless restart at the end (meditation mode) —
      // rewind to the melodic intro and keep playing, so the instrumental
      // opening stays equally skipped on every pass. The synchronizer holds
      // the last name on screen until the first name's timestamp arrives
      // again. Otherwise pause as before.
      if (ACTIVE_RECITER.loop) {
        freshPassByElement.set(audio, true);
        try {
          audio.currentTime = ACTIVE_RECITER.introSeconds;
        } catch {
          audio.currentTime = 0;
        }
        if (audio.paused) void audio.play();
        return;
      }
      useImmersiveRecitationStore.getState().pause();
    };

    const handleError = () => {
      // Media placeholders may 404 until real assets are added (see
      // config/recitationConfig.ts) — stop silently instead of erroring out.
      useImmersiveRecitationStore.getState().pause();
    };

    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('durationchange', handleDurationChange);
    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('error', handleError);

    // One-shot intro guard: if playback actually started below the intro (the
    // in-gesture seek was dropped by the browser), snap to the intro right when
    // playing begins. Removed from the map once it has fired for this pass.
    const handlePlaying = () => {
      if (!freshPassByElement.get(audio)) return;
      freshPassByElement.set(audio, false);
      if (audio.currentTime < ACTIVE_RECITER.introSeconds) {
        try {
          audio.currentTime = ACTIVE_RECITER.introSeconds;
        } catch {
          // Ignore; the element is playing, so this is best-effort only.
        }
      }
    };
    audio.addEventListener('playing', handlePlaying);

    return () => {
      audio.pause();
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('durationchange', handleDurationChange);
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('error', handleError);
      audio.removeEventListener('playing', handlePlaying);
      audio.removeAttribute('src');
      audio.load();
      audioRef.current = null;
    };
  }, []);

  // store -> element: play/pause.
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    if (isPlaying) {
      if (audio.paused) void audio.play();
    } else if (!audio.paused) {
      audio.pause();
    }
  }, [isPlaying]);

  // store -> element: seek. Divergent positions only (user seek / reset).
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !Number.isFinite(currentTime)) return;
    if (Math.abs(audio.currentTime - currentTime) > SEEK_TOLERANCE_SECONDS) {
      audio.currentTime = currentTime;
    }
  }, [currentTime]);

  // store -> element: volume / mute / speed (idempotent one-way mirrors).
  useEffect(() => {
    const audio = audioRef.current;
    if (audio) audio.volume = volume;
  }, [volume]);

  useEffect(() => {
    const audio = audioRef.current;
    if (audio) audio.muted = isMuted;
  }, [isMuted]);

  useEffect(() => {
    const audio = audioRef.current;
    if (audio) audio.playbackRate = playbackSpeed;
  }, [playbackSpeed]);

  return engine;
}
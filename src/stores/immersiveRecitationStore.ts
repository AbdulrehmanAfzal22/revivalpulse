import { create } from 'zustand';
import { ACTIVE_RECITER } from 'config/recitationConfig';

/**
 * Immersive Recitation — page-scoped playback state.
 *
 * TIME MODEL (normalized timeline): `currentTime` and `duration` are REAL audio
 * file seconds (the same units the timestamps in namesTimestamps.json use).
 * The melodic intro offset is NEVER stored here; the presentation layer subtracts
 * it via utils/timeline.ts (toDisplaySeconds / toDisplayDuration) and converts
 * displayed seek positions back to real seconds before calling `seek`.
 *
 * This store is deliberately scoped to the immersive 99-Names experience ONLY.
 * It does NOT talk to playbackStore / readingPreferencesStore / the global
 * AudioPlayer — the immersive session has its own audio element and its own
 * timing, and mixing it into the global player state created interleaved
 * playback conflicts. Nothing outside pages/ImmersiveRecitationPage (and its
 * future child components) should read or write this store.
 */
export interface ImmersiveRecitationState {
  /** Whether the recitation audio is currently playing. */
  isPlaying: boolean;
  /** Playback position in the recitation audio, in seconds. */
  currentTime: number;
  /** Total length of the recitation audio, in seconds (0 until metadata loads). */
  duration: number;
  /** Index (0-based) of the name currently on screen, matching the 99-name array. */
  currentNameIndex: number;
  /** Master volume, 0..1. */
  volume: number;
  isMuted: boolean;
  /** Audio playback rate multiplier (1 = normal). */
  playbackSpeed: number;
  /** Index into VIDEO_PLAYLIST (config/recitationConfig.ts). */
  currentVideoIndex: number;
  isFullscreen: boolean;

  play: () => void;
  pause: () => void;
  /** Jumps to a position (seconds from start) and keeps playing state as-is. */
  seek: (time: number) => void;
  /** Restarts from 0:00 and plays (controls' "replay" button). */
  replay: () => void;
  /** Live position updates from the recitation <audio> element (source of truth while playing). */
  setCurrentTime: (time: number) => void;
  /** Current name driven by the audio position (see useTimestampSync). */
  setCurrentNameIndex: (index: number) => void;
  setVolume: (volume: number) => void;
  toggleMute: () => void;
  setSpeed: (speed: number) => void;
  nextVideo: () => void;
  /** Jumps straight to a playlist entry (any integer; wrapping handled by the player). */
  setVideoIndex: (index: number) => void;
  /** Convenience so the page can update the flag directly on fullscreenchange. */
  setFullscreen: (fullscreen: boolean) => void;
  /** Restores every field to its initial value (fresh session state). */
  reset: () => void;
}

const INITIAL_STATE = {
  isPlaying: false,
  currentTime: 0,
  duration: 0,
  currentNameIndex: 0,
  volume: 1,
  isMuted: false,
  playbackSpeed: 1,
  currentVideoIndex: 0,
  isFullscreen: false,
};

export const useImmersiveRecitationStore = create<ImmersiveRecitationState>((set, get) => ({
  ...INITIAL_STATE,

  play: () => set({ isPlaying: true }),
  pause: () => set({ isPlaying: false }),
  seek: (time) => set({ currentTime: Number.isFinite(time) ? Math.max(0, time) : get().currentTime }),
  // Replay = fresh melodic pass: the real position is the intro, not 0, so the
  // engine's mirror seek effect and the display layer agree (0:00 on screen).
  replay: () => set({ currentTime: ACTIVE_RECITER.introSeconds, isPlaying: true }),
  setCurrentTime: (time) => set({ currentTime: Number.isFinite(time) ? Math.max(0, time) : get().currentTime }),
  setCurrentNameIndex: (index) => set({ currentNameIndex: Math.max(-1, index) }),
  setVolume: (volume) => set({ volume: Math.min(1, Math.max(0, volume)) }),
  toggleMute: () => set((state) => ({ isMuted: !state.isMuted })),
  setSpeed: (speed) => set({ playbackSpeed: speed }),
  nextVideo: () => set((state) => ({ currentVideoIndex: state.currentVideoIndex + 1 })),
  setVideoIndex: (index) => set({ currentVideoIndex: index }),
  setFullscreen: (fullscreen) => set({ isFullscreen: fullscreen }),
  // Duration is a property of the loaded media, not the session, so it survives
  // a reset — otherwise the progress bar loses its range after "reset".
  reset: () => set((state) => ({ ...INITIAL_STATE, duration: state.duration })),
}));
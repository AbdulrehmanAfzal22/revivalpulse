import { create } from 'zustand';
import { useReadingPreferencesStore } from './readingPreferencesStore';
import type { LoopMode, PlaybackRange, PlaybackSource } from 'types/audioPlayer.types';

interface PlaybackStoreState {
  // shared "what's audibly active" — written by both isolated word clicks
  // (useWordAudio) and the full surah engine (playbackEngine), so
  // highlighting never has two competing sources of truth.
  source: PlaybackSource;
  verseKey: string | null;
  activeWordPosition: number | null;
  isPlaying: boolean;
  stopFn: (() => void) | null;
  /**
   * True while full-ayah playback is paused specifically because the user
   * tapped a word (not because they hit pause/stop themselves). Consumed by
   * useWordAudio to resume the ayah once the tapped word's audio finishes —
   * see hardening-phase-5. Cleared on any fresh 'surah' begin() or on stop().
   */
  wordInterruptedSurah: boolean;

  // surah engine state — reactive mirror of playbackEngine's internal Audio element(s)
  reciterId: string;
  surahId: number | null;
  isLoading: boolean;
  loopMode: LoopMode;
  range: PlaybackRange | null;
  autoplayEnabled: boolean;
  /** Explicit on/off switches for grouped translation-audio playback — see playbackEngine.ts's TRANSLATION_GROUP_SIZE pattern. Independent of which translations are selected as text. */
  urduTranslationAudioEnabled: boolean;
  englishTranslationAudioEnabled: boolean;
  playbackSpeed: number;
  duration: number;
  currentTime: number;

  /** Stops whatever was previously playing (word or surah) before taking over. */
  begin: (source: 'word' | 'surah', verseKey: string, stopFn: () => void) => void;
  setActiveWord: (position: number | null) => void;
  /** Updates the active verse without touching source/stopFn — for advancing within one ongoing session. */
  setVerseKey: (verseKey: string) => void;
  setWordInterruptedSurah: (value: boolean) => void;
  stop: () => void;

  setReciterId: (id: string) => void;
  setSurahId: (id: number | null) => void;
  setLoading: (isLoading: boolean) => void;
  setLoopMode: (mode: LoopMode) => void;
  setRange: (range: PlaybackRange | null) => void;
  setAutoplayEnabled: (enabled: boolean) => void;
  setUrduTranslationAudioEnabled: (enabled: boolean) => void;
  setEnglishTranslationAudioEnabled: (enabled: boolean) => void;
  setPlaybackSpeed: (speed: number) => void;
  setProgress: (currentTime: number, duration: number) => void;
}

export const usePlaybackStore = create<PlaybackStoreState>((set, get) => ({
  source: null,
  verseKey: null,
  activeWordPosition: null,
  isPlaying: false,
  stopFn: null,
  wordInterruptedSurah: false,

  reciterId: useReadingPreferencesStore.getState().preferences.selectedReciterId,
  surahId: null,
  isLoading: false,
  loopMode: 'off',
  range: null,
  autoplayEnabled: true,
  urduTranslationAudioEnabled: true,
  englishTranslationAudioEnabled: false,
  playbackSpeed: useReadingPreferencesStore.getState().preferences.wordPlaybackSpeed,
  duration: 0,
  currentTime: 0,

  begin: (source, verseKey, stopFn) => {
    get().stopFn?.();
    set({
      source,
      verseKey,
      isPlaying: true,
      activeWordPosition: null,
      stopFn,
      // A fresh surah start always supersedes any pending word-driven resume.
      ...(source === 'surah' ? { wordInterruptedSurah: false } : {}),
    });
  },
  setActiveWord: (position) => set({ activeWordPosition: position }),
  setVerseKey: (verseKey) => set({ verseKey }),
  setWordInterruptedSurah: (value) => set({ wordInterruptedSurah: value }),
  stop: () =>
    set({
      source: null,
      verseKey: null,
      isPlaying: false,
      activeWordPosition: null,
      stopFn: null,
      wordInterruptedSurah: false,
    }),

  setReciterId: (id) => {
    set({ reciterId: id });
    // Write-through: the reciter picked during playback becomes the new default too,
    // same pattern as Settings changing it directly (see the subscribe() below).
    useReadingPreferencesStore.getState().update({ selectedReciterId: id });
  },
  setSurahId: (id) => set({ surahId: id }),
  setLoading: (isLoading) => set({ isLoading }),
  setLoopMode: (mode) => set({ loopMode: mode }),
  setRange: (range) => set({ range }),
  setAutoplayEnabled: (enabled) => set({ autoplayEnabled: enabled }),
  setUrduTranslationAudioEnabled: (enabled) => set({ urduTranslationAudioEnabled: enabled }),
  setEnglishTranslationAudioEnabled: (enabled) => set({ englishTranslationAudioEnabled: enabled }),
  setPlaybackSpeed: (speed) => {
    set({ playbackSpeed: speed });
    useReadingPreferencesStore.getState().update({ wordPlaybackSpeed: speed });
  },
  setProgress: (currentTime, duration) => set({ currentTime, duration }),
}));

/**
 * Mirrors changes made directly in Settings (readingPreferencesStore) into
 * the live playback store — e.g. re-hydration after sign-in, or the
 * Settings page itself, both bypass playbackStore's own setters above.
 */
useReadingPreferencesStore.subscribe((state) => {
  const { selectedReciterId, wordPlaybackSpeed } = state.preferences;
  const current = usePlaybackStore.getState();
  if (current.reciterId !== selectedReciterId || current.playbackSpeed !== wordPlaybackSpeed) {
    usePlaybackStore.setState({ reciterId: selectedReciterId, playbackSpeed: wordPlaybackSpeed });
  }
});

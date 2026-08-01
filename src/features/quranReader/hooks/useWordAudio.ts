import { useCallback, useRef, useState } from 'react';
import { getOrFetchAudio } from 'services/audioCache';
import { usePlaybackStore } from 'stores/playbackStore';
import { pause as pauseSurah, resume as resumeSurah } from 'features/quranReader/services/playbackEngine';
import useReadingPreferences from 'hooks/useReadingPreferences';
import type { Word } from 'types/word.types';

export interface UseWordAudioResult {
  play: (word: Word) => Promise<void>;
  isLoading: boolean;
}

export default function useWordAudio(): UseWordAudioResult {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  // All words within one ayah share the same <audio> element (audioRef), so
  // rapid taps race: getOrFetchAudio is async, and without this guard
  // whichever tap's fetch/cache-read happens to resolve *last* wins and sets
  // .src — not whichever word was tapped last. This token makes every tap
  // check, after its own await, whether a newer tap has since started; if
  // so it's stale and must not touch the shared element at all.
  const requestIdRef = useRef(0);
  const [isLoading, setIsLoading] = useState(false);
  const { preferences } = useReadingPreferences();
  const begin = usePlaybackStore((state) => state.begin);
  const setActiveWord = usePlaybackStore((state) => state.setActiveWord);
  const setWordInterruptedSurah = usePlaybackStore((state) => state.setWordInterruptedSurah);
  const stop = usePlaybackStore((state) => state.stop);

  const play = useCallback(
    async (word: Word) => {
      if (!word.audioUrl) return;

      if (!audioRef.current) {
        audioRef.current = new Audio();
      }
      const audio = audioRef.current;

      const requestId = ++requestIdRef.current;
      const isStale = (): boolean => requestId !== requestIdRef.current;

      // Tapping a word always wins over ongoing ayah recitation. If a surah
      // was actively playing, remember that — once this word's audio finishes
      // naturally (not if the user interrupts it again), playback resumes
      // the ayah from exactly where it paused. Explicit stop/pause elsewhere
      // clears this via playbackStore's begin()/stop().
      const { source, isPlaying } = usePlaybackStore.getState();
      if (source === 'surah' && isPlaying) setWordInterruptedSurah(true);

      begin('word', word.verseKey, () => audio.pause());
      setActiveWord(word.position);
      setIsLoading(true);

      try {
        const objectUrl = await getOrFetchAudio(word.audioUrl);
        if (isStale()) return;
        // getOrFetchAudio creates a fresh object URL every call — revoke
        // whatever this shared element was last pointed at (from the
        // previous word tap) before pointing it at the new one, or every
        // tap leaks one blob URL for the life of the page.
        if (audio.src.startsWith('blob:')) URL.revokeObjectURL(audio.src);
        audio.src = objectUrl;
        audio.playbackRate = preferences.wordPlaybackSpeed;
        audio.onended = () => {
          if (isStale()) return;
          const { wordInterruptedSurah, verseKey: interruptedVerseKey } = usePlaybackStore.getState();
          if (wordInterruptedSurah) {
            // Hand playback back to the surah engine directly, restoring
            // `source`/`verseKey` — going through the generic stop() here
            // would wipe them and leave the UI (play/pause icon, verse
            // highlighting) out of sync with the audio, which really did
            // resume. See hardening-phase-5.
            usePlaybackStore.setState({
              source: 'surah',
              verseKey: interruptedVerseKey,
              activeWordPosition: null,
              wordInterruptedSurah: false,
              stopFn: pauseSurah,
            });
            resumeSurah();
          } else {
            stop();
          }
        };
        await audio.play();
      } catch {
        if (!isStale()) stop();
      } finally {
        if (!isStale()) setIsLoading(false);
      }
    },
    [begin, setActiveWord, setWordInterruptedSurah, stop, preferences.wordPlaybackSpeed]
  );

  return { play, isLoading };
}

import { useEffect, useRef, useState } from 'react';
import { Loader2, Pause, Play } from 'lucide-react';
import Button from './Button';
import type { ButtonSize } from './Button';
import styles from './AudioPlayButton.module.css';

export interface AudioPlayButtonProps {
  src: string;
  size?: ButtonSize;
  label: string;
  startOffsetSeconds?: number;
  debugLabel?: string;
  playbackRate?: number;
  onAudioError?: (message: string) => void;
}

type PlaybackStatus = 'idle' | 'loading' | 'playing';

/**
 * Self-contained single-clip player (own <audio> element, no shared engine)
 * for short one-off recitations — Names of Allah, duas. Deliberately not
 * routed through features/quranReader's playbackEngine, which exists for
 * queued/seekable ayah playback with word-highlighting, a different problem.
 */
export default function AudioPlayButton({ src, size = 'md', label, startOffsetSeconds = 0, debugLabel, playbackRate = 1, onAudioError }: AudioPlayButtonProps) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const pendingPlayRef = useRef(false);
  const pendingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [status, setStatus] = useState<PlaybackStatus>('idle');
  const debugEnabled = typeof window !== 'undefined' && new URLSearchParams(window.location.search).has('duaAudioDebug');

  function clearPendingPlay() {
    pendingPlayRef.current = false;
    if (pendingTimeoutRef.current) {
      clearTimeout(pendingTimeoutRef.current);
      pendingTimeoutRef.current = null;
    }
  }

  useEffect(() => {
    try {
      const url = new URL(src, window.location.href);
      if (!['http:', 'https:'].includes(url.protocol)) throw new Error(`Unsupported protocol: ${url.protocol}`);
    } catch (error) {
      const message = `Invalid audio URL for ${debugLabel ?? 'dua'}: ${src}`;
      console.error(`[Dua audio] ${message}`, error);
      onAudioError?.(message);
    }
  }, [src, debugLabel, onAudioError]);

  useEffect(() => {
    setStatus('idle');
    clearPendingPlay();
    return clearPendingPlay;
  }, [src]);

  useEffect(() => {
    if (audioRef.current) audioRef.current.playbackRate = playbackRate;
  }, [playbackRate]);

  async function toggle() {
    const audio = audioRef.current;
    if (!audio) return;

    if (status === 'playing') {
      audio.pause();
      return;
    }

    setStatus('loading');
    onAudioError?.('');
    pendingPlayRef.current = true;
    if (audio.readyState >= HTMLMediaElement.HAVE_METADATA) {
      await seekAndPlay(audio);
    } else {
      audio.load();
      pendingTimeoutRef.current = setTimeout(() => {
        if (!pendingPlayRef.current) return;
        clearPendingPlay();
        setStatus('idle');
      }, 10000);
    }
  }

  async function seekAndPlay(audio: HTMLAudioElement): Promise<void> {
    clearPendingPlay();
    try {
      if (startOffsetSeconds > 0) audio.currentTime = startOffsetSeconds;
    } catch (error) {
      console.error(`[Dua audio] Failed to seek ${debugLabel ?? src} to ${startOffsetSeconds}s`, error);
      setStatus('idle');
      return;
    }
    try {
      await audio.play();
      if (debugEnabled) console.info(`[Dua audio] play() resolved for ${debugLabel ?? src}`);
    } catch (error) {
      const message = error instanceof DOMException && error.name === 'NotAllowedError'
        ? 'Audio playback was blocked by the browser. Press play again to retry.'
        : 'Unable to play audio for this dua.';
      console.error(`[Dua audio] play() rejected for ${debugLabel ?? src}`, error);
      clearPendingPlay();
      setStatus('idle');
      onAudioError?.(message);
    }
  }

  function handleLoadedMetadata() {
    const audio = audioRef.current;
    if (audio && pendingPlayRef.current) seekAndPlay(audio);
  }

  function handlePlaybackError() {
    clearPendingPlay();
    setStatus('idle');
    const message = `Unable to load audio for ${debugLabel ?? 'this dua'}.`;
    console.error(`[Dua audio] Media error for ${debugLabel ?? src}: ${src}`, audioRef.current?.error);
    onAudioError?.(message);
  }

  function handleTimeUpdate() {
    const audio = audioRef.current;
    if (debugEnabled && audio) {
      console.info(`[Dua audio] ${debugLabel ?? src}: ${audio.currentTime.toFixed(3)}s`);
    }
  }

  const icon =
    status === 'loading' ? (
      <Loader2 size={16} className={styles.spin} />
    ) : status === 'playing' ? (
      <Pause size={16} />
    ) : (
      <Play size={16} />
    );

  return (
    <>
      <Button
        type="button"
        variant="icon"
        size={size}
        className={status === 'playing' ? styles.playing : undefined}
        aria-label={label}
        aria-pressed={status === 'playing'}
        onClick={toggle}
        leadingIcon={icon}
      />
      <audio
        ref={audioRef}
        src={src}
        preload="none"
        onLoadedMetadata={handleLoadedMetadata}
        onTimeUpdate={handleTimeUpdate}
        onPlaying={() => { clearPendingPlay(); setStatus('playing'); }}
        onPause={() => setStatus('idle')}
        onEnded={() => setStatus('idle')}
        onError={handlePlaybackError}
      />
    </>
  );
}

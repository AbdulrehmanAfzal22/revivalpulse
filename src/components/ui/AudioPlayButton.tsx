import { useEffect, useRef, useState } from 'react';
import { Loader2, Pause, Play } from 'lucide-react';
import Button from './Button';
import type { ButtonSize } from './Button';
import styles from './AudioPlayButton.module.css';

export interface AudioPlayButtonProps {
  src: string;
  size?: ButtonSize;
  label: string;
}

type PlaybackStatus = 'idle' | 'loading' | 'playing';

/**
 * Self-contained single-clip player (own <audio> element, no shared engine)
 * for short one-off recitations — Names of Allah, duas. Deliberately not
 * routed through features/quranReader's playbackEngine, which exists for
 * queued/seekable ayah playback with word-highlighting, a different problem.
 */
export default function AudioPlayButton({ src, size = 'md', label }: AudioPlayButtonProps) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [status, setStatus] = useState<PlaybackStatus>('idle');

  useEffect(() => {
    setStatus('idle');
  }, [src]);

  function toggle() {
    const audio = audioRef.current;
    if (!audio) return;

    if (status === 'playing') {
      audio.pause();
      return;
    }

    setStatus('loading');
    void audio.play().catch(() => setStatus('idle'));
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
        aria-label={label}
        aria-pressed={status === 'playing'}
        onClick={toggle}
        leadingIcon={icon}
      />
      <audio
        ref={audioRef}
        src={src}
        preload="none"
        onPlaying={() => setStatus('playing')}
        onPause={() => setStatus('idle')}
        onEnded={() => setStatus('idle')}
        onError={() => setStatus('idle')}
      />
    </>
  );
}

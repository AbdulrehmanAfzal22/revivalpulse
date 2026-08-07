import { useCallback, useMemo, useRef } from 'react';
import type { KeyboardEvent, PointerEvent } from 'react';
import { useImmersiveRecitationStore } from 'stores/immersiveRecitationStore';
import { formatTime } from 'utils/formatters';
import type { AllahName } from 'types/immersiveRecitation.types';
import { ACTIVE_RECITER } from 'config/recitationConfig';
import {
  toDisplayDuration,
  toDisplaySeconds,
  toRealSeconds,
} from 'features/immersiveRecitation/utils/timeline';
import useTranslation from 'hooks/useTranslation';
import styles from './ProgressBar.module.css';

const KEYBOARD_STEP_SECONDS = 1;
const KEYBOARD_LARGE_STEP_SECONDS = 10;

export interface ProgressBarProps {
  /** Used for the name-boundary tick marks (timestamps are monotonic). */
  names: readonly AllahName[];
}

/**
 * Phase 9 "ProgressBar" — autoplay seek bar, normalized display timeline.
 *
 * All on-screen numbers are DISPLAY seconds: real audio time minus the melodic
 * intro (`utils/timeline.ts`). The bar's maximum is (file duration − intro),
 * ticks are placed at (name.timestampSeconds − intro), and the clock starts at
 * 0:00 even though the real element starts 17s in. Seeking maps a displayed
 * position back to a real target (display + intro) before writing the store,
 * so the element only ever sees real-file seconds.
 *
 * Reads `currentTime`/`duration` straight from the store; seeking writes
 * straight back via `store.seek`. Draggable with pointer events and keyboard
 * accessible (arrows = ±1s, shift+arrows = ±10s, Home = display 0:00 /
 * real intro, End = end of the displayed track).
 */
export default function ProgressBar({ names }: ProgressBarProps) {
  const { t } = useTranslation();
  const introSeconds = ACTIVE_RECITER.introSeconds;
  const currentTime = useImmersiveRecitationStore((state) => state.currentTime);
  const duration = useImmersiveRecitationStore((state) => state.duration);
  const seek = useImmersiveRecitationStore((state) => state.seek);

  const trackRef = useRef<HTMLDivElement | null>(null);
  const draggingRef = useRef(false);

  // Display timeline (the numbers the user sees).
  const displayTime = toDisplaySeconds(currentTime, introSeconds);
  const displayMax = toDisplayDuration(duration, introSeconds);
  const hasDuration = Number.isFinite(duration) && displayMax > 0;
  const percent =
    hasDuration ? Math.min(100, Math.max(0, (displayTime / displayMax) * 100)) : 0;

  const ticks = useMemo(() => {
    if (!Number.isFinite(duration) || displayMax <= 0) return [];
    return names
      .map((name) => {
        // Real name timestamp → its display position (intro never visible).
        const display = name.timestampSeconds - introSeconds;
        return {
          id: name.id,
          display,
          percent: Math.min(100, Math.max(0, (display / displayMax) * 100)),
        };
      })
      .filter((tick) => Number.isFinite(tick.display) && tick.display >= 0);
  }, [names, duration, displayMax, introSeconds]);

  const positionAt = useCallback(
    (clientX: number): number => {
      const track = trackRef.current;
      if (!track || displayMax <= 0) return 0;
      const rect = track.getBoundingClientRect();
      const ratio = (clientX - rect.left) / rect.width;
      // Display seconds 0..max.
      return displayMax * Math.min(1, Math.max(0, ratio));
    },
    [displayMax],
  );

  const handlePointerDown = (event: PointerEvent<HTMLDivElement>) => {
    draggingRef.current = true;
    trackRef.current?.setPointerCapture(event.pointerId);
    // Map the visible position to a REAL element position before seeking.
    seek(toRealSeconds(positionAt(event.clientX), introSeconds));
  };

  const handlePointerMove = (event: PointerEvent<HTMLDivElement>) => {
    if (draggingRef.current) {
      seek(toRealSeconds(positionAt(event.clientX), introSeconds));
    }
  };

  const handlePointerUp = () => {
    draggingRef.current = false;
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const step = event.shiftKey ? KEYBOARD_LARGE_STEP_SECONDS : KEYBOARD_STEP_SECONDS;
    switch (event.key) {
      case 'ArrowLeft':
      case 'ArrowDown':
        event.preventDefault();
        // Step the DISPLAY value; convert back before seeking the element.
        seek(toRealSeconds(Math.max(0, displayTime - step), introSeconds));
        break;
      case 'ArrowRight':
      case 'ArrowUp':
        event.preventDefault();
        seek(toRealSeconds(displayTime + step, introSeconds));
        break;
      case 'Home':
        event.preventDefault();
        // Display start = the real intro (skips the instrumental opening).
        seek(toRealSeconds(0, introSeconds));
        break;
      case 'End':
        event.preventDefault();
        // `duration` may be the config fallback; never seek to a non-finite
        // value (the browser throws "non-finite" when assigning it to
        // HTMLMediaElement.currentTime). Seeking real `duration` reaches the
        // end of the displayed track (display = duration − intro).
        seek(Number.isFinite(duration) && duration > 0 ? duration : currentTime);
        break;
      default:
        break;
    }
  };

  return (
    <div className={styles.bar}>
      <div
        ref={trackRef}
        className={styles.track}
        role="slider"
        tabIndex={0}
        aria-label={t('immersiveRecitation.progressBar')}
        aria-valuemin={0}
        aria-valuemax={hasDuration ? Math.round(displayMax) : 0}
        aria-valuenow={Math.round(displayTime)}
        aria-valuetext={formatTime(displayTime)}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onKeyDown={handleKeyDown}
      >
        <div className={styles.ticks} aria-hidden="true">
          {ticks.map((tick) => (
            <span
              key={tick.id}
              className={styles.tick}
              style={{ left: `${tick.percent}%` }}
            />
          ))}
        </div>
        {/* Fill + thumb use only GPU-friendly transforms (scaleX / translateX),
            never animating layout properties like width/left at 4Hz. */}
        <div
          className={styles.fill}
          style={{ transform: `scaleX(${percent / 100})` }}
        />
        <div className={styles.thumbRail} style={{ transform: `translateX(${percent}%)` }}>
          <div className={styles.thumb} />
        </div>
      </div>
    </div>
  );
}
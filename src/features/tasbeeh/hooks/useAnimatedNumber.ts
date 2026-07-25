import { useEffect, useRef, useState } from 'react';

const ANIMATION_MS = 500;

/** Tweens the displayed integer toward `value` on every change, for the stat-card "live increment" effect. */
export default function useAnimatedNumber(value: number): number {
  const [displayed, setDisplayed] = useState(value);
  const frameRef = useRef<number | undefined>(undefined);
  const fromRef = useRef(value);

  useEffect(() => {
    const from = fromRef.current;
    const to = value;
    if (from === to) return;

    const start = performance.now();

    function tick(now: number) {
      const progress = Math.min(1, (now - start) / ANIMATION_MS);
      const eased = 1 - (1 - progress) * (1 - progress);
      setDisplayed(Math.round(from + (to - from) * eased));

      if (progress < 1) {
        frameRef.current = requestAnimationFrame(tick);
      } else {
        fromRef.current = to;
      }
    }

    frameRef.current = requestAnimationFrame(tick);
    return () => {
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  return displayed;
}

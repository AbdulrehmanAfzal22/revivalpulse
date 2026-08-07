import { useEffect, useRef, useState } from 'react';

/**
 * useAutoHide — Phase 9 "controls auto hide".
 *
 * Returns whether the (immersive player) controls should be visible. Visible
 * on mount and on any activity (pointer down/move, touch, keys, wheel); hides
 * after `delayMs` of inactivity. The returned boolean only toggles when the
 * visibility actually changes, so it never re-renders on every pointer move.
 */
export default function useAutoHide(delayMs = 3000): boolean {
  const [visible, setVisible] = useState(true);
  const visibleRef = useRef(true);
  const timerRef = useRef<number | undefined>(undefined);

  useEffect(() => {
    const scheduleHide = () => {
      if (timerRef.current !== undefined) window.clearTimeout(timerRef.current);
      timerRef.current = window.setTimeout(() => {
        if (visibleRef.current) {
          visibleRef.current = false;
          setVisible(false);
        }
      }, delayMs);
    };

    const show = () => {
      if (!visibleRef.current) {
        visibleRef.current = true;
        setVisible(true);
      }
      scheduleHide();
    };

    const activityEvents = ['pointerdown', 'pointermove', 'keydown', 'touchstart', 'wheel'] as const;
    activityEvents.forEach((event) => window.addEventListener(event, show, { passive: true }));
    scheduleHide();

    return () => {
      if (timerRef.current !== undefined) window.clearTimeout(timerRef.current);
      activityEvents.forEach((event) => window.removeEventListener(event, show));
    };
  }, [delayMs]);

  return visible;
}
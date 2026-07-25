import { useCallback, useEffect, useState } from 'react';
import type { RefObject } from 'react';

export interface UseFullscreenResult {
  isFullscreen: boolean;
  toggle: () => void;
}

export default function useFullscreen(targetRef: RefObject<HTMLElement | null>): UseFullscreenResult {
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    const handleChange = (): void => setIsFullscreen(Boolean(document.fullscreenElement));
    document.addEventListener('fullscreenchange', handleChange);
    return () => document.removeEventListener('fullscreenchange', handleChange);
  }, []);

  const toggle = useCallback(() => {
    if (document.fullscreenElement) {
      void document.exitFullscreen();
      return;
    }
    if (targetRef.current && document.fullscreenEnabled) {
      targetRef.current.requestFullscreen().catch(() => {});
    }
  }, [targetRef]);

  return { isFullscreen, toggle };
}

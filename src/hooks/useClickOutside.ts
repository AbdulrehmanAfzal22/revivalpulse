import { useEffect } from 'react';
import type { RefObject } from 'react';

export default function useClickOutside(
  ref: RefObject<HTMLElement | null>,
  isActive: boolean,
  onOutsideClick: () => void
): void {
  useEffect(() => {
    if (!isActive) return;

    const handlePointerDown = (event: PointerEvent): void => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        onOutsideClick();
      }
    };

    document.addEventListener('pointerdown', handlePointerDown);
    return () => document.removeEventListener('pointerdown', handlePointerDown);
  }, [ref, isActive, onOutsideClick]);
}

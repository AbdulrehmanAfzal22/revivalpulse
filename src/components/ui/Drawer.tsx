import { useEffect, useRef } from 'react';
import type { ReactNode } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import useFocusTrap from 'hooks/useFocusTrap';
import styles from './Drawer.module.css';

export type DrawerSide = 'left' | 'right';

export interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
  side?: DrawerSide;
  children: ReactNode;
  /** Id of the element (typically the panel's own heading) that names this dialog for assistive technology — sets aria-labelledby on the dialog element. Optional and additive: omitting it preserves every existing caller's behavior exactly. */
  titleId?: string;
}

export default function Drawer({ isOpen, onClose, side = 'left', children, titleId }: DrawerProps) {
  const prefersReducedMotion = useReducedMotion();
  const panelRef = useRef<HTMLDivElement>(null);
  useFocusTrap(panelRef, isOpen);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (event: KeyboardEvent): void => {
      if (event.key === 'Escape') onClose();
    };

    document.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';
    panelRef.current?.focus();

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  const offscreenX = side === 'left' ? '-100%' : '100%';
  const panelClasses = [styles.panel, side === 'left' ? styles.left : styles.right].join(' ');

  return (
    <AnimatePresence>
      {isOpen && (
        <div className={styles.wrapper}>
          <motion.div
            className={styles.backdrop}
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: prefersReducedMotion ? 0.01 : 0.2 }}
          />
          <motion.div
            ref={panelRef}
            className={panelClasses}
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            tabIndex={-1}
            initial={{ x: prefersReducedMotion ? 0 : offscreenX, opacity: prefersReducedMotion ? 0 : 1 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: prefersReducedMotion ? 0 : offscreenX, opacity: prefersReducedMotion ? 0 : 1 }}
            transition={
              prefersReducedMotion ? { duration: 0.01 } : { type: 'tween', duration: 0.25, ease: 'easeOut' }
            }
          >
            {children}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

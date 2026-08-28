import { useEffect, useRef } from 'react';
import type { ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { X } from 'lucide-react';
import useFocusTrap from 'hooks/useFocusTrap';
import useTranslation from 'hooks/useTranslation';
import styles from './Dialog.module.css';
import Button from './Button';

export interface DialogProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  contentClassName?: string;
  panelClassName?: string;
}

export default function Dialog({ isOpen, onClose, title, children, contentClassName, panelClassName }: DialogProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();
  const { t } = useTranslation();
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

  const panelMotion = prefersReducedMotion
    ? { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 }, transition: { duration: 0.01 } }
    : {
        initial: { opacity: 0, scale: 0.96, y: -8 },
        animate: { opacity: 1, scale: 1, y: 0 },
        exit: { opacity: 0, scale: 0.96, y: -8 },
        transition: { duration: 0.18, ease: 'easeOut' as const },
      };

  return createPortal(
    (
    <AnimatePresence>
      {isOpen && (
        <div className={styles.overlayWrapper}>
          <motion.div
            className={styles.backdrop}
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: prefersReducedMotion ? 0.01 : 0.15 }}
          />
          <motion.div
            ref={panelRef}
            className={[styles.panel, panelClassName].filter(Boolean).join(' ')}
            role="dialog"
            aria-modal="true"
            aria-label={title}
            tabIndex={-1}
            {...panelMotion}
          >
            <div className={styles.header}>
              {title && <h2 className={styles.title}>{title}</h2>}
              <Button
                variant="icon"
                aria-label={t('common.closeDialog')}
                onClick={onClose}
                leadingIcon={<X size={18} />}
              />
            </div>
            <div className={[styles.content, contentClassName].filter(Boolean).join(' ')}>{children}</div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
    ),
    document.body,
  );
}

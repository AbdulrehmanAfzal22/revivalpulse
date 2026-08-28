import { useEffect, useRef, useState } from 'react';
import { Settings, X } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import Button from 'components/ui/Button';
import styles from './DuaSettingsPopover.module.css';

export interface DuaSettings {
  arabicSize: number;
  translationSize: number;
  playbackRate: number;
}

interface DuaSettingsPopoverProps {
  settings: DuaSettings;
  onChange: (patch: Partial<DuaSettings>) => void;
}

const SPEED_OPTIONS = [0.5, 0.75, 1, 1.25, 1.5, 2];

export default function DuaSettingsPopover({ settings, onChange }: DuaSettingsPopoverProps) {
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return undefined;
    const handleOutsideClick = (event: MouseEvent): void => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) setIsOpen(false);
    };
    const handleKeyDown = (event: KeyboardEvent): void => {
      if (event.key === 'Escape') setIsOpen(false);
    };
    document.addEventListener('click', handleOutsideClick);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('click', handleOutsideClick);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  return (
    <div className={styles.wrapper} ref={wrapperRef}>
      <Button
        type="button"
        variant="icon"
        size="sm"
        aria-label="Dua display and audio settings"
        aria-expanded={isOpen}
        onClick={(event) => {
          event.stopPropagation();
          setIsOpen((open) => !open);
        }}
        leadingIcon={isOpen ? <X size={16} /> : <Settings size={16} />}
      />
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className={styles.panel}
            role="dialog"
            aria-label="Dua settings"
            initial={{ opacity: 0, y: -4, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -4, scale: 0.97 }}
            transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
          >
          <label className={styles.control}>
            <span>Arabic text size <output>{settings.arabicSize}px</output></span>
            <input type="range" min="24" max="48" step="1" value={settings.arabicSize} onChange={(event) => onChange({ arabicSize: Number(event.target.value) })} />
          </label>
          <label className={styles.control}>
            <span>Translation text size <output>{settings.translationSize}px</output></span>
            <input type="range" min="14" max="24" step="1" value={settings.translationSize} onChange={(event) => onChange({ translationSize: Number(event.target.value) })} />
          </label>
          <fieldset className={styles.speedControl}>
            <legend>Playback speed</legend>
            <div className={styles.speedOptions}>
              {SPEED_OPTIONS.map((speed) => (
                <button key={speed} type="button" className={speed === settings.playbackRate ? styles.speedActive : styles.speed} onClick={() => onChange({ playbackRate: speed })} aria-pressed={speed === settings.playbackRate}>
                  {speed}x
                </button>
              ))}
            </div>
          </fieldset>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

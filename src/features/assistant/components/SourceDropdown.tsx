import React, { useState, useRef } from 'react';
import { ChevronDown, Search, BookOpen, BookMarked, Clock } from 'lucide-react';
import { useLanguageContext } from 'contexts/LanguageContext';
import Button from 'components/ui/Button';
import useClickOutside from 'hooks/useClickOutside';
import styles from './SourceDropdown.module.css';

export type SourceMode = 'general' | 'quran' | 'hadith' | 'tafsir' | 'history';

export interface SourceDropdownProps {
  mode: SourceMode;
  onModeChange: (mode: SourceMode) => void;
}

const SOURCE_MODE_LABELS: Record<SourceMode, string> = {
  general: 'All Sources',
  quran: 'Quran',
  hadith: 'Hadith',
  tafsir: 'Tafsir',
  history: 'Islamic History',
};

const SOURCE_MODE_ICONS: Record<SourceMode, React.ReactNode> = {
  general: <Search size={16} />,
  quran: <BookOpen size={16} />,
  hadith: <BookMarked size={16} />,
  tafsir: <BookOpen size={16} />,
  history: <Clock size={16} />,
};

export function SourceDropdown({ mode, onModeChange }: SourceDropdownProps) {
  const [open, setOpen] = useState(false);
  const { interfaceLanguage } = useLanguageContext();
  const wrapperRef = useRef<HTMLDivElement>(null);

  useClickOutside(wrapperRef, open, () => setOpen(false));

  const handleOptionClick = (selectedMode: SourceMode) => {
    setOpen(false);
    onModeChange(selectedMode);
  };

  const MODES: SourceMode[] = ['general', 'quran', 'hadith', 'tafsir', 'history'];

  return (
    <div className={styles.wrapper} ref={wrapperRef}>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="menu"
        aria-expanded={open}
        leadingIcon={SOURCE_MODE_ICONS[mode]}
        trailingIcon={<ChevronDown size={14} />}
      >
        {SOURCE_MODE_LABELS[mode]}
      </Button>

      {open && (
        <ul className={styles.menu} role="menu">
          {MODES.map((optionMode) => (
            <li key={optionMode} role="none">
              <button
                type="button"
                role="menuitem"
                className={styles.item}
                onClick={() => handleOptionClick(optionMode)}
              >
                <span className="flex items-center gap-2">
                  {SOURCE_MODE_ICONS[optionMode]}
                  <span>{SOURCE_MODE_LABELS[optionMode]}</span>
                </span>
                {optionMode === mode && <div className={styles.check} />}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
import { useRef, useState } from 'react';
import { Check, ChevronDown, Globe } from 'lucide-react';
import Button from 'components/ui/Button';
import useInterfaceLanguage from 'hooks/useInterfaceLanguage';
import useClickOutside from 'hooks/useClickOutside';
import styles from './LanguageSelector.module.css';

export default function LanguageSelector() {
  const { interfaceLanguage, languages, setInterfaceLanguage } = useInterfaceLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useClickOutside(wrapperRef, isOpen, () => setIsOpen(false));

  const handleSelect = (code: string): void => {
    setInterfaceLanguage(code);
    setIsOpen(false);
  };

  return (
    <div className={styles.wrapper} ref={wrapperRef}>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setIsOpen((open) => !open)}
        aria-haspopup="menu"
        aria-expanded={isOpen}
        leadingIcon={<Globe size={16} />}
        trailingIcon={<ChevronDown size={14} />}
      >
        {interfaceLanguage.nativeName}
      </Button>

      {isOpen && (
        <ul className={styles.menu} role="menu">
          {languages.map((option) => (
            <li key={option.code} role="none">
              <button
                type="button"
                role="menuitem"
                className={styles.item}
                onClick={() => handleSelect(option.code)}
              >
                <span>{option.nativeName}</span>
                {option.code === interfaceLanguage.code && <Check size={16} className={styles.check} />}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

import { Check } from 'lucide-react';
import type { ColorPreset } from 'types/readingPreferences.types';
import styles from './SwatchGroup.module.css';

export interface SwatchGroupProps {
  options: ColorPreset[];
  value: string;
  onChange: (id: string) => void;
}

export default function SwatchGroup({ options, value, onChange }: SwatchGroupProps) {
  return (
    <div className={styles.group} role="radiogroup">
      {options.map((option) => (
        <button
          key={option.id}
          type="button"
          role="radio"
          aria-checked={option.id === value}
          aria-label={option.label}
          title={option.label}
          className={styles.swatch}
          style={{ backgroundColor: option.value }}
          onClick={() => onChange(option.id)}
        >
          {option.id === value && <Check size={14} className={styles.check} />}
        </button>
      ))}
    </div>
  );
}

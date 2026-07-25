import styles from './PillGroup.module.css';

export interface PillOption {
  id: string;
  label: string;
}

export interface PillGroupProps {
  options: PillOption[];
  value: string;
  onChange: (id: string) => void;
}

export default function PillGroup({ options, value, onChange }: PillGroupProps) {
  return (
    <div className={styles.group} role="radiogroup">
      {options.map((option) => (
        <button
          key={option.id}
          type="button"
          role="radio"
          aria-checked={option.id === value}
          className={[styles.pill, option.id === value && styles.pillActive].filter(Boolean).join(' ')}
          onClick={() => onChange(option.id)}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}

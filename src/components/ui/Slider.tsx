import styles from './Slider.module.css';

export interface SliderProps {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  valueLabel?: string;
  onChange: (value: number) => void;
}

export default function Slider({
  label,
  value,
  min,
  max,
  step = 1,
  valueLabel,
  onChange,
}: SliderProps) {
  return (
    <label className={styles.wrapper}>
      <span className={styles.row}>
        <span className={styles.label}>{label}</span>
        <span className={styles.value}>{valueLabel ?? value}</span>
      </span>
      <input
        type="range"
        className={styles.input}
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
      />
    </label>
  );
}

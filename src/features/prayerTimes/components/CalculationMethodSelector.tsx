import { CALCULATION_METHODS } from 'constants/calculationMethods';
import useTranslation from 'hooks/useTranslation';
import styles from './CalculationMethodSelector.module.css';

export interface CalculationMethodSelectorProps {
  value: number;
  onChange: (methodId: number) => void;
}

export default function CalculationMethodSelector({ value, onChange }: CalculationMethodSelectorProps) {
  const { t } = useTranslation();

  return (
    <label className={styles.wrapper}>
      <span className={styles.label}>{t('prayerTimes.calculationMethod')}</span>
      <select className={styles.select} value={value} onChange={(event) => onChange(Number(event.target.value))}>
        {CALCULATION_METHODS.map((method) => (
          <option key={method.id} value={method.id}>
            {method.name}
          </option>
        ))}
      </select>
    </label>
  );
}

import useTranslation from 'hooks/useTranslation';
import styles from './LoadingSpinner.module.css';

export type SpinnerSize = 'sm' | 'md' | 'lg';

export interface LoadingSpinnerProps {
  size?: SpinnerSize;
  label?: string;
}

export default function LoadingSpinner({ size = 'md', label }: LoadingSpinnerProps) {
  const { t } = useTranslation();

  return (
    <div className={styles.wrapper} role="status" aria-live="polite">
      <span className={[styles.spinner, styles[size]].join(' ')} aria-hidden="true" />
      <span className={styles.srOnly}>{label ?? t('common.loading')}</span>
    </div>
  );
}

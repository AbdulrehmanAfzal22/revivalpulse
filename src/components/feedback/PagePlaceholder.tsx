import type { ReactNode } from 'react';
import useTranslation from 'hooks/useTranslation';
import EmptyState from './EmptyState';
import styles from './PagePlaceholder.module.css';

export interface PagePlaceholderProps {
  icon: ReactNode;
  title: string;
  description?: string;
}

export default function PagePlaceholder({ icon, title, description }: PagePlaceholderProps) {
  const { t } = useTranslation();

  return (
    <div className={styles.wrapper}>
      <EmptyState icon={icon} title={title} description={description ?? t('common.comingSoon')} />
    </div>
  );
}

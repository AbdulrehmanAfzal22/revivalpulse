import type { ReactNode } from 'react';
import Typography from 'components/ui/Typography';
import styles from './EmptyState.module.css';

export interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  description?: string;
  action?: ReactNode;
}

export default function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <div className={styles.wrapper}>
      {icon && <div className={styles.icon}>{icon}</div>}
      <Typography variant="h3">{title}</Typography>
      {description && (
        <Typography variant="body" muted className={styles.description}>
          {description}
        </Typography>
      )}
      {action && <div className={styles.action}>{action}</div>}
    </div>
  );
}

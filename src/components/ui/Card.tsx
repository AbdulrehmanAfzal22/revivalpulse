import type { HTMLAttributes } from 'react';
import styles from './Card.module.css';

export type CardElevation = 'flat' | 'raised';

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  elevation?: CardElevation;
}

export default function Card({ elevation = 'flat', className, children, ...rest }: CardProps) {
  const classes = [styles.card, styles[elevation], className].filter(Boolean).join(' ');

  return (
    <div className={classes} {...rest}>
      {children}
    </div>
  );
}

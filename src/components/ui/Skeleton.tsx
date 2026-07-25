import type { CSSProperties } from 'react';
import styles from './Skeleton.module.css';

export type SkeletonVariant = 'text' | 'rect' | 'circle';

export interface SkeletonProps {
  variant?: SkeletonVariant;
  width?: number | string;
  height?: number | string;
  count?: number;
  className?: string;
}

export default function Skeleton({
  variant = 'text',
  width,
  height,
  count = 1,
  className,
}: SkeletonProps) {
  const style: CSSProperties = { width, height };
  const classes = [styles.skeleton, styles[variant], className].filter(Boolean).join(' ');

  return (
    <>
      {Array.from({ length: count }, (_, index) => (
        <span key={index} className={classes} style={style} aria-hidden="true" />
      ))}
    </>
  );
}

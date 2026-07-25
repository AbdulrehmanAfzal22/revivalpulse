import type { ElementType, HTMLAttributes } from 'react';
import styles from './Typography.module.css';

export type TypographyVariant = 'h1' | 'h2' | 'h3' | 'h4' | 'body' | 'caption';

export interface TypographyProps extends HTMLAttributes<HTMLElement> {
  variant?: TypographyVariant;
  as?: ElementType;
  muted?: boolean;
}

const DEFAULT_TAGS: Record<TypographyVariant, ElementType> = {
  h1: 'h1',
  h2: 'h2',
  h3: 'h3',
  h4: 'h4',
  body: 'p',
  caption: 'span',
};

export default function Typography({
  variant = 'body',
  as,
  muted = false,
  className,
  children,
  ...rest
}: TypographyProps) {
  const Tag = as ?? DEFAULT_TAGS[variant];
  const classes = [styles.text, styles[variant], muted && styles.muted, className]
    .filter(Boolean)
    .join(' ');

  return (
    <Tag className={classes} {...rest}>
      {children}
    </Tag>
  );
}

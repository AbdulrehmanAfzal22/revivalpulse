import styles from './KidsMascot.module.css';

export interface KidsMascotProps {
  className?: string;
}

/**
 * The Kids Mode character: a smiling sun-face friend drawn entirely from the
 * main site's Islamic Vision tokens (gold face, pine features, terracotta
 * cheeks) so it reads as part of the app rather than a stock cartoon. Inline
 * SVG — self-contained, no download, and it recolours with light/dark for free.
 * The dot-ring radiance turns slowly and the face bobs; both stop under
 * prefers-reduced-motion.
 */
export default function KidsMascot({ className }: KidsMascotProps) {
  return (
    <svg
      className={[styles.mascot, className].filter(Boolean).join(' ')}
      viewBox="0 0 120 120"
      aria-hidden="true"
      focusable="false"
    >
      <circle
        className={styles.radiance}
        cx="60"
        cy="60"
        r="52"
        fill="none"
        stroke="var(--color-gold-soft)"
        strokeWidth="8"
        strokeLinecap="round"
        strokeDasharray="1 21"
        opacity="0.8"
      />
      <g className={styles.face}>
        <circle cx="60" cy="60" r="44" fill="var(--color-gold)" opacity="0.28" />
        <circle cx="60" cy="62" r="36" fill="var(--color-gold-light)" />
        <circle cx="44" cy="70" r="5.5" fill="var(--color-accent)" opacity="0.45" />
        <circle cx="76" cy="70" r="5.5" fill="var(--color-accent)" opacity="0.45" />
        <path d="M45 58 q6 -8 12 0" stroke="var(--color-pine)" strokeWidth="4" strokeLinecap="round" fill="none" />
        <path d="M63 58 q6 -8 12 0" stroke="var(--color-pine)" strokeWidth="4" strokeLinecap="round" fill="none" />
        <path d="M47 73 q13 13 26 0" stroke="var(--color-pine)" strokeWidth="4" strokeLinecap="round" fill="none" />
        <path d="M42 82 Q60 95 78 82 L78 86 Q60 101 42 86 Z" fill="var(--color-pine)" />
      </g>
    </svg>
  );
}

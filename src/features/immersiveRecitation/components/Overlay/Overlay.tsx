import type { CSSProperties } from 'react';
import styles from './Overlay.module.css';

/**
 * Pure presentational dimming layer that sits between the background video
 * (Layer 0) and the name-text layer (Layer 2).
 *
 * Zero logic: it only renders a gradient + optional backdrop blur. Every knob
 * is a CSS variable, so tuning darkness (`--ov-dim`, default 0.62 ≈ 62% black
 * at the focal point) or blur (`--ov-blur`) later never touches this file.
 *
 * NOTE: the original spec mentioned Tailwind; this repo has no Tailwind setup,
 * so the overlay follows the app's CSS Modules + design-token convention
 * while keeping the same "tune via CSS variables" surface.
 */
export interface OverlayProps {
  /** Peak darkness (0..1) of the gradient at the focal point. Default 0.62. */
  intensity?: number;
  /** Backdrop-blur radius in px. 0 (default) disables it (cheaper on low-end). */
  blur?: number;
  className?: string;
}

export default function Overlay({ intensity = 0.62, blur = 0, className }: OverlayProps) {
  const style = {
    '--ov-dim': intensity,
    '--ov-blur': `${blur}px`,
  } as CSSProperties;

  return <div aria-hidden="true" className={`${styles.overlay}${className ? ` ${className}` : ''}`} style={style} />;
}
import { useReducedMotion } from 'framer-motion';
import type { CSSProperties } from 'react';
import styles from './SparkleBurst.module.css';

/**
 * Phase 9 — celebratory sparkle burst, no image assets needed.
 *
 * Renders a fixed ring of SVG star particles radiating from a center point.
 * `burstKey` changes retrigger the CSS animation (a simple key change forces
 * the element to re-mount, restarting `@keyframes sparkle-fly`).
 *
 * Pure CSS + one tiny inline SVG — cheaper than framer-motion for a
 * fire-and-forget effect, and it still respects prefers-reduced-motion via
 * the media query in the stylesheet.
 */
export interface SparkleBurstProps {
  /** Change this value to retrigger the burst. */
  burstKey: string | number;
  /** Center point relative to the nearest positioned ancestor (px or %). */
  x?: number | string;
  y?: number | string;
  /** Number of sparkle particles (8–16 feels right). */
  count?: number;
}

const GOLD = '#ffc94d';
const SKY = '#5ec8e0';
const CORAL = '#ff8965';
const COLORS = [GOLD, SKY, CORAL, '#ffffff'];

function polar(radius: number, angleDeg: number): { x: number; y: number } {
  const radians = (angleDeg * Math.PI) / 180;
  return { x: radius * Math.cos(radians), y: radius * Math.sin(radians) };
}

export default function SparkleBurst({ burstKey, x = 0, y = 0, count = 12 }: SparkleBurstProps) {
  const prefersReducedMotion = useReducedMotion();

  const particles = Array.from({ length: count }, (_, i) => {
    const angle = (360 / count) * i + (i % 2 === 0 ? 0 : 18);
    const distance = 46 + (i % 3) * 14;
    const { x: dx, y: dy } = polar(distance, angle);
    const size = 8 + (i % 3) * 4;
    const style: CSSProperties = {
      left: x,
      top: y,
      '--dx': `${dx}px`,
      '--dy': `${dy}px`,
      '--size': `${size}px`,
      color: COLORS[i % COLORS.length],
      animationDelay: `${(i % 4) * 35}ms`,
    } as CSSProperties;
    return { i, style };
  });

  return (
    <span
      key={String(burstKey)}
      className={styles.burst}
      aria-hidden="true"
      data-reduced={prefersReducedMotion || undefined}
    >
      {particles.map(({ i, style }) => (
        <span key={i} className={styles.particle} style={style}>
          <svg viewBox="0 0 24 24" width="100%" height="100%" fill="currentColor">
            <path d="M12 2 L14.5 9.5 L22 12 L14.5 14.5 L12 22 L9.5 14.5 L2 12 L9.5 9.5 Z" />
          </svg>
        </span>
      ))}
    </span>
  );
}

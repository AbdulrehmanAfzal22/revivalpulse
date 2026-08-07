import { useEffect, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { useImmersiveRecitationStore } from 'stores/immersiveRecitationStore';
import styles from './BackgroundImagePlayer.module.css';

/**
 * The 8 rotating ambient stills for the immersive recitation — pre-existing
 * files referenced directly from `public/assets/` (pic1..pic8.jpg). Nothing is
 * fetched or generated.
 */
const BACKGROUND_IMAGES = Array.from({ length: 8 }, (_, i) => {
  const number = i + 1;
  return `${process.env.PUBLIC_URL ?? ''}/assets/pic${number}.jpg`;
});

/** Scene-change crossfade duration in seconds (matches the video player). */
const CROSSFADE_DURATION = 1;

/**
 * Image index for the current name per the composition:
 *   Math.floor(currentNameIndex / 10) % 8
 * names 0-9 -> image 1, 10-19 -> 2, … 70-79 -> 8, then names 80-98 wrap back
 * to images 1 and 2. The index -1 (melodic intro, Bismillah idle) is clamped to
 * 0 so the first image is already in place under the idle state.
 */
export function imageIndexForName(currentNameIndex: number): number {
  const safe = Math.max(0, currentNameIndex);
  return Math.floor(safe / 10) % BACKGROUND_IMAGES.length;
}

interface LayerSlots {
  /** URL currently held by layer A. */
  a: string;
  /** URL currently held by layer B. */
  b: string;
  /** True while layer A is the visible (most recent) layer. */
  aIsActive: boolean;
}

/**
 * Two stacked background-image layers, crossfaded with Framer Motion.
 *
 * - Both layers stay mounted forever; each scene change slides the new image
 *   into the STANDBY layer and flips which layer is active, so the two layers
 *   crossfade opacity 0 <-> 1 over CROSSFADE_DURATION and are never both 0 —
 *   the same no-black-flash guarantee as the video player it replaces.
 * - The active image is derived DIRECTLY from the Store's `currentNameIndex`
 *   (the same value useTimestampSync writes and NameOverlay reads): image
 *   changes are always based on identical state as the name on screen — no
 *   timer, no second source of truth.
 */
export default function BackgroundImagePlayer() {
  const currentNameIndex = useImmersiveRecitationStore((state) => state.currentNameIndex);
  const reduceMotion = useReducedMotion();

  const activeImage = imageIndexForName(currentNameIndex);

  const [layers, setLayers] = useState<LayerSlots>(() => ({
    a: BACKGROUND_IMAGES[0]!,
    b: BACKGROUND_IMAGES[0]!,
    aIsActive: true,
  }));

  useEffect(() => {
    setLayers((previous) => {
      // activeImage is always in [0..7] (modulo 8 above), so the lookup can never
      // miss; `!` silences the indexed-access `string | undefined`.
      const incoming = BACKGROUND_IMAGES[activeImage]!;
      const activeUrl = previous.aIsActive ? previous.a : previous.b;
      // Same scene (mount, or a loop landing on the very same image): no-op.
      if (activeUrl === incoming) return previous;
      // Slide the new image into the STANDBY layer, then flip which is active.
      if (previous.aIsActive) {
        return { a: previous.a, b: incoming, aIsActive: false };
      }
      return { a: incoming, b: previous.b, aIsActive: true };
    });
  }, [activeImage]);

  return (
    <div className={styles.player} aria-hidden="true">
      <motion.div
        className={styles.layer}
        style={{ backgroundImage: `url(${layers.a})` }}
        initial={false}
        animate={{ opacity: layers.aIsActive ? 1 : 0 }}
        transition={{
          duration: reduceMotion ? 0 : CROSSFADE_DURATION,
          ease: 'easeInOut',
        }}
      />
      <motion.div
        className={styles.layer}
        style={{ backgroundImage: `url(${layers.b})` }}
        initial={false}
        animate={{ opacity: layers.aIsActive ? 0 : 1 }}
        transition={{
          duration: reduceMotion ? 0 : CROSSFADE_DURATION,
          ease: 'easeInOut',
        }}
      />
    </div>
  );
}
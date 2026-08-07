import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import Typography from 'components/ui/Typography';
import { useImmersiveRecitationStore } from 'stores/immersiveRecitationStore';
import type { AllahName } from 'types/immersiveRecitation.types';
import styles from './NameOverlay.module.css';

/**
 * Centered name display (Arabic large, transliteration, meaning).
 *
 * Purely reactive to the store: it reads `currentNameIndex` and renders the
 * name at that index. The AnimatePresence crossfades the OUTGOING name down
 * and the INCOMING name up whenever the index changes. It has no timing logic
 * of its own — the TimestampSynchronizer advances the index and this
 * component simply follows.
 *
 * Phase 14 extensibility: `textMode` is a RESERVED slot for an alternate
 * text mode (e.g. full translation vs meaning). Only 'meaning' is implemented
 * today; the prop exists so the toggle + data can be added later without
 * changing this API.
 */
export interface NameOverlayProps {
  /** Full timed 99-name list (order = canonical) used to resolve the index. */
  names: AllahName[];
  /**
   * RESERVED (Phase 14): alternate text mode for the name block.
   * Defaults to `'meaning'` — current behavior. A future `'translation'`
   * mode renders full translations instead; toggle UI and data are not
   * built yet, so rendering is unchanged until that phase lands.
   */
  textMode?: 'meaning' | 'translation';
}

export default function NameOverlay({ names, textMode = 'meaning' }: NameOverlayProps) {
  const currentNameIndex = useImmersiveRecitationStore((state) => state.currentNameIndex);
  const reduceMotion = useReducedMotion();

  // Reserved for Phase 14. Today both values render the same layout.
  void textMode;

  const name = names[currentNameIndex] ?? null;

  return (
    <div className={styles.layer} aria-live="assertive" aria-atomic="true">
      {/* No mode="wait": the next name must MOUNT the instant the index changes,
          so it is on screen within one frame of its timestamp. mode="wait" (and a
          slow exit) delays the incoming text by the full exit duration (~0.35s) —
          a constant, noticeable sync lag the user explicitly pointed at. The
          crossfade below is a short overlap so content swaps exactly with audio. */}
      <AnimatePresence initial={false}>
        {name && (
          <motion.div
            key={name.id}
            className={styles.name}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, transition: { duration: reduceMotion ? 0 : 0.18, ease: 'easeOut' } }}
            exit={{ opacity: 0, transition: { duration: reduceMotion ? 0 : 0.14, ease: 'easeIn' } }}
          >
            <p className={styles.arabic} dir="rtl" lang="ar">
              {name.arabic}
            </p>
            <Typography variant="h3" as="p" className={styles.transliteration}>
              {name.transliteration}
            </Typography>
            <Typography variant="body" className={styles.meaning}>
              {name.meaning}
            </Typography>
          </motion.div>
        )}
        {!name && names.length > 0 && (
          <motion.div
            key="idle"
            className={styles.idle}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, transition: { duration: reduceMotion ? 0 : 0.25, ease: 'easeOut' } }}
            exit={{ opacity: 0, transition: { duration: reduceMotion ? 0 : 0.15, ease: 'easeIn' } }}
          >
            {/* Melodic intro: no name is active yet (index -1). */}
            <p className={styles.idleArabic} dir="rtl" lang="ar">
              بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
            </p>
            <Typography variant="h3" as="p" className={styles.idleCaption}>
              Beginning
            </Typography>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
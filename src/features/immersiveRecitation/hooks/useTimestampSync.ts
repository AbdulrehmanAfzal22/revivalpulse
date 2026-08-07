import { useEffect, useRef } from 'react';
import { useImmersiveRecitationStore } from 'stores/immersiveRecitationStore';
import { SEEK_TOLERANCE_SECONDS } from 'features/immersiveRecitation/hooks/useAudioEngine';
import type { AllahName } from 'types/immersiveRecitation.types';

/**
 * Returns the index (0-based) of the name whose timestamp is the last one
 * at-or-before `time`, or `-1` while the melodic intro is still playing.
 * Timestamps are monotonic within one recitation, so a single forward pass
 * suffices. Times before `introSeconds` yield -1 so the UI can show an idle
 * "beginning" state instead of the first name. The speech recitation has no
 * intro (introSeconds = 0), so at time 0 the first name is active.
 */
export function nameIndexAtTime(
  time: number,
  names: readonly AllahName[],
  introSeconds = 0
): number {
  if (!Number.isFinite(time) || time < introSeconds) return -1;
  let index = -1;
  for (let i = 0; i < names.length; i += 1) {
    const name = names[i];
    if (name !== undefined && name.timestampSeconds <= time) {
      index = i;
    } else {
      break;
    }
  }
  return index;
}

/**
 * useTimestampSync — Phase 8 "TimestampSynchronizer" (frame-accurate).
 *
 * The single source of truth for name timing in the immersive session. It
 * derives the active name index from the REAL audio time (via the
 * timestamp-sorted `names` array) and writes that index into the store as
 * `currentNameIndex`. Nothing else in the feature computes the index:
 * NameOverlay and ProgressBar both READ `currentNameIndex`/`currentTime` from
 * the store.
 *
 * HOW IT STAYS EXACT (this is the whole point):
 * - A requestAnimationFrame loop reads the live <audio> element's
 *   `currentTime` EVERY FRAME (the native `timeupdate` fire rate is only ~4Hz),
 *   so name flips land within ~16 ms of the recorded boundary instead of up to
 *   250 ms late — below the threshold of human noticeability.
 * - Making the element the ground truth makes the sync IMMUNE to playback-rate
 *   changes: `currentTime` is media time, so 2.0x vs 0.5x cannot produce
 *   drift; the index is always derived from where the decoder actually is.
 * - Clicks on the seek bar appear INSTANTLY: `seekTo` writes the target into
 *   the store synchronously, but the element takes a few frames to get there.
 *   While the store is meaningfully AHEAD of the element (a forward seek is in
 *   flight), the loop prefers the store value, so the name snaps to the
 *   clicked position in the same frame; the moment the element catches up the
 *   element value continues to rule. The store only drives the index during
 *   those seek windows.
 *
 * No visible state is subscribed here (only the index is WRITTEN); the rAF
 * loop is torn down on unmount. Seek handling stays implicit: any source that
 * changes the audio position (bar, End/Home, replay, loop) re-derives the
 * index on the next frame from the element's real position.
 */
export default function useTimestampSync(
  names: readonly AllahName[],
  introSeconds = 0,
  getElement?: () => HTMLAudioElement | null
): void {
  const namesRef = useRef(names);
  namesRef.current = names;
  const introRef = useRef(introSeconds);
  introRef.current = introSeconds;

  useEffect(() => {
    const store = () => useImmersiveRecitationStore.getState();
    let lastIndex = store().currentNameIndex;
    let rafId = 0;

    const tick = () => {
      const { currentTime: storeTime } = store();
      const element = getElement?.();
      let time = storeTime;
      if (element) {
        const elementTime = element.currentTime;
        // While the element is at or past the store, the element is the ground
        // truth: it is frame-accurate and advance-proof. Only when the store is
        // meaningfully AHEAD (delta > tolerance) is a forward seek still in
        // flight — keep the store value so the name snaps immediately.
        if (Number.isFinite(elementTime) && storeTime - elementTime <= SEEK_TOLERANCE_SECONDS) {
          time = elementTime;
        }
      }
      const index = nameIndexAtTime(time, namesRef.current, introRef.current);
      if (index !== lastIndex) {
        lastIndex = index;
        store().setCurrentNameIndex(index);
      }
      rafId = requestAnimationFrame(tick);
    };

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, [getElement]);
}
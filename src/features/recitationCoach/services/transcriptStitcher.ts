/**
 * Consecutive audio chunks overlap on purpose (see useMicrophoneChunks) so
 * words spoken right at a chunk boundary aren't cut off — but that means
 * each new chunk's transcript re-recognizes the tail of the previous one.
 * This finds the longest run at the end of `existingWords` that matches the
 * start of `newWords`, so callers can drop that many words from the front
 * of `newWords` (and, for the caller that also has per-word timestamps for
 * the same chunk, drop the same count from that parallel array too).
 */
export function findOverlapLength(existingWords: string[], newWords: string[]): number {
  if (existingWords.length === 0 || newWords.length === 0) return 0;

  const maxOverlap = Math.min(existingWords.length, newWords.length, 12);
  for (let overlap = maxOverlap; overlap > 0; overlap -= 1) {
    const tail = existingWords.slice(existingWords.length - overlap).join(' ');
    const head = newWords.slice(0, overlap).join(' ');
    if (tail === head) return overlap;
  }
  return 0;
}

export function stitchTranscripts(existingWords: string[], newWords: string[]): string[] {
  const overlap = findOverlapLength(existingWords, newWords);
  return [...existingWords, ...newWords.slice(overlap)];
}

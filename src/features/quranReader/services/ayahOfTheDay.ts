import { SURAHS } from 'data/quran/surahs';

const TOTAL_VERSES = SURAHS.reduce((sum, surah) => sum + surah.versesCount, 0);

function dayOfYear(date: Date): number {
  const start = new Date(date.getFullYear(), 0, 0);
  const diffMs = date.getTime() - start.getTime();
  return Math.floor(diffMs / (1000 * 60 * 60 * 24));
}

/** Deterministic day-of-year rotation through the whole Quran (6236 verses) — same date always gives the same verse. */
export function getVerseKeyForDay(date: Date = new Date()): string {
  let index = dayOfYear(date) % TOTAL_VERSES;

  for (const surah of SURAHS) {
    if (index < surah.versesCount) {
      return `${surah.id}:${index + 1}`;
    }
    index -= surah.versesCount;
  }

  // Unreachable: TOTAL_VERSES is the sum of every surah's versesCount, so the
  // loop above always finds a home for any index in [0, TOTAL_VERSES).
  const first = SURAHS[0] as (typeof SURAHS)[number];
  return `${first.id}:1`;
}

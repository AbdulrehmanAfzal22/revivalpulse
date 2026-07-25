import type { SajdahVerse } from 'types/quran.types';

/**
 * The 14 sajdah (prostration) verses, in the numbering convention used by
 * api.quran.com (verified live per-verse: 22:77, sometimes counted as a
 * 15th sajdah in some schools, is not flagged by that source).
 */
export const SAJDAH_VERSES: SajdahVerse[] = [
  { verseKey: '7:206', sajdahNumber: 1 },
  { verseKey: '13:15', sajdahNumber: 2 },
  { verseKey: '16:50', sajdahNumber: 3 },
  { verseKey: '17:109', sajdahNumber: 4 },
  { verseKey: '19:58', sajdahNumber: 5 },
  { verseKey: '22:18', sajdahNumber: 6 },
  { verseKey: '25:60', sajdahNumber: 7 },
  { verseKey: '27:26', sajdahNumber: 8 },
  { verseKey: '32:15', sajdahNumber: 9 },
  { verseKey: '38:24', sajdahNumber: 10 },
  { verseKey: '41:38', sajdahNumber: 11 },
  { verseKey: '53:62', sajdahNumber: 12 },
  { verseKey: '84:21', sajdahNumber: 13 },
  { verseKey: '96:19', sajdahNumber: 14 },
];

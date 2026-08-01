import type { SurahFullText } from 'api/quran/fullTextClient';
import { splitAyahWords } from './arabicNormalization';

export interface IndexedWord {
  word: string;
  surahId: number;
  ayahNumber: number;
  wordIndexInAyah: number;
}

export interface SurahWordIndex {
  /** Every word in the whole Quran, in reading order — index into this array is the "global word index". */
  words: IndexedWord[];
  /** Normalized word -> global word indices where it occurs, for fast candidate lookup during detection. */
  byWord: Map<string, number[]>;
  /** surahId -> normalized words per ayah, for comparing against recognized speech once a surah is locked. */
  ayahsBySurah: Map<number, string[][]>;
  /** surahId -> original (diacritics intact) words per ayah, index-aligned with ayahsBySurah, for on-screen display. */
  displayAyahsBySurah: Map<number, string[][]>;
}

export function buildSurahWordIndex(fullText: SurahFullText[]): SurahWordIndex {
  const words: IndexedWord[] = [];
  const byWord = new Map<string, number[]>();
  const ayahsBySurah = new Map<number, string[][]>();
  const displayAyahsBySurah = new Map<number, string[][]>();

  for (const surah of fullText) {
    const normalizedAyahs: string[][] = [];
    const displayAyahs: string[][] = [];

    surah.ayahs.forEach((ayahText, ayahIdx) => {
      const ayahNumber = ayahIdx + 1;
      const { raw, normalized } = splitAyahWords(ayahText);
      normalizedAyahs.push(normalized);
      displayAyahs.push(raw);

      normalized.forEach((word, wordIndexInAyah) => {
        const globalIndex = words.length;
        words.push({ word, surahId: surah.id, ayahNumber, wordIndexInAyah });
        const existing = byWord.get(word);
        if (existing) {
          existing.push(globalIndex);
        } else {
          byWord.set(word, [globalIndex]);
        }
      });
    });

    ayahsBySurah.set(surah.id, normalizedAyahs);
    displayAyahsBySurah.set(surah.id, displayAyahs);
  }

  return { words, byWord, ayahsBySurah, displayAyahsBySurah };
}

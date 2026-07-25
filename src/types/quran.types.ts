import type { Word } from 'types/word.types';

export type RevelationPlace = 'makkah' | 'madinah';

export interface Surah {
  id: number;
  nameArabic: string;
  nameSimple: string;
  nameComplex: string;
  translatedName: string;
  versesCount: number;
  revelationPlace: RevelationPlace;
  revelationOrder: number;
  bismillahPre: boolean;
  pages: [number, number];
}

export interface JuzBoundary {
  juzNumber: number;
  firstVerseKey: string;
  lastVerseKey: string;
  versesCount: number;
  /** Surah number (as string key) -> "startAyah-endAyah" within this juz. */
  verseMapping: Record<string, string>;
}

export interface SajdahVerse {
  verseKey: string;
  sajdahNumber: number;
}

export interface AyahTranslation {
  /** Matches TranslationResource.id from constants/translations.ts. */
  translationId: string;
  text: string;
}

export interface Ayah {
  id: number;
  verseKey: string;
  verseNumber: number;
  chapterId: number;
  textUthmani: string;
  translations: AyahTranslation[];
  words: Word[];
  juzNumber: number;
  hizbNumber: number;
  rubNumber: number;
  rukuNumber: number;
  manzilNumber: number;
  sajdahNumber: number | null;
  pageNumber: number;
}

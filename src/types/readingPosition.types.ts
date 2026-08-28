export type ReadingModule = 'quran' | 'hadith' | 'tafsir';

interface ReadingPositionBase {
  module: ReadingModule;
  updatedAt: number;
  scrollTop: number;
  preview: string;
}

export interface QuranReadingPosition extends ReadingPositionBase {
  module: 'quran';
  surahId: number;
  ayahNumber: number;
  verseKey: string;
}

export interface HadithReadingPosition extends ReadingPositionBase {
  module: 'hadith';
  bookSlug: string;
  chapterId: number;
  hadithNumber: number;
}

export interface TafsirReadingPosition extends ReadingPositionBase {
  module: 'tafsir';
  surahId: number;
  ayahNumber: number;
  verseKey: string;
}

export type ReadingPosition = QuranReadingPosition | HadithReadingPosition | TafsirReadingPosition;
export type ReadingPositions = Partial<Record<ReadingModule, ReadingPosition>>;

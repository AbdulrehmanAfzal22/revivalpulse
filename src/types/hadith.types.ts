export interface HadithBook {
  id: number;
  slug: string;
  sourcePath: string;
  nameArabic: string;
  nameEnglish: string;
  authorArabic: string;
  authorEnglish: string;
  totalHadiths: number;
}

export interface HadithChapter {
  id: number;
  bookId: number;
  nameArabic: string;
  nameEnglish: string;
}

export interface Hadith {
  id: number;
  idInBook: number;
  chapterId: number;
  bookId: number;
  arabic: string;
  narrator: string | null;
  englishText: string;
}

export interface HadithBookContent {
  chapters: HadithChapter[];
  hadiths: Hadith[];
}

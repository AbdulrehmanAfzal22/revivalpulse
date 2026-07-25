import { HADITH_DATA_BASE_URL } from 'constants/hadithApi';
import type { HadithBook, HadithBookContent } from 'types/hadith.types';

interface RawChapter {
  id: number;
  bookId: number;
  arabic: string;
  english: string;
}

interface RawHadith {
  id: number;
  idInBook: number;
  chapterId: number;
  bookId: number;
  arabic: string;
  english: {
    narrator: string;
    text: string;
  };
}

interface RawBook {
  chapters: RawChapter[];
  hadiths: RawHadith[];
}

function mapChapter(chapter: RawChapter): HadithBookContent['chapters'][number] {
  return {
    id: chapter.id,
    bookId: chapter.bookId,
    nameArabic: chapter.arabic,
    nameEnglish: chapter.english,
  };
}

function mapHadith(hadith: RawHadith): HadithBookContent['hadiths'][number] {
  return {
    id: hadith.id,
    idInBook: hadith.idInBook,
    chapterId: hadith.chapterId,
    bookId: hadith.bookId,
    arabic: hadith.arabic,
    narrator: hadith.english.narrator.trim() || null,
    englishText: hadith.english.text.trim(),
  };
}

export async function getHadithBookContent(book: HadithBook): Promise<HadithBookContent> {
  const url = `${HADITH_DATA_BASE_URL}/${book.sourcePath}`;
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to load ${book.nameEnglish} (status ${response.status})`);
  }

  const data = (await response.json()) as RawBook;
  return {
    chapters: data.chapters.map(mapChapter),
    hadiths: data.hadiths.map(mapHadith),
  };
}

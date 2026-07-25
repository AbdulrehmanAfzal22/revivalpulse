import type { Hadith, HadithBookContent } from 'types/hadith.types';

export interface HadithSearchFilters {
  query: string;
  chapterId: number | null;
}

/**
 * Client-side only — this data source is static per-book JSON files with no
 * search API, so results are scoped to one already-loaded book. A single
 * query field matches Arabic, English, and narrator text together (Urdu
 * isn't available — see data/hadith/books.ts for why).
 */
export function searchHadiths(content: HadithBookContent, filters: HadithSearchFilters): Hadith[] {
  let results = content.hadiths;

  if (filters.chapterId !== null) {
    results = results.filter((hadith) => hadith.chapterId === filters.chapterId);
  }

  const rawTerm = filters.query.trim();
  if (!rawTerm) return results;

  if (/^\d+$/.test(rawTerm)) {
    const number = Number(rawTerm);
    return results.filter((hadith) => hadith.idInBook === number);
  }

  const lowerTerm = rawTerm.toLowerCase();
  return results.filter(
    (hadith) =>
      hadith.arabic.includes(rawTerm) ||
      hadith.englishText.toLowerCase().includes(lowerTerm) ||
      (hadith.narrator?.toLowerCase().includes(lowerTerm) ?? false)
  );
}

export function findHadithByNumber(content: HadithBookContent, idInBook: number): Hadith | undefined {
  return content.hadiths.find((hadith) => hadith.idInBook === idInBook);
}

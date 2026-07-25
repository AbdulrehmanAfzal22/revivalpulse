import { getVerseArabicText } from 'api/quran/quranClient';
import type { VerseSearchResult } from 'types/search.types';

export type RootIndex = Record<string, string[]>;

/** Generated at scaffold time from the same corpus as public/data/morphology/. */
export async function loadRootIndex(): Promise<RootIndex> {
  const response = await fetch('/data/rootIndex.json');
  if (!response.ok) {
    throw new Error(`Failed to load root index (status ${response.status})`);
  }
  return response.json() as Promise<RootIndex>;
}

export async function searchByRoot(
  root: string,
  rootIndex: RootIndex,
  page: number,
  pageSize: number
): Promise<{ totalResults: number; results: VerseSearchResult[] }> {
  const allVerseKeys = rootIndex[root] ?? [];
  const start = (page - 1) * pageSize;
  const pageKeys = allVerseKeys.slice(start, start + pageSize);

  const results = await Promise.all(
    pageKeys.map(
      async (verseKey): Promise<VerseSearchResult> => ({
        verseKey,
        textUthmani: await getVerseArabicText(verseKey),
        highlightedArabic: null,
        matchedTranslationText: null,
      })
    )
  );

  return { totalResults: allVerseKeys.length, results };
}

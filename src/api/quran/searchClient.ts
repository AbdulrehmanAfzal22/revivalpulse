import { QURAN_API_BASE_URL } from 'constants/quranApi';
import type { VerseSearchResult } from 'types/search.types';

interface RawSearchTranslation {
  text: string;
  resource_id: number;
}

interface RawSearchResult {
  verse_key: string;
  text: string;
  highlighted: string | null;
  translations: RawSearchTranslation[];
}

interface SearchResponse {
  search: {
    total_results: number;
    results: RawSearchResult[];
  };
}

export interface SearchOptions {
  /** Best-effort server hint; results are still filtered client-side against this list. */
  translationResourceIds?: number[];
  size?: number;
  page?: number;
}

export interface SearchResponseData {
  totalResults: number;
  results: VerseSearchResult[];
}

export async function searchVerses(query: string, options: SearchOptions = {}): Promise<SearchResponseData> {
  const { translationResourceIds, size = 20, page = 1 } = options;
  const params = new URLSearchParams({ q: query, size: String(size), page: String(page) });
  if (translationResourceIds?.length) {
    params.set('translation_ids', translationResourceIds.join(','));
  }

  const response = await fetch(`${QURAN_API_BASE_URL}/search?${params.toString()}`);
  if (!response.ok) {
    throw new Error(`Search failed (status ${response.status})`);
  }

  const data = (await response.json()) as SearchResponse;

  const results: VerseSearchResult[] = data.search.results.map((result) => {
    const relevantTranslation = translationResourceIds?.length
      ? result.translations.find((translation) => translationResourceIds.includes(translation.resource_id))
      : result.translations[0];

    return {
      verseKey: result.verse_key,
      textUthmani: result.text,
      highlightedArabic: result.highlighted,
      // Carries <em> match-highlight markup from the API — sanitize before rendering as HTML.
      matchedTranslationText: relevantTranslation ? relevantTranslation.text : null,
    };
  });

  return { totalResults: data.search.total_results, results };
}

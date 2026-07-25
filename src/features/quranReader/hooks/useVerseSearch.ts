import { useQuery } from '@tanstack/react-query';
import type { UseQueryResult } from '@tanstack/react-query';
import { searchVerses } from 'api/quran/searchClient';
import { getVerseArabicText } from 'api/quran/quranClient';
import { loadRootIndex, searchByRoot } from 'features/quranReader/services/rootSearch';
import { TRANSLATIONS } from 'constants/translations';
import { SEARCH_RESULTS_PER_PAGE } from 'constants/search';
import { SURAHS } from 'data/quran/surahs';
import type { SearchMode, TranslationSearchLanguage, VerseSearchResult } from 'types/search.types';

export interface VerseSearchData {
  totalResults: number;
  results: VerseSearchResult[];
}

const VERSE_KEY_PATTERN = /^(\d{1,3}):(\d{1,3})$/;

async function searchByAyahKey(query: string): Promise<VerseSearchData> {
  const match = VERSE_KEY_PATTERN.exec(query.trim());
  if (!match) return { totalResults: 0, results: [] };

  const surahId = Number(match[1]);
  const ayahNumber = Number(match[2]);
  const surah = SURAHS.find((item) => item.id === surahId);
  if (!surah || ayahNumber < 1 || ayahNumber > surah.versesCount) {
    return { totalResults: 0, results: [] };
  }

  const verseKey = `${surahId}:${ayahNumber}`;
  const textUthmani = await getVerseArabicText(verseKey);
  return {
    totalResults: 1,
    results: [{ verseKey, textUthmani, highlightedArabic: null, matchedTranslationText: null }],
  };
}

async function searchByTranslationLanguage(
  query: string,
  language: TranslationSearchLanguage | undefined
): Promise<VerseSearchData> {
  const languageTranslations = language
    ? TRANSLATIONS.filter((translation) => translation.languageCode === language && translation.source === 'quran.com')
    : [];
  const translationResourceIds = languageTranslations.map((translation) => Number(translation.sourceId));

  const data = await searchVerses(query, {
    translationResourceIds: translationResourceIds.length ? translationResourceIds : undefined,
    size: SEARCH_RESULTS_PER_PAGE,
  });

  // Defensive client-side filter — server-side language scoping isn't reliably documented,
  // so only keep results that actually resolved a matching-language translation.
  if (!language) return data;
  return { ...data, results: data.results.filter((result) => result.matchedTranslationText !== null) };
}

export default function useVerseSearch(
  mode: Exclude<SearchMode, 'surah'>,
  query: string,
  translationLanguage?: TranslationSearchLanguage
): UseQueryResult<VerseSearchData, Error> {
  const trimmed = query.trim();

  return useQuery({
    queryKey: ['quran', 'search', mode, trimmed, translationLanguage],
    queryFn: async (): Promise<VerseSearchData> => {
      if (mode === 'ayah') return searchByAyahKey(trimmed);

      if (mode === 'root') {
        const index = await loadRootIndex();
        return searchByRoot(trimmed, index, 1, SEARCH_RESULTS_PER_PAGE);
      }

      if (mode === 'translation') return searchByTranslationLanguage(trimmed, translationLanguage);

      return searchVerses(trimmed, { size: SEARCH_RESULTS_PER_PAGE });
    },
    enabled: trimmed.length >= 2,
  });
}

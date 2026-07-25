import type { SearchMode } from 'types/search.types';
import type { TranslationKey } from 'i18n';

export interface SearchModeOption {
  id: SearchMode;
  labelKey: TranslationKey;
  placeholderKey: TranslationKey;
}

export const SEARCH_MODES: SearchModeOption[] = [
  { id: 'surah', labelKey: 'quran.search.modeSurah', placeholderKey: 'quran.search.placeholderSurah' },
  { id: 'ayah', labelKey: 'quran.search.modeAyah', placeholderKey: 'quran.search.placeholderAyah' },
  { id: 'arabic', labelKey: 'quran.search.modeArabic', placeholderKey: 'quran.search.placeholderArabic' },
  { id: 'translation', labelKey: 'quran.search.modeTranslation', placeholderKey: 'quran.search.placeholderTranslation' },
  { id: 'root', labelKey: 'quran.search.modeRoot', placeholderKey: 'quran.search.placeholderRoot' },
];

export const SEARCH_RESULTS_PER_PAGE = 20;
export const SEARCH_SUGGESTIONS_LIMIT = 6;
export const SEARCH_DEBOUNCE_MS = 300;

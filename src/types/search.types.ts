export type SearchMode = 'surah' | 'ayah' | 'arabic' | 'translation' | 'root';
export type TranslationSearchLanguage = 'en' | 'ur';

export interface VerseSearchResult {
  verseKey: string;
  textUthmani: string;
  highlightedArabic: string | null;
  matchedTranslationText: string | null;
}

export type TranslationSource = 'quran.com' | 'alquran.cloud';
export type TafsirLanguage = 'ar' | 'en' | 'ur';

/**
 * Every interface language (constants/languages.ts) except 'ar' — a Quran
 * "translation into Arabic" isn't a real category, since Arabic is the
 * source text. Arabic-interface users read the original text directly; see
 * the hardening-phase-3 coverage audit for why this is a deliberate
 * omission, not a gap.
 */
export type TranslationLanguageCode = 'en' | 'ur' | 'fa' | 'fr' | 'id' | 'ms' | 'tr' | 'bn' | 'hi' | 'de';

export interface TranslationResource {
  id: string;
  label: string;
  authorName: string;
  languageCode: TranslationLanguageCode;
  source: TranslationSource;
  /** Quran.com numeric resource id, or an AlQuran Cloud edition identifier. */
  sourceId: string | number;
}

export interface TafsirResource {
  id: string;
  label: string;
  authorName: string;
  languageCode: TafsirLanguage;
  /**
   * 'youtube' covers scholars with no digitized tafsir text on either API
   * (e.g. Engineer Muhammad Ali Mirza, who publishes only as video lectures)
   * — sourceId is a search query, not an editing/resource id, and TafsirPage
   * renders a live YouTube search embed instead of fetching/sanitizing text.
   */
  source: TranslationSource | 'youtube';
  sourceId: string | number;
  /** Quran.com hosts some commentaries (e.g. Maududi) as a translation resource, not a dedicated tafsir resource. */
  quranComEndpoint?: 'tafsir' | 'translation';
}

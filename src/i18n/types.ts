import type { TranslationKey } from './locales/en';

export type { TranslationKey };

/**
 * Base names for pluralized keys. Each entry here must have matching
 * `<base>_one` and `<base>_other` keys (plus any extra CLDR categories a
 * given language needs, e.g. Arabic's `_few`/`_many`/`_two`) in every
 * locale file.
 */
export type PluralKey =
  | 'quran.versesCount'
  | 'quran.printVersesCount'
  | 'quran.search.resultsCount'
  | 'hadith.hadithsCount'
  | 'bookmarks.streakDays';

/**
 * `& Record<string, string>` lets a locale file declare extra CLDR plural
 * categories (e.g. Arabic's `_few`/`_two`) beyond the English `_one`/`_other`
 * baseline without TypeScript rejecting the extra keys as excess.
 */
export type LocaleDictionary = Record<TranslationKey, string> & Record<string, string>;

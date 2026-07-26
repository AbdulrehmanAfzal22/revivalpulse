import type { TranslationLanguageCode } from 'types/translation.types';

export interface TranslationAudioEdition {
  id: string;
  label: string;
  languageCode: TranslationLanguageCode;
  /** alquran.cloud "versebyverse" audio edition identifier — verified live against /ayah/1/{identifier}. */
  identifier: string;
}

/**
 * Curated, not exhaustive — alquran.cloud publishes exactly one verse-by-verse
 * audio edition per language for Urdu and English (checked live against
 * api.alquran.cloud/v1/edition?format=audio before wiring these).
 */
export const TRANSLATION_AUDIO_EDITIONS: TranslationAudioEdition[] = [
  {
    id: 'ur-khan',
    label: 'Shamshad Ali Khan',
    languageCode: 'ur',
    identifier: 'ur.khan',
  },
  {
    id: 'en-walk',
    label: 'Ibrahim Walk',
    languageCode: 'en',
    identifier: 'en.walk',
  },
];

export const DEFAULT_TRANSLATION_AUDIO_ID = 'ur-khan';

export function getTranslationAudioEditionById(id: string): TranslationAudioEdition | undefined {
  return TRANSLATION_AUDIO_EDITIONS.find((edition) => edition.id === id);
}

import { en } from './locales/en';
import { ar } from './locales/ar';
import { ur } from './locales/ur';
import { fa } from './locales/fa';
import { fr } from './locales/fr';
import { id } from './locales/id';
import { ms } from './locales/ms';
import { tr } from './locales/tr';
import { bn } from './locales/bn';
import { hi } from './locales/hi';
import { de } from './locales/de';
import type { LocaleDictionary } from './types';

const DICTIONARIES: Record<string, LocaleDictionary> = { en, ar, ur, fa, fr, id, ms, tr, bn, hi, de };

export function getDictionary(code: string): LocaleDictionary {
  return DICTIONARIES[code] ?? en;
}

export { en };
export type { TranslationKey } from './locales/en';
export type { PluralKey, LocaleDictionary } from './types';

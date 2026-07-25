import { LANGUAGES } from 'constants/languages';

export function isRTL(languageCode: string): boolean {
  return LANGUAGES.find((lang) => lang.code === languageCode)?.dir === 'rtl';
}

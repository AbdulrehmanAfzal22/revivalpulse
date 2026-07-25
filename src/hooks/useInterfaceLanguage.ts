import { useLanguageContext } from 'contexts/LanguageContext';
import type { LanguageContextValue } from 'types/language.types';

export default function useInterfaceLanguage(): LanguageContextValue {
  return useLanguageContext();
}

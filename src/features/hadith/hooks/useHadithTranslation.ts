import { useQuery } from '@tanstack/react-query';
import {
  getHadithTranslation,
  getHadithTranslationLanguages,
  type HadithTranslation,
  type HadithTranslationLanguage,
} from 'features/hadith/services/hadithTranslationClient';

export default function useHadithTranslationLanguages(bookSlug: string) {
  return useQuery<HadithTranslationLanguage[], Error>({
    queryKey: ['hadith', 'translation-languages', bookSlug],
    queryFn: () => getHadithTranslationLanguages(bookSlug),
    staleTime: Infinity,
    gcTime: Infinity,
  });
}

export function useHadithTranslation(
  bookSlug: string,
  language: HadithTranslationLanguage | undefined
) {
  return useQuery<Record<number, HadithTranslation>, Error>({
    queryKey: ['hadith', 'translation', bookSlug, language?.editionId],
    queryFn: () => getHadithTranslation(bookSlug, language as HadithTranslationLanguage),
    enabled: Boolean(language && language.code !== 'eng'),
    staleTime: Infinity,
    gcTime: Infinity,
  });
}

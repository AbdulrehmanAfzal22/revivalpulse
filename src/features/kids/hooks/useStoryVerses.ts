import { useQueries } from '@tanstack/react-query';
import { getSingleTranslationText, getVerseArabicText } from 'api/quran/quranClient';

const SAHEEH_INTERNATIONAL_SOURCE_ID = 20;

export interface StoryVerse {
  verseKey: string;
  arabic: string;
  translation: string;
}

export interface UseStoryVersesResult {
  verses: StoryVerse[];
  isPending: boolean;
  isError: boolean;
}

/** Fetches real Arabic + translation for each verse key, live — see data/kids/stories.ts. */
export default function useStoryVerses(verseKeys: string[]): UseStoryVersesResult {
  const results = useQueries({
    queries: verseKeys.map((verseKey) => ({
      queryKey: ['kidsStoryVerse', verseKey],
      queryFn: async (): Promise<StoryVerse> => {
        const [arabic, translation] = await Promise.all([
          getVerseArabicText(verseKey),
          getSingleTranslationText(SAHEEH_INTERNATIONAL_SOURCE_ID, verseKey),
        ]);
        return { verseKey, arabic, translation };
      },
      staleTime: 1000 * 60 * 60,
    })),
  });

  return {
    verses: results.map((r) => r.data).filter((v): v is StoryVerse => Boolean(v)),
    isPending: results.some((r) => r.isPending),
    isError: results.some((r) => r.isError),
  };
}

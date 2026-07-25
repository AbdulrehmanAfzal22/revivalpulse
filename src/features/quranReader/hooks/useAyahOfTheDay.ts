import { useQuery } from '@tanstack/react-query';
import type { UseQueryResult } from '@tanstack/react-query';
import { getSingleTranslationText, getVerseArabicText } from 'api/quran/quranClient';
import { getVerseKeyForDay } from 'features/quranReader/services/ayahOfTheDay';

const SAHEEH_INTERNATIONAL_SOURCE_ID = 20;

export interface AyahOfTheDay {
  verseKey: string;
  arabic: string;
  translation: string;
}

export default function useAyahOfTheDay(): UseQueryResult<AyahOfTheDay, Error> {
  const today = new Date();
  const dateKey = `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`;
  const verseKey = getVerseKeyForDay(today);

  return useQuery({
    queryKey: ['ayahOfTheDay', dateKey],
    queryFn: async () => {
      const [arabic, translation] = await Promise.all([
        getVerseArabicText(verseKey),
        getSingleTranslationText(SAHEEH_INTERNATIONAL_SOURCE_ID, verseKey),
      ]);
      return { verseKey, arabic, translation };
    },
    staleTime: 1000 * 60 * 60,
  });
}

import { useQuery } from '@tanstack/react-query';
import type { UseQueryResult } from '@tanstack/react-query';
import { getVerseArabicText } from 'api/quran/quranClient';

export default function useVerseArabicText(verseKey: string): UseQueryResult<string, Error> {
  return useQuery({
    queryKey: ['quran', 'verseArabicText', verseKey],
    queryFn: () => getVerseArabicText(verseKey),
    enabled: Boolean(verseKey),
  });
}

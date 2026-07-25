import { useQuery } from '@tanstack/react-query';
import type { UseQueryResult } from '@tanstack/react-query';
import DOMPurify from 'dompurify';
import { fetchTafsirText } from 'features/quranReader/services/tafsirAggregator';

export default function useAyahTafsir(tafsirId: string, verseKey: string): UseQueryResult<string, Error> {
  return useQuery({
    queryKey: ['quran', 'tafsir', tafsirId, verseKey],
    queryFn: async () => {
      const raw = await fetchTafsirText(tafsirId, verseKey);
      return DOMPurify.sanitize(raw);
    },
    enabled: Boolean(tafsirId && verseKey),
  });
}

import { useQuery } from '@tanstack/react-query';
import type { UseQueryResult } from '@tanstack/react-query';
import { fetchChapterWithTranslations } from 'features/quranReader/services/translationAggregator';
import type { Ayah } from 'types/quran.types';

export default function useChapterVerses(
  chapterId: number,
  translationIds: string[]
): UseQueryResult<Ayah[], Error> {
  const sortedIds = [...translationIds].sort();

  return useQuery({
    queryKey: ['quran', 'chapterVerses', chapterId, sortedIds],
    queryFn: () => fetchChapterWithTranslations(chapterId, sortedIds),
    enabled: Number.isInteger(chapterId) && chapterId >= 1 && chapterId <= 114,
  });
}

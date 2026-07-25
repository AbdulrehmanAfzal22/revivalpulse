import { useQuery } from '@tanstack/react-query';
import type { UseQueryResult } from '@tanstack/react-query';
import { getSurahMorphology } from 'api/quran/morphologyClient';
import type { WordMorphology } from 'types/word.types';

export default function useWordMorphology(surahId: number): UseQueryResult<Record<string, WordMorphology>, Error> {
  return useQuery({
    queryKey: ['quran', 'morphology', surahId],
    queryFn: () => getSurahMorphology(surahId),
    staleTime: Infinity,
    gcTime: 1000 * 60 * 60 * 24 * 30,
  });
}

import { useQuery } from '@tanstack/react-query';
import type { UseQueryResult } from '@tanstack/react-query';
import { getAlphabetLetters } from 'api/kids/kidsAlphabetClient';
import type { AlphabetLetter } from 'types/kids.types';

export default function useAlphabetLetters(): UseQueryResult<AlphabetLetter[], Error> {
  return useQuery({
    queryKey: ['kidsAlphabet'],
    queryFn: getAlphabetLetters,
    staleTime: Infinity,
  });
}

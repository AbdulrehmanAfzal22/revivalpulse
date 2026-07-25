import { useQuery } from '@tanstack/react-query';
import type { UseQueryResult } from '@tanstack/react-query';
import { getDivineNames } from 'api/namesOfAllah/namesOfAllahClient';
import type { DivineName } from 'types/namesOfAllah.types';

export default function useDivineNames(): UseQueryResult<DivineName[], Error> {
  return useQuery({
    queryKey: ['namesOfAllah'],
    queryFn: getDivineNames,
    staleTime: Infinity,
  });
}

import { useQuery } from '@tanstack/react-query';
import type { UseQueryResult } from '@tanstack/react-query';
import { getAllDuas } from 'api/duas/duasClient';
import type { DuaItem } from 'types/duas.types';

export default function useDuas(): UseQueryResult<DuaItem[], Error> {
  return useQuery({
    queryKey: ['duas'],
    queryFn: getAllDuas,
    staleTime: Infinity,
  });
}

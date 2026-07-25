import { useQuery } from '@tanstack/react-query';
import type { UseQueryResult } from '@tanstack/react-query';
import { getUpcomingMajorEvents } from 'features/islamicCalendar/services/islamicEvents';
import type { IslamicEvent } from 'types/islamicCalendar.types';

export default function useUpcomingIslamicEvents(
  currentHijriYear: number | undefined,
  limit: number
): UseQueryResult<IslamicEvent[], Error> {
  return useQuery({
    queryKey: ['islamicCalendar', 'upcomingEvents', currentHijriYear, limit],
    queryFn: () => getUpcomingMajorEvents(currentHijriYear as number, limit),
    enabled: currentHijriYear !== undefined,
    staleTime: 1000 * 60 * 60,
  });
}

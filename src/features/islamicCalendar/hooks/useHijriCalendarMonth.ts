import { useQuery } from '@tanstack/react-query';
import type { UseQueryResult } from '@tanstack/react-query';
import { getHijriCalendarForMonth } from 'api/islamicCalendar/islamicCalendarClient';
import type { CalendarDay } from 'types/islamicCalendar.types';

export default function useHijriCalendarMonth(month: number, year: number): UseQueryResult<CalendarDay[], Error> {
  return useQuery({
    queryKey: ['islamicCalendar', 'month', month, year],
    queryFn: () => getHijriCalendarForMonth(month, year),
    staleTime: 1000 * 60 * 60,
  });
}

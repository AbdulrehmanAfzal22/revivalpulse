import { useQuery } from '@tanstack/react-query';
import type { UseQueryResult } from '@tanstack/react-query';
import { getHijriDateForToday } from 'api/islamicCalendar/islamicCalendarClient';
import type { CalendarDay } from 'types/islamicCalendar.types';

export default function useTodayHijriDate(): UseQueryResult<CalendarDay, Error> {
  const today = new Date();
  const dateKey = `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`;

  return useQuery({
    queryKey: ['islamicCalendar', 'today', dateKey],
    queryFn: () => getHijriDateForToday(today),
    staleTime: 1000 * 60 * 60,
  });
}

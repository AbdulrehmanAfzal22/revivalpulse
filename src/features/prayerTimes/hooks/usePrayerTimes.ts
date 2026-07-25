import { useQuery } from '@tanstack/react-query';
import type { UseQueryResult } from '@tanstack/react-query';
import { getPrayerTimings } from 'api/prayerTimes/prayerTimesClient';
import type { Coordinates, PrayerTimesResult } from 'types/prayerTimes.types';

export default function usePrayerTimes(
  coordinates: Coordinates | null,
  methodId: number
): UseQueryResult<PrayerTimesResult, Error> {
  const today = new Date();
  const dateKey = `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`;

  return useQuery({
    queryKey: ['prayerTimes', coordinates?.latitude, coordinates?.longitude, methodId, dateKey],
    queryFn: () => getPrayerTimings(coordinates as Coordinates, methodId, today),
    enabled: coordinates !== null,
    staleTime: 1000 * 60 * 30,
  });
}

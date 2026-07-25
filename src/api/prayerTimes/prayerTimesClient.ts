import { PRAYER_TIMES_API_BASE_URL } from 'constants/prayerTimesApi';
import { useDevModeStore } from 'stores/devModeStore';
import { MOCK_PRAYER_TIMES } from 'features/devMode/services/mockData';
import type { Coordinates, PrayerTimesResult } from 'types/prayerTimes.types';

interface RawTimingsResponse {
  code: number;
  data: {
    timings: Record<string, string>;
    date: {
      readable: string;
      hijri: { date: string };
    };
    meta: {
      timezone: string;
      method: { name: string };
    };
  };
}

/** Timings come back as "HH:mm (TZ)" or "HH:mm" — strip any trailing zone suffix. */
function cleanTime(value: string): string {
  return value.split(' ')[0] ?? value;
}

export async function getPrayerTimings(
  coordinates: Coordinates,
  methodId: number,
  date: Date = new Date()
): Promise<PrayerTimesResult> {
  if (useDevModeStore.getState().flags.mockDataMode) {
    return MOCK_PRAYER_TIMES;
  }

  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();

  const params = new URLSearchParams({
    latitude: String(coordinates.latitude),
    longitude: String(coordinates.longitude),
    method: String(methodId),
  });

  const url = `${PRAYER_TIMES_API_BASE_URL}/timings/${day}-${month}-${year}?${params.toString()}`;
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to load prayer times (status ${response.status})`);
  }

  const data = (await response.json()) as RawTimingsResponse;
  const { timings, date: dateInfo, meta } = data.data;

  return {
    timings: {
      Fajr: cleanTime(timings.Fajr ?? ''),
      Sunrise: cleanTime(timings.Sunrise ?? ''),
      Dhuhr: cleanTime(timings.Dhuhr ?? ''),
      Asr: cleanTime(timings.Asr ?? ''),
      Maghrib: cleanTime(timings.Maghrib ?? ''),
      Isha: cleanTime(timings.Isha ?? ''),
    },
    timezone: meta.timezone,
    dateGregorian: dateInfo.readable,
    dateHijri: dateInfo.hijri.date,
    methodName: meta.method.name,
  };
}

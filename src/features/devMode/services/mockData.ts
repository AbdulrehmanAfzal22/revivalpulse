import type { PrayerTimesResult } from 'types/prayerTimes.types';

/**
 * Demonstrates the mock-data-mode pattern for one client (prayer times —
 * the simplest response shape to fake convincingly) rather than covering
 * every API client in this app; see api/prayerTimes/prayerTimesClient.ts
 * for where this plugs in, gated on stores/devModeStore's mockDataMode flag.
 */
export const MOCK_PRAYER_TIMES: PrayerTimesResult = {
  timings: { Fajr: '05:00', Sunrise: '06:24', Dhuhr: '12:15', Asr: '15:45', Maghrib: '18:32', Isha: '20:02' },
  timezone: 'UTC',
  dateGregorian: '01 Jan 2026',
  dateHijri: '11-07-1447',
  methodName: 'Mock Data (Developer Mode)',
};

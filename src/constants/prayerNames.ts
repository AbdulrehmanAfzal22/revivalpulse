import type { PrayerName } from 'types/prayerTimes.types';

/** Display order. Sunrise is shown for reference but isn't a prayer — excluded from "current prayer" logic. */
export const PRAYER_DISPLAY_ORDER: PrayerName[] = ['Fajr', 'Sunrise', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'];

export const PRAYERS: PrayerName[] = ['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'];

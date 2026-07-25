export interface Coordinates {
  latitude: number;
  longitude: number;
}

export type PrayerName = 'Fajr' | 'Sunrise' | 'Dhuhr' | 'Asr' | 'Maghrib' | 'Isha';

export type PrayerTimings = Record<PrayerName, string>;

export interface PrayerTimesResult {
  timings: PrayerTimings;
  timezone: string;
  dateGregorian: string;
  dateHijri: string;
  methodName: string;
}

export interface CalculationMethod {
  id: number;
  code: string;
  name: string;
}

export type LocationSource = 'geolocation' | 'manual';

export interface PrayerLocation extends Coordinates {
  label: string;
  source: LocationSource;
}

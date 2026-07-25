import { PRAYER_TIMES_API_BASE_URL } from 'constants/prayerTimesApi';
import type { CalendarDay, GregorianDate, HijriDate } from 'types/islamicCalendar.types';

/** Same provider as Phase 11's prayer times (api.aladhan.com) — this just uses its calendar endpoints. */
const ALADHAN_BASE_URL = PRAYER_TIMES_API_BASE_URL;

interface RawHijri {
  day: string;
  weekday: { en: string; ar: string };
  month: { number: number; en: string; ar: string; days: number };
  year: string;
  holidays: string[];
}

interface RawGregorian {
  day: string;
  weekday: { en: string };
  month: { number: number; en: string };
  year: string;
}

interface RawCalendarEntry {
  hijri: RawHijri;
  gregorian: RawGregorian;
}

function mapHijri(raw: RawHijri): HijriDate {
  return {
    day: Number(raw.day),
    month: raw.month,
    year: Number(raw.year),
    weekdayEn: raw.weekday.en,
    weekdayAr: raw.weekday.ar,
  };
}

function mapGregorian(raw: RawGregorian): GregorianDate {
  return {
    day: Number(raw.day),
    month: raw.month.number,
    monthNameEn: raw.month.en,
    year: Number(raw.year),
    weekdayEn: raw.weekday.en,
  };
}

function pad(value: number): string {
  return String(value).padStart(2, '0');
}

/** Hijri equivalent of one Gregorian date — used for the "Islamic Date" home widget. */
export async function getHijriDateForToday(date: Date = new Date()): Promise<CalendarDay> {
  const url = `${ALADHAN_BASE_URL}/gToH/${pad(date.getDate())}-${pad(date.getMonth() + 1)}-${date.getFullYear()}`;
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to load today's Hijri date (status ${response.status})`);
  }
  const data = (await response.json()) as { data: RawCalendarEntry };
  return {
    hijri: mapHijri(data.data.hijri),
    gregorian: mapGregorian(data.data.gregorian),
    events: data.data.hijri.holidays,
  };
}

/** Gregorian equivalent of one Hijri date — used to place static events (data/islamicCalendar/index.ts) on the calendar. */
export async function getGregorianForHijri(day: number, month: number, year: number): Promise<GregorianDate> {
  const url = `${ALADHAN_BASE_URL}/hToG/${pad(day)}-${pad(month)}-${year}`;
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to convert ${day}-${month}-${year} AH (status ${response.status})`);
  }
  const data = (await response.json()) as { data: RawCalendarEntry };
  return mapGregorian(data.data.gregorian);
}

/** Full Gregorian-month grid with each day's Hijri equivalent, for the calendar page. */
export async function getHijriCalendarForMonth(month: number, year: number): Promise<CalendarDay[]> {
  const url = `${ALADHAN_BASE_URL}/gToHCalendar/${month}/${year}`;
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to load calendar for ${month}/${year} (status ${response.status})`);
  }
  const data = (await response.json()) as { data: RawCalendarEntry[] };
  return data.data.map((entry) => ({
    hijri: mapHijri(entry.hijri),
    gregorian: mapGregorian(entry.gregorian),
    events: entry.hijri.holidays,
  }));
}

export interface RawHolidayDay {
  hijriDay: number;
  hijriMonth: number;
  gregorian: GregorianDate;
  names: string[];
}

/**
 * Every named day in a Hijri year, deduped by (date, name) — AlAdhan's own
 * feed returns literal duplicate rows for some dates (verified: e.g. Eid
 * al-Adha appears 2-3x for the same date with the same name).
 */
export async function getHolidaysForHijriYear(hijriYear: number): Promise<RawHolidayDay[]> {
  const url = `${ALADHAN_BASE_URL}/islamicHolidaysByHijriYear/${hijriYear}`;
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to load Islamic holidays for ${hijriYear} AH (status ${response.status})`);
  }
  const data = (await response.json()) as { data: RawCalendarEntry[] };

  const byDate = new Map<string, RawHolidayDay>();
  for (const entry of data.data) {
    const key = `${entry.hijri.month.number}-${entry.hijri.day}`;
    const existing = byDate.get(key);
    const namesSet = new Set([...(existing?.names ?? []), ...entry.hijri.holidays]);
    byDate.set(key, {
      hijriDay: Number(entry.hijri.day),
      hijriMonth: entry.hijri.month.number,
      gregorian: mapGregorian(entry.gregorian),
      names: Array.from(namesSet),
    });
  }
  return Array.from(byDate.values());
}

import { PRAYERS } from 'constants/prayerNames';
import type { PrayerName, PrayerTimings } from 'types/prayerTimes.types';

export function parseMinutes(hhmm: string): number {
  const [hours, minutes] = hhmm.split(':').map(Number);
  return (hours ?? 0) * 60 + (minutes ?? 0);
}

/**
 * Minutes since midnight, evaluated in `timezone` (IANA), not the browser's
 * local zone — required because a manually-overridden location can be in a
 * different timezone than the device, and prayer times are meaningless
 * compared against the wrong clock.
 */
export function nowMinutesInTimezone(timezone: string): number {
  const parts = new Intl.DateTimeFormat('en-GB', {
    timeZone: timezone,
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).formatToParts(new Date());

  const hour = Number(parts.find((part) => part.type === 'hour')?.value ?? '0');
  const minute = Number(parts.find((part) => part.type === 'minute')?.value ?? '0');
  return hour * 60 + minute;
}

export interface CurrentPrayerInfo {
  /** null before the first prayer (Fajr) of the day. */
  current: PrayerName | null;
  next: PrayerName;
  minutesUntilNext: number;
}

export function getCurrentPrayerInfo(timings: PrayerTimings, timezone: string): CurrentPrayerInfo {
  const nowMinutes = nowMinutesInTimezone(timezone);
  const entries = PRAYERS.map((name) => ({ name, minutes: parseMinutes(timings[name]) }));

  let currentIndex = -1;
  entries.forEach((entry, index) => {
    if (nowMinutes >= entry.minutes) currentIndex = index;
  });

  // currentIndex/nextIndex are always valid indices into `entries` (fixed-length,
  // matching PRAYERS) by construction, so these lookups can't actually be undefined.
  const first = entries[0] as (typeof entries)[number];
  const current = currentIndex === -1 ? null : (entries[currentIndex] as (typeof entries)[number]).name;
  const wrapsToTomorrow = currentIndex === entries.length - 1;
  const nextIndex = wrapsToTomorrow ? 0 : currentIndex + 1;
  const nextEntry = entries[nextIndex] as (typeof entries)[number];
  const next = nextEntry.name;
  const minutesUntilNext = wrapsToTomorrow
    ? first.minutes + 24 * 60 - nowMinutes
    : nextEntry.minutes - nowMinutes;

  return { current, next, minutesUntilNext };
}

export interface CountdownParts {
  hours: number;
  minutes: number;
}

/** Returns the raw parts — callers render the translated "Xh Ym" / "Ym" string via useTranslation(). */
export function getCountdownParts(totalMinutes: number): CountdownParts {
  return { hours: Math.floor(totalMinutes / 60), minutes: totalMinutes % 60 };
}

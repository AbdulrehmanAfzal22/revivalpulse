import {
  getGregorianForHijri,
  getHolidaysForHijriYear,
} from 'api/islamicCalendar/islamicCalendarClient';
import { isMajorIslamicEvent, STATIC_EVENTS } from 'data/islamicCalendar';
import type { IslamicEvent } from 'types/islamicCalendar.types';

function gregorianTimestamp(event: IslamicEvent): number {
  return new Date(event.gregorian.year, event.gregorian.month - 1, event.gregorian.day).getTime();
}

/** Major events (data/islamicCalendar/index.ts allow-list) for one Hijri year, sorted chronologically. */
export async function getMajorEventsForHijriYear(hijriYear: number): Promise<IslamicEvent[]> {
  const holidays = await getHolidaysForHijriYear(hijriYear);

  const fromFeed: IslamicEvent[] = holidays.flatMap((day) =>
    day.names
      .filter(isMajorIslamicEvent)
      .map((name) => ({ name, hijriDay: day.hijriDay, hijriMonth: day.hijriMonth, gregorian: day.gregorian }))
  );

  const staticEvents = await Promise.all(
    STATIC_EVENTS.map(async (event) => ({
      name: event.name,
      hijriDay: event.hijriDay,
      hijriMonth: event.hijriMonth,
      gregorian: await getGregorianForHijri(event.hijriDay, event.hijriMonth, hijriYear),
    }))
  );

  return [...fromFeed, ...staticEvents].sort((a, b) => gregorianTimestamp(a) - gregorianTimestamp(b));
}

/** Upcoming events starting today, spanning into next Hijri year if the current one runs out. */
export async function getUpcomingMajorEvents(currentHijriYear: number, limit: number): Promise<IslamicEvent[]> {
  const [thisYear, nextYear] = await Promise.all([
    getMajorEventsForHijriYear(currentHijriYear),
    getMajorEventsForHijriYear(currentHijriYear + 1),
  ]);

  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);

  return [...thisYear, ...nextYear]
    .filter((event) => gregorianTimestamp(event) >= startOfToday.getTime())
    .sort((a, b) => gregorianTimestamp(a) - gregorianTimestamp(b))
    .slice(0, limit);
}

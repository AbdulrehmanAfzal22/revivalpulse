import { PRAYERS } from 'constants/prayerNames';
import { nowMinutesInTimezone, parseMinutes } from 'features/prayerTimes/services/prayerTimeCalculations';
import type { PrayerName, PrayerTimesResult } from 'types/prayerTimes.types';

let scheduledTimers: ReturnType<typeof setTimeout>[] = [];

export function clearScheduledNotifications(): void {
  scheduledTimers.forEach((timer) => clearTimeout(timer));
  scheduledTimers = [];
}

const PRAYER_NOTIFICATION_BODY: Partial<Record<PrayerName, string>> = {
  Fajr: "It's time for Fajr prayer.",
  Dhuhr: "It's time for Dhuhr prayer.",
  Asr: "It's time for Asr prayer.",
  Maghrib: "It's time for Maghrib prayer.",
  Isha: "It's time for Isha prayer.",
};

function notifyPrayer(prayer: PrayerName): void {
  if (typeof window === 'undefined' || !('Notification' in window) || Notification.permission !== 'granted') return;
  // eslint-disable-next-line no-new -- fire-and-forget browser notification, nothing to hold a reference to
  new Notification(`${prayer} — Prayer Time`, {
    body: PRAYER_NOTIFICATION_BODY[prayer] ?? `It's time for ${prayer}.`,
    tag: `prayer-${prayer}`,
  });
}

/**
 * Schedules a browser Notification for each enabled prayer still upcoming
 * today, from already-fetched prayer times — plain setTimeout, foreground
 * only. There's no push server behind this (that would need real backend
 * infrastructure this project doesn't have), so it only fires while this
 * tab is open, matching the honest scope of every other "sync while open"
 * piece in this app (e.g. the tasbeeh offline queue's online-event fallback).
 */
export function scheduleTodayNotifications(timings: PrayerTimesResult, enabledPrayers: PrayerName[]): void {
  clearScheduledNotifications();
  const nowMinutes = nowMinutesInTimezone(timings.timezone);

  for (const prayer of PRAYERS) {
    if (!enabledPrayers.includes(prayer)) continue;
    const targetMinutes = parseMinutes(timings.timings[prayer]);
    const minutesUntil = targetMinutes - nowMinutes;
    if (minutesUntil <= 0) continue;

    const timer = setTimeout(() => notifyPrayer(prayer), minutesUntil * 60 * 1000);
    scheduledTimers.push(timer);
  }
}

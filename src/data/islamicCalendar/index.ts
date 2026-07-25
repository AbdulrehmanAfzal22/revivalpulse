/**
 * AlAdhan's islamicHolidaysByHijriYear feed (api/islamicCalendar/islamicCalendarClient.ts)
 * returns ~80 named days per year, most of them regional/scholarly "Urs"
 * (death-anniversary) observances tied to one particular tradition rather
 * than universally marked. Filtering to this curated allow-list keeps the
 * calendar to the handful of events most Islamic-calendar apps show —
 * verified live against api.aladhan.com/v1/islamicHolidaysByHijriYear/1448
 * before picking these keywords.
 */
export const MAJOR_EVENT_KEYWORDS: string[] = [
  'Mawlid',
  'Miraj',
  'Ramadan',
  'Qadr',
  'Eid-ul-Fitr',
  'Eid-ul-Adha',
  'Ashura',
  'Arafa',
];

/**
 * AlAdhan's holiday feed doesn't tag 1 Muharram as "Islamic New Year" (it
 * returns an unrelated scholar's birthday for that date instead) — this is
 * a fixed calendrical fact, not sourced content, so it's safe to hardcode
 * rather than needing verification the way actual event text would.
 */
export const STATIC_EVENTS: { hijriDay: number; hijriMonth: number; name: string }[] = [
  { hijriDay: 1, hijriMonth: 1, name: 'Islamic New Year' },
];

export function isMajorIslamicEvent(name: string): boolean {
  return MAJOR_EVENT_KEYWORDS.some((keyword) => name.toLowerCase().includes(keyword.toLowerCase()));
}

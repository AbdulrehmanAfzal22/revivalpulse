export interface HijriMonthInfo {
  number: number;
  en: string;
  ar: string;
  days: number;
}

export interface HijriDate {
  day: number;
  month: HijriMonthInfo;
  year: number;
  weekdayEn: string;
  weekdayAr: string;
}

export interface GregorianDate {
  day: number;
  month: number;
  monthNameEn: string;
  year: number;
  weekdayEn: string;
}

export interface CalendarDay {
  hijri: HijriDate;
  gregorian: GregorianDate;
  /** Already deduped + filtered to the curated major-event allow-list (data/islamicCalendar/index.ts). */
  events: string[];
}

export interface IslamicEvent {
  name: string;
  hijriDay: number;
  hijriMonth: number;
  gregorian: GregorianDate;
}

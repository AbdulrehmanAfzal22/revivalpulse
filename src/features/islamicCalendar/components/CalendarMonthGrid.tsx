import Typography from 'components/ui/Typography';
import type { CalendarDay } from 'types/islamicCalendar.types';
import useTranslation from 'hooks/useTranslation';
import type { TranslationKey } from 'i18n';
import styles from './CalendarMonthGrid.module.css';

export interface CalendarMonthGridProps {
  days: CalendarDay[];
  todayGregorianDay: number | null;
}

const WEEKDAY_HEADER_KEYS: TranslationKey[] = [
  'islamicCalendar.weekday.sun',
  'islamicCalendar.weekday.mon',
  'islamicCalendar.weekday.tue',
  'islamicCalendar.weekday.wed',
  'islamicCalendar.weekday.thu',
  'islamicCalendar.weekday.fri',
  'islamicCalendar.weekday.sat',
];
const WEEKDAY_INDEX: Record<string, number> = {
  Sunday: 0,
  Monday: 1,
  Tuesday: 2,
  Wednesday: 3,
  Thursday: 4,
  Friday: 5,
  Saturday: 6,
};

export default function CalendarMonthGrid({ days, todayGregorianDay }: CalendarMonthGridProps) {
  const firstDay = days[0];
  const leadingBlanks = firstDay ? (WEEKDAY_INDEX[firstDay.gregorian.weekdayEn] ?? 0) : 0;
  const { t } = useTranslation();

  return (
    <div className={styles.grid}>
      {WEEKDAY_HEADER_KEYS.map((key) => (
        <Typography key={key} variant="caption" muted className={styles.headerCell}>
          {t(key)}
        </Typography>
      ))}

      {Array.from({ length: leadingBlanks }, (_, index) => (
        <span key={`blank-${index}`} className={styles.blankCell} />
      ))}

      {days.map((day) => {
        const hasEvent = day.events.length > 0;
        const isToday = day.gregorian.day === todayGregorianDay;
        return (
          <div
            key={`${day.gregorian.year}-${day.gregorian.month}-${day.gregorian.day}`}
            className={[styles.dayCell, isToday && styles.today, hasEvent && styles.hasEvent]
              .filter(Boolean)
              .join(' ')}
            title={hasEvent ? day.events.join(', ') : undefined}
          >
            <span className={styles.gregorianDay}>{day.gregorian.day}</span>
            <span className={styles.hijriDay}>
              {day.hijri.day} <span className={styles.hijriMonth}>{day.hijri.month.en}</span>
            </span>
          </div>
        );
      })}
    </div>
  );
}

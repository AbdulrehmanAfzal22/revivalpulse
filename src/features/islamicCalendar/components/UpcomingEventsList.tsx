import Typography from 'components/ui/Typography';
import type { IslamicEvent } from 'types/islamicCalendar.types';
import useTranslation from 'hooks/useTranslation';
import type { TranslationKey } from 'i18n';
import styles from './UpcomingEventsList.module.css';

export interface UpcomingEventsListProps {
  events: IslamicEvent[];
}

const HIJRI_MONTH_NAME_KEYS: TranslationKey[] = [
  'islamicCalendar.hijriMonth.muharram',
  'islamicCalendar.hijriMonth.safar',
  'islamicCalendar.hijriMonth.rabiAlAwwal',
  'islamicCalendar.hijriMonth.rabiAlThani',
  'islamicCalendar.hijriMonth.jumadaAlAwwal',
  'islamicCalendar.hijriMonth.jumadaAlThani',
  'islamicCalendar.hijriMonth.rajab',
  'islamicCalendar.hijriMonth.shaban',
  'islamicCalendar.hijriMonth.ramadan',
  'islamicCalendar.hijriMonth.shawwal',
  'islamicCalendar.hijriMonth.dhuAlQidah',
  'islamicCalendar.hijriMonth.dhuAlHijjah',
];

function daysUntil(event: IslamicEvent): number {
  const target = new Date(event.gregorian.year, event.gregorian.month - 1, event.gregorian.day);
  target.setHours(0, 0, 0, 0);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return Math.round((target.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
}

export default function UpcomingEventsList({ events }: UpcomingEventsListProps) {
  const { t } = useTranslation();

  return (
    <ul className={styles.list}>
      {events.map((event) => {
        const remaining = daysUntil(event);
        const monthKey = HIJRI_MONTH_NAME_KEYS[event.hijriMonth - 1];
        const hijriMonthName = monthKey ? t(monthKey) : '';
        return (
          <li
            key={`${event.name}-${event.gregorian.year}-${event.gregorian.month}-${event.gregorian.day}`}
            className={styles.item}
          >
            <div>
              <Typography variant="body">{event.name}</Typography>
              <Typography variant="caption" muted>
                {event.hijriDay} {hijriMonthName} · {event.gregorian.monthNameEn} {event.gregorian.day},{' '}
                {event.gregorian.year}
              </Typography>
            </div>
            <span className={styles.countdown}>
              {remaining === 0 ? t('islamicCalendar.eventToday') : t('islamicCalendar.eventDaysAway', { count: remaining })}
            </span>
          </li>
        );
      })}
    </ul>
  );
}

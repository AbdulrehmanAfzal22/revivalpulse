import { useState } from 'react';
import { ChevronLeft, ChevronRight, RotateCw } from 'lucide-react';
import Typography from 'components/ui/Typography';
import Button from 'components/ui/Button';
import Skeleton from 'components/ui/Skeleton';
import EmptyState from 'components/feedback/EmptyState';
import useHijriCalendarMonth from 'features/islamicCalendar/hooks/useHijriCalendarMonth';
import useTodayHijriDate from 'features/islamicCalendar/hooks/useTodayHijriDate';
import useUpcomingIslamicEvents from 'features/islamicCalendar/hooks/useUpcomingIslamicEvents';
import CalendarMonthGrid from 'features/islamicCalendar/components/CalendarMonthGrid';
import UpcomingEventsList from 'features/islamicCalendar/components/UpcomingEventsList';
import useTranslation from 'hooks/useTranslation';
import type { TranslationKey } from 'i18n';
import styles from './IslamicCalendarPage.module.css';

const MONTH_NAME_KEYS: TranslationKey[] = [
  'islamicCalendar.month.january',
  'islamicCalendar.month.february',
  'islamicCalendar.month.march',
  'islamicCalendar.month.april',
  'islamicCalendar.month.may',
  'islamicCalendar.month.june',
  'islamicCalendar.month.july',
  'islamicCalendar.month.august',
  'islamicCalendar.month.september',
  'islamicCalendar.month.october',
  'islamicCalendar.month.november',
  'islamicCalendar.month.december',
];

export default function IslamicCalendarPage() {
  const now = new Date();
  const [viewedMonth, setViewedMonth] = useState(now.getMonth() + 1);
  const [viewedYear, setViewedYear] = useState(now.getFullYear());
  const { t } = useTranslation();

  const today = useTodayHijriDate();
  const monthCalendar = useHijriCalendarMonth(viewedMonth, viewedYear);
  const upcomingEvents = useUpcomingIslamicEvents(today.data?.hijri.year, 6);

  const isCurrentMonth = viewedMonth === now.getMonth() + 1 && viewedYear === now.getFullYear();

  function goToPreviousMonth() {
    if (viewedMonth === 1) {
      setViewedMonth(12);
      setViewedYear((year) => year - 1);
    } else {
      setViewedMonth((month) => month - 1);
    }
  }

  function goToNextMonth() {
    if (viewedMonth === 12) {
      setViewedMonth(1);
      setViewedYear((year) => year + 1);
    } else {
      setViewedMonth((month) => month + 1);
    }
  }

  return (
    <div className={styles.page}>
        <Typography variant="h2" className={styles.title}>{t('islamicCalendar.title')}</Typography>

        {today.data && (
          <div className={styles.todayRow}>
            <Typography variant="h3" as="p" className={styles.todayHijri}>
              {t('islamicCalendar.hijriDateAH', {
                day: today.data.hijri.day,
                month: today.data.hijri.month.en,
                year: today.data.hijri.year,
              })}
            </Typography>
            <Typography variant="body" muted className={styles.todayGregorian}>
              {t('islamicCalendar.gregorianDate', {
                weekday: today.data.gregorian.weekdayEn,
                month: today.data.gregorian.monthNameEn,
                day: today.data.gregorian.day,
                year: today.data.gregorian.year,
              })}
            </Typography>
          </div>
        )}

      <div className={styles.monthHeader}>
        <Typography variant="h4" as="p" className={styles.monthTitle}>
          {t(MONTH_NAME_KEYS[viewedMonth - 1] as TranslationKey)} {viewedYear}
        </Typography>
        <div className={styles.monthNav}>
          <Button variant="icon" aria-label={t('islamicCalendar.previousMonth')} onClick={goToPreviousMonth} leadingIcon={<ChevronLeft size={18} />} />
          <Button variant="icon" aria-label={t('islamicCalendar.nextMonth')} onClick={goToNextMonth} leadingIcon={<ChevronRight size={18} />} />
        </div>
      </div>

      {monthCalendar.isPending && (
        <div aria-busy="true" aria-label={t('islamicCalendar.loadingCalendar')}>
          <Skeleton variant="rect" height="16rem" />
        </div>
      )}

      {monthCalendar.isError && (
        <EmptyState
          title={t('emptyState.calendar.loadFailed')}
          description={monthCalendar.error.message}
          action={
            <Button
              variant="secondary"
              onClick={() => monthCalendar.refetch()}
              disabled={monthCalendar.isFetching}
              leadingIcon={<RotateCw size={16} />}
            >
              {t('common.retry')}
            </Button>
          }
        />
      )}

      {monthCalendar.data && (
        <CalendarMonthGrid
          days={monthCalendar.data}
          todayGregorianDay={isCurrentMonth ? now.getDate() : null}
        />
      )}

      <div>
        <Typography variant="h3" as="h2" className={styles.eventsHeading}>
          {t('islamicCalendar.upcomingEvents')}
        </Typography>
        {upcomingEvents.isPending && <Skeleton variant="rect" height="4rem" count={3} />}
        {upcomingEvents.data && <UpcomingEventsList events={upcomingEvents.data} />}
      </div>
    </div>
  );
}

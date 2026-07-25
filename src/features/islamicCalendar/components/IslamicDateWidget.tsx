import { Link } from 'react-router-dom';
import { CalendarDays } from 'lucide-react';
import Card from 'components/ui/Card';
import Typography from 'components/ui/Typography';
import Skeleton from 'components/ui/Skeleton';
import useTodayHijriDate from 'features/islamicCalendar/hooks/useTodayHijriDate';
import { ROUTES } from 'constants/routes';
import useTranslation from 'hooks/useTranslation';
import styles from './IslamicDateWidget.module.css';

export default function IslamicDateWidget() {
  const { data, isPending, isError } = useTodayHijriDate();
  const { t } = useTranslation();

  if (isError) return null;

  return (
    <Card elevation="raised" className={styles.card}>
      <div className={styles.heading}>
        <CalendarDays size={16} />
        <Typography variant="caption" muted>
          {t('islamicCalendar.islamicDate')}
        </Typography>
      </div>

      {isPending && <Skeleton variant="text" count={2} />}

      {data && (
        <Link to={ROUTES.ISLAMIC_CALENDAR} className={styles.link}>
          <Typography variant="h3" as="p">
            {t('islamicCalendar.hijriDateAH', { day: data.hijri.day, month: data.hijri.month.en, year: data.hijri.year })}
          </Typography>
          <Typography variant="caption" muted>
            {t('islamicCalendar.gregorianDate', {
              weekday: data.gregorian.weekdayEn,
              month: data.gregorian.monthNameEn,
              day: data.gregorian.day,
              year: data.gregorian.year,
            })}
          </Typography>
        </Link>
      )}
    </Card>
  );
}

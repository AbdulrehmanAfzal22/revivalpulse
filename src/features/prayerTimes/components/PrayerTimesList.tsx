import { Sunrise as SunriseIcon } from 'lucide-react';
import { PRAYER_DISPLAY_ORDER } from 'constants/prayerNames';
import { getCountdownParts, getCurrentPrayerInfo } from 'features/prayerTimes/services/prayerTimeCalculations';
import Card from 'components/ui/Card';
import Typography from 'components/ui/Typography';
import useTranslation from 'hooks/useTranslation';
import type { PrayerTimesResult } from 'types/prayerTimes.types';
import styles from './PrayerTimesList.module.css';

export interface PrayerTimesListProps {
  result: PrayerTimesResult;
}

export default function PrayerTimesList({ result }: PrayerTimesListProps) {
  const { current, next, minutesUntilNext } = getCurrentPrayerInfo(result.timings, result.timezone);
  const { t } = useTranslation();

  const { hours, minutes } = getCountdownParts(minutesUntilNext);
  const countdown =
    hours === 0 ? t('prayerTimes.countdownMinutes', { minutes }) : t('prayerTimes.countdownHoursMinutes', { hours, minutes });

  return (
    <div className={styles.wrapper}>
      <Card elevation="raised" className={styles.nextCard}>
        <Typography variant="caption" muted>
          {current ? t('prayerTimes.currentNext', { current }) : t('prayerTimes.next')}
        </Typography>
        <Typography variant="h2">{next}</Typography>
        <Typography variant="body" muted>
          {t('prayerTimes.in', { countdown })} · {result.timings[next]}
        </Typography>
      </Card>

      <ul className={styles.list}>
        {PRAYER_DISPLAY_ORDER.map((name) => (
          <li
            key={name}
            className={[styles.row, name === current && styles.rowActive].filter(Boolean).join(' ')}
          >
            <span className={styles.name}>
              {name === 'Sunrise' && <SunriseIcon size={14} className={styles.sunriseIcon} />}
              {name}
            </span>
            <span className={styles.time}>{result.timings[name]}</span>
          </li>
        ))}
      </ul>

      <Typography variant="caption" muted className={styles.meta}>
        {t('prayerTimes.dateMeta', {
          gregorian: result.dateGregorian,
          hijri: result.dateHijri,
          method: result.methodName,
        })}
      </Typography>
    </div>
  );
}

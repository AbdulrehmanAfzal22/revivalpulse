import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Clock } from 'lucide-react';
import Card from 'components/ui/Card';
import Typography from 'components/ui/Typography';
import Skeleton from 'components/ui/Skeleton';
import Button from 'components/ui/Button';
import useGeolocation from 'features/prayerTimes/hooks/useGeolocation';
import usePrayerTimes from 'features/prayerTimes/hooks/usePrayerTimes';
import { usePrayerTimesPreferencesStore } from 'stores/prayerTimesPreferencesStore';
import { getCurrentPrayerInfo, getCountdownParts } from 'features/prayerTimes/services/prayerTimeCalculations';
import { ROUTES } from 'constants/routes';
import useTranslation from 'hooks/useTranslation';
import styles from './PrayerCountdownWidget.module.css';

export default function PrayerCountdownWidget() {
  const geolocation = useGeolocation();
  const manualLocation = usePrayerTimesPreferencesStore((state) => state.manualLocation);
  const calculationMethodId = usePrayerTimesPreferencesStore((state) => state.calculationMethodId);
  const { t } = useTranslation();

  useEffect(() => {
    if (!manualLocation) geolocation.requestLocation();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const activeCoordinates = manualLocation ?? geolocation.coordinates;
  const prayerTimes = usePrayerTimes(activeCoordinates, calculationMethodId);
  const info = prayerTimes.data ? getCurrentPrayerInfo(prayerTimes.data.timings, prayerTimes.data.timezone) : null;

  function countdownText(minutesUntilNext: number): string {
    const { hours, minutes } = getCountdownParts(minutesUntilNext);
    return hours === 0
      ? t('prayerTimes.countdownMinutes', { minutes })
      : t('prayerTimes.countdownHoursMinutes', { hours, minutes });
  }

  return (
    <Card elevation="raised" className={styles.card}>
      <div className={styles.heading}>
        <Clock size={16} />
        <Typography variant="caption" muted>
          {t('prayerTimes.nextPrayer')}
        </Typography>
      </div>

      {!activeCoordinates && geolocation.status !== 'loading' && (
        <Link to={ROUTES.PRAYER_TIMES}>
          <Button variant="secondary" size="sm">
            {t('prayerTimes.setYourLocation')}
          </Button>
        </Link>
      )}

      {activeCoordinates && prayerTimes.isPending && <Skeleton variant="text" count={2} />}

      {activeCoordinates && info && (
        <Link to={ROUTES.PRAYER_TIMES} className={styles.link}>
          <Typography variant="h3" as="p">
            {info.next}
          </Typography>
          <Typography variant="body" muted>
            {t('prayerTimes.in', { countdown: countdownText(info.minutesUntilNext) })}
          </Typography>
        </Link>
      )}
    </Card>
  );
}

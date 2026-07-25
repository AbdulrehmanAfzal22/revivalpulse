import { useEffect } from 'react';
import { RotateCw } from 'lucide-react';
import useGeolocation from 'features/prayerTimes/hooks/useGeolocation';
import usePrayerTimes from 'features/prayerTimes/hooks/usePrayerTimes';
import LocationPicker from 'features/prayerTimes/components/LocationPicker';
import CalculationMethodSelector from 'features/prayerTimes/components/CalculationMethodSelector';
import PrayerTimesList from 'features/prayerTimes/components/PrayerTimesList';
import { usePrayerTimesPreferencesStore } from 'stores/prayerTimesPreferencesStore';
import Typography from 'components/ui/Typography';
import Card from 'components/ui/Card';
import Button from 'components/ui/Button';
import Skeleton from 'components/ui/Skeleton';
import EmptyState from 'components/feedback/EmptyState';
import useTranslation from 'hooks/useTranslation';
import styles from './PrayerTimesPage.module.css';

export default function PrayerTimesPage() {
  const geolocation = useGeolocation();
  const manualLocation = usePrayerTimesPreferencesStore((state) => state.manualLocation);
  const setManualLocation = usePrayerTimesPreferencesStore((state) => state.setManualLocation);
  const calculationMethodId = usePrayerTimesPreferencesStore((state) => state.calculationMethodId);
  const setCalculationMethodId = usePrayerTimesPreferencesStore((state) => state.setCalculationMethodId);
  const { t } = useTranslation();

  useEffect(() => {
    if (!manualLocation) geolocation.requestLocation();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const activeCoordinates = manualLocation ?? geolocation.coordinates;
  const activeLabel = manualLocation
    ? manualLocation.label
    : geolocation.coordinates
      ? t('prayerTimes.yourLocation')
      : t('prayerTimes.noLocationSet');

  const prayerTimes = usePrayerTimes(activeCoordinates, calculationMethodId);

  return (
    <div className={styles.page}>
      <Typography variant="h2">{t('prayerTimes.title')}</Typography>

      <Card className={styles.settingsCard}>
        <LocationPicker
          activeLocationLabel={activeLabel}
          geolocationStatus={geolocation.status}
          onUseDeviceLocation={() => {
            setManualLocation(null);
            geolocation.requestLocation();
          }}
          onSelectCity={(city) =>
            setManualLocation({
              latitude: city.latitude,
              longitude: city.longitude,
              label: `${city.name}, ${city.country}`,
              source: 'manual',
            })
          }
        />
        <CalculationMethodSelector value={calculationMethodId} onChange={setCalculationMethodId} />
      </Card>

      {!activeCoordinates && geolocation.status !== 'loading' && (
        <EmptyState title={t('emptyState.prayerTimes.setLocation')} />
      )}

      {activeCoordinates && prayerTimes.isPending && (
        <div aria-busy="true" aria-label={t('prayerTimes.loadingPrayerTimes')}>
          <Skeleton variant="rect" height="8rem" />
          <Skeleton variant="text" count={6} />
        </div>
      )}

      {activeCoordinates && prayerTimes.isError && (
        <EmptyState
          title={t('emptyState.prayerTimes.loadFailed')}
          description={prayerTimes.error.message}
          action={
            <Button
              variant="secondary"
              onClick={() => prayerTimes.refetch()}
              disabled={prayerTimes.isFetching}
              leadingIcon={<RotateCw size={16} />}
            >
              {t('common.retry')}
            </Button>
          }
        />
      )}

      {activeCoordinates && prayerTimes.data && <PrayerTimesList result={prayerTimes.data} />}
    </div>
  );
}

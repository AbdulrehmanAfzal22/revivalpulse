import { useEffect } from 'react';
import useGeolocation from 'features/prayerTimes/hooks/useGeolocation';
import LocationPicker from 'features/prayerTimes/components/LocationPicker';
import { usePrayerTimesPreferencesStore } from 'stores/prayerTimesPreferencesStore';
import useDeviceOrientation from 'features/qibla/hooks/useDeviceOrientation';
import { QiblaCompass } from 'features/qibla/components';
import { getQiblaInfo } from 'features/qibla/services/qiblaCalculations';
import Typography from 'components/ui/Typography';
import Card from 'components/ui/Card';
import EmptyState from 'components/feedback/EmptyState';
import useTranslation from 'hooks/useTranslation';
import styles from './QiblaPage.module.css';

export default function QiblaPage() {
  const geolocation = useGeolocation();
  const manualLocation = usePrayerTimesPreferencesStore((state) => state.manualLocation);
  const setManualLocation = usePrayerTimesPreferencesStore((state) => state.setManualLocation);
  const { heading, support, requestPermission } = useDeviceOrientation();
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

  return (
    <div className={styles.page}>
      <Typography variant="h2">{t('qibla.title')}</Typography>

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
      </Card>

      {activeCoordinates ? (
        <QiblaCompass
          qibla={getQiblaInfo(activeCoordinates)}
          heading={heading}
          support={support}
          onRequestPermission={() => void requestPermission()}
        />
      ) : (
        <EmptyState title={t('emptyState.qibla.setLocation')} />
      )}
    </div>
  );
}

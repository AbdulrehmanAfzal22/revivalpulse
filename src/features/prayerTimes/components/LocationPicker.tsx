import { useState } from 'react';
import { Loader2, MapPin, Search } from 'lucide-react';
import Button from 'components/ui/Button';
import { MAJOR_CITIES } from 'data/prayerTimes/majorCities';
import type { MajorCity } from 'data/prayerTimes/majorCities';
import type { GeolocationStatus } from 'features/prayerTimes/hooks/useGeolocation';
import useTranslation from 'hooks/useTranslation';
import styles from './LocationPicker.module.css';

export interface LocationPickerProps {
  activeLocationLabel: string;
  geolocationStatus: GeolocationStatus;
  onUseDeviceLocation: () => void;
  onSelectCity: (city: MajorCity) => void;
}

export default function LocationPicker({
  activeLocationLabel,
  geolocationStatus,
  onUseDeviceLocation,
  onSelectCity,
}: LocationPickerProps) {
  const [query, setQuery] = useState('');
  const { t } = useTranslation();

  const filteredCities = query.trim()
    ? MAJOR_CITIES.filter((city) => city.name.toLowerCase().includes(query.trim().toLowerCase()))
    : [];

  return (
    <div className={styles.wrapper}>
      <div className={styles.current}>
        <MapPin size={16} className={styles.pinIcon} />
        <span>{activeLocationLabel}</span>
        <Button
          variant="secondary"
          size="sm"
          onClick={onUseDeviceLocation}
          disabled={geolocationStatus === 'loading'}
          leadingIcon={
            geolocationStatus === 'loading' ? <Loader2 size={14} className={styles.spin} /> : <MapPin size={14} />
          }
        >
          {t('location.useMyLocation')}
        </Button>
      </div>

      {geolocationStatus === 'denied' && <span className={styles.errorNote}>{t('location.deniedNote')}</span>}
      {geolocationStatus === 'error' && <span className={styles.errorNote}>{t('location.errorNote')}</span>}
      {geolocationStatus === 'unsupported' && (
        <span className={styles.errorNote}>{t('location.unsupportedNote')}</span>
      )}

      <label className={styles.field}>
        <Search size={16} className={styles.fieldIcon} />
        <input
          type="search"
          className={styles.input}
          placeholder={t('location.searchCityPlaceholder')}
          value={query}
          onChange={(event) => setQuery(event.target.value)}
        />
      </label>

      {filteredCities.length > 0 && (
        <ul className={styles.suggestions}>
          {filteredCities.slice(0, 8).map((city) => (
            <li key={`${city.name}-${city.country}`}>
              <button
                type="button"
                className={styles.suggestionRow}
                onClick={() => {
                  onSelectCity(city);
                  setQuery('');
                }}
              >
                {t('location.cityCountry', { city: city.name, country: city.country })}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

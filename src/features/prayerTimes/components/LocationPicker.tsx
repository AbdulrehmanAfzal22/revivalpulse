import { useEffect, useState } from 'react';
import { Loader2, MapPin, Search } from 'lucide-react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import Button from 'components/ui/Button';
import type { MajorCity } from 'data/prayerTimes/majorCities';
import type { GeolocationStatus } from 'features/prayerTimes/hooks/useGeolocation';
import { searchWorldwideCities } from 'features/prayerTimes/services/geocodingClient';
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
  const [suggestions, setSuggestions] = useState<MajorCity[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const { t } = useTranslation();
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    const term = query.trim();
    if (term.length < 2) {
      setSuggestions([]);
      setIsSearching(false);
      return undefined;
    }

    const controller = new AbortController();
    const timeout = window.setTimeout(() => {
      setIsSearching(true);
      void searchWorldwideCities(term, controller.signal)
        .then(setSuggestions)
        .catch((error: unknown) => {
          if ((error as { name?: string }).name !== 'AbortError') setSuggestions([]);
        })
        .finally(() => setIsSearching(false));
    }, 300);
    return () => {
      window.clearTimeout(timeout);
      controller.abort();
    };
  }, [query]);

  return (
    <div className={styles.wrapper}>
      <div className={styles.current}>
        <MapPin size={16} className={styles.pinIcon} />
        <span>{activeLocationLabel}</span>
        <motion.div whileTap={reduceMotion ? undefined : { scale: 0.97 }} transition={{ duration: 0.18 }}>
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
        </motion.div>
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

      {isSearching && <span className={styles.searching}>Searching worldwide...</span>}
      <AnimatePresence initial={false}>
        {suggestions.length > 0 && (
          <motion.ul
            className={styles.suggestions}
            initial={reduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.98, y: -4 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.98, y: -4 }}
            transition={reduceMotion ? { duration: 0.01 } : { duration: 0.38, ease: [0.16, 1, 0.3, 1] }}
          >
            {suggestions.map((city, index) => (
              <motion.li
                key={`${city.name}-${city.country}-${city.latitude}-${city.longitude}`}
                initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={reduceMotion ? { duration: 0.01 } : { duration: 0.4, delay: index * 0.035, ease: [0.16, 1, 0.3, 1] }}
              >
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
              </motion.li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}

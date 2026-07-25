import { useCallback, useState } from 'react';
import type { Coordinates } from 'types/prayerTimes.types';

export type GeolocationStatus = 'idle' | 'loading' | 'success' | 'error' | 'denied' | 'unsupported';

export interface UseGeolocationResult {
  coordinates: Coordinates | null;
  status: GeolocationStatus;
  error: string | null;
  requestLocation: () => void;
}

export default function useGeolocation(): UseGeolocationResult {
  const [coordinates, setCoordinates] = useState<Coordinates | null>(null);
  const [status, setStatus] = useState<GeolocationStatus>('idle');
  const [error, setError] = useState<string | null>(null);

  const requestLocation = useCallback(() => {
    // `in` only checks the property exists — some privacy-hardened browsers and
    // extensions neuter the API by setting `navigator.geolocation` to a falsy
    // value rather than removing it, which `in` would miss and then throw
    // synchronously on `.getCurrentPosition`, crashing the page.
    if (!navigator.geolocation) {
      setStatus('unsupported');
      return;
    }

    setStatus('loading');
    try {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCoordinates({ latitude: position.coords.latitude, longitude: position.coords.longitude });
          setStatus('success');
        },
        (geoError) => {
          setError(geoError.message);
          setStatus(geoError.code === geoError.PERMISSION_DENIED ? 'denied' : 'error');
        },
        { enableHighAccuracy: false, timeout: 10000, maximumAge: 1000 * 60 * 30 }
      );
    } catch {
      setStatus('unsupported');
    }
  }, []);

  return { coordinates, status, error, requestLocation };
}

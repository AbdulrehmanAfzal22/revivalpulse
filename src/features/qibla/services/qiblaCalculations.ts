import { EARTH_RADIUS_KM, KAABA_COORDINATES } from 'constants/qibla';
import type { Coordinates } from 'types/prayerTimes.types';
import type { QiblaResult } from 'types/qibla.types';

function toRadians(degrees: number): number {
  return (degrees * Math.PI) / 180;
}

function toDegrees(radians: number): number {
  return (radians * 180) / Math.PI;
}

/** Great-circle initial bearing from `from` to the Kaaba, in degrees from true north. Verified against api.aladhan.com/v1/qibla. */
function computeBearing(from: Coordinates): number {
  const lat1 = toRadians(from.latitude);
  const lat2 = toRadians(KAABA_COORDINATES.latitude);
  const deltaLon = toRadians(KAABA_COORDINATES.longitude - from.longitude);

  const y = Math.sin(deltaLon) * Math.cos(lat2);
  const x = Math.cos(lat1) * Math.sin(lat2) - Math.sin(lat1) * Math.cos(lat2) * Math.cos(deltaLon);
  const bearing = toDegrees(Math.atan2(y, x));

  return (bearing + 360) % 360;
}

/** Haversine great-circle distance in kilometers. */
function computeDistanceKm(from: Coordinates): number {
  const lat1 = toRadians(from.latitude);
  const lat2 = toRadians(KAABA_COORDINATES.latitude);
  const deltaLat = toRadians(KAABA_COORDINATES.latitude - from.latitude);
  const deltaLon = toRadians(KAABA_COORDINATES.longitude - from.longitude);

  const a =
    Math.sin(deltaLat / 2) ** 2 + Math.cos(lat1) * Math.cos(lat2) * Math.sin(deltaLon / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return EARTH_RADIUS_KM * c;
}

export function getQiblaInfo(from: Coordinates): QiblaResult {
  return {
    bearing: computeBearing(from),
    distanceKm: computeDistanceKm(from),
  };
}

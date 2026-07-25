export interface QiblaResult {
  /** Degrees from true north. */
  bearing: number;
  distanceKm: number;
}

export type CompassSupport = 'unknown' | 'supported' | 'permission-required' | 'unsupported';

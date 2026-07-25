import type { TranslationKey } from 'i18n';

export type DhikrId = 'subhanallah' | 'alhamdulillah' | 'allahuakbar' | 'astaghfirullah';

export interface DhikrPreset {
  id: DhikrId;
  arabic: string;
  transliteration: string;
  translationKey: TranslationKey;
}

/** Local, cross-device-synced record of one day's tally for one dhikr. Id: `${date}:${dhikrKey}`. */
export interface TasbeehHistoryPayload {
  /** YYYY-MM-DD, device-local calendar date. */
  date: string;
  dhikrKey: string;
  label: string;
  count: number;
}

export type GlobalConnectionStatus = 'unavailable' | 'connecting' | 'live' | 'offline' | 'error';

export type GlobalTimeRange = 'today' | 'week' | 'month' | 'allTime';

/** Aggregate total for one dhikr across all users, for the currently selected time range. */
export interface GlobalDhikrTotal {
  dhikrKey: string;
  count: number;
}

/** This device's own contribution within the selected time range. */
export interface MyDhikrContribution {
  dhikrKey: string;
  count: number;
}

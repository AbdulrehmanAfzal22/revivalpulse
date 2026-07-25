import type { DhikrPreset, GlobalTimeRange } from 'types/tasbeeh.types';
import type { TranslationKey } from 'i18n';

export const DHIKR_PRESETS: DhikrPreset[] = [
  { id: 'subhanallah', arabic: 'سُبْحَانَ اللَّهِ', transliteration: 'SubhanAllah', translationKey: 'tasbeeh.dhikr.subhanallah' },
  { id: 'alhamdulillah', arabic: 'الْحَمْدُ لِلَّهِ', transliteration: 'Alhamdulillah', translationKey: 'tasbeeh.dhikr.alhamdulillah' },
  { id: 'allahuakbar', arabic: 'اللَّهُ أَكْبَرُ', transliteration: 'Allahu Akbar', translationKey: 'tasbeeh.dhikr.allahuakbar' },
  { id: 'astaghfirullah', arabic: 'أَسْتَغْفِرُ اللَّهَ', transliteration: 'Astaghfirullah', translationKey: 'tasbeeh.dhikr.astaghfirullah' },
];

// DHIKR_PRESETS is a fixed non-empty literal array declared immediately above, so index 0 always exists.
export const DEFAULT_DHIKR_ID = (DHIKR_PRESETS[0] as DhikrPreset).id;
export const DEFAULT_TARGET = 33;
export const TARGET_OPTIONS = [33, 99, 100, 1000] as const;

export const HISTORY_DAYS_SHOWN = 14;

/** Trailing debounce for the cross-device sync push (services/syncEngine.ts). Local writes are instant. */
export const HISTORY_SYNC_DEBOUNCE_MS = 2000;

/** Global-counter tap batching: trailing debounce, capped by a max-wait so a long unbroken tapping
 *  session still flushes periodically instead of withholding everything until the user stops. */
export const GLOBAL_QUEUE_DEBOUNCE_MS = 1500;
export const GLOBAL_QUEUE_MAX_WAIT_MS = 5000;

/** Mirrors the server-side cooldown in the increment_dhikr_count RPC (0003_dhikr_global_counter.sql)
 *  — informational only; the real enforcement happens in Postgres, this just avoids a client firing
 *  a call that the server would reject outright. */
export const GLOBAL_RATE_LIMIT_MS = 900;

export const GLOBAL_TIME_RANGES: { id: GlobalTimeRange; labelKey: TranslationKey }[] = [
  { id: 'today', labelKey: 'tasbeeh.range.today' },
  { id: 'week', labelKey: 'tasbeeh.range.week' },
  { id: 'month', labelKey: 'tasbeeh.range.month' },
  { id: 'allTime', labelKey: 'tasbeeh.range.allTime' },
];

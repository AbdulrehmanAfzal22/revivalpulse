import type { SyncDomain } from 'types/sync.types';

export const SYNC_DOMAINS: SyncDomain[] = [
  'bookmarks',
  'lastRead',
  'readingHistory',
  'notes',
  'highlights',
  'favorites',
  'settings',
  'readingGoals',
  'tasbeehProgress',
  'kidsProgress',
];

export const SYNC_TABLE_NAMES: Record<SyncDomain, string> = {
  bookmarks: 'bookmarks',
  lastRead: 'last_read',
  readingHistory: 'reading_history',
  notes: 'notes',
  highlights: 'highlights',
  favorites: 'favorites',
  settings: 'user_settings',
  readingGoals: 'reading_goals',
  tasbeehProgress: 'tasbeeh_progress',
  kidsProgress: 'kids_progress',
};

export const SYNC_STORAGE_PREFIX = 'islamic-web:sync:';

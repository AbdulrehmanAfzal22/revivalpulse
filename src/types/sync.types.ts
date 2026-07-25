export type SyncDomain =
  | 'bookmarks'
  | 'lastRead'
  | 'readingHistory'
  | 'notes'
  | 'highlights'
  | 'favorites'
  | 'settings'
  | 'readingGoals'
  | 'tasbeehProgress'
  | 'kidsProgress';

export interface SyncRecord<T = unknown> {
  id: string;
  updatedAt: number;
  deleted: boolean;
  payload: T;
}

export type SyncState = 'idle' | 'syncing' | 'synced' | 'offline' | 'error';

export interface SyncSnapshot {
  domain: SyncDomain;
  state: SyncState;
  lastSyncedAt: number | null;
  error: string | null;
}

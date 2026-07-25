import { supabase } from './supabaseClient';
import { SYNC_STORAGE_PREFIX, SYNC_TABLE_NAMES } from 'constants/sync';
import type { SyncDomain, SyncRecord } from 'types/sync.types';

interface SyncTableRow {
  id: string;
  user_id: string;
  updated_at: string;
  deleted: boolean;
  payload: unknown;
}

function localKey(domain: SyncDomain, userId: string | null): string {
  return `${SYNC_STORAGE_PREFIX}${userId ?? 'guest'}:${domain}`;
}

export function readLocal<T>(domain: SyncDomain, userId: string | null): SyncRecord<T>[] {
  const raw = window.localStorage.getItem(localKey(domain, userId));
  if (!raw) return [];

  try {
    return JSON.parse(raw) as SyncRecord<T>[];
  } catch {
    return [];
  }
}

export function writeLocal<T>(
  domain: SyncDomain,
  userId: string | null,
  records: SyncRecord<T>[]
): void {
  window.localStorage.setItem(localKey(domain, userId), JSON.stringify(records));
}

export function upsertLocal<T>(
  domain: SyncDomain,
  userId: string | null,
  record: SyncRecord<T>
): SyncRecord<T>[] {
  const existing = readLocal<T>(domain, userId);
  const next = [...existing.filter((item) => item.id !== record.id), record];
  writeLocal(domain, userId, next);
  return next;
}

/** Last-write-wins merge by `updatedAt`; deleted records are dropped from the result. */
export function mergeRecords<T>(local: SyncRecord<T>[], remote: SyncRecord<T>[]): SyncRecord<T>[] {
  const byId = new Map<string, SyncRecord<T>>();

  [...local, ...remote].forEach((record) => {
    const existing = byId.get(record.id);
    if (!existing || record.updatedAt > existing.updatedAt) {
      byId.set(record.id, record);
    }
  });

  return Array.from(byId.values()).filter((record) => !record.deleted);
}

export async function pullFromRemote<T>(domain: SyncDomain, userId: string): Promise<SyncRecord<T>[]> {
  if (!supabase) return [];

  const table = SYNC_TABLE_NAMES[domain];
  const { data, error } = await supabase.from(table).select('*').eq('user_id', userId);
  if (error) throw error;

  const rows = (data ?? []) as unknown as SyncTableRow[];
  return rows.map((row) => ({
    id: row.id,
    updatedAt: new Date(row.updated_at).getTime(),
    deleted: row.deleted,
    payload: row.payload as T,
  }));
}

export async function pushToRemote<T>(
  domain: SyncDomain,
  userId: string,
  records: SyncRecord<T>[]
): Promise<void> {
  if (!supabase || records.length === 0) return;

  const table = SYNC_TABLE_NAMES[domain];
  const rows: SyncTableRow[] = records.map((record) => ({
    id: record.id,
    user_id: userId,
    updated_at: new Date(record.updatedAt).toISOString(),
    deleted: record.deleted,
    payload: record.payload,
  }));

  const { error } = await supabase.from(table).upsert(rows, { onConflict: 'id' });
  if (error) throw error;
}

/**
 * Local-only for guests (no `userId`). For signed-in users, pulls remote,
 * merges with local via last-write-wins, writes the merged set back to both
 * sides so local and remote converge.
 */
export async function syncDomain<T>(
  domain: SyncDomain,
  userId: string | null
): Promise<SyncRecord<T>[]> {
  const local = readLocal<T>(domain, userId);
  if (!userId || !supabase) return local;

  const remote = await pullFromRemote<T>(domain, userId);
  const merged = mergeRecords(local, remote);
  writeLocal(domain, userId, merged);
  await pushToRemote(domain, userId, merged);
  return merged;
}

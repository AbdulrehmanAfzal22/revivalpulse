import type { RealtimeChannel } from '@supabase/supabase-js';
import { supabase } from 'services/supabaseClient';
import type { GlobalDhikrTotal, MyDhikrContribution } from 'types/tasbeeh.types';

interface DhikrCounterRow {
  dhikr_key: string;
  total_count: number;
}

interface DhikrTotalsSinceRow {
  dhikr_key: string;
  total: number;
}

/** Null when Supabase isn't configured — anonymous/guest mode still renders the personal counter. */
export function isGlobalCounterAvailable(): boolean {
  return supabase !== null;
}

export async function fetchAllTimeTotals(): Promise<GlobalDhikrTotal[]> {
  if (!supabase) return [];

  const { data, error } = await supabase.from('dhikr_counters').select('dhikr_key, total_count');
  if (error) throw error;

  return (data as DhikrCounterRow[]).map((row) => ({ dhikrKey: row.dhikr_key, count: row.total_count }));
}

export async function fetchTotalsSince(since: Date): Promise<GlobalDhikrTotal[]> {
  if (!supabase) return [];

  const { data, error } = await supabase.rpc('get_dhikr_totals_since', { p_since: since.toISOString() });
  if (error) throw error;

  return (data as DhikrTotalsSinceRow[]).map((row) => ({ dhikrKey: row.dhikr_key, count: row.total }));
}

export async function fetchMyContribution(sessionId: string): Promise<MyDhikrContribution[]> {
  if (!supabase) return [];

  const { data, error } = await supabase.rpc('get_my_dhikr_totals', { p_session_id: sessionId });
  if (error) throw error;

  return (data as DhikrTotalsSinceRow[]).map((row) => ({ dhikrKey: row.dhikr_key, count: row.total }));
}

/** Throws on rejection (including the server's rate-limit error) — callers decide how to handle that. */
export async function incrementGlobalCount(
  dhikrKey: string,
  sessionId: string,
  amount: number
): Promise<number> {
  if (!supabase) throw new Error('Global counter is not configured.');

  const { data, error } = await supabase.rpc('increment_dhikr_count', {
    p_dhikr_key: dhikrKey,
    p_session_id: sessionId,
    p_amount: amount,
  });
  if (error) throw error;

  const row = (data as { total_count: number }[] | null)?.[0];
  return row?.total_count ?? 0;
}

/**
 * Subscribes to live changes on dhikr_counters via Supabase Realtime. Returns
 * an unsubscribe function; callers own the channel's lifecycle (Tasbeeh page
 * mount/unmount) rather than this being a module-level singleton, since the
 * global counter only needs to stay live while that page is open.
 */
export function subscribeToGlobalCounts(
  onChange: (row: GlobalDhikrTotal) => void,
  onStatusChange: (status: 'connecting' | 'live' | 'offline' | 'error') => void
): () => void {
  if (!supabase) {
    onStatusChange('offline');
    return () => {};
  }

  onStatusChange('connecting');
  const client = supabase;

  const channel: RealtimeChannel = client
    .channel('dhikr-counters-changes')
    .on(
      'postgres_changes',
      { event: '*', schema: 'public', table: 'dhikr_counters' },
      (payload) => {
        const row = payload.new as DhikrCounterRow | undefined;
        if (row) onChange({ dhikrKey: row.dhikr_key, count: row.total_count });
      }
    )
    .subscribe((status) => {
      if (status === 'SUBSCRIBED') onStatusChange('live');
      else if (status === 'CHANNEL_ERROR' || status === 'TIMED_OUT') onStatusChange('error');
      else if (status === 'CLOSED') onStatusChange('offline');
    });

  return () => {
    void client.removeChannel(channel);
  };
}

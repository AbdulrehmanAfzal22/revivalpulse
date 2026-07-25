-- Additive to 0001/0002. Backs the Phase 12 global community tasbeeh counter
-- (src/api/realtime/tasbeehRealtimeClient.ts). Unlike the per-user tables in
-- 0001, this is a shared aggregate: every visitor (signed-in or anonymous)
-- contributes to the same rows, so it cannot use the owner-scoped RLS
-- pattern from syncEngine.ts. Run against your own Supabase project (SQL
-- editor or `supabase db push`) after 0001 and 0002.

-- One row per dhikr, holding the running all-time total. Read directly by
-- clients (for the initial value and as the Realtime replication source);
-- never written directly by clients — only increment_dhikr_count() below
-- may write it.
create table if not exists dhikr_counters (
  dhikr_key text primary key,
  total_count bigint not null default 0,
  updated_at timestamptz not null default now()
);

alter table dhikr_counters enable row level security;

create policy "Anyone can read global totals" on dhikr_counters
  for select using (true);

-- Publish to Supabase Realtime so clients can subscribe to postgres_changes
-- on this table and see live increments without polling.
alter publication supabase_realtime add table dhikr_counters;

-- Append-only event log, one row per increment call. Used only to compute
-- daily/weekly/monthly aggregates and per-session ("my contribution")
-- totals, and to enforce the per-session rate limit below. `session_id` is
-- a random client-generated UUID (services/anonymousSession.ts) — never an
-- auth identity — but even so this table has NO public grants or RLS
-- policies at all: it's readable only through the two SECURITY DEFINER
-- aggregate functions below, so no client can ever list another visitor's
-- raw tap events, session id, or timing.
create table if not exists dhikr_count_log (
  id uuid primary key default gen_random_uuid(),
  dhikr_key text not null,
  session_id text not null,
  amount integer not null,
  created_at timestamptz not null default now()
);

alter table dhikr_count_log enable row level security;
-- Intentionally no policies: default-deny for anon/authenticated. The table
-- owner (used by the SECURITY DEFINER functions below) bypasses RLS.

create index if not exists dhikr_count_log_session_created_idx
  on dhikr_count_log (session_id, created_at desc);
create index if not exists dhikr_count_log_dhikr_created_idx
  on dhikr_count_log (dhikr_key, created_at);

revoke all on dhikr_count_log from anon, authenticated;
revoke all on dhikr_counters from anon, authenticated;
grant select on dhikr_counters to anon, authenticated;

-- Atomic increment with per-session rate limiting. This is the only path
-- that may write to either table, so it is the de facto "increment
-- endpoint" (Supabase exposes SECURITY DEFINER functions to PostgREST the
-- same way it exposes tables, so `supabase.rpc('increment_dhikr_count', ...)`
-- from the client hits this directly — no separate server needed).
--
-- Rate limit: rejects a call if the same session_id logged an event in the
-- last 900ms (GLOBAL_RATE_LIMIT_MS in constants/tasbeeh.ts mirrors this for
-- client-side awareness only; enforcement is here, server-side, so it can't
-- be bypassed). The client batches taps and debounces its own calls well
-- above this interval, so a legitimate user never hits it — only a script
-- calling the RPC directly, faster than any human or the app's own
-- batching, would.
-- `amount` is capped at 200 per call so a single spoofed call can't claim
-- an arbitrary batch.
create or replace function increment_dhikr_count(
  p_dhikr_key text,
  p_session_id text,
  p_amount integer
)
returns table (total_count bigint)
language plpgsql
security definer
set search_path = public
as $$
declare
  v_last_at timestamptz;
  v_capped_amount integer;
begin
  if p_dhikr_key is null or length(trim(p_dhikr_key)) = 0 then
    raise exception 'dhikr_key is required';
  end if;
  if p_session_id is null or length(trim(p_session_id)) = 0 then
    raise exception 'session_id is required';
  end if;
  if p_amount is null or p_amount < 1 then
    raise exception 'amount must be a positive integer';
  end if;
  v_capped_amount := least(p_amount, 200);

  select created_at into v_last_at
  from dhikr_count_log
  where session_id = p_session_id
  order by created_at desc
  limit 1;

  if v_last_at is not null and v_last_at > now() - interval '900 milliseconds' then
    raise exception 'rate limit exceeded, try again shortly' using errcode = 'P0001';
  end if;

  insert into dhikr_count_log (dhikr_key, session_id, amount)
  values (p_dhikr_key, p_session_id, v_capped_amount);

  insert into dhikr_counters (dhikr_key, total_count, updated_at)
  values (p_dhikr_key, v_capped_amount, now())
  on conflict (dhikr_key)
  do update set
    total_count = dhikr_counters.total_count + excluded.total_count,
    updated_at = now();

  return query
    select dc.total_count from dhikr_counters dc where dc.dhikr_key = p_dhikr_key;
end;
$$;

revoke all on function increment_dhikr_count(text, text, integer) from public;
grant execute on function increment_dhikr_count(text, text, integer) to anon, authenticated;

-- Aggregate total per dhikr since a given instant. Backs the
-- today/week/month range tabs — the client computes UTC range boundaries
-- itself (there's no single "local time" for a global aggregate) and passes
-- them in.
create or replace function get_dhikr_totals_since(p_since timestamptz)
returns table (dhikr_key text, total bigint)
language sql
stable
security definer
set search_path = public
as $$
  select l.dhikr_key, sum(l.amount)::bigint as total
  from dhikr_count_log l
  where l.created_at >= p_since
  group by l.dhikr_key;
$$;

revoke all on function get_dhikr_totals_since(timestamptz) from public;
grant execute on function get_dhikr_totals_since(timestamptz) to anon, authenticated;

-- This device/session's own contribution per dhikr, all-time. The client
-- can intersect this with a range's totals to show "your % of this range".
create or replace function get_my_dhikr_totals(p_session_id text)
returns table (dhikr_key text, total bigint)
language sql
stable
security definer
set search_path = public
as $$
  select l.dhikr_key, sum(l.amount)::bigint as total
  from dhikr_count_log l
  where l.session_id = p_session_id
  group by l.dhikr_key;
$$;

revoke all on function get_my_dhikr_totals(text) from public;
grant execute on function get_my_dhikr_totals(text) to anon, authenticated;

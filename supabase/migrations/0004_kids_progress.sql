-- Additive to 0001/0002/0003 — adds the 'kidsProgress' sync domain for
-- Phase 14 (Kids Mode). Same generic per-user shape as every other
-- syncEngine.ts domain (see 0001_sync_tables.sql): one row per record
-- (a letter learned, a quiz result, a badge earned, ...), not one row per
-- child, since services/syncEngine.ts already handles arbitrary JSON
-- payloads per record — the child-profile structure lives in the payload,
-- not the schema.

create table if not exists kids_progress (
  id uuid primary key,
  user_id uuid not null references auth.users (id) on delete cascade,
  updated_at timestamptz not null default now(),
  deleted boolean not null default false,
  payload jsonb not null default '{}'::jsonb
);

alter table kids_progress enable row level security;

create policy "Owner can manage own rows" on kids_progress
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create index if not exists kids_progress_user_id_idx on kids_progress (user_id);

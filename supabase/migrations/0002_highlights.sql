-- Additive to 0001_sync_tables.sql — adds the 'highlights' sync domain
-- introduced in Phase 9 (persistent per-ayah highlight color, distinct from
-- the ephemeral reading-preferences hover tint from Phase 5).

create table if not exists highlights (
  id uuid primary key,
  user_id uuid not null references auth.users (id) on delete cascade,
  updated_at timestamptz not null default now(),
  deleted boolean not null default false,
  payload jsonb not null default '{}'::jsonb
);

alter table highlights enable row level security;

create policy "Owner can manage own rows" on highlights
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create index if not exists highlights_user_id_idx on highlights (user_id);

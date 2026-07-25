-- Reference schema for services/syncEngine.ts.
-- Run against your own Supabase project (SQL editor or `supabase db push`).
-- Every domain follows the same shape: id + owner + last-write-wins timestamp + JSON payload.
-- Table names must match constants/sync.ts SYNC_TABLE_NAMES.

create table if not exists bookmarks (
  id uuid primary key,
  user_id uuid not null references auth.users (id) on delete cascade,
  updated_at timestamptz not null default now(),
  deleted boolean not null default false,
  payload jsonb not null default '{}'::jsonb
);

create table if not exists last_read (
  id uuid primary key,
  user_id uuid not null references auth.users (id) on delete cascade,
  updated_at timestamptz not null default now(),
  deleted boolean not null default false,
  payload jsonb not null default '{}'::jsonb
);

create table if not exists reading_history (
  id uuid primary key,
  user_id uuid not null references auth.users (id) on delete cascade,
  updated_at timestamptz not null default now(),
  deleted boolean not null default false,
  payload jsonb not null default '{}'::jsonb
);

create table if not exists notes (
  id uuid primary key,
  user_id uuid not null references auth.users (id) on delete cascade,
  updated_at timestamptz not null default now(),
  deleted boolean not null default false,
  payload jsonb not null default '{}'::jsonb
);

create table if not exists favorites (
  id uuid primary key,
  user_id uuid not null references auth.users (id) on delete cascade,
  updated_at timestamptz not null default now(),
  deleted boolean not null default false,
  payload jsonb not null default '{}'::jsonb
);

create table if not exists user_settings (
  id uuid primary key,
  user_id uuid not null references auth.users (id) on delete cascade,
  updated_at timestamptz not null default now(),
  deleted boolean not null default false,
  payload jsonb not null default '{}'::jsonb
);

create table if not exists reading_goals (
  id uuid primary key,
  user_id uuid not null references auth.users (id) on delete cascade,
  updated_at timestamptz not null default now(),
  deleted boolean not null default false,
  payload jsonb not null default '{}'::jsonb
);

create table if not exists tasbeeh_progress (
  id uuid primary key,
  user_id uuid not null references auth.users (id) on delete cascade,
  updated_at timestamptz not null default now(),
  deleted boolean not null default false,
  payload jsonb not null default '{}'::jsonb
);

-- RLS: every table is readable/writable only by its owner.
do $$
declare
  table_name text;
begin
  foreach table_name in array array[
    'bookmarks', 'last_read', 'reading_history', 'notes',
    'favorites', 'user_settings', 'reading_goals', 'tasbeeh_progress'
  ]
  loop
    execute format('alter table %I enable row level security;', table_name);
    execute format(
      'create policy "Owner can manage own rows" on %I for all using (auth.uid() = user_id) with check (auth.uid() = user_id);',
      table_name
    );
    execute format('create index if not exists %I on %I (user_id);', table_name || '_user_id_idx', table_name);
  end loop;
end $$;

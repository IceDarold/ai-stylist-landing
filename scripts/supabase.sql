create table if not exists leads (
  id uuid primary key default gen_random_uuid(),
  email text unique not null,
  created_at timestamptz not null default now()
);

create table if not exists quiz_sessions (
  id uuid primary key,
  lead_id uuid references leads(id),
  started_at timestamptz not null default now(),
  completed_at timestamptz
);

create table if not exists quiz_answers (
  id uuid primary key default gen_random_uuid(),
  session_id uuid references quiz_sessions(id) on delete cascade,
  question_key text not null,
  answer jsonb not null,
  created_at timestamptz not null default now()
);

create table if not exists events (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  payload jsonb,
  lead_id uuid references leads(id),
  session_id uuid references quiz_sessions(id),
  created_at timestamptz not null default now()
);

-- RLS: only service_role may access
alter table leads enable row level security;
alter table quiz_sessions enable row level security;
alter table quiz_answers enable row level security;
alter table events enable row level security;

create policy srv_all_leads on leads for all
  to service_role using (true) with check (true);
create policy srv_all_quiz_sessions on quiz_sessions for all
  to service_role using (true) with check (true);
create policy srv_all_quiz_answers on quiz_answers for all
  to service_role using (true) with check (true);
create policy srv_all_events on events for all
  to service_role using (true) with check (true);

-- Telegram subscribers for notifications
create table if not exists tg_subscribers (
  chat_id bigint primary key,
  username text,
  first_name text,
  last_name text,
  active boolean not null default true,
  subscribed_at timestamptz not null default now(),
  unsubscribed_at timestamptz
);
alter table tg_subscribers enable row level security;
create policy srv_all_tg_subscribers on tg_subscribers for all
  to service_role using (true) with check (true);

-- Image slots mapping for editable images
create table if not exists image_slots (
  slot_id text primary key,
  path text not null,
  updated_at timestamptz not null default now()
);
alter table image_slots enable row level security;
create policy srv_all_image_slots on image_slots for all
  to service_role using (true) with check (true);

-- Brands directory for Favorite Brands step
create table if not exists brands (
  id text primary key, -- slug or short code
  name text not null,
  logo_url text,
  created_at timestamptz not null default now()
);
alter table brands enable row level security;
create policy srv_all_brands on brands for all
  to service_role using (true) with check (true);

-- Random brands helper (optional)
create or replace function brands_random(sample_count int default 12)
returns table(id text, name text, logo_url text)
language sql
as $$
  select b.id, b.name, b.logo_url
  from brands b
  order by random()
  limit sample_count;
$$;

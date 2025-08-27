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

-- Brands and quiz brand selection
create extension if not exists pg_trgm;
create extension if not exists unaccent;

create table if not exists brands (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  tier text not null check (tier in ('mass','premium','luxury')),
  logo_url text,
  is_active boolean not null default true
);

create table if not exists brand_aliases (
  id bigserial primary key,
  brand_id uuid not null references brands(id) on delete cascade,
  alias text not null
);

create table if not exists brand_popularity (
  brand_id uuid not null references brands(id) on delete cascade,
  region text not null,
  score integer not null default 0,
  primary key (brand_id, region)
);

create table if not exists quiz_brand_selection (
  id bigserial primary key,
  quiz_id uuid not null,
  brand_id uuid references brands(id),
  source text not null,
  order_index smallint not null,
  created_at timestamptz not null default now()
);
create index if not exists quiz_brand_selection_quiz_idx on quiz_brand_selection (quiz_id);

create table if not exists quiz_custom_brands (
  id bigserial primary key,
  quiz_id uuid not null,
  name text not null check (char_length(name) between 2 and 50),
  created_at timestamptz not null default now()
);
create index if not exists quiz_custom_brands_quiz_idx on quiz_custom_brands (quiz_id);

create table if not exists quiz_brand_flags (
  quiz_id uuid primary key,
  auto_pick boolean not null default false,
  updated_at timestamptz not null default now()
);

-- Simple search function used by the API
create or replace function search_brands(q text, lim int default 8, p_tier text default null)
returns table (id uuid, name text, tier text, logo_url text) as $$
  select distinct b.id, b.name, b.tier, b.logo_url
  from brands b
  left join brand_aliases a on a.brand_id = b.id
  where b.is_active
    and (unaccent(lower(b.name)) like unaccent(lower(q)) || '%'
      or unaccent(lower(a.alias)) like unaccent(lower(q)) || '%')
    and (p_tier is null or b.tier = p_tier)
  order by b.name
  limit lim;
$$ language sql stable;

create or replace function get_popular_brands(p_region text, p_tier text default null, lim int default 16)
returns table (id uuid, name text, tier text, logo_url text) as $$
  select b.id, b.name, b.tier, b.logo_url
  from brand_popularity p
  join brands b on b.id = p.brand_id
  where b.is_active
    and p.region = p_region
    and (p_tier is null or b.tier = p_tier)
  order by p.score desc
  limit lim;
$$ language sql stable;

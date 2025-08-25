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

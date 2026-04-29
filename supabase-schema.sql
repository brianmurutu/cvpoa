-- CVPoa Database Schema
-- Run this in your Supabase SQL editor

-- ── Access Grants (payment gating) ──────────────────────────────────────────
create table if not exists access_grants (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  plan_id text not null check (plan_id in ('quick', 'standard', 'business')),
  reference text not null unique,  -- Paystack payment reference
  expires_at timestamptz not null,
  created_at timestamptz default now()
);

create index on access_grants(user_id, expires_at desc);

-- ── Resumes ─────────────────────────────────────────────────────────────────
create table if not exists resumes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  full_name text not null,
  email text,
  phone text,
  location text,
  linkedin text,
  target_role text,
  ai_output jsonb,      -- structured AI-generated content
  raw_input jsonb,      -- original form input
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index on resumes(user_id, created_at desc);

-- ── Cover Letters ────────────────────────────────────────────────────────────
create table if not exists cover_letters (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  resume_id uuid references resumes(id) on delete set null,
  job_title text,
  company_name text,
  content text not null,
  created_at timestamptz default now()
);

create index on cover_letters(user_id, created_at desc);

-- ── Row Level Security ───────────────────────────────────────────────────────
alter table access_grants enable row level security;
alter table resumes enable row level security;
alter table cover_letters enable row level security;

-- Users can only read/write their own data
create policy "Users own access_grants" on access_grants
  for all using (auth.uid() = user_id);

create policy "Users own resumes" on resumes
  for all using (auth.uid() = user_id);

create policy "Users own cover_letters" on cover_letters
  for all using (auth.uid() = user_id);

-- ── Updated At Trigger ───────────────────────────────────────────────────────
create or replace function update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger resumes_updated_at
  before update on resumes
  for each row execute function update_updated_at();

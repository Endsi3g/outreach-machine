-- Outreach Machine — Migration V2 (Phase 5)
-- Run in Supabase SQL Editor AFTER migration.sql

-- ==========================================
-- 1. User Settings (Encrypted API Keys)
-- ==========================================
create table if not exists user_settings (
  user_id text primary key,
  ollama_url text,
  ollama_model text,
  resend_api_key_encrypted text,
  apify_token_encrypted text,
  sentry_dsn text,
  updated_at timestamptz default now()
);

alter table user_settings enable row level security;

create policy "Users can view own settings" on user_settings
  for select using (user_id = auth.uid()::text);
create policy "Users can insert own settings" on user_settings
  for insert with check (user_id = auth.uid()::text);
create policy "Users can update own settings" on user_settings
  for update using (user_id = auth.uid()::text);

-- ==========================================
-- 2. Teams
-- ==========================================
create table if not exists teams (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  owner_id text not null,
  created_at timestamptz default now()
);

create table if not exists team_members (
  team_id uuid references teams(id) on delete cascade,
  user_id text not null,
  role text default 'member' check (role in ('owner', 'admin', 'member')),
  joined_at timestamptz default now(),
  primary key (team_id, user_id)
);

alter table teams enable row level security;
alter table team_members enable row level security;

-- Team owner can do everything
create policy "Team owners can manage teams" on teams
  for all using (owner_id = auth.uid()::text);

-- Members can view teams they belong to
create policy "Members can view their teams" on teams
  for select using (
    id in (select team_id from team_members where user_id = auth.uid()::text)
  );

-- Members can view their own memberships
create policy "Members can view memberships" on team_members
  for select using (user_id = auth.uid()::text);

-- Owners/admins can manage members
create policy "Admins can manage members" on team_members
  for all using (
    team_id in (
      select team_id from team_members
      where user_id = auth.uid()::text and role in ('owner', 'admin')
    )
  );

-- ==========================================
-- 3. Make leads & campaigns team-shareable
-- ==========================================
alter table leads add column if not exists team_id uuid references teams(id) on delete set null;
alter table campaigns add column if not exists team_id uuid references teams(id) on delete set null;

create index if not exists idx_leads_team_id on leads(team_id);
create index if not exists idx_campaigns_team_id on campaigns(team_id);

-- Allow team members to see shared leads
create policy "Team members can view team leads" on leads
  for select using (
    team_id in (select team_id from team_members where user_id = auth.uid()::text)
  );

create policy "Team members can view team campaigns" on campaigns
  for select using (
    team_id in (select team_id from team_members where user_id = auth.uid()::text)
  );

-- Outreach Machine — Supabase Database Schema
-- Run this in the Supabase SQL Editor (https://supabase.com/dashboard)

-- ==========================================
-- 1. Leads Table
-- ==========================================
create table if not exists leads (
  id uuid primary key default gen_random_uuid(),
  user_id text not null,
  name text,
  email text,
  company text,
  position text,
  website text,
  linkedin_url text,
  phone text,
  status text default 'new' check (status in ('new', 'contacted', 'replied', 'qualified', 'lost')),
  score integer default 0,
  tags text[] default '{}',
  notes text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- ==========================================
-- 2. Campaigns Table
-- ==========================================
create table if not exists campaigns (
  id uuid primary key default gen_random_uuid(),
  user_id text not null,
  name text not null,
  subject text,
  template text,
  status text default 'draft' check (status in ('draft', 'active', 'paused', 'completed')),
  total_leads integer default 0,
  sent integer default 0,
  opened integer default 0,
  replied integer default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- ==========================================
-- 3. Generated Emails Table
-- ==========================================
create table if not exists generated_emails (
  id uuid primary key default gen_random_uuid(),
  campaign_id uuid references campaigns(id) on delete cascade,
  lead_id uuid references leads(id) on delete cascade,
  user_id text not null,
  subject text,
  body text,
  status text default 'pending' check (status in ('pending', 'approved', 'rejected', 'sent')),
  sent_at timestamptz,
  opened_at timestamptz,
  replied_at timestamptz,
  created_at timestamptz default now()
);

-- ==========================================
-- 4. Notifications Table
-- ==========================================
create table if not exists notifications (
  id uuid primary key default gen_random_uuid(),
  user_id text not null,
  title text not null,
  message text,
  type text default 'info' check (type in ('info', 'success', 'warning', 'error')),
  read boolean default false,
  created_at timestamptz default now()
);

-- ==========================================
-- 4.5 Profiles Table (for onboarding metadata)
-- ==========================================
create table if not exists profiles (
  user_id text primary key,
  company_name text,
  industry text,
  website text,
  sender_name text,
  sender_email text,
  signature text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- ==========================================
-- 5. Row Level Security (RLS)
-- ==========================================
alter table leads enable row level security;
alter table campaigns enable row level security;
alter table generated_emails enable row level security;
alter table notifications enable row level security;
alter table profiles enable row level security;

-- Policies: users can only access their own data
create policy "Users can view own leads" on leads
  for select using (user_id = auth.uid()::text);
create policy "Users can insert own leads" on leads
  for insert with check (user_id = auth.uid()::text);
create policy "Users can update own leads" on leads
  for update using (user_id = auth.uid()::text);
create policy "Users can delete own leads" on leads
  for delete using (user_id = auth.uid()::text);

create policy "Users can view own campaigns" on campaigns
  for select using (user_id = auth.uid()::text);
create policy "Users can insert own campaigns" on campaigns
  for insert with check (user_id = auth.uid()::text);
create policy "Users can update own campaigns" on campaigns
  for update using (user_id = auth.uid()::text);
create policy "Users can delete own campaigns" on campaigns
  for delete using (user_id = auth.uid()::text);

create policy "Users can view own emails" on generated_emails
  for select using (user_id = auth.uid()::text);
create policy "Users can insert own emails" on generated_emails
  for insert with check (user_id = auth.uid()::text);
create policy "Users can update own emails" on generated_emails
  for update using (user_id = auth.uid()::text);

create policy "Users can view own notifications" on notifications
  for select using (user_id = auth.uid()::text);
create policy "Users can update own notifications" on notifications
  for update using (user_id = auth.uid()::text);

create policy "Users can view own profile" on profiles
  for select using (user_id = auth.uid()::text);
create policy "Users can insert own profile" on profiles
  for insert with check (user_id = auth.uid()::text);
create policy "Users can update own profile" on profiles
  for update using (user_id = auth.uid()::text);

-- ==========================================
-- 6. Indexes for performance
-- ==========================================
create index if not exists idx_leads_user_id on leads(user_id);
create index if not exists idx_campaigns_user_id on campaigns(user_id);
create index if not exists idx_generated_emails_campaign_id on generated_emails(campaign_id);
create index if not exists idx_generated_emails_lead_id on generated_emails(lead_id);
create index if not exists idx_notifications_user_id on notifications(user_id);
create index if not exists idx_notifications_read on notifications(user_id, read);

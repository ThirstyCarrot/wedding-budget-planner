-- Supabase SQL Schema for EternalPlan - Wedding Budget Planner
-- Run this query once in your Supabase SQL Editor (https://supabase.com/dashboard/project/_/sql)

-- 1. Create wedding_plans table
create table if not exists public.wedding_plans (
  id text primary key,
  data jsonb not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. Enable Row Level Security (RLS)
alter table public.wedding_plans enable row level security;

-- 3. Clean up existing policies if re-running
drop policy if exists "Allow public read on wedding_plans" on public.wedding_plans;
drop policy if exists "Allow public insert on wedding_plans" on public.wedding_plans;
drop policy if exists "Allow public update on wedding_plans" on public.wedding_plans;

-- 4. Create public access policies for select, insert, and update
create policy "Allow public read on wedding_plans" 
  on public.wedding_plans 
  for select 
  using (true);

create policy "Allow public insert on wedding_plans" 
  on public.wedding_plans 
  for insert 
  with check (true);

create policy "Allow public update on wedding_plans" 
  on public.wedding_plans 
  for update 
  using (true);

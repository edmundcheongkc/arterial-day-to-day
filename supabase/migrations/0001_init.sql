create table if not exists team_members (
  id uuid primary key default gen_random_uuid(),
  user_id uuid,
  display_name text not null,
  email text not null,
  role text not null default 'editor',
  created_at timestamptz not null default now()
);

alter table team_members enable row level security;
drop policy if exists "team_members_v1_read" on team_members;
create policy "team_members_v1_read" on team_members for select using (true);
drop policy if exists "team_members_v1_write" on team_members;
create policy "team_members_v1_write" on team_members for all using (true) with check (true);

create table if not exists work_records (
  id uuid primary key default gen_random_uuid(),
  user_id uuid,
  title text not null,
  description text,
  status text not null default 'to_do',
  assigned_to uuid references team_members(id),
  due_date date,
  is_deleted boolean not null default false,
  ai_status_suggestion text,
  ai_status_suggestion_source text,
  ai_status_suggestion_confidence numeric,
  ai_status_suggestion_review_status text default 'unreviewed',
  created_at timestamptz not null default now()
);

alter table work_records enable row level security;
drop policy if exists "work_records_v1_read" on work_records;
create policy "work_records_v1_read" on work_records for select using (true);
drop policy if exists "work_records_v1_write" on work_records;
create policy "work_records_v1_write" on work_records for all using (true) with check (true);

create table if not exists activities (
  id uuid primary key default gen_random_uuid(),
  user_id uuid,
  record_id uuid references work_records(id),
  actor_name text not null,
  action text not null,
  detail jsonb,
  created_at timestamptz not null default now()
);

alter table activities enable row level security;
drop policy if exists "activities_v1_read" on activities;
create policy "activities_v1_read" on activities for select using (true);
drop policy if exists "activities_v1_write" on activities;
create policy "activities_v1_write" on activities for all using (true) with check (true);

create table if not exists audit_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid,
  actor_name text not null,
  table_name text not null,
  row_id uuid not null,
  action text not null,
  before_state jsonb,
  after_state jsonb,
  created_at timestamptz not null default now()
);

alter table audit_logs enable row level security;
drop policy if exists "audit_logs_v1_read" on audit_logs;
create policy "audit_logs_v1_read" on audit_logs for select using (true);
drop policy if exists "audit_logs_v1_write" on audit_logs;
create policy "audit_logs_v1_write" on audit_logs for all using (true) with check (true);

insert into team_members (id, display_name, email, role) values
  ('a1000000-0000-0000-0000-000000000001', 'Jordan Lee', 'jordan@arterial.internal', 'admin'),
  ('a1000000-0000-0000-0000-000000000002', 'Sam Rivera', 'sam@arterial.internal', 'editor'),
  ('a1000000-0000-0000-0000-000000000003', 'Taylor Kim', 'taylor@arterial.internal', 'editor')
on conflict (id) do nothing;

insert into work_records (id, title, description, status, assigned_to, due_date) values
  ('b1000000-0000-0000-0000-000000000001', 'Q3 Vendor Reconciliation', 'Match all vendor invoices against POs for Q3.', 'in_progress', 'a1000000-0000-0000-0000-000000000001', current_date + 3),
  ('b1000000-0000-0000-0000-000000000002', 'Onboard New Contractor', 'Complete paperwork and system access for new hire.', 'to_do', 'a1000000-0000-0000-0000-000000000002', current_date + 7),
  ('b1000000-0000-0000-0000-000000000003', 'Weekly Report Draft', 'Compile metrics and draft the weekly ops report.', 'in_progress', 'a1000000-0000-0000-0000-000000000003', current_date + 1),
  ('b1000000-0000-0000-0000-000000000004', 'Update Process Doc', 'Revise the intake SOP based on last month feedback.', 'done', 'a1000000-0000-0000-0000-000000000002', current_date - 2)
on conflict (id) do nothing;

insert into activities (record_id, actor_name, action, detail) values
  ('b1000000-0000-0000-0000-000000000001', 'Jordan Lee', 'status_changed', '{"from":"to_do","to":"in_progress"}'),
  ('b1000000-0000-0000-0000-000000000004', 'Sam Rivera', 'status_changed', '{"from":"in_progress","to":"done"}'),
  ('b1000000-0000-0000-0000-000000000003', 'Taylor Kim', 'record_created', '{}')
on conflict (id) do nothing;
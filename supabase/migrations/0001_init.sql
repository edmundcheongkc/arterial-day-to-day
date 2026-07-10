create table if not exists work_items (
  id uuid primary key default gen_random_uuid(),
  user_id uuid,
  title text not null,
  description text,
  status text not null default 'todo',
  assignee_name text,
  due_date date,
  priority_score numeric default 0,
  priority_source text default 'rule_based_v1',
  priority_confidence numeric default 0.9,
  priority_review_status text default 'unreviewed',
  created_at timestamptz not null default now()
);

create table if not exists activity_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid,
  work_item_id uuid references work_items(id) on delete cascade,
  action text not null,
  previous_value jsonb,
  new_value jsonb,
  actor_name text,
  created_at timestamptz not null default now()
);

alter table work_items enable row level security;
alter table activity_logs enable row level security;

drop policy if exists "work_items_v1_read" on work_items;
create policy "work_items_v1_read" on work_items for select using (true);
drop policy if exists "work_items_v1_write" on work_items;
create policy "work_items_v1_write" on work_items for all using (true) with check (true);

drop policy if exists "activity_logs_v1_read" on activity_logs;
create policy "activity_logs_v1_read" on activity_logs for select using (true);
drop policy if exists "activity_logs_v1_write" on activity_logs;
create policy "activity_logs_v1_write" on activity_logs for all using (true) with check (true);

insert into work_items (id, title, description, status, assignee_name, due_date, priority_score, priority_source, priority_confidence, priority_review_status)
values
  (gen_random_uuid(), 'Weekly vendor invoice check', 'Review and approve all outstanding vendor invoices before EOD Friday.', 'in_progress', 'Jordan', current_date + interval '1 day', 0.5, 'rule_based_v1', 0.9, 'unreviewed'),
  (gen_random_uuid(), 'Update team contact directory', 'Add three new starters and remove two who left.', 'todo', 'Sam', current_date + interval '3 days', 0.2, 'rule_based_v1', 0.9, 'unreviewed'),
  (gen_random_uuid(), 'Q2 budget reconciliation', 'Cross-check actuals vs forecast in the shared sheet and flag discrepancies.', 'blocked', 'Alex', current_date - interval '1 day', 0.9, 'rule_based_v1', 0.9, 'unreviewed'),
  (gen_random_uuid(), 'Onboarding checklist for new hire', 'Prepare access, hardware request, and first-week schedule.', 'todo', 'Jordan', current_date + interval '5 days', 0.2, 'rule_based_v1', 0.9, 'unreviewed'),
  (gen_random_uuid(), 'Monthly ops report draft', 'Compile KPIs and write the two-page summary for leadership.', 'done', 'Sam', current_date - interval '2 days', 0.1, 'rule_based_v1', 0.9, 'unreviewed')
on conflict do nothing;

insert into activity_logs (work_item_id, action, previous_value, new_value, actor_name)
select id, 'created', null, jsonb_build_object('title', title, 'status', status), assignee_name
from work_items
on conflict do nothing;
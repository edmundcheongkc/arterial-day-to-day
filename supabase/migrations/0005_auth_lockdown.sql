-- Sprint 3: replace permissive v1 RLS with auth.uid() = user_id owner
-- policies. Seed/demo rows (user_id is null) stay readable by everyone so
-- the app remains screenshot-able, but only their real owner (or nobody,
-- for seed rows) can write to them.

create or replace function current_team_role() returns text
language sql stable
as $$
  select role from team_members where user_id = auth.uid() limit 1;
$$;

-- work_records --------------------------------------------------------
drop policy if exists "work_records_v1_read" on work_records;
drop policy if exists "work_records_v1_write" on work_records;

create policy "work_records_select" on work_records for select
  using (user_id is null or auth.uid() = user_id);

create policy "work_records_insert" on work_records for insert
  with check (auth.uid() = user_id and current_team_role() in ('editor', 'admin'));

create policy "work_records_update" on work_records for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id and current_team_role() in ('editor', 'admin'));

create policy "work_records_delete" on work_records for delete
  using (auth.uid() = user_id and current_team_role() in ('editor', 'admin'));

-- team_members ---------------------------------------------------------
drop policy if exists "team_members_v1_read" on team_members;
drop policy if exists "team_members_v1_write" on team_members;

create policy "team_members_select" on team_members for select using (true);

create policy "team_members_insert" on team_members for insert
  with check (auth.uid() = user_id or current_team_role() = 'admin');

create policy "team_members_admin_update" on team_members for update
  using (current_team_role() = 'admin');

create policy "team_members_admin_delete" on team_members for delete
  using (current_team_role() = 'admin');

-- activities -------------------------------------------------------------
drop policy if exists "activities_v1_read" on activities;
drop policy if exists "activities_v1_write" on activities;

create policy "activities_select" on activities for select using (true);

create policy "activities_insert" on activities for insert
  with check (auth.uid() = user_id);

-- audit_logs: append-only, admin-readable, no update/delete policy at all
drop policy if exists "audit_logs_v1_read" on audit_logs;
drop policy if exists "audit_logs_v1_write" on audit_logs;

create policy "audit_logs_select" on audit_logs for select
  using (current_team_role() = 'admin');

create policy "audit_logs_insert" on audit_logs for insert
  with check (auth.uid() = user_id);

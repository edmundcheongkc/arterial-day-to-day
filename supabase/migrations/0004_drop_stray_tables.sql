-- Drop the work_items/activity_logs tables created by an earlier session
-- against a stale docs snapshot. The canonical schema is team_members/
-- work_records/activities/audit_logs (see 0001_init.sql); these were never
-- part of it and were left unused after the schema mismatch was found.
drop table if exists activity_logs;
drop table if exists work_items;

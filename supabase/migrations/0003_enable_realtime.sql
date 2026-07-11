-- Enable Realtime broadcasts so open dashboard tabs update without a refresh
-- (ARCHITECTURE.md's "Log a work record" flow, step 4-5).
alter publication supabase_realtime add table team_members;
alter publication supabase_realtime add table work_records;
alter publication supabase_realtime add table activities;

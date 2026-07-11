-- Preserve activity history after a work item is deleted. SECURITY.md requires
-- activity_logs to be append-only ("every create, update, delete... writes a
-- row"), but the original FK was ON DELETE CASCADE, which would silently wipe
-- an item's whole history (including its 'deleted' entry) the moment the item
-- is removed. Switch to SET NULL so deleted-item history survives.
alter table activity_logs drop constraint if exists activity_logs_work_item_id_fkey;
alter table activity_logs add constraint activity_logs_work_item_id_fkey
  foreign key (work_item_id) references work_items(id) on delete set null;

-- Enable Realtime broadcasts so open dashboard tabs update without a refresh
-- (ARCHITECTURE.md's "Log a work item" flow, step 4-5).
alter publication supabase_realtime add table work_items;
alter publication supabase_realtime add table activity_logs;

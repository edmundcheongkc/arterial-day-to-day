# Test Plan — Arterial Day-to-Day

## Success Scenario (manual, end-to-end)
1. Open `/dashboard` in an incognito browser — confirm 4 seed records load, no login prompt
2. Click **New Record** — fill in title, description, assign to 'Sam Rivera', set due date tomorrow, status 'To Do' — submit
3. Confirm new record appears in list with correct status badge and assignee chip
4. Open a second incognito window on the same URL — confirm the new record is visible there too (within 3 s)
5. Click the status badge on the new record → advance to 'In Progress' → confirm badge updates in both windows
6. Open the activity feed — confirm two entries: 'record_created' and 'status_changed'
7. Click **Edit** on the record — change the title — save — confirm updated title shown in list
8. Click **Delete** on the record — confirm dialog — confirm — record disappears from list; verify `is_deleted=true` in Supabase table editor

## Empty State
- Delete all non-seed records and filter by a status with no matches → confirm empty state copy appears, not a blank white block

## Error Cases
- Submit Create Record form with blank title → confirm inline validation error, no DB write
- Simulate network failure (DevTools offline) during status change → confirm error banner appears, status reverts to previous value
- Open `/dashboard` with DB unreachable → confirm error state with retry button, not a crash

## Loading State
- Throttle network to Slow 3G in DevTools → reload `/dashboard` → confirm skeleton loaders appear before data

## Permissions (Sprint 3)
- Log in as a 'viewer' account → confirm **New Record** and **Edit** buttons are absent or disabled
- Attempt direct API POST to create a record as viewer → confirm 403 response
- Log in as user A; log in as user B in separate session → confirm each sees only their own records

## AI Suggestion (Sprint 4)
- Advance a record's last-updated date to 4 days ago (via Supabase table editor) → reload dashboard → confirm stall badge appears
- Trigger `suggest_status_change` for a stalled record → confirm suggestion row in review queue with confidence score
- Dismiss suggestion → confirm `review_status = 'dismissed'` in DB, status unchanged
- Approve suggestion → confirm status updated, audit_log row with `approved_by` present

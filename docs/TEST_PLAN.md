# Test Plan — Arterial Day-to-Day

## v1 Success Scenario (manual)
1. Open app homepage — dashboard loads with seeded items, no login prompt.
2. Click "New Work Item" — form renders with all fields.
3. Enter title "Weekly vendor invoice check", status "In Progress", assignee "Jordan", due date tomorrow.
4. Submit — item appears in the In Progress column within 1 second.
5. Open a second browser tab — item is visible without refresh (Realtime).
6. Click the item → edit status to "Blocked" → save.
7. Priority score increases; item is highlighted as blocked.
8. Activity feed shows two entries: 'created' and 'status_changed'.
9. Click delete → confirmation dialog → confirm → item removed from list.
10. Activity feed shows 'deleted' entry.

## Empty States
- Delete all items → each status column shows "No items here yet" copy.
- Activity feed with no events → shows "No activity yet".

## Error Cases
- Submit form with blank title → inline validation error, no DB write.
- Simulate network drop during create → error banner with retry button; no duplicate rows.
- Load dashboard with Supabase offline → error boundary renders with "Could not load items — retry" button.

## Realtime Check
- Two tabs open; create item in tab A; confirm it appears in tab B within 2 seconds without manual refresh.

## Priority Score Check
- Create item with due date yesterday and status 'blocked' → priority_score ≥ 0.7 stored in DB.
- Confirm `priority_source = 'rule_based_v1'` and `priority_review_status = 'unreviewed'`.

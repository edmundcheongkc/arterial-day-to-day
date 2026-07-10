# Tasks & Sprints — Arterial Day-to-Day

## Sprint 1 — DB + Core Work Item Engine
**Goal:** Schema live, CRUD working, seed data visible without login.
- [ ] Write and apply migration SQL (work_items, activity_logs, seed rows)
- [ ] Build work item list page — shows all items, 5 states (loading/empty/partial/error/ready)
- [ ] Build new-item form — title, status, assignee, due date
- [ ] Wire create → Supabase insert → activity_log entry
- [ ] Build edit form — update any field, writes activity_log
- [ ] Status dropdown — enforces allowed values (todo/in_progress/blocked/done)
- [ ] Delete button (lead-only in UI copy, permissive for now) → soft confirmation
- [ ] Seed demo rows visible on first load (no login wall)

**Definition of Done:** A new item submitted via the form appears in the list immediately; the activity log shows the creation event; deleting an item removes it from the list — all verified by manual test steps in TEST_PLAN.md.

---

## Sprint 2 — Dashboard + Activity Feed ✦ v1 functional milestone
**Goal:** Shared operational view is usable as the team's daily driver.
- [ ] Dashboard: items grouped by status column (Kanban-lite) with due date + assignee
- [ ] Priority score calculated on save (rule-based: overdue, blocked, unassigned)
- [ ] Overdue items visually flagged
- [ ] Activity feed panel — last 20 changes, newest first
- [ ] Realtime subscription — new items/updates appear without refresh
- [ ] Empty state copy for each column
- [ ] Error boundary on dashboard with retry

**Definition of Done:** Two browser tabs open; item created in tab A appears in tab B within 2 seconds; priority score reflects rules; overdue items are highlighted.

---

## Sprint 3 — Lock It Down (Auth + RLS)
**Goal:** Real users log in; data is owner-scoped; demo mode removed.
- [ ] Enable Supabase Auth (email/password)
- [ ] Login + signup pages (not the homepage)
- [ ] Replace permissive RLS policies with `auth.uid() = user_id` owner policies
- [ ] Assign `user_id` on create for authenticated users
- [ ] Role field on members (viewer/contributor/lead); enforce in server actions
- [ ] Session-aware navigation (user name, sign out)
- [ ] Remove or gate seed demo rows behind a dev flag

**Definition of Done:** Unauthenticated request to create an item is rejected by RLS; user A cannot edit user B's items; login flow completes and lands on dashboard.

---

## Sprint 4 — Polish + Intelligence
**Goal:** Daily-use quality; smart features layered on stable core.
- [ ] Bulk status update with approval confirmation
- [ ] Filter/search bar on dashboard
- [ ] Daily digest summary (auto-generated from activity_logs)
- [ ] LLM-assisted description suggestions (draft → approve pattern)
- [ ] Recurring item templates
- [ ] Audit log viewer for leads

**Definition of Done:** Digest renders for previous day's activity; LLM suggestion shown as draft with accept/reject buttons; accepted suggestion writes to DB and logs the action.

---

## Gantt (sprint → feature)
```
Sprint 1 |---DB schema, CRUD, seed, item form, edit, delete
Sprint 2 |---Dashboard, priority score, activity feed, realtime  ← v1 functional
Sprint 3 |---Auth, RLS lock-down, roles
Sprint 4 |---Filters, digest, LLM suggestions, templates
```

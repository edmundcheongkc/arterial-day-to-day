# Tasks & Sprints — Arterial Day-to-Day

## Sprint 1 — DB + Core Record Engine
**Goal:** The one core action works end-to-end: create, view, edit, delete, change status — all persisted, no login wall.

- [ ] Apply migration SQL (all tables + seed data)
- [ ] `/dashboard` page: full record list, status badges, assignee chips — no login required
- [ ] Create Record form: title, description, status, assigned_to, due_date → insert to DB
- [ ] Edit Record modal: all fields editable → update in DB
- [ ] Delete Record (soft): confirmation dialog → sets `is_deleted=true` → removed from list
- [ ] Status pill click → cycle status → DB update → optimistic UI update
- [ ] Activity row written on every create / edit / status-change
- [ ] Dashboard: loading skeleton, empty state copy, error banner
- [ ] Verify 4 seed records render on cold load with no auth

**Definition of Done:** A tester opens `/dashboard` in an incognito window, creates a record, changes its status, and sees the activity entry — all without logging in. A second incognito window reloads and sees the same record.

---

## Sprint 2 — Activity Feed, Team View & Filters ✦ **v1 functional milestone**
**Goal:** The full shared workflow is usable by the real team.

- [ ] Activity feed panel: last 20 events, newest first, live via Supabase Realtime
- [ ] Team Members page: list members; admin can add/remove
- [ ] Filter bar: filter by status, assignee
- [ ] Sort: overdue first, then by stall (no update in 3+ days), then due_date
- [ ] Overdue badge on records past due_date
- [ ] Audit log row written for every write action
- [ ] Empty state for activity feed and filtered-empty record list

**Definition of Done:** Two team members use the live URL simultaneously; one creates/updates a record; the other sees the change and the activity entry within 3 seconds without refreshing.

---

## Sprint 3 — Lock It Down (Auth + RLS)
**Goal:** Real users have accounts; data is owner-scoped; demo rows remain visible.

- [ ] Supabase Auth: email/password signup + login pages
- [ ] Replace permissive RLS policies with `auth.uid() = user_id` on all tables
- [ ] Attach `user_id` to new writes post-auth
- [ ] Role enforcement in API routes: viewers read-only, editors write, admins manage members
- [ ] Redirect unauthenticated users to `/login` (first time this gate exists)
- [ ] Verify cross-user isolation: user A cannot read user B's records

**Definition of Done:** Two separate Supabase Auth accounts each see only their own records. Role restrictions block a 'viewer' account from creating a record.

---

## Sprint 4 — Intelligence Layer
**Goal:** AI surfaces suggestions; humans approve before anything changes.

- [ ] Rule-based stall flag: records with no update in 3+ days get 'stalled' badge (no LLM)
- [ ] `suggest_status_change` tool: server-side OpenAI call → stores suggestion + source + confidence + review_status
- [ ] Review Queue UI: team lead sees pending suggestions, approves or dismisses
- [ ] Approved suggestion → status updated → audit log row written with `approved_by`
- [ ] `summarise_record_history` tool: auto (low-risk), one-line summary on record detail view

**Definition of Done:** A stalled record surfaces a status suggestion; a team lead approves it; the status changes and the audit log shows the approval.

---

## Gantt (sprint → feature)
```
Sprint 1:  DB schema, seed data, /dashboard, create/edit/delete/status record, activity writes
Sprint 2:  Activity feed (realtime), team page, filters, sort/overdue, audit logs   ← v1 functional
Sprint 3:  Auth, RLS lock-down, roles
Sprint 4:  Stall detection, AI suggestions, review queue
```

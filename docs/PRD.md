# Product Requirements — Arterial Day-to-Day

## Problem
The team tracks recurring operational work (records, statuses, owners) across disconnected spreadsheets and chat threads. There is no single shared view, so things slip, status is stale, and handoffs break.

## Target User
Internal team members (3–15 people) who run the same operational workflow every day — logging work, updating status, and handing off to colleagues.

## Core Objects
- **Work Record** — the unit of work: title, description, status, assignee, due date
- **Team Member** — person who owns or works records
- **Activity** — timestamped log entry for every state change
- **Audit Log** — immutable write history for every table

## MVP Must-Haves
- [ ] Create a work record with title, description, status, assignee, due date
- [ ] View all records in a shared dashboard (no login required in v1)
- [ ] Edit any field on a record; change persists to DB
- [ ] Advance record status through defined stages (To Do → In Progress → Done)
- [ ] Delete (soft) a record with confirmation
- [ ] Every write action appends an activity entry
- [ ] Dashboard shows loading, empty, error, and populated states correctly
- [ ] 4 seed demo records visible on first load

## Non-Goals (v1)
- User login / authentication
- Per-user data isolation
- AI suggestions
- External integrations (Slack, email)
- Mobile-native app

## Success Criteria
A team member opens the dashboard, creates a new work record assigned to a colleague, advances its status to In Progress, and a second team member on a different browser sees the updated record and activity entry — all without any login, within 60 seconds of first load.

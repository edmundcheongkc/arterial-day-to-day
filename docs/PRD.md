# Product Requirements — Arterial Day-to-Day

## Problem
The team tracks recurring operational work across spreadsheets and chat. Records fall through gaps, statuses are stale, and nobody has a single up-to-date view.

## Target User
Internal team members and their manager/lead who need to log work and see everyone's progress daily.

## Core Objects
- **WorkItem** — the unit of work logged (title, status, assignee, due date, notes)
- **Team** — the group sharing the dashboard
- **Member** — a person on the team with a role (viewer / contributor / lead)
- **ActivityLog** — every status change or note update, timestamped

## MVP Must-Haves
- [ ] Create, edit, and delete work items
- [ ] Set and update status per item (To Do / In Progress / Blocked / Done)
- [ ] Assign an item to a team member
- [ ] Shared dashboard shows all items, sorted by status and due date
- [ ] Activity feed shows recent changes across the team
- [ ] Seed data loads on first visit — no login required to see the app
- [ ] All creates/edits persist to the database and reflect immediately

## Non-Goals (v1)
- Email or Slack notifications
- Multiple teams / workspaces
- File attachments
- Time tracking
- Mobile-native app
- Public-facing pages

## Success Criteria
A team member opens the app, creates a new work item titled "Weekly vendor invoice check", sets status to In Progress, assigns it to a colleague, and every other team member refreshing the dashboard sees it appear instantly with the correct assignee and status — no spreadsheet involved.

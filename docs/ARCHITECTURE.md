# Architecture — Arterial Day-to-Day

## Stack
- **Frontend:** Next.js (App Router) on Vercel
- **Database + API:** Supabase (Postgres + RLS + Realtime)
- **Auth (Sprint 3):** Supabase Auth — added after core works
- **AI (Sprint 4):** OpenAI via server-side API route only

## Build Sequence
**Now:** DB schema → work record CRUD → shared dashboard → activity feed
**Next:** Auth + RLS lock-down → role enforcement → filters
**Later:** AI status suggestions → stall detection → export

## Key User Action — "Log a work record and everyone sees it"
1. Team member fills Create Record form in the browser
2. Next.js API route validates input server-side
3. Supabase insert writes to `work_records`; activity row written in same transaction
4. Supabase Realtime pushes the new row to all connected dashboards
5. Every client re-renders the record list with the new item and status badge
6. Audit log row written with before/after state

## Layer Plan
1. **Data layer** — tables, constraints, RLS policies (truth lives here)
2. **App logic** — Next.js server actions/API routes enforce business rules (status transitions, soft-delete)
3. **Smart features** — AI suggestions sit on top; removing them leaves the app fully functional

## Core Without AI
All CRUD, status transitions, activity feed, and dashboard work with zero AI calls. AI is additive only.

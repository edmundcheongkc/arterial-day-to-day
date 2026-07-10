# Architecture — Arterial Day-to-Day

## Stack
- **Frontend:** Next.js (App Router) on Vercel
- **Database + Auth:** Supabase (Postgres + RLS + Realtime)
- **Styling:** Tailwind CSS

## Build Order
**Now:** DB schema → work item CRUD → status updates → shared dashboard → activity feed → seed demo data
**Next:** Login/signup → member roles enforcement → per-user ownership (RLS lock-down)
**Later:** Smart prioritisation suggestions, recurring item templates, summary digest

## Key Action Flow — "Log a work item"
1. Team member fills in the new-item form (title, status, assignee, due date)
2. Form POSTs to a Next.js Server Action
3. Server Action inserts a row into `work_items` and writes an `activity_logs` entry
4. Supabase Realtime broadcasts the change
5. All open dashboard sessions receive the update and re-render the item list
6. Activity feed shows the new entry at the top

## Layer Plan
1. **Data layer:** tables, constraints, RLS policies, seed rows — truth lives here
2. **App logic:** CRUD actions, status machine, role checks in server code
3. **Smart features:** auto-priority scoring, overdue flagging, digest summaries (added after core is stable)

## Core Without AI
The app is fully operational with AI off. Smart features are additive overlays on top of stable CRUD.

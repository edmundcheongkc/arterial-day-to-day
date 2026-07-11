# Security — Arterial Day-to-Day

## Secret Handling
- `SUPABASE_SERVICE_ROLE_KEY` and `OPENAI_API_KEY` live in Vercel environment variables only
- Only server-side API routes access the service role key — never the browser client
- Public Supabase anon key is the only credential in frontend code

## Permission Model
**v1 (demo):** Permissive RLS — all reads and writes open; no login required.
**Sprint 3 (lock-down):**
- RLS policies replaced: `auth.uid() = user_id` for all owned tables
- `role` field on `team_members` enforced in Next.js middleware and API routes
- Viewers: read-only; Editors: create/edit records; Admins: add/remove members, approve AI actions

## Approved Tools Rule
- Agent may only call functions listed in `AGENTIC_LAYER.md`
- No `run_any`, `eval`, or raw SQL execution from agent context
- Every tool call is logged in `audit_logs` before the action fires

## Audit Principle
- Every write to `work_records`, `team_members`, or `activities` produces an `audit_logs` row
- Audit logs are append-only — no update or delete permitted (enforced by RLS: no `update`/`delete` policy on `audit_logs`)
- AI-generated field changes store `source`, `confidence`, and `review_status` before any value is applied

## Stop Points
- Payments, legal data, or PII at scale: stop and get a human before proceeding
- Any bulk-delete or export operation: human approval required, not agentic

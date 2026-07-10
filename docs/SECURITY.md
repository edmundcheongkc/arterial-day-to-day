# Security — Arterial Day-to-Day

## Secrets
- `SUPABASE_SERVICE_ROLE_KEY` lives only in Vercel server-side env; never sent to the browser
- Client uses `NEXT_PUBLIC_SUPABASE_ANON_KEY` (safe for public) with RLS as the guard
- No secrets in `.env.local` committed to repo

## Permission Model (v1 → lock-down)
| Role | Can do |
|---|---|
| Anonymous (demo) | Read all items, read activity feed |
| Contributor | Create + edit own items, update any status |
| Lead | All contributor actions + delete items + purge logs |

**v1 (demo):** Supabase RLS policies are permissive (`using (true)`) — safe for internal demo with no sensitive data.
**Lock-down sprint:** Replace with `auth.uid() = user_id` owner policies; add role check middleware in Next.js.

## Approved Tools Rule
Agent actions use only named, scoped tools (`tool_score_priority`, `tool_flag_overdue`). No `run_any` or `eval` patterns permitted.

## Audit Principle
Every create, update, delete, and agent action writes a row to `activity_logs` with actor, timestamp, before/after values. Logs are append-only; deletion of logs requires lead role and is recorded.

## Stop & Get Help
Any change touching auth, payments, or bulk data deletion must be reviewed by a human before deployment.

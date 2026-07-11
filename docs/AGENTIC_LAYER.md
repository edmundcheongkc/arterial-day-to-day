# Agentic Layer — Arterial Day-to-Day

## Risk Levels & Actions

### Low — Auto (no approval needed)
- Summarise a record's activity history into a one-line note
- Tag a record as 'stalled' based on rule-based stall score
- Auto-sort dashboard by urgency score

### Medium — Light Approval (team lead reviews before apply)
- Suggest a status change based on record age and description
- Draft a weekly ops summary from all record activity
- Reassign a record when assignee has >N open items (draft only)

### High — Always Approval (explicit confirm required)
- Send a Slack/email nudge to an assignee about a stalled record
- Bulk-update status on multiple records

### Critical — Human Only (never agentic)
- Hard-delete any record or activity row
- Export or exfiltrate full dataset
- Modify audit_logs

## Named Tools (approved list)
- `summarise_record_history(record_id)` — low risk, auto
- `suggest_status_change(record_id)` — medium, requires approval
- `draft_weekly_summary()` — medium, requires approval
- `flag_stalled_records()` — low, auto (rule-based, no LLM)

## Approval Flow
Draft → surfaced in Review Queue UI → team lead approves/dismisses → action fires → audit_log row written

## Audit Log Fields (every agent action)
`actor_name`, `tool_name`, `record_id`, `before_state`, `after_state`, `approved_by`, `approved_at`, `created_at`

## v1 vs Later
**v1:** No agentic actions — rule-based flags only.
**Sprint 4:** `suggest_status_change` + review queue UI.

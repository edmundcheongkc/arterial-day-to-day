# Agentic Layer — Arterial Day-to-Day

## Risk Levels & Actions

### Low — auto-execute (no approval)
- `score_priority` — recalculate priority score on save
- `flag_overdue` — mark items past due date
- `summarise_activity` — generate daily digest text from activity_logs

### Medium — show draft, one-click approve
- `suggest_assignee` — propose an assignee based on past patterns
- `bulk_status_update` — move all Done items to an archive view

### High — explicit approval required
- `send_digest_notification` — post summary to a channel (future)

### Critical — human only, never automated
- `delete_work_item` — permanent delete (must be intentional UI action)
- `purge_activity_logs` — irreversible, requires lead role

## Named Tools (v1)
- `tool_score_priority(work_item_id)` — reads item, writes priority fields
- `tool_flag_overdue()` — batch scan, updates flags

## Audit Log Fields (activity_logs)
`id, work_item_id, action, actor_name, previous_value, new_value, created_at`

## Agent Permissions
Agent inherits the calling user's role. No agent action may exceed contributor permissions without lead approval. All actions write to `activity_logs`.

## v1 vs Later
**v1:** Rule-based scoring + overdue flagging only
**Later:** LLM draft suggestions behind approval UI

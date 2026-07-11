# Intelligence Layer — Arterial Day-to-Day

## Messy Inputs (what the team logs today)
- Freeform status notes in chat
- Spreadsheet rows with inconsistent status labels
- Verbal handoffs with no written record

## Auto-Structure Target
Every work record must resolve to:
```json
{
  "title": "Q3 Vendor Reconciliation",
  "status": "in_progress",
  "assigned_to": "<team_member_id>",
  "due_date": "2025-08-10",
  "ai_status_suggestion": "blocked",
  "ai_status_suggestion_source": "gpt-4o / prompt-v1",
  "ai_status_suggestion_confidence": 0.82,
  "ai_status_suggestion_review_status": "unreviewed"
}
```

## Events to Track
- Record age since last status change (days)
- Number of status changes total
- Assignee workload (open record count)
- Days until due_date

## Scoring Rules (v1 — rule-based, no model needed)
- **Stall score:** days since last update ÷ expected cycle time → flag if > 1.5×
- **Overdue flag:** due_date < today AND status ≠ 'done'
- **Load score:** count of open records per assignee

## What Gets Ranked
- Records on dashboard sorted by: overdue first, then stall score desc, then due_date asc

## v1 vs Later
**v1:** Rule-based stall flag and overdue badge only — no LLM calls.
**Later:** LLM reads record title + description + history → suggests next status; stored with confidence + review_status; team lead approves before any change is applied.

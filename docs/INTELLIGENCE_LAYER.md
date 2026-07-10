# Intelligence Layer — Arterial Day-to-Day

## Messy Inputs
- Free-text descriptions with no consistent format
- Due dates sometimes missing
- Status updates buried in chat messages

## Auto-Structure (v1 rule-based, no LLM required)
```json
{
  "priority_score": 0.85,
  "priority_source": "rule_based_v1",
  "priority_confidence": 0.9,
  "priority_review_status": "unreviewed",
  "rules_fired": ["overdue", "blocked_status"]
}
```

## Scoring Rules (v1)
| Rule | Score bump |
|---|---|
| Due date is past today | +0.4 |
| Status = 'blocked' | +0.3 |
| No assignee set | +0.2 |
| Due within 2 days | +0.2 |
Scores clamp to 0–1. Items ranked by score descending on dashboard.

## Events to Track
- `work_item.created`
- `work_item.status_changed`
- `work_item.overdue` (computed at query time)
- `work_item.unassigned`

## v1 vs Later
**v1:** Rule-based priority score, overdue flag, blocked flag
**Next:** LLM-suggested description clean-up, auto-tag by work type
**Later:** Trend analysis — which items recur, who is most blocked

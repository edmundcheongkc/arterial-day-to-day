# Data Model — Arterial Day-to-Day

## work_items
| Field | Type | Notes |
|---|---|---|
| id | uuid PK | gen_random_uuid() |
| user_id | uuid nullable | owner (set at lock-down) |
| title | text not null | |
| description | text | |
| status | text not null | 'todo'\|'in_progress'\|'blocked'\|'done' |
| assignee_name | text | free-text for v1 |
| due_date | date | |
| priority_score | numeric | AI field — see below |
| priority_source | text | e.g. 'rule_based_v1' |
| priority_confidence | numeric | 0–1 |
| priority_review_status | text | default 'unreviewed' |
| created_at | timestamptz | default now() |

## activity_logs
| Field | Type | Notes |
|---|---|---|
| id | uuid PK | |
| user_id | uuid nullable | |
| work_item_id | uuid | FK → work_items.id |
| action | text | 'created'\|'status_changed'\|'edited'\|'deleted' |
| previous_value | jsonb | snapshot before change |
| new_value | jsonb | snapshot after change |
| actor_name | text | display name for v1 |
| created_at | timestamptz | default now() |

## Relationships
- `activity_logs.work_item_id` → `work_items.id`

## RLS
- v1: permissive read + write for all (demo-first)
- Lock-down sprint: owner-scoped policies using `auth.uid() = user_id`

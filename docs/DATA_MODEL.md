# Data Model — Arterial Day-to-Day

## team_members
| Field | Type | Notes |
|---|---|---|
| id | uuid PK | gen_random_uuid() |
| user_id | uuid | nullable; linked at lock-down sprint |
| display_name | text | not null |
| email | text | not null |
| role | text | 'viewer' / 'editor' / 'admin'; default 'editor' |
| created_at | timestamptz | not null, default now() |

## work_records
| Field | Type | Notes |
|---|---|---|
| id | uuid PK | |
| user_id | uuid | nullable |
| title | text | not null |
| description | text | |
| status | text | 'to_do' / 'in_progress' / 'done' / 'blocked' |
| assigned_to | uuid | FK → team_members.id |
| due_date | date | |
| is_deleted | boolean | soft-delete flag, default false |
| ai_status_suggestion | text | AI-generated field |
| ai_status_suggestion_source | text | model + prompt version |
| ai_status_suggestion_confidence | numeric | 0–1 |
| ai_status_suggestion_review_status | text | 'unreviewed' / 'approved' / 'dismissed' |
| created_at | timestamptz | |

## activities
| Field | Type | Notes |
|---|---|---|
| id | uuid PK | |
| user_id | uuid | nullable |
| record_id | uuid | FK → work_records.id |
| actor_name | text | display name at time of action |
| action | text | 'record_created' / 'status_changed' / 'field_updated' / 'record_deleted' |
| detail | jsonb | e.g. `{"from":"to_do","to":"in_progress"}` |
| created_at | timestamptz | |

## audit_logs
| Field | Type | Notes |
|---|---|---|
| id | uuid PK | |
| user_id | uuid | nullable |
| actor_name | text | |
| table_name | text | |
| row_id | uuid | |
| action | text | 'insert' / 'update' / 'delete' |
| before_state | jsonb | |
| after_state | jsonb | |
| created_at | timestamptz | |

## RLS
- v1: permissive read + write for all tables (demo-first)
- Sprint 3: replaced with `auth.uid() = user_id` owner policies

## Relationships
`work_records.assigned_to` → `team_members.id`
`activities.record_id` → `work_records.id`

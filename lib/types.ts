export type WorkRecordStatus = "to_do" | "in_progress" | "blocked" | "done";

export const WORK_RECORD_STATUSES: WorkRecordStatus[] = [
  "to_do",
  "in_progress",
  "blocked",
  "done",
];

export const STATUS_LABELS: Record<WorkRecordStatus, string> = {
  to_do: "To Do",
  in_progress: "In Progress",
  blocked: "Blocked",
  done: "Done",
};

export function isWorkRecordStatus(value: string): value is WorkRecordStatus {
  return (WORK_RECORD_STATUSES as string[]).includes(value);
}

export type WorkRecord = {
  id: string;
  user_id: string | null;
  title: string;
  description: string | null;
  status: WorkRecordStatus;
  assigned_to: string | null;
  due_date: string | null;
  is_deleted: boolean;
  ai_status_suggestion: string | null;
  ai_status_suggestion_source: string | null;
  ai_status_suggestion_confidence: number | null;
  ai_status_suggestion_review_status: string | null;
  created_at: string;
};

export type TeamMemberRole = "viewer" | "editor" | "admin";

export type TeamMember = {
  id: string;
  user_id: string | null;
  display_name: string;
  email: string;
  role: TeamMemberRole;
  created_at: string;
};

export type ActivityAction =
  | "record_created"
  | "status_changed"
  | "field_updated"
  | "record_deleted";

export type Activity = {
  id: string;
  user_id: string | null;
  record_id: string | null;
  actor_name: string;
  action: ActivityAction;
  detail: Record<string, unknown> | null;
  created_at: string;
};

export type AuditAction = "insert" | "update" | "delete";

export type AuditLog = {
  id: string;
  user_id: string | null;
  actor_name: string;
  table_name: string;
  row_id: string;
  action: AuditAction;
  before_state: Record<string, unknown> | null;
  after_state: Record<string, unknown> | null;
  created_at: string;
};

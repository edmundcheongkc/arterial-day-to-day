export type WorkItemStatus = "todo" | "in_progress" | "blocked" | "done";

export const WORK_ITEM_STATUSES: WorkItemStatus[] = [
  "todo",
  "in_progress",
  "blocked",
  "done",
];

export const STATUS_LABELS: Record<WorkItemStatus, string> = {
  todo: "To Do",
  in_progress: "In Progress",
  blocked: "Blocked",
  done: "Done",
};

export type WorkItem = {
  id: string;
  user_id: string | null;
  title: string;
  description: string | null;
  status: WorkItemStatus;
  assignee_name: string | null;
  due_date: string | null;
  priority_score: number;
  priority_source: string;
  priority_confidence: number;
  priority_review_status: string;
  created_at: string;
};

export type ActivityAction = "created" | "status_changed" | "edited" | "deleted";

export type ActivityLog = {
  id: string;
  user_id: string | null;
  work_item_id: string;
  action: ActivityAction;
  previous_value: Record<string, unknown> | null;
  new_value: Record<string, unknown> | null;
  actor_name: string | null;
  created_at: string;
};

export function isWorkItemStatus(value: string): value is WorkItemStatus {
  return (WORK_ITEM_STATUSES as string[]).includes(value);
}

import type { WorkItemStatus } from "@/lib/types";

export type PriorityInput = {
  status: WorkItemStatus;
  due_date: string | null;
  assignee_name: string | null;
};

export type PriorityResult = {
  priority_score: number;
  priority_source: "rule_based_v1";
  priority_confidence: number;
  priority_review_status: "unreviewed";
  rules_fired: string[];
};

function daysUntil(dateStr: string): number {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const due = new Date(dateStr);
  due.setHours(0, 0, 0, 0);
  return Math.round((due.getTime() - today.getTime()) / 86_400_000);
}

export function scorePriority(input: PriorityInput): PriorityResult {
  let score = 0;
  const rules_fired: string[] = [];

  if (input.due_date) {
    const diff = daysUntil(input.due_date);
    if (diff < 0) {
      score += 0.4;
      rules_fired.push("overdue");
    } else if (diff <= 2) {
      score += 0.2;
      rules_fired.push("due_soon");
    }
  }

  if (input.status === "blocked") {
    score += 0.3;
    rules_fired.push("blocked_status");
  }

  if (!input.assignee_name || input.assignee_name.trim() === "") {
    score += 0.2;
    rules_fired.push("unassigned");
  }

  score = Math.min(1, Math.max(0, score));

  return {
    priority_score: Math.round(score * 100) / 100,
    priority_source: "rule_based_v1",
    priority_confidence: 0.9,
    priority_review_status: "unreviewed",
    rules_fired,
  };
}

export function isOverdue(item: PriorityInput): boolean {
  if (!item.due_date) return false;
  if (item.status === "done") return false;
  return daysUntil(item.due_date) < 0;
}

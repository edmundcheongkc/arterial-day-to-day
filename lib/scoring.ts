import type { WorkRecord } from "@/lib/types";

const STALL_THRESHOLD_DAYS = 3;

function daysSince(iso: string): number {
  const then = new Date(iso).getTime();
  return (Date.now() - then) / 86_400_000;
}

export function isOverdue(record: Pick<WorkRecord, "due_date" | "status">): boolean {
  if (!record.due_date) return false;
  if (record.status === "done") return false;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const due = new Date(record.due_date + "T00:00:00");
  return due.getTime() < today.getTime();
}

export function isStalled(record: Pick<WorkRecord, "status">, lastActivityAt: string): boolean {
  if (record.status === "done") return false;
  return daysSince(lastActivityAt) >= STALL_THRESHOLD_DAYS;
}

export function sortRecords(
  records: WorkRecord[],
  lastActivityMap: Map<string, string>,
): WorkRecord[] {
  return [...records].sort((a, b) => {
    const aOverdue = isOverdue(a);
    const bOverdue = isOverdue(b);
    if (aOverdue !== bOverdue) return aOverdue ? -1 : 1;

    const aStalled = isStalled(a, lastActivityMap.get(a.id) ?? a.created_at);
    const bStalled = isStalled(b, lastActivityMap.get(b.id) ?? b.created_at);
    if (aStalled !== bStalled) return aStalled ? -1 : 1;

    if (a.due_date && b.due_date) return a.due_date.localeCompare(b.due_date);
    if (a.due_date) return -1;
    if (b.due_date) return 1;
    return a.created_at.localeCompare(b.created_at);
  });
}

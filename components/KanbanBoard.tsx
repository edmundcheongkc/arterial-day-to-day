import { STATUS_LABELS, WORK_RECORD_STATUSES, type TeamMember, type WorkRecord } from "@/lib/types";
import { sortRecords, isStalled } from "@/lib/scoring";
import { WorkRecordCard } from "@/components/WorkRecordCard";

const COLUMN_EMPTY_COPY: Record<string, string> = {
  to_do: "No records here yet.",
  in_progress: "Nothing in progress.",
  blocked: "Nothing blocked — nice.",
  done: "No completed records yet.",
};

export function KanbanBoard({
  records,
  teamMembers,
  lastActivityMap,
}: {
  records: WorkRecord[];
  teamMembers: TeamMember[];
  lastActivityMap: Map<string, string>;
}) {
  const memberById = new Map(teamMembers.map((m) => [m.id, m.display_name]));
  const sorted = sortRecords(records, lastActivityMap);

  if (records.length === 0) {
    return (
      <div className="text-center py-16 text-neutral-500 text-sm border border-dashed border-neutral-300 rounded-lg">
        No matching records.
      </div>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {WORK_RECORD_STATUSES.map((status) => {
        const columnRecords = sorted.filter((r) => r.status === status);
        return (
          <div key={status} className="flex flex-col gap-3 min-w-0">
            <div className="flex items-center justify-between px-1">
              <h2 className="text-xs font-semibold uppercase tracking-wide text-neutral-500">
                {STATUS_LABELS[status]}
              </h2>
              <span className="text-xs text-neutral-400">{columnRecords.length}</span>
            </div>
            {columnRecords.length === 0 ? (
              <div className="text-center py-8 text-xs text-neutral-400 border border-dashed border-neutral-300 rounded-lg">
                {COLUMN_EMPTY_COPY[status]}
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                {columnRecords.map((record) => (
                  <WorkRecordCard
                    key={record.id}
                    record={record}
                    assigneeName={record.assigned_to ? memberById.get(record.assigned_to) ?? null : null}
                    stalled={isStalled(record, lastActivityMap.get(record.id) ?? record.created_at)}
                    teamMembers={teamMembers}
                  />
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

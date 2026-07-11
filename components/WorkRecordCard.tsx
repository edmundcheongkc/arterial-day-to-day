"use client";

import { useState } from "react";
import { StatusSelect } from "@/components/StatusSelect";
import { EditWorkRecordForm } from "@/components/EditWorkRecordForm";
import { DeleteWorkRecordButton } from "@/components/DeleteWorkRecordButton";
import { isOverdue } from "@/lib/scoring";
import type { TeamMember, WorkRecord } from "@/lib/types";

function formatDueDate(due_date: string | null): string {
  if (!due_date) return "No due date";
  const d = new Date(due_date + "T00:00:00");
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export function WorkRecordCard({
  record,
  assigneeName,
  stalled,
  teamMembers,
}: {
  record: WorkRecord;
  assigneeName: string | null;
  stalled: boolean;
  teamMembers: TeamMember[];
}) {
  const [isEditing, setIsEditing] = useState(false);
  const overdue = isOverdue(record);

  return (
    <div
      className={`border rounded-lg p-4 bg-white shadow-sm ${
        overdue ? "border-red-300 ring-1 ring-red-100" : "border-neutral-200"
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="font-medium text-sm truncate">{record.title}</h3>
            {overdue && (
              <span className="shrink-0 text-[10px] font-semibold uppercase tracking-wide text-red-700 bg-red-100 rounded-full px-1.5 py-0.5">
                Overdue
              </span>
            )}
            {stalled && !overdue && (
              <span className="shrink-0 text-[10px] font-semibold uppercase tracking-wide text-amber-700 bg-amber-100 rounded-full px-1.5 py-0.5">
                Stalled
              </span>
            )}
          </div>
          {record.description && (
            <p className="text-xs text-neutral-500 mt-1 line-clamp-2">{record.description}</p>
          )}
          <div className="flex flex-wrap gap-x-3 gap-y-1 mt-2 text-xs text-neutral-500">
            <span>{assigneeName ?? "Unassigned"}</span>
            <span>·</span>
            <span className={overdue ? "text-red-600 font-medium" : undefined}>
              {formatDueDate(record.due_date)}
            </span>
          </div>
        </div>
        <StatusSelect id={record.id} status={record.status} />
      </div>

      {isEditing ? (
        <EditWorkRecordForm
          record={record}
          teamMembers={teamMembers}
          onCancel={() => setIsEditing(false)}
          onSaved={() => setIsEditing(false)}
        />
      ) : (
        <div className="flex items-center justify-between mt-3 pt-3 border-t border-neutral-100">
          <button onClick={() => setIsEditing(true)} className="text-xs text-neutral-600 hover:underline">
            Edit
          </button>
          <DeleteWorkRecordButton id={record.id} title={record.title} />
        </div>
      )}
    </div>
  );
}

"use client";

import { useState } from "react";
import { StatusSelect } from "@/components/StatusSelect";
import { EditWorkItemForm } from "@/components/EditWorkItemForm";
import { DeleteWorkItemButton } from "@/components/DeleteWorkItemButton";
import { isOverdue } from "@/lib/priority";
import type { WorkItem } from "@/lib/types";

function formatDueDate(due_date: string | null): string {
  if (!due_date) return "No due date";
  const d = new Date(due_date + "T00:00:00");
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export function WorkItemCard({ item }: { item: WorkItem }) {
  const [isEditing, setIsEditing] = useState(false);
  const overdue = isOverdue(item);

  return (
    <div
      className={`border rounded-lg p-4 bg-white shadow-sm ${
        overdue ? "border-red-300 ring-1 ring-red-100" : "border-neutral-200"
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="font-medium text-sm truncate">{item.title}</h3>
            {overdue && (
              <span className="shrink-0 text-[10px] font-semibold uppercase tracking-wide text-red-700 bg-red-100 rounded-full px-1.5 py-0.5">
                Overdue
              </span>
            )}
          </div>
          {item.description && (
            <p className="text-xs text-neutral-500 mt-1 line-clamp-2">{item.description}</p>
          )}
          <div className="flex flex-wrap gap-x-3 gap-y-1 mt-2 text-xs text-neutral-500">
            <span>{item.assignee_name || "Unassigned"}</span>
            <span>·</span>
            <span className={overdue ? "text-red-600 font-medium" : undefined}>
              {formatDueDate(item.due_date)}
            </span>
            <span>·</span>
            <span>priority {item.priority_score.toFixed(2)}</span>
          </div>
        </div>
        <StatusSelect id={item.id} status={item.status} />
      </div>

      {isEditing ? (
        <EditWorkItemForm
          item={item}
          onCancel={() => setIsEditing(false)}
          onSaved={() => setIsEditing(false)}
        />
      ) : (
        <div className="flex items-center justify-between mt-3 pt-3 border-t border-neutral-100">
          <button onClick={() => setIsEditing(true)} className="text-xs text-neutral-600 hover:underline">
            Edit
          </button>
          <DeleteWorkItemButton id={item.id} title={item.title} />
        </div>
      )}
    </div>
  );
}

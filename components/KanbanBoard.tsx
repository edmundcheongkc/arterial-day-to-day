import { STATUS_LABELS, WORK_ITEM_STATUSES, type WorkItem } from "@/lib/types";
import { WorkItemCard } from "@/components/WorkItemCard";

const COLUMN_EMPTY_COPY: Record<string, string> = {
  todo: "No items here yet.",
  in_progress: "Nothing in progress.",
  blocked: "Nothing blocked — nice.",
  done: "No completed items yet.",
};

export function KanbanBoard({ items }: { items: WorkItem[] }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {WORK_ITEM_STATUSES.map((status) => {
        const columnItems = items.filter((item) => item.status === status);
        return (
          <div key={status} className="flex flex-col gap-3 min-w-0">
            <div className="flex items-center justify-between px-1">
              <h2 className="text-xs font-semibold uppercase tracking-wide text-neutral-500">
                {STATUS_LABELS[status]}
              </h2>
              <span className="text-xs text-neutral-400">{columnItems.length}</span>
            </div>
            {columnItems.length === 0 ? (
              <div className="text-center py-8 text-xs text-neutral-400 border border-dashed border-neutral-300 rounded-lg">
                {COLUMN_EMPTY_COPY[status]}
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                {columnItems.map((item) => (
                  <WorkItemCard key={item.id} item={item} />
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

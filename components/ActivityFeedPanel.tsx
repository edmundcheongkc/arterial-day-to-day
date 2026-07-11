import type { ActivityLog } from "@/lib/types";

const ACTION_LABELS: Record<ActivityLog["action"], string> = {
  created: "created",
  status_changed: "changed status on",
  edited: "edited",
  deleted: "deleted",
};

function relativeTime(iso: string): string {
  const diffMs = Date.now() - new Date(iso).getTime();
  const mins = Math.round(diffMs / 60_000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.round(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.round(hours / 24);
  return `${days}d ago`;
}

function itemTitle(log: ActivityLog): string {
  const title = (log.new_value?.title ?? log.previous_value?.title) as string | undefined;
  return title ?? "a work item";
}

export function ActivityFeedPanel({ logs }: { logs: ActivityLog[] }) {
  return (
    <aside className="border border-neutral-200 rounded-lg bg-white shadow-sm p-4 h-fit">
      <h2 className="text-sm font-semibold mb-3">Activity Feed</h2>
      {logs.length === 0 ? (
        <p className="text-xs text-neutral-500">No activity yet.</p>
      ) : (
        <ul className="space-y-3">
          {logs.map((log) => (
            <li key={log.id} className="text-xs">
              <p className="text-neutral-700">
                <span className="font-medium">{log.actor_name || "Someone"}</span>{" "}
                {ACTION_LABELS[log.action]}{" "}
                <span className="font-medium">&ldquo;{itemTitle(log)}&rdquo;</span>
              </p>
              <p className="text-neutral-400 mt-0.5">{relativeTime(log.created_at)}</p>
            </li>
          ))}
        </ul>
      )}
    </aside>
  );
}

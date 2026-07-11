import type { Activity } from "@/lib/types";

const ACTION_LABELS: Record<Activity["action"], string> = {
  record_created: "created",
  status_changed: "changed status on",
  field_updated: "edited",
  record_deleted: "deleted",
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

function recordTitle(activity: Activity, titleMap: Map<string, string>): string {
  const title = activity.detail?.title as string | undefined;
  if (title) return title;
  if (activity.record_id) return titleMap.get(activity.record_id) ?? "a work record";
  return "a work record";
}

export function ActivityFeedPanel({
  activities,
  titleMap,
}: {
  activities: Activity[];
  titleMap: Map<string, string>;
}) {
  return (
    <aside className="border border-neutral-200 rounded-lg bg-white shadow-sm p-4 h-fit">
      <h2 className="text-sm font-semibold mb-3">Activity Feed</h2>
      {activities.length === 0 ? (
        <p className="text-xs text-neutral-500">No activity yet.</p>
      ) : (
        <ul className="space-y-3">
          {activities.map((activity) => (
            <li key={activity.id} className="text-xs">
              <p className="text-neutral-700">
                <span className="font-medium">{activity.actor_name || "Someone"}</span>{" "}
                {ACTION_LABELS[activity.action]}{" "}
                <span className="font-medium">&ldquo;{recordTitle(activity, titleMap)}&rdquo;</span>
              </p>
              <p className="text-neutral-400 mt-0.5">{relativeTime(activity.created_at)}</p>
            </li>
          ))}
        </ul>
      )}
    </aside>
  );
}

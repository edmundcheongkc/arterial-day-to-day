"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { STATUS_LABELS, WORK_RECORD_STATUSES, type TeamMember } from "@/lib/types";

export function FilterBar({ teamMembers }: { teamMembers: TeamMember[] }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const status = searchParams.get("status") ?? "";
  const assignee = searchParams.get("assignee") ?? "";

  function updateParam(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value) params.set(key, value);
    else params.delete(key);
    router.push(`${pathname}?${params.toString()}`);
  }

  const hasFilters = status || assignee;

  return (
    <div className="flex flex-wrap items-center gap-2 mb-4">
      <select
        value={status}
        onChange={(e) => updateParam("status", e.target.value)}
        className="text-xs rounded-md border border-neutral-300 px-2 py-1.5"
      >
        <option value="">All statuses</option>
        {WORK_RECORD_STATUSES.map((s) => (
          <option key={s} value={s}>
            {STATUS_LABELS[s]}
          </option>
        ))}
      </select>

      <select
        value={assignee}
        onChange={(e) => updateParam("assignee", e.target.value)}
        className="text-xs rounded-md border border-neutral-300 px-2 py-1.5"
      >
        <option value="">All assignees</option>
        {teamMembers.map((m) => (
          <option key={m.id} value={m.id}>
            {m.display_name}
          </option>
        ))}
      </select>

      {hasFilters && (
        <button
          onClick={() => router.push(pathname)}
          className="text-xs text-neutral-500 hover:underline"
        >
          Clear filters
        </button>
      )}
    </div>
  );
}

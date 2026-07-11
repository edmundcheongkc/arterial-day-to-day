"use client";

import { useState, useTransition } from "react";
import { removeTeamMember } from "@/lib/actions/team-members";

export function RemoveTeamMemberButton({ id, name }: { id: string; name: string }) {
  const [confirming, setConfirming] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  if (confirming) {
    return (
      <div className="flex flex-col items-end gap-1">
        <div className="flex items-center gap-2 text-xs">
          <span className="text-neutral-600">Remove &ldquo;{name}&rdquo;?</span>
          <button
            disabled={isPending}
            onClick={() =>
              startTransition(async () => {
                const result = await removeTeamMember(id);
                if (!result.ok) {
                  setError(result.error);
                }
                setConfirming(false);
              })
            }
            className="px-2 py-1 rounded bg-red-600 text-white hover:bg-red-700 disabled:opacity-50"
          >
            {isPending ? "Removing…" : "Confirm"}
          </button>
          <button
            disabled={isPending}
            onClick={() => setConfirming(false)}
            className="px-2 py-1 rounded border border-neutral-300 hover:bg-neutral-100"
          >
            Cancel
          </button>
        </div>
        {error && <span className="text-xs text-red-600">{error}</span>}
      </div>
    );
  }

  return (
    <div className="flex flex-col items-end gap-1">
      <button onClick={() => setConfirming(true)} className="text-xs text-red-600 hover:underline">
        Remove
      </button>
      {error && <span className="text-xs text-red-600">{error}</span>}
    </div>
  );
}

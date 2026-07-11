"use client";

import { useState, useTransition } from "react";
import { updateWorkRecordStatus } from "@/lib/actions/work-records";
import { STATUS_LABELS, WORK_RECORD_STATUSES, type WorkRecordStatus } from "@/lib/types";

const STATUS_STYLES: Record<WorkRecordStatus, string> = {
  to_do: "bg-neutral-100 text-neutral-700 border-neutral-300",
  in_progress: "bg-blue-50 text-blue-700 border-blue-300",
  blocked: "bg-red-50 text-red-700 border-red-300",
  done: "bg-green-50 text-green-700 border-green-300",
};

export function StatusSelect({
  id,
  status,
  disabled = false,
}: {
  id: string;
  status: WorkRecordStatus;
  disabled?: boolean;
}) {
  const [value, setValue] = useState(status);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  return (
    <div className="flex flex-col gap-1">
      <select
        value={value}
        disabled={disabled || isPending}
        onChange={(e) => {
          const next = e.target.value as WorkRecordStatus;
          const prev = value;
          setValue(next);
          setError(null);
          startTransition(async () => {
            const result = await updateWorkRecordStatus(id, next);
            if (!result.ok) {
              setValue(prev);
              setError(result.error);
            }
          });
        }}
        className={`text-xs font-medium border rounded-full px-2.5 py-1 cursor-pointer disabled:opacity-50 ${STATUS_STYLES[value]}`}
      >
        {WORK_RECORD_STATUSES.map((s) => (
          <option key={s} value={s}>
            {STATUS_LABELS[s]}
          </option>
        ))}
      </select>
      {error && <span className="text-xs text-red-600">{error}</span>}
    </div>
  );
}

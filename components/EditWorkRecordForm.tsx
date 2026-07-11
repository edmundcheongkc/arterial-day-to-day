"use client";

import { useActionState } from "react";
import { updateWorkRecord, type ActionResult } from "@/lib/actions/work-records";
import { WorkRecordFormFields } from "@/components/WorkRecordFormFields";
import type { TeamMember, WorkRecord } from "@/lib/types";

const initialState: ActionResult | null = null;

export function EditWorkRecordForm({
  record,
  teamMembers,
  onCancel,
  onSaved,
}: {
  record: WorkRecord;
  teamMembers: TeamMember[];
  onCancel: () => void;
  onSaved: () => void;
}) {
  const boundUpdate = updateWorkRecord.bind(null, record.id);
  const [state, formAction, isPending] = useActionState(async (
    prev: ActionResult | null,
    formData: FormData,
  ) => {
    const result = await boundUpdate(prev, formData);
    if (result.ok) onSaved();
    return result;
  }, initialState);

  return (
    <div className="border border-neutral-200 rounded-lg p-4 bg-white shadow-sm mt-2 w-full">
      <h3 className="text-sm font-semibold mb-3">Edit Work Record</h3>
      <form action={formAction} className="space-y-3">
        <WorkRecordFormFields record={record} teamMembers={teamMembers} />
        {state && !state.ok && <p className="text-xs text-red-600">{state.error}</p>}
        <div className="flex gap-2 pt-1">
          <button
            type="submit"
            disabled={isPending}
            className="px-3 py-1.5 rounded-md bg-neutral-900 text-white text-sm hover:bg-neutral-700 disabled:opacity-50"
          >
            {isPending ? "Saving…" : "Save"}
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="px-3 py-1.5 rounded-md border border-neutral-300 text-sm hover:bg-neutral-100"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

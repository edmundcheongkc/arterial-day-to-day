"use client";

import { useActionState, useRef, useState } from "react";
import { createWorkRecord, type ActionResult } from "@/lib/actions/work-records";
import { WorkRecordFormFields } from "@/components/WorkRecordFormFields";
import type { TeamMember } from "@/lib/types";

const initialState: ActionResult | null = null;

export function NewWorkRecordForm({ teamMembers }: { teamMembers: TeamMember[] }) {
  const [open, setOpen] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const [state, formAction, isPending] = useActionState(async (
    prev: ActionResult | null,
    formData: FormData,
  ) => {
    const result = await createWorkRecord(prev, formData);
    if (result.ok) {
      formRef.current?.reset();
      setOpen(false);
    }
    return result;
  }, initialState);

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="px-4 py-2 rounded-md bg-neutral-900 text-white text-sm font-medium hover:bg-neutral-700"
      >
        + New Record
      </button>
    );
  }

  return (
    <div className="border border-neutral-200 rounded-lg p-4 bg-white shadow-sm max-w-md">
      <h2 className="text-sm font-semibold mb-3">New Work Record</h2>
      <form ref={formRef} action={formAction} className="space-y-3">
        <WorkRecordFormFields teamMembers={teamMembers} />
        {state && !state.ok && <p className="text-xs text-red-600">{state.error}</p>}
        <div className="flex gap-2 pt-1">
          <button
            type="submit"
            disabled={isPending}
            className="px-3 py-1.5 rounded-md bg-neutral-900 text-white text-sm hover:bg-neutral-700 disabled:opacity-50"
          >
            {isPending ? "Saving…" : "Create"}
          </button>
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="px-3 py-1.5 rounded-md border border-neutral-300 text-sm hover:bg-neutral-100"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

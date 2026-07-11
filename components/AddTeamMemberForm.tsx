"use client";

import { useActionState, useRef, useState } from "react";
import { addTeamMember, type ActionResult } from "@/lib/actions/team-members";

const initialState: ActionResult | null = null;

export function AddTeamMemberForm() {
  const [open, setOpen] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const [state, formAction, isPending] = useActionState(async (
    prev: ActionResult | null,
    formData: FormData,
  ) => {
    const result = await addTeamMember(prev, formData);
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
        + Add Member
      </button>
    );
  }

  return (
    <div className="border border-neutral-200 rounded-lg p-4 bg-white shadow-sm max-w-md">
      <h2 className="text-sm font-semibold mb-3">Add Team Member</h2>
      <form ref={formRef} action={formAction} className="space-y-3">
        <div>
          <label className="block text-xs font-medium text-neutral-600 mb-1" htmlFor="display_name">
            Name <span className="text-red-600">*</span>
          </label>
          <input
            id="display_name"
            name="display_name"
            required
            placeholder="Priya Nair"
            className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-neutral-600 mb-1" htmlFor="email">
            Email <span className="text-red-600">*</span>
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            placeholder="priya@arterial.internal"
            className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-neutral-600 mb-1" htmlFor="role">
            Role
          </label>
          <select
            id="role"
            name="role"
            defaultValue="editor"
            className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm"
          >
            <option value="viewer">Viewer</option>
            <option value="editor">Editor</option>
            <option value="admin">Admin</option>
          </select>
        </div>
        {state && !state.ok && <p className="text-xs text-red-600">{state.error}</p>}
        <div className="flex gap-2 pt-1">
          <button
            type="submit"
            disabled={isPending}
            className="px-3 py-1.5 rounded-md bg-neutral-900 text-white text-sm hover:bg-neutral-700 disabled:opacity-50"
          >
            {isPending ? "Saving…" : "Add"}
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

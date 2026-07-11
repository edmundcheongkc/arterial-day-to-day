import { STATUS_LABELS, WORK_RECORD_STATUSES, type TeamMember, type WorkRecord } from "@/lib/types";

export function WorkRecordFormFields({
  record,
  teamMembers,
}: {
  record?: WorkRecord;
  teamMembers: TeamMember[];
}) {
  return (
    <div className="space-y-3">
      <div>
        <label className="block text-xs font-medium text-neutral-600 mb-1" htmlFor="title">
          Title <span className="text-red-600">*</span>
        </label>
        <input
          id="title"
          name="title"
          required
          defaultValue={record?.title}
          placeholder="Q3 Vendor Reconciliation"
          className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm"
        />
      </div>

      <div>
        <label className="block text-xs font-medium text-neutral-600 mb-1" htmlFor="description">
          Description
        </label>
        <textarea
          id="description"
          name="description"
          defaultValue={record?.description ?? ""}
          rows={2}
          placeholder="Optional detail"
          className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm"
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-medium text-neutral-600 mb-1" htmlFor="status">
            Status
          </label>
          <select
            id="status"
            name="status"
            defaultValue={record?.status ?? "to_do"}
            className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm"
          >
            {WORK_RECORD_STATUSES.map((s) => (
              <option key={s} value={s}>
                {STATUS_LABELS[s]}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-medium text-neutral-600 mb-1" htmlFor="due_date">
            Due date
          </label>
          <input
            id="due_date"
            name="due_date"
            type="date"
            defaultValue={record?.due_date ?? ""}
            className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm"
          />
        </div>
      </div>

      <div>
        <label className="block text-xs font-medium text-neutral-600 mb-1" htmlFor="assigned_to">
          Assignee
        </label>
        <select
          id="assigned_to"
          name="assigned_to"
          defaultValue={record?.assigned_to ?? ""}
          className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm"
        >
          <option value="">Unassigned</option>
          {teamMembers.map((m) => (
            <option key={m.id} value={m.id}>
              {m.display_name}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}

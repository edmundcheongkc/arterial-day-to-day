import { STATUS_LABELS, WORK_ITEM_STATUSES, type WorkItem } from "@/lib/types";

export function WorkItemFormFields({ item }: { item?: WorkItem }) {
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
          defaultValue={item?.title}
          placeholder="Weekly vendor invoice check"
          className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm"
        />
      </div>

      <div>
        <label className="block text-xs font-medium text-neutral-600 mb-1" htmlFor="description">
          Notes
        </label>
        <textarea
          id="description"
          name="description"
          defaultValue={item?.description ?? ""}
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
            defaultValue={item?.status ?? "todo"}
            className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm"
          >
            {WORK_ITEM_STATUSES.map((s) => (
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
            defaultValue={item?.due_date ?? ""}
            className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm"
          />
        </div>
      </div>

      <div>
        <label className="block text-xs font-medium text-neutral-600 mb-1" htmlFor="assignee_name">
          Assignee
        </label>
        <input
          id="assignee_name"
          name="assignee_name"
          defaultValue={item?.assignee_name ?? ""}
          placeholder="Jordan"
          className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm"
        />
      </div>
    </div>
  );
}

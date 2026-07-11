"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { scorePriority } from "@/lib/priority";
import { isWorkItemStatus, type WorkItem, type ActivityLog } from "@/lib/types";

export type ActionResult = { ok: true } | { ok: false; error: string };

function parseDueDate(value: FormDataEntryValue | null): string | null {
  if (!value || typeof value !== "string" || value.trim() === "") return null;
  return value;
}

export async function getWorkItems(): Promise<WorkItem[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("work_items")
    .select("*")
    .order("priority_score", { ascending: false })
    .order("created_at", { ascending: false });
  if (error) throw new Error(error.message);
  return data as WorkItem[];
}

export async function getActivityLog(limit = 20): Promise<ActivityLog[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("activity_logs")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(limit);
  if (error) throw new Error(error.message);
  return data as ActivityLog[];
}

export async function createWorkItem(
  _prevState: ActionResult | null,
  formData: FormData,
): Promise<ActionResult> {
  const title = String(formData.get("title") ?? "").trim();
  if (!title) return { ok: false, error: "Title is required." };

  const statusRaw = String(formData.get("status") ?? "todo");
  const status = isWorkItemStatus(statusRaw) ? statusRaw : "todo";
  const assignee_name = String(formData.get("assignee_name") ?? "").trim() || null;
  const due_date = parseDueDate(formData.get("due_date"));
  const description = String(formData.get("description") ?? "").trim() || null;

  const priority = scorePriority({ status, due_date, assignee_name });

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("work_items")
    .insert({
      title,
      description,
      status,
      assignee_name,
      due_date,
      priority_score: priority.priority_score,
      priority_source: priority.priority_source,
      priority_confidence: priority.priority_confidence,
      priority_review_status: priority.priority_review_status,
    })
    .select()
    .single();

  if (error) return { ok: false, error: error.message };

  await supabase.from("activity_logs").insert({
    work_item_id: data.id,
    action: "created",
    previous_value: null,
    new_value: { title: data.title, status: data.status, assignee_name: data.assignee_name },
    actor_name: assignee_name ?? "Unknown",
  });

  revalidatePath("/");
  return { ok: true };
}

export async function updateWorkItem(
  id: string,
  _prevState: ActionResult | null,
  formData: FormData,
): Promise<ActionResult> {
  const supabase = await createClient();
  const { data: existing, error: fetchError } = await supabase
    .from("work_items")
    .select("*")
    .eq("id", id)
    .single();
  if (fetchError || !existing) return { ok: false, error: fetchError?.message ?? "Item not found." };

  const title = String(formData.get("title") ?? "").trim();
  if (!title) return { ok: false, error: "Title is required." };

  const statusRaw = String(formData.get("status") ?? existing.status);
  const status = isWorkItemStatus(statusRaw) ? statusRaw : existing.status;
  const assignee_name = String(formData.get("assignee_name") ?? "").trim() || null;
  const due_date = parseDueDate(formData.get("due_date"));
  const description = String(formData.get("description") ?? "").trim() || null;

  const priority = scorePriority({ status, due_date, assignee_name });

  const { data: updated, error } = await supabase
    .from("work_items")
    .update({
      title,
      description,
      status,
      assignee_name,
      due_date,
      priority_score: priority.priority_score,
      priority_source: priority.priority_source,
      priority_confidence: priority.priority_confidence,
      priority_review_status: priority.priority_review_status,
    })
    .eq("id", id)
    .select()
    .single();

  if (error) return { ok: false, error: error.message };

  const action = existing.status !== status ? "status_changed" : "edited";

  await supabase.from("activity_logs").insert({
    work_item_id: id,
    action,
    previous_value: {
      title: existing.title,
      status: existing.status,
      assignee_name: existing.assignee_name,
      due_date: existing.due_date,
    },
    new_value: {
      title: updated.title,
      status: updated.status,
      assignee_name: updated.assignee_name,
      due_date: updated.due_date,
    },
    actor_name: assignee_name ?? existing.assignee_name ?? "Unknown",
  });

  revalidatePath("/");
  return { ok: true };
}

export async function updateWorkItemStatus(id: string, status: string): Promise<ActionResult> {
  if (!isWorkItemStatus(status)) return { ok: false, error: "Invalid status." };
  const supabase = await createClient();
  const { data: existing, error: fetchError } = await supabase
    .from("work_items")
    .select("*")
    .eq("id", id)
    .single();
  if (fetchError || !existing) return { ok: false, error: fetchError?.message ?? "Item not found." };

  const priority = scorePriority({
    status,
    due_date: existing.due_date,
    assignee_name: existing.assignee_name,
  });

  const { data: updated, error } = await supabase
    .from("work_items")
    .update({
      status,
      priority_score: priority.priority_score,
      priority_source: priority.priority_source,
      priority_confidence: priority.priority_confidence,
      priority_review_status: priority.priority_review_status,
    })
    .eq("id", id)
    .select()
    .single();

  if (error) return { ok: false, error: error.message };

  await supabase.from("activity_logs").insert({
    work_item_id: id,
    action: "status_changed",
    previous_value: { title: existing.title, status: existing.status },
    new_value: { title: updated.title, status: updated.status },
    actor_name: existing.assignee_name ?? "Unknown",
  });

  revalidatePath("/");
  return { ok: true };
}

export async function deleteWorkItem(id: string): Promise<ActionResult> {
  const supabase = await createClient();
  const { data: existing, error: fetchError } = await supabase
    .from("work_items")
    .select("*")
    .eq("id", id)
    .single();
  if (fetchError || !existing) return { ok: false, error: fetchError?.message ?? "Item not found." };

  // Written before the delete so it lands while the FK is still valid; the
  // work_item_id FK is ON DELETE SET NULL (see migration 0002) so this row
  // survives the delete instead of cascading away with it.
  await supabase.from("activity_logs").insert({
    work_item_id: id,
    action: "deleted",
    previous_value: {
      title: existing.title,
      status: existing.status,
      assignee_name: existing.assignee_name,
    },
    new_value: null,
    actor_name: existing.assignee_name ?? "Unknown",
  });

  const { error } = await supabase.from("work_items").delete().eq("id", id);
  if (error) return { ok: false, error: error.message };

  revalidatePath("/");
  return { ok: true };
}

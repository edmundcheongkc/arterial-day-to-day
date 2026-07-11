"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { isWorkRecordStatus, type WorkRecord, type Activity, type TeamMember } from "@/lib/types";

export type ActionResult = { ok: true } | { ok: false; error: string };

type SupabaseClient = Awaited<ReturnType<typeof createClient>>;

function parseDueDate(value: FormDataEntryValue | null): string | null {
  if (!value || typeof value !== "string" || value.trim() === "") return null;
  return value;
}

function parseAssignedTo(value: FormDataEntryValue | null): string | null {
  if (!value || typeof value !== "string" || value.trim() === "") return null;
  return value;
}

async function writeAuditLog(
  supabase: SupabaseClient,
  userId: string,
  entry: {
    actor_name: string;
    table_name: string;
    row_id: string;
    action: "insert" | "update" | "delete";
    before_state: Record<string, unknown> | null;
    after_state: Record<string, unknown> | null;
  },
) {
  await supabase.from("audit_logs").insert({ ...entry, user_id: userId });
}

async function requireEditor(
  supabase: SupabaseClient,
): Promise<{ ok: true; userId: string } | { ok: false; error: string }> {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: "You need to sign in to do that." };

  const { data: member } = await supabase
    .from("team_members")
    .select("role")
    .eq("user_id", user.id)
    .maybeSingle();

  if (!member || (member.role !== "editor" && member.role !== "admin")) {
    return { ok: false, error: "Viewers can't make changes — ask an admin to upgrade your role." };
  }
  return { ok: true, userId: user.id };
}

export type WorkRecordFilters = {
  status?: string;
  assignedTo?: string;
};

export async function getWorkRecords(filters: WorkRecordFilters = {}): Promise<WorkRecord[]> {
  const supabase = await createClient();
  let query = supabase.from("work_records").select("*").eq("is_deleted", false);
  if (filters.status && isWorkRecordStatus(filters.status)) {
    query = query.eq("status", filters.status);
  }
  if (filters.assignedTo) {
    query = query.eq("assigned_to", filters.assignedTo);
  }
  const { data, error } = await query.order("created_at", { ascending: false });
  if (error) throw new Error(error.message);
  return data as WorkRecord[];
}

export async function getTeamMembers(): Promise<TeamMember[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("team_members")
    .select("*")
    .order("display_name", { ascending: true });
  if (error) throw new Error(error.message);
  return data as TeamMember[];
}

export async function getRecordTitleMap(): Promise<Map<string, string>> {
  const supabase = await createClient();
  const { data, error } = await supabase.from("work_records").select("id, title");
  if (error) throw new Error(error.message);
  return new Map((data as { id: string; title: string }[]).map((r) => [r.id, r.title]));
}

export async function getActivities(limit = 20): Promise<Activity[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("activities")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(limit);
  if (error) throw new Error(error.message);
  return data as Activity[];
}

export async function getLastActivityMap(): Promise<Map<string, string>> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("activities")
    .select("record_id, created_at")
    .order("created_at", { ascending: false })
    .limit(500);
  if (error) throw new Error(error.message);
  const map = new Map<string, string>();
  for (const row of data as { record_id: string | null; created_at: string }[]) {
    if (!row.record_id) continue;
    if (!map.has(row.record_id)) map.set(row.record_id, row.created_at);
  }
  return map;
}

async function actorNameFor(supabase: SupabaseClient, assignedTo: string | null): Promise<string> {
  if (!assignedTo) return "Unknown";
  const { data } = await supabase
    .from("team_members")
    .select("display_name")
    .eq("id", assignedTo)
    .single();
  return data?.display_name ?? "Unknown";
}

export async function createWorkRecord(
  _prevState: ActionResult | null,
  formData: FormData,
): Promise<ActionResult> {
  const title = String(formData.get("title") ?? "").trim();
  if (!title) return { ok: false, error: "Title is required." };

  const statusRaw = String(formData.get("status") ?? "to_do");
  const status = isWorkRecordStatus(statusRaw) ? statusRaw : "to_do";
  const description = String(formData.get("description") ?? "").trim() || null;
  const assigned_to = parseAssignedTo(formData.get("assigned_to"));
  const due_date = parseDueDate(formData.get("due_date"));

  const supabase = await createClient();
  const auth = await requireEditor(supabase);
  if (!auth.ok) return auth;

  const { data, error } = await supabase
    .from("work_records")
    .insert({ title, description, status, assigned_to, due_date, user_id: auth.userId })
    .select()
    .single();

  if (error) return { ok: false, error: error.message };

  const actor_name = await actorNameFor(supabase, assigned_to);

  await supabase.from("activities").insert({
    record_id: data.id,
    actor_name,
    action: "record_created",
    detail: { title: data.title, status: data.status },
    user_id: auth.userId,
  });

  await writeAuditLog(supabase, auth.userId, {
    actor_name,
    table_name: "work_records",
    row_id: data.id,
    action: "insert",
    before_state: null,
    after_state: data,
  });

  revalidatePath("/dashboard");
  return { ok: true };
}

export async function updateWorkRecord(
  id: string,
  _prevState: ActionResult | null,
  formData: FormData,
): Promise<ActionResult> {
  const supabase = await createClient();
  const auth = await requireEditor(supabase);
  if (!auth.ok) return auth;

  const { data: existing, error: fetchError } = await supabase
    .from("work_records")
    .select("*")
    .eq("id", id)
    .single();
  if (fetchError || !existing) return { ok: false, error: fetchError?.message ?? "Record not found." };

  const title = String(formData.get("title") ?? "").trim();
  if (!title) return { ok: false, error: "Title is required." };

  const statusRaw = String(formData.get("status") ?? existing.status);
  const status = isWorkRecordStatus(statusRaw) ? statusRaw : existing.status;
  const description = String(formData.get("description") ?? "").trim() || null;
  const assigned_to = parseAssignedTo(formData.get("assigned_to"));
  const due_date = parseDueDate(formData.get("due_date"));

  const { data: updated, error } = await supabase
    .from("work_records")
    .update({ title, description, status, assigned_to, due_date })
    .eq("id", id)
    .select()
    .single();

  if (error) return { ok: false, error: error.message };

  const actor_name = await actorNameFor(supabase, assigned_to ?? existing.assigned_to);
  const action = existing.status !== status ? "status_changed" : "field_updated";

  await supabase.from("activities").insert({
    record_id: id,
    actor_name,
    action,
    detail: { title: updated.title, from: existing.status, to: updated.status },
    user_id: auth.userId,
  });

  await writeAuditLog(supabase, auth.userId, {
    actor_name,
    table_name: "work_records",
    row_id: id,
    action: "update",
    before_state: existing,
    after_state: updated,
  });

  revalidatePath("/dashboard");
  return { ok: true };
}

export async function updateWorkRecordStatus(id: string, status: string): Promise<ActionResult> {
  if (!isWorkRecordStatus(status)) return { ok: false, error: "Invalid status." };
  const supabase = await createClient();
  const auth = await requireEditor(supabase);
  if (!auth.ok) return auth;

  const { data: existing, error: fetchError } = await supabase
    .from("work_records")
    .select("*")
    .eq("id", id)
    .single();
  if (fetchError || !existing) return { ok: false, error: fetchError?.message ?? "Record not found." };

  const { data: updated, error } = await supabase
    .from("work_records")
    .update({ status })
    .eq("id", id)
    .select()
    .single();

  if (error) return { ok: false, error: error.message };

  const actor_name = await actorNameFor(supabase, existing.assigned_to);

  await supabase.from("activities").insert({
    record_id: id,
    actor_name,
    action: "status_changed",
    detail: { title: existing.title, from: existing.status, to: updated.status },
    user_id: auth.userId,
  });

  await writeAuditLog(supabase, auth.userId, {
    actor_name,
    table_name: "work_records",
    row_id: id,
    action: "update",
    before_state: existing,
    after_state: updated,
  });

  revalidatePath("/dashboard");
  return { ok: true };
}

export async function softDeleteWorkRecord(id: string): Promise<ActionResult> {
  const supabase = await createClient();
  const auth = await requireEditor(supabase);
  if (!auth.ok) return auth;

  const { data: existing, error: fetchError } = await supabase
    .from("work_records")
    .select("*")
    .eq("id", id)
    .single();
  if (fetchError || !existing) return { ok: false, error: fetchError?.message ?? "Record not found." };

  const { data: updated, error } = await supabase
    .from("work_records")
    .update({ is_deleted: true })
    .eq("id", id)
    .select()
    .single();

  if (error) return { ok: false, error: error.message };

  const actor_name = await actorNameFor(supabase, existing.assigned_to);

  await supabase.from("activities").insert({
    record_id: id,
    actor_name,
    action: "record_deleted",
    detail: { title: existing.title },
    user_id: auth.userId,
  });

  await writeAuditLog(supabase, auth.userId, {
    actor_name,
    table_name: "work_records",
    row_id: id,
    action: "update",
    before_state: existing,
    after_state: updated,
  });

  revalidatePath("/dashboard");
  return { ok: true };
}

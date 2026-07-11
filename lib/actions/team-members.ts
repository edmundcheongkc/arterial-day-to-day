"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import type { TeamMemberRole } from "@/lib/types";

export type ActionResult = { ok: true } | { ok: false; error: string };

const ROLES: TeamMemberRole[] = ["viewer", "editor", "admin"];

export async function addTeamMember(
  _prevState: ActionResult | null,
  formData: FormData,
): Promise<ActionResult> {
  const display_name = String(formData.get("display_name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  if (!display_name) return { ok: false, error: "Name is required." };
  if (!email) return { ok: false, error: "Email is required." };

  const roleRaw = String(formData.get("role") ?? "editor");
  const role = (ROLES as string[]).includes(roleRaw) ? (roleRaw as TeamMemberRole) : "editor";

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("team_members")
    .insert({ display_name, email, role })
    .select()
    .single();

  if (error) return { ok: false, error: error.message };

  await supabase.from("audit_logs").insert({
    actor_name: display_name,
    table_name: "team_members",
    row_id: data.id,
    action: "insert",
    before_state: null,
    after_state: data,
  });

  revalidatePath("/team");
  revalidatePath("/dashboard");
  return { ok: true };
}

export async function removeTeamMember(id: string): Promise<ActionResult> {
  const supabase = await createClient();
  const { data: existing, error: fetchError } = await supabase
    .from("team_members")
    .select("*")
    .eq("id", id)
    .single();
  if (fetchError || !existing) return { ok: false, error: fetchError?.message ?? "Member not found." };

  const { error } = await supabase.from("team_members").delete().eq("id", id);
  if (error) {
    if (error.code === "23503") {
      return {
        ok: false,
        error: "Can't remove this member — they still have work records assigned.",
      };
    }
    return { ok: false, error: error.message };
  }

  await supabase.from("audit_logs").insert({
    actor_name: existing.display_name,
    table_name: "team_members",
    row_id: id,
    action: "delete",
    before_state: existing,
    after_state: null,
  });

  revalidatePath("/team");
  revalidatePath("/dashboard");
  return { ok: true };
}

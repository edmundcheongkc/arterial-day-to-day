"use server";

import { createClient } from "@/lib/supabase/server";
import type { TeamMemberRole } from "@/lib/types";

export type CurrentUser = {
  id: string;
  email: string;
  displayName: string;
  role: TeamMemberRole;
} | null;

// A confirmed auth user may not have a team_members row yet (their first
// login after email confirmation). Bootstrap one so RLS write policies
// (which key off team_members.role) work immediately.
export async function ensureTeamMembership(): Promise<void> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return;

  const { data: existing } = await supabase
    .from("team_members")
    .select("id")
    .eq("user_id", user.id)
    .maybeSingle();
  if (existing) return;

  const displayName =
    (user.user_metadata?.display_name as string | undefined) ||
    user.email?.split("@")[0] ||
    "New Member";

  // First real (linked) team member becomes admin so there's always
  // someone who can manage the roster; everyone after is an editor.
  const { count } = await supabase
    .from("team_members")
    .select("id", { count: "exact", head: true })
    .not("user_id", "is", null);
  const role = !count ? "admin" : "editor";

  await supabase.from("team_members").insert({
    user_id: user.id,
    display_name: displayName,
    email: user.email ?? "",
    role,
  });
}

export async function getCurrentUser(): Promise<CurrentUser> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: member } = await supabase
    .from("team_members")
    .select("display_name, role")
    .eq("user_id", user.id)
    .maybeSingle();

  return {
    id: user.id,
    email: user.email ?? "",
    displayName: member?.display_name ?? user.email?.split("@")[0] ?? "Member",
    role: (member?.role as TeamMemberRole) ?? "editor",
  };
}

export async function signOut(): Promise<void> {
  const supabase = await createClient();
  await supabase.auth.signOut();
}

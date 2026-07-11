import { getTeamMembers } from "@/lib/actions/work-records";
import { getCurrentUser } from "@/lib/actions/auth";
import { AddTeamMemberForm } from "@/components/AddTeamMemberForm";
import { RemoveTeamMemberButton } from "@/components/RemoveTeamMemberButton";

const ROLE_LABELS: Record<string, string> = {
  viewer: "Viewer",
  editor: "Editor",
  admin: "Admin",
};

export default async function TeamPage() {
  const [members, user] = await Promise.all([getTeamMembers(), getCurrentUser()]);
  const isAdmin = user?.role === "admin";

  return (
    <main className="min-h-screen p-6 md:p-10 max-w-3xl mx-auto">
      <header className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Team Members</h1>
          <p className="text-sm text-neutral-500">Who&apos;s on the team and their role</p>
        </div>
        {isAdmin && <AddTeamMemberForm />}
      </header>

      {members.length === 0 ? (
        <div className="text-center py-16 text-neutral-500 text-sm border border-dashed border-neutral-300 rounded-lg">
          No team members yet — add the first one above.
        </div>
      ) : (
        <div className="border border-neutral-200 rounded-lg divide-y divide-neutral-100 bg-white shadow-sm">
          {members.map((member) => (
            <div key={member.id} className="flex items-center justify-between px-4 py-3">
              <div>
                <p className="text-sm font-medium">{member.display_name}</p>
                <p className="text-xs text-neutral-500">{member.email}</p>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xs font-medium text-neutral-600 bg-neutral-100 rounded-full px-2.5 py-1">
                  {ROLE_LABELS[member.role] ?? member.role}
                </span>
                {isAdmin && <RemoveTeamMemberButton id={member.id} name={member.display_name} />}
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}

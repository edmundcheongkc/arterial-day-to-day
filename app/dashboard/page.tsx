import {
  getWorkRecords,
  getTeamMembers,
  getActivities,
  getLastActivityMap,
  getRecordTitleMap,
} from "@/lib/actions/work-records";
import { getCurrentUser } from "@/lib/actions/auth";
import { NewWorkRecordForm } from "@/components/NewWorkRecordForm";
import { KanbanBoard } from "@/components/KanbanBoard";
import { ActivityFeedPanel } from "@/components/ActivityFeedPanel";
import { RealtimeRefresher } from "@/components/RealtimeRefresher";
import { FilterBar } from "@/components/FilterBar";

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; assignee?: string }>;
}) {
  const params = await searchParams;
  const [records, teamMembers, activities, lastActivityMap, titleMap, user] = await Promise.all([
    getWorkRecords({ status: params.status, assignedTo: params.assignee }),
    getTeamMembers(),
    getActivities(20),
    getLastActivityMap(),
    getRecordTitleMap(),
    getCurrentUser(),
  ]);
  const canWrite = user?.role === "editor" || user?.role === "admin";

  return (
    <main className="min-h-screen p-6 md:p-10 max-w-6xl mx-auto">
      <RealtimeRefresher />
      <header className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Arterial Day-to-Day</h1>
          <p className="text-sm text-neutral-500">Shared team operations tracker</p>
        </div>
        {canWrite && <NewWorkRecordForm teamMembers={teamMembers} />}
      </header>

      <FilterBar teamMembers={teamMembers} />

      <div className="grid gap-6 lg:grid-cols-[1fr_260px]">
        <KanbanBoard
          records={records}
          teamMembers={teamMembers}
          lastActivityMap={lastActivityMap}
          canWrite={canWrite}
        />
        <ActivityFeedPanel activities={activities} titleMap={titleMap} />
      </div>
    </main>
  );
}

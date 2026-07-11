import { getWorkItems, getActivityLog } from "@/lib/actions/work-items";
import { NewWorkItemForm } from "@/components/NewWorkItemForm";
import { KanbanBoard } from "@/components/KanbanBoard";
import { ActivityFeedPanel } from "@/components/ActivityFeedPanel";
import { RealtimeRefresher } from "@/components/RealtimeRefresher";

export default async function Home() {
  const [items, logs] = await Promise.all([getWorkItems(), getActivityLog(20)]);

  return (
    <main className="min-h-screen p-6 md:p-10 max-w-6xl mx-auto">
      <RealtimeRefresher />
      <header className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Arterial Day-to-Day</h1>
          <p className="text-sm text-neutral-500">Shared team operations tracker</p>
        </div>
        <NewWorkItemForm />
      </header>

      <div className="grid gap-6 lg:grid-cols-[1fr_260px]">
        <KanbanBoard items={items} />
        <ActivityFeedPanel logs={logs} />
      </div>
    </main>
  );
}

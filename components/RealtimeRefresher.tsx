"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

// Server Actions already revalidatePath("/") for the tab that made the change.
// This subscription is what makes OTHER open tabs pick up the change (the
// "two tabs open, item appears without refresh" requirement in TEST_PLAN.md).
export function RealtimeRefresher() {
  const router = useRouter();

  useEffect(() => {
    const supabase = createClient();
    const channel = supabase
      .channel("work-items-realtime")
      .on("postgres_changes", { event: "*", schema: "public", table: "work_items" }, () => {
        router.refresh();
      })
      .on("postgres_changes", { event: "*", schema: "public", table: "activity_logs" }, () => {
        router.refresh();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [router]);

  return null;
}

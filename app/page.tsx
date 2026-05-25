import { Suspense } from "react";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { getDeals } from "@/lib/data";

export default async function Home() {
  const deals = await getDeals();
  return (
    <Suspense>
      <DashboardShell deals={deals} />
    </Suspense>
  );
}

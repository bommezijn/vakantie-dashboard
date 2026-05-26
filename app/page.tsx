import { Suspense } from "react";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { getDeals } from "@/lib/data";
import { getRates } from "@/lib/currency";

export default async function Home() {
  const [deals, rates] = await Promise.all([getDeals(), getRates()]);
  return (
    <Suspense>
      <DashboardShell deals={deals} rates={rates} />
    </Suspense>
  );
}

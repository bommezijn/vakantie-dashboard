import { Skeleton } from "@/components/ui/skeleton";

/**
 * Route-level loading boundary. Verschijnt terwijl de server een zoekopdracht
 * uitvoert (runAgencySearch wacht op alle reisbureaus, max ~8s). Het skelet
 * spiegelt de uiteindelijke layout: hero + status-balk + zijbalk + kaartenraster.
 */
export default function Loading() {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Header placeholder */}
      <div className="border-b bg-card">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 lg:px-6">
          <div className="flex items-center gap-3">
            <Skeleton className="size-9 rounded-md" />
            <div className="space-y-1.5">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-3 w-40" />
            </div>
          </div>
          <Skeleton className="h-4 w-24" />
        </div>
      </div>

      <div className="mx-auto w-full max-w-7xl flex-1 space-y-4 px-4 py-4 lg:px-6">
        {/* Search hero */}
        <Skeleton className="h-20 w-full rounded-xl" />

        {/* Agency status bar */}
        <div className="rounded-lg border bg-muted/30 px-3 py-2.5">
          <Skeleton className="mb-2 h-3 w-48" />
          <div className="flex flex-wrap gap-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-4 w-28" />
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-[300px_1fr]">
          {/* Sidebar */}
          <Skeleton className="hidden h-[28rem] w-full rounded-xl lg:block" />

          {/* Results */}
          <div className="flex flex-col gap-4">
            <Skeleton className="h-20 w-full rounded-xl" />
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} className="h-52 w-full rounded-xl" />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

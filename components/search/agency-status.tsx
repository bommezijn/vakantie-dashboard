"use client";

import { CheckCircle2, AlertCircle, MinusCircle, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import type { AgencyResult } from "@/types/search";

const STATUS_STYLES: Record<
  AgencyResult["status"],
  { icon: typeof CheckCircle2; tone: string; label: string }
> = {
  ok: {
    icon: CheckCircle2,
    tone: "text-emerald-600 dark:text-emerald-400",
    label: "OK",
  },
  fallback: {
    icon: Loader2,
    tone: "text-amber-600 dark:text-amber-400",
    label: "Cache",
  },
  error: {
    icon: AlertCircle,
    tone: "text-rose-600 dark:text-rose-400",
    label: "Error",
  },
  skipped: {
    icon: MinusCircle,
    tone: "text-muted-foreground",
    label: "Skipped",
  },
};

interface AgencyStatusProps {
  agencies: AgencyResult[];
}

export function AgencyStatus({ agencies }: AgencyStatusProps) {
  const okCount = agencies.filter((a) => a.status === "ok").length;
  const totalCount = agencies.length;

  return (
    <div className="flex flex-wrap items-center gap-x-4 gap-y-2 rounded-md border bg-muted/30 px-3 py-2 text-xs">
      <span className="font-medium text-muted-foreground">
        {okCount}/{totalCount} agencies
      </span>
      <div className="flex flex-wrap gap-3">
        {agencies.map((a) => {
          const conf = STATUS_STYLES[a.status];
          const Icon = conf.icon;
          return (
            <span
              key={a.provider}
              className="flex items-center gap-1.5"
              title={a.message ?? conf.label}
            >
              <Icon className={cn("size-3.5", conf.tone)} />
              <span className="font-medium">{a.provider}</span>
              <span className="tabular-nums text-muted-foreground">
                {a.count} · {a.durationMs}ms
              </span>
            </span>
          );
        })}
      </div>
    </div>
  );
}

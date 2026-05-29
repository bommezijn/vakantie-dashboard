"use client";

import { CheckCircle2, AlertCircle, MinusCircle, Loader2, ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";
import type { AgencyResult } from "@/types/search";

const STATUS_STYLES: Record<
  AgencyResult["status"],
  { icon: typeof CheckCircle2; tone: string; label: string }
> = {
  ok: {
    icon: CheckCircle2,
    tone: "text-emerald-600 dark:text-emerald-400",
    label: "Live",
  },
  fallback: {
    icon: Loader2,
    tone: "text-amber-600 dark:text-amber-400",
    label: "Cache",
  },
  error: {
    icon: AlertCircle,
    tone: "text-rose-600 dark:text-rose-400",
    label: "Geblokkeerd",
  },
  skipped: {
    icon: MinusCircle,
    tone: "text-muted-foreground",
    label: "Geen zoekopdracht",
  },
};

interface AgencyStatusProps {
  agencies: AgencyResult[];
}

export function AgencyStatus({ agencies }: AgencyStatusProps) {
  const liveCount = agencies.filter((a) => a.status === "ok").length;
  const totalCount = agencies.length;

  return (
    <div className="rounded-lg border bg-muted/30 px-3 py-2.5 text-xs">
      <div className="mb-2 flex items-center justify-between">
        <span className="font-semibold text-muted-foreground">
          <span className="text-foreground">{liveCount}</span> van {totalCount} live · {totalCount - liveCount} fallback
        </span>
      </div>
      <div className="flex flex-wrap gap-x-3 gap-y-2">
        {agencies.map((a) => {
          const conf = STATUS_STYLES[a.status];
          const Icon = conf.icon;
          const showLink = a.searchUrl && a.status !== "ok";
          return (
            <div
              key={a.provider}
              className="flex items-center gap-1.5"
              title={a.message ?? conf.label}
            >
              <Icon className={cn("size-3.5 shrink-0", conf.tone)} />
              <span className="font-medium">{a.provider}</span>
              <span className="tabular-nums text-muted-foreground">
                {a.count} · {a.durationMs}ms
              </span>
              {showLink && (
                <a
                  href={a.searchUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-0.5 rounded border border-[#94adff]/40 bg-[#94adff]/10 px-1.5 py-0.5 text-[10px] font-medium text-[#2b438d] hover:bg-[#94adff]/20 dark:text-[#94adff]"
                  title={`Open ${a.provider} zoekpagina in nieuw tabblad`}
                >
                  Open
                  <ExternalLink className="size-2.5" />
                </a>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

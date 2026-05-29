"use client";

import { useState } from "react";
import {
  CheckCircle2,
  AlertCircle,
  MinusCircle,
  Database,
  ExternalLink,
  ChevronDown,
  Info,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { AgencyResult, AgencyStatus as Status } from "@/types/search";

const STATUS_CONF: Record<
  Status,
  { icon: typeof CheckCircle2; tone: string; label: string; help: string }
> = {
  ok: {
    icon: CheckCircle2,
    tone: "text-emerald-600 dark:text-emerald-400",
    label: "live resultaten",
    help: "Live opgehaald van de site van het reisbureau.",
  },
  fallback: {
    icon: Database,
    tone: "text-amber-600 dark:text-amber-400",
    label: "uit onze database",
    help: "Live zoeken lukte niet — we tonen vergelijkbare deals uit onze eigen database. Klik op ‘Open’ om zelf op hun site te zoeken.",
  },
  error: {
    icon: AlertCircle,
    tone: "text-rose-600 dark:text-rose-400",
    label: "geblokkeerd",
    help: "Dit reisbureau blokkeert geautomatiseerd zoeken. Open hun zoekpagina zelf via ‘Open’.",
  },
  skipped: {
    icon: MinusCircle,
    tone: "text-muted-foreground",
    label: "overgeslagen",
    help: "Geen zoekopdracht uitgevoerd voor dit reisbureau.",
  },
};

interface AgencyStatusProps {
  agencies: AgencyResult[];
}

export function AgencyStatus({ agencies }: AgencyStatusProps) {
  const [showDetail, setShowDetail] = useState(false);

  const liveCount = agencies.filter((a) => a.status === "ok").length;
  const realAgencies = agencies.filter((a) => a.provider !== "Eigen").length;
  const hasFallbacks = agencies.some(
    (a) => a.status === "fallback" || a.status === "error"
  );

  return (
    <div className="rounded-lg border bg-muted/30 px-3 py-2.5 text-xs">
      <button
        type="button"
        onClick={() => setShowDetail((v) => !v)}
        className="flex w-full items-center justify-between gap-2"
      >
        <span className="font-medium text-muted-foreground">
          <span className="font-semibold text-foreground">{liveCount}</span> van{" "}
          {realAgencies} reisbureaus live doorzocht
          {hasFallbacks && " · rest uit eigen database"}
        </span>
        <span className="flex items-center gap-1 text-muted-foreground">
          Details
          <ChevronDown
            className={cn("size-3.5 transition-transform", showDetail && "rotate-180")}
          />
        </span>
      </button>

      {showDetail && (
        <>
          <div className="mt-2.5 flex flex-wrap gap-x-3 gap-y-2 border-t pt-2.5">
            {agencies.map((a) => {
              const conf = STATUS_CONF[a.status];
              const Icon = conf.icon;
              const isOwn = a.provider === "Eigen";
              const showLink = a.searchUrl && a.status !== "ok" && !isOwn;
              return (
                <div
                  key={a.provider}
                  className="flex items-center gap-1.5"
                  title={a.message ?? conf.help}
                >
                  <Icon className={cn("size-3.5 shrink-0", conf.tone)} />
                  <span className="font-medium">{a.provider}</span>
                  <span className="text-muted-foreground">
                    {isOwn ? `${a.count} toegevoegd` : `${conf.label} (${a.count})`}
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

          {hasFallbacks && (
            <p className="mt-2.5 flex items-start gap-1.5 border-t pt-2.5 text-[11px] leading-relaxed text-muted-foreground">
              <Info className="mt-px size-3.5 shrink-0" />
              Sommige reisbureaus blokkeren geautomatiseerd zoeken. Voor die
              bureaus tonen we vergelijkbare deals uit onze database — klik op
              ‘Open’ om hun eigen zoekpagina te bekijken.
            </p>
          )}
        </>
      )}
    </div>
  );
}

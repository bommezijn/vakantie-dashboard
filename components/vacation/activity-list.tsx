"use client";

import { useTransition } from "react";
import { ExternalLink, MapPin, Trash2, CheckCircle2, Circle } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { formatLocal } from "@/lib/format";
import {
  deleteActivity,
  toggleActivityReserved,
} from "@/app/actions/vacation";
import type { Database } from "@/types/database";

type ActivityRow = Database["public"]["Tables"]["vacation_activities"]["Row"];

interface ActivityListProps {
  activities: ActivityRow[];
  planId: string;
}

export function ActivityList({ activities, planId }: ActivityListProps) {
  if (activities.length === 0) {
    return (
      <div className="rounded-xl border-2 border-dashed border-muted-foreground/20 p-10 text-center">
        <p className="text-sm text-muted-foreground">
          Nog geen activiteiten. Voeg je eerste idee toe — een excursie, restaurant of dagtrip.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {activities.map((a) => (
        <ActivityCard key={a.id} activity={a} planId={planId} />
      ))}
    </div>
  );
}

function faviconUrl(url: string): string {
  try {
    const { hostname } = new URL(url);
    return `https://www.google.com/s2/favicons?sz=64&domain=${hostname}`;
  } catch {
    return "";
  }
}

function domainLabel(url: string): string {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return url;
  }
}

function ActivityCard({ activity, planId }: { activity: ActivityRow; planId: string }) {
  const [isPending, startTransition] = useTransition();
  const reserved = activity.is_reserved ?? false;

  function onToggle() {
    startTransition(async () => {
      try {
        await toggleActivityReserved(activity.id, planId, !reserved);
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Update mislukt");
      }
    });
  }

  function onDelete() {
    if (!confirm(`"${activity.name}" verwijderen?`)) return;
    startTransition(async () => {
      try {
        await deleteActivity(activity.id, planId);
        toast.success("Verwijderd");
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Verwijderen mislukt");
      }
    });
  }

  return (
    <div
      className={cn(
        "group relative rounded-xl border bg-card transition-all",
        reserved
          ? "border-[#2b438d]/30 bg-[#2b438d]/5"
          : "border-border hover:border-[#94adff]/60 hover:shadow-sm",
        isPending && "pointer-events-none opacity-60"
      )}
    >
      {/* Accent bar on the left */}
      <div
        className={cn(
          "absolute left-0 top-0 h-full w-1 rounded-l-xl transition-colors",
          reserved ? "bg-[#2b438d]" : "bg-[#94adff]/50 group-hover:bg-[#94adff]"
        )}
      />

      <div className="flex gap-4 p-4 pl-5">
        {/* Favicon / icon */}
        {activity.url ? (
          <div className="flex shrink-0 flex-col items-center gap-1.5 pt-0.5">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={faviconUrl(activity.url)}
              alt=""
              width={32}
              height={32}
              className="size-8 rounded-lg border bg-white object-contain p-0.5 shadow-sm"
            />
          </div>
        ) : (
          <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground">
            <MapPin className="size-4" />
          </div>
        )}

        {/* Main content */}
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-start justify-between gap-x-3 gap-y-1">
            <div className="min-w-0">
              <h4
                className={cn(
                  "text-sm font-semibold leading-snug",
                  reserved && "text-muted-foreground line-through"
                )}
              >
                {activity.name}
              </h4>
              {activity.location && (
                <p className="mt-0.5 flex items-center gap-1 text-xs text-muted-foreground">
                  <MapPin className="size-3 shrink-0" />
                  {activity.location}
                </p>
              )}
            </div>

            {/* Price + status cluster */}
            <div className="flex shrink-0 items-center gap-2">
              {activity.price_per_person != null && (
                <span
                  className={cn(
                    "rounded-full px-2.5 py-0.5 text-xs font-semibold tabular-nums",
                    reserved
                      ? "bg-[#2b438d] text-white"
                      : "bg-[#e8fd94] text-[#1a2d5a]"
                  )}
                >
                  {formatLocal(Number(activity.price_per_person), activity.currency ?? "EUR")}
                </span>
              )}
            </div>
          </div>

          {activity.notes && (
            <p className="mt-1.5 text-xs text-muted-foreground">{activity.notes}</p>
          )}

          {activity.url && (
            <a
              href={activity.url}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-1.5 inline-flex items-center gap-1 text-xs text-[#2b438d] hover:underline dark:text-[#94adff]"
            >
              <ExternalLink className="size-3" />
              {domainLabel(activity.url)}
            </a>
          )}
        </div>

        {/* Actions */}
        <div className="flex shrink-0 flex-col items-center gap-2">
          <button
            onClick={onToggle}
            disabled={isPending}
            aria-label={reserved ? "Markeer als open" : "Markeer als gereserveerd"}
            className={cn(
              "flex flex-col items-center gap-0.5 rounded-lg p-1.5 text-[9px] font-semibold uppercase tracking-wide transition-colors",
              reserved
                ? "text-[#2b438d] hover:bg-[#2b438d]/10 dark:text-[#94adff]"
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            )}
          >
            {reserved ? (
              <CheckCircle2 className="size-5 text-[#2b438d] dark:text-[#94adff]" />
            ) : (
              <Circle className="size-5" />
            )}
            {reserved ? "Geboekt" : "Open"}
          </button>

          <Button
            size="sm"
            variant="ghost"
            onClick={onDelete}
            disabled={isPending}
            aria-label="Verwijder activiteit"
            className="size-7 p-0 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100 hover:text-destructive"
          >
            <Trash2 className="size-3.5" />
          </Button>
        </div>
      </div>
    </div>
  );
}

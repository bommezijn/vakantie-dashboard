"use client";

import { Plane, Users } from "lucide-react";
import { useQueryState } from "nuqs";
import { travelersParser } from "@/lib/search-params";

export function SiteHeader() {
  const [travelers] = useQueryState("travelers", travelersParser);

  return (
    <header className="border-b bg-card">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 lg:px-6">
        <div className="flex items-center gap-3">
          <div className="grid size-9 place-items-center rounded-md bg-primary text-primary-foreground">
            <Plane className="size-4" />
          </div>
          <div>
            <h1 className="text-base font-semibold leading-tight">
              Vakantieplanner
            </h1>
            <p className="text-xs text-muted-foreground">
              1 – 12 juli 2026 · Amsterdam Schiphol
            </p>
          </div>
        </div>
        <div className="hidden items-center gap-2 text-sm text-muted-foreground sm:flex">
          <Users className="size-4" />
          <span>
            <strong className="text-foreground">{travelers}</strong> reizigers
          </span>
        </div>
      </div>
    </header>
  );
}

"use client";

import { useQueryState } from "nuqs";
import { Switch } from "@/components/ui/switch";
import { showOverBudgetParser } from "@/lib/search-params";

export function OverBudgetToggle() {
  const [show, setShow] = useQueryState("showOverBudget", showOverBudgetParser);

  return (
    <label className="flex cursor-pointer items-center justify-between gap-3 rounded-md border bg-card p-3 text-sm">
      <span className="font-medium">Toon ook boven budget</span>
      <Switch checked={show} onCheckedChange={setShow} />
    </label>
  );
}

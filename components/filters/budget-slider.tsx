"use client";

import { useQueryState } from "nuqs";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/filters/label";
import { budgetParser, travelersParser } from "@/lib/search-params";
import { formatPrice } from "@/lib/format";

export function BudgetSlider() {
  const [budget, setBudget] = useQueryState("budget", budgetParser);
  const [travelers] = useQueryState("travelers", travelersParser);

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <Label>Max budget p.p.</Label>
        <span className="text-base font-semibold tabular-nums text-primary">
          {formatPrice(budget)}
        </span>
      </div>
      <Slider
        min={300}
        max={1500}
        step={25}
        value={[budget]}
        onValueChange={(v) => setBudget(v[0])}
      />
      <p className="text-xs text-muted-foreground">
        Totaal {travelers}p: <strong>{formatPrice(budget * travelers)}</strong>
      </p>
    </div>
  );
}

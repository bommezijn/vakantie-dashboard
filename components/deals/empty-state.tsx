"use client";

import { SearchX } from "lucide-react";
import { useQueryStates } from "nuqs";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { filterParsers } from "@/lib/search-params";

export function EmptyState() {
  const [, setAll] = useQueryStates(filterParsers);

  return (
    <Card className="flex flex-col items-center justify-center gap-3 p-12 text-center">
      <SearchX className="size-10 text-muted-foreground" />
      <div>
        <p className="text-base font-semibold">Geen deals gevonden</p>
        <p className="mt-1 text-sm text-muted-foreground">
          Probeer minder keywords of een hoger budget.
        </p>
      </div>
      <Button
        variant="outline"
        size="sm"
        onClick={() =>
          setAll({
            budget: null,
            travelers: null,
            keywords: null,
            providers: null,
            countries: null,
            showOverBudget: null,
            sort: null,
          })
        }
      >
        Reset filters
      </Button>
    </Card>
  );
}

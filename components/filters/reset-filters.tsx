"use client";

import { useQueryStates } from "nuqs";
import { Button } from "@/components/ui/button";
import { RotateCcw } from "lucide-react";
import { filterParsers } from "@/lib/search-params";

export function ResetFilters() {
  const [, setAll] = useQueryStates(filterParsers);

  return (
    <Button
      variant="ghost"
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
      className="w-full justify-start text-muted-foreground hover:text-foreground"
    >
      <RotateCcw className="mr-2 size-3.5" />
      Reset alle filters
    </Button>
  );
}

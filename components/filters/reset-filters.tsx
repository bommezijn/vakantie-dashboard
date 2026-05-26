"use client";

import { useQueryStates } from "nuqs";
import { Button } from "@/components/ui/button";
import { RotateCcw } from "lucide-react";
import {
  keywordsParser,
  providersParser,
  showOverBudgetParser,
  sortParser,
} from "@/lib/search-params";

export function ResetFilters() {
  const [, setAll] = useQueryStates({
    keywords: keywordsParser,
    providers: providersParser,
    showOverBudget: showOverBudgetParser,
    sort: sortParser,
  });

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={() =>
        setAll({
          keywords: null,
          providers: null,
          showOverBudget: null,
          sort: null,
        })
      }
      className="w-full justify-start text-muted-foreground hover:text-foreground"
    >
      <RotateCcw className="mr-2 size-3.5" />
      Reset verfijning
    </Button>
  );
}

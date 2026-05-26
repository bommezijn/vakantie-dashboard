"use client";

import { SearchX } from "lucide-react";
import { useQueryStates } from "nuqs";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  keywordsParser,
  providersParser,
  showOverBudgetParser,
} from "@/lib/search-params";

interface EmptyStateProps {
  title?: string;
  description?: string;
}

export function EmptyState({
  title = "Geen deals binnen je verfijning",
  description = "Probeer minder keywords, een ander reisbureau, of toon ook deals boven je budget.",
}: EmptyStateProps) {
  const [, setRefinement] = useQueryStates({
    keywords: keywordsParser,
    providers: providersParser,
    showOverBudget: showOverBudgetParser,
  });

  return (
    <Card className="flex flex-col items-center justify-center gap-3 p-12 text-center">
      <SearchX className="size-10 text-muted-foreground" />
      <div>
        <p className="text-base font-semibold">{title}</p>
        <p className="mt-1 text-sm text-muted-foreground">{description}</p>
      </div>
      <Button
        variant="outline"
        size="sm"
        onClick={() =>
          setRefinement({
            keywords: null,
            providers: null,
            showOverBudget: null,
          })
        }
      >
        Reset verfijning
      </Button>
    </Card>
  );
}

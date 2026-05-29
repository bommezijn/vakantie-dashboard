"use client";

import { useQueryState } from "nuqs";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Label } from "@/components/filters/label";
import { keywordsParser } from "@/lib/search-params";
import { keywordCategories } from "@/data/keyword-categories";

export function KeywordFilters() {
  const [keywords, setKeywords] = useQueryState("keywords", keywordsParser);

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <Label>Keywords {keywords.length > 0 ? `(${keywords.length})` : ""}</Label>
        {keywords.length > 0 && (
          <button
            type="button"
            onClick={() => setKeywords([])}
            className="text-xs text-muted-foreground underline-offset-2 hover:underline"
          >
            Wissen
          </button>
        )}
      </div>
      {keywordCategories.map((cat) => (
        <div key={cat.label} className="space-y-1.5">
          <p className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground/80">
            {cat.label}
          </p>
          <ToggleGroup
            type="multiple"
            value={keywords}
            onValueChange={(v) => setKeywords(v.length > 0 ? v : [])}
            variant="outline"
            spacing={4}
            className="flex-wrap justify-start"
          >
            {cat.items.map((kw) => (
              <ToggleGroupItem
                key={kw.id}
                value={kw.id}
                size="sm"
                className="rounded-full text-xs"
              >
                <span className="mr-1">{kw.icon}</span>
                {kw.id}
              </ToggleGroupItem>
            ))}
          </ToggleGroup>
        </div>
      ))}
    </div>
  );
}

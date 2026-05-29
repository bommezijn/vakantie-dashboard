"use client";

import { useQueryState } from "nuqs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/filters/label";
import { sortParser } from "@/lib/search-params";
import type { SortKey } from "@/types/deal";

const OPTIONS: Array<{ value: SortKey; label: string }> = [
  { value: "price-asc", label: "Prijs (laag → hoog)" },
  { value: "price-desc", label: "Prijs (hoog → laag)" },
  { value: "rating-desc", label: "Beoordeling" },
  { value: "flight-asc", label: "Vluchttijd" },
  { value: "duration-desc", label: "Reisduur" },
];

export function SortSelect() {
  const [sort, setSort] = useQueryState("sort", sortParser);

  return (
    <div className="space-y-2">
      <Label>Sorteren</Label>
      <Select value={sort} onValueChange={(v) => setSort(v as SortKey)}>
        <SelectTrigger className="w-full">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {OPTIONS.map((o) => (
            <SelectItem key={o.value} value={o.value}>
              {o.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

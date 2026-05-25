"use client";

import { useQueryState } from "nuqs";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Label } from "@/components/filters/label";
import { countriesParser } from "@/lib/search-params";

interface CountryFilterProps {
  countries: string[];
}

export function CountryFilter({ countries }: CountryFilterProps) {
  const [selected, setSelected] = useQueryState("countries", countriesParser);

  return (
    <div className="space-y-2">
      <Label>Land</Label>
      <ToggleGroup
        type="multiple"
        value={selected}
        onValueChange={(v) => setSelected(v.length > 0 ? v : [])}
        variant="outline"
        spacing={4}
        className="flex-wrap justify-start"
      >
        {countries.map((c) => (
          <ToggleGroupItem key={c} value={c} size="sm" className="text-xs">
            {c}
          </ToggleGroupItem>
        ))}
      </ToggleGroup>
    </div>
  );
}

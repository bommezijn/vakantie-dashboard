"use client";

import { useQueryState } from "nuqs";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Label } from "@/components/filters/label";
import { providersParser } from "@/lib/search-params";

interface ProviderFilterProps {
  providers: string[];
}

export function ProviderFilter({ providers }: ProviderFilterProps) {
  const [selected, setSelected] = useQueryState("providers", providersParser);

  return (
    <div className="space-y-2">
      <Label>Provider</Label>
      <ToggleGroup
        type="multiple"
        value={selected}
        onValueChange={(v) => setSelected(v.length > 0 ? v : [])}
        variant="outline"
        spacing={4}
        className="flex-wrap justify-start"
      >
        {providers.map((p) => (
          <ToggleGroupItem key={p} value={p} size="sm" className="text-xs">
            {p}
          </ToggleGroupItem>
        ))}
      </ToggleGroup>
    </div>
  );
}

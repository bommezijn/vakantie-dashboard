"use client";

import { useQueryState } from "nuqs";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Label } from "@/components/filters/label";
import { travelersParser } from "@/lib/search-params";

const COUNTS = [1, 2, 3, 4, 5, 6];

export function TravelersToggle() {
  const [travelers, setTravelers] = useQueryState("travelers", travelersParser);

  return (
    <div className="space-y-2">
      <Label>Reizigers</Label>
      <ToggleGroup
        type="single"
        value={String(travelers)}
        onValueChange={(v) => {
          if (v) setTravelers(Number(v));
        }}
        variant="outline"
        className="w-full"
      >
        {COUNTS.map((n) => (
          <ToggleGroupItem key={n} value={String(n)} className="flex-1">
            {n}
          </ToggleGroupItem>
        ))}
      </ToggleGroup>
    </div>
  );
}

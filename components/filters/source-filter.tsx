"use client";

import { useQueryState } from "nuqs";
import { Globe, PenLine, Building2 } from "lucide-react";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Label } from "@/components/filters/label";
import { sourceParser, type SourceFilter as SourceValue } from "@/lib/search-params";

interface SourceFilterProps {
  /** Aantal eigen deals in de huidige resultaten — toont een telling bij "Eigen". */
  userDealCount: number;
}

const OPTIONS: { value: SourceValue; label: string; icon: typeof Globe }[] = [
  { value: "all", label: "Alles", icon: Globe },
  { value: "agency", label: "Reisbureaus", icon: Building2 },
  { value: "user", label: "Eigen", icon: PenLine },
];

export function SourceFilter({ userDealCount }: SourceFilterProps) {
  const [source, setSource] = useQueryState("source", sourceParser);

  return (
    <div className="space-y-2">
      <Label>Bron</Label>
      <ToggleGroup
        type="single"
        value={source}
        onValueChange={(v) => setSource((v as SourceValue) || "all")}
        variant="outline"
        spacing={4}
        className="flex-wrap justify-start"
      >
        {OPTIONS.map((opt) => (
          <ToggleGroupItem key={opt.value} value={opt.value} size="sm" className="text-xs">
            <opt.icon className="mr-1 size-3" />
            {opt.label}
            {opt.value === "user" && userDealCount > 0 && (
              <span className="ml-1 rounded-full bg-[#e8fd94] px-1.5 text-[10px] font-semibold text-[#1a2d5a]">
                {userDealCount}
              </span>
            )}
          </ToggleGroupItem>
        ))}
      </ToggleGroup>
    </div>
  );
}

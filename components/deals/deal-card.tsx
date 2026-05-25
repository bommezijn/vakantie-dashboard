"use client";

import { useQueryState } from "nuqs";
import { Plane, MapPin, Star } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { dealParser } from "@/lib/search-params";
import { formatPrice } from "@/lib/format";
import type { Deal } from "@/types/deal";

interface DealCardProps {
  deal: Deal;
  travelers: number;
  maxBudget: number;
}

const TYPE_VARIANTS: Record<Deal["type"], string> = {
  villa: "bg-emerald-100 text-emerald-900 dark:bg-emerald-950 dark:text-emerald-200",
  appartement: "bg-sky-100 text-sky-900 dark:bg-sky-950 dark:text-sky-200",
  hotel: "bg-violet-100 text-violet-900 dark:bg-violet-950 dark:text-violet-200",
  aparthotel: "bg-indigo-100 text-indigo-900 dark:bg-indigo-950 dark:text-indigo-200",
  "all-inclusive": "bg-orange-100 text-orange-900 dark:bg-orange-950 dark:text-orange-200",
};

export function DealCard({ deal, travelers, maxBudget }: DealCardProps) {
  const [, setSelected] = useQueryState("deal", dealParser);

  const totalPrice = deal.pricePerPerson * travelers;
  const within = deal.pricePerPerson <= maxBudget;
  const margin = maxBudget - deal.pricePerPerson;

  return (
    <Card
      onClick={() => setSelected(deal.id)}
      className={cn(
        "group cursor-pointer gap-0 overflow-hidden p-0 transition-all hover:shadow-md hover:-translate-y-0.5",
        !within && "opacity-70"
      )}
    >
      <div className="flex items-start justify-between gap-3 p-4 pb-3">
        <div className="min-w-0 flex-1">
          <div className="mb-1.5 flex items-center gap-2">
            <Badge variant="outline" className="text-[10px] font-medium">
              {deal.provider}
            </Badge>
            <Badge
              variant="secondary"
              className={cn("text-[10px] font-medium", TYPE_VARIANTS[deal.type])}
            >
              {deal.type}
            </Badge>
          </div>
          <h3 className="text-sm font-semibold leading-tight">{deal.title}</h3>
          <p className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
            <MapPin className="size-3" />
            {deal.region}, {deal.country}
          </p>
        </div>
        <div className="text-right">
          <p className="text-lg font-bold tabular-nums">
            {formatPrice(deal.pricePerPerson)}
          </p>
          <p className="text-[10px] text-muted-foreground">per persoon</p>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 border-t bg-muted/30 px-4 py-2 text-xs text-muted-foreground">
        <span className="flex items-center gap-1">
          <Plane className="size-3" />
          {deal.flightTime}
        </span>
        <span className="flex items-center gap-1">
          <Star className="size-3 fill-amber-400 text-amber-400" />
          {deal.rating.toFixed(1)}
        </span>
        <span>{deal.duration}d</span>
        <span className="ml-auto tabular-nums">
          {travelers}p · {formatPrice(totalPrice)}
        </span>
        {within ? (
          <Badge variant="outline" className="border-emerald-300 text-[10px] text-emerald-700">
            +{formatPrice(margin)}
          </Badge>
        ) : (
          <Badge variant="outline" className="border-rose-300 text-[10px] text-rose-700">
            −{formatPrice(Math.abs(margin))}
          </Badge>
        )}
      </div>
    </Card>
  );
}

"use client";

import Image from "next/image";
import { useQueryState } from "nuqs";
import { Plane, MapPin, Star, PenLine, Bookmark, Link2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { dealParser } from "@/lib/search-params";
import { formatPrice } from "@/lib/format";
import { visualForCountry, emojiForType, normalizeImageUrl } from "@/lib/deal-visuals";
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
  const isUserDeal = deal.source === "user";
  const imageUrl = normalizeImageUrl(deal.imageUrl);
  const visual = visualForCountry(deal.country);

  return (
    <Card
      onClick={() => setSelected(deal.id)}
      className={cn(
        "group cursor-pointer gap-0 overflow-hidden p-0 transition-all hover:shadow-md hover:-translate-y-0.5",
        !within && "opacity-70",
        isUserDeal && "border-l-[3px] border-l-[#e8fd94]"
      )}
    >
      {/* Header strip — real image when available, anders een gradient per land */}
      <div className="relative h-28 w-full overflow-hidden">
        {imageUrl ? (
          <>
            <Image
              src={imageUrl}
              alt={deal.title}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 33vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background/60 to-transparent" />
          </>
        ) : (
          <div
            className={cn(
              "flex h-full w-full items-center justify-between bg-gradient-to-br px-4 transition-transform duration-300 group-hover:scale-105",
              visual.gradient
            )}
          >
            <span className="text-3xl drop-shadow-sm" aria-hidden>
              {emojiForType(deal.type)}
            </span>
            <span className="flex items-center gap-1.5 rounded-full bg-white/85 px-2.5 py-1 text-xs font-semibold text-slate-800 shadow-sm backdrop-blur-sm">
              <span aria-hidden>{visual.emoji}</span>
              {deal.country}
            </span>
          </div>
        )}
      </div>

      <div className="flex items-start justify-between gap-3 p-4 pb-3">
        <div className="min-w-0 flex-1">
          <div className="mb-1.5 flex flex-wrap items-center gap-2">
            {isUserDeal ? <UserSourceBadge createdVia={deal.createdVia} /> : (
              <Badge variant="outline" className="text-[10px] font-medium">
                {deal.provider}
              </Badge>
            )}
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
          <p className={cn("text-lg font-bold tabular-nums", isUserDeal && "text-[#2b438d] dark:text-[#94adff]")}>
            {formatPrice(deal.pricePerPerson)}
          </p>
          <p className="text-[10px] text-muted-foreground">per persoon</p>
        </div>
      </div>

      <div className={cn(
        "flex flex-wrap items-center gap-x-3 gap-y-1 border-t px-4 py-2 text-xs text-muted-foreground",
        isUserDeal ? "bg-[#e8fd94]/10" : "bg-muted/30"
      )}>
        <span className="flex items-center gap-1">
          <Plane className="size-3" />
          {deal.flightTime}
        </span>
        {deal.rating > 0 && (
          <span className="flex items-center gap-1">
            <Star className="size-3 fill-amber-400 text-amber-400" />
            {deal.rating.toFixed(1)}
          </span>
        )}
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

/**
 * Per-source pill voor user-deals. Drie varianten:
 *  - Bookmarklet → 1-click vanuit een vakantiesite
 *  - Link-paste → user plakte een URL in het AddDealLinkForm
 *  - Manual     → user vulde alles handmatig in (default)
 */
function UserSourceBadge({ createdVia }: { createdVia?: Deal["createdVia"] }) {
  if (createdVia === "bookmarklet") {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-[#94adff] px-2 py-0.5 text-[10px] font-semibold text-[#1a2d5a]">
        <Bookmark className="size-2.5" />
        Via bookmarklet
      </span>
    );
  }
  if (createdVia === "link-paste") {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-[#e8fd94] px-2 py-0.5 text-[10px] font-semibold text-[#1a2d5a]">
        <Link2 className="size-2.5" />
        Via link
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-[#e8fd94] px-2 py-0.5 text-[10px] font-semibold text-[#1a2d5a]">
      <PenLine className="size-2.5" />
      Eigen
    </span>
  );
}

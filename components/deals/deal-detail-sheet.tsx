"use client";

import Image from "next/image";
import { useQueryState } from "nuqs";
import { ExternalLink, MapPin, Plane, Star, Bookmark, Link2, PenLine } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { dealParser } from "@/lib/search-params";
import { formatPrice, formatLocal } from "@/lib/format";
import { convertFromEur, currencyForCountry, type Rates } from "@/lib/currency";
import { visualForCountry, emojiForType, normalizeImageUrl } from "@/lib/deal-visuals";
import { MakeVacationButton } from "@/components/deals/make-vacation-button";
import { DeleteDealButton } from "@/components/deals/delete-deal-button";
import type { Deal } from "@/types/deal";

interface DealDetailSheetProps {
  deals: Deal[];
  travelers: number;
  rates: Rates;
}

export function DealDetailSheet({ deals, travelers, rates }: DealDetailSheetProps) {
  const [selectedId, setSelected] = useQueryState("deal", dealParser);
  const deal = selectedId ? deals.find((d) => d.id === selectedId) : null;
  const open = Boolean(deal);

  const localCurrency = deal ? currencyForCountry(deal.country) : null;
  const localAmount =
    deal && localCurrency
      ? convertFromEur(deal.pricePerPerson, localCurrency, rates)
      : null;

  return (
    <Sheet open={open} onOpenChange={(o) => !o && setSelected(null)}>
      <SheetContent side="right" className="w-full gap-0 p-0 sm:max-w-xl">
        {deal && (
          <>
            <DealBanner deal={deal} />
            <SheetHeader className="space-y-3 border-b p-6 pt-4">
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="outline">{deal.provider}</Badge>
                <Badge variant="secondary">{deal.type}</Badge>
                <Badge variant="outline">{deal.catering}</Badge>
                {deal.source === "user" && <SourceBadge createdVia={deal.createdVia} />}
              </div>
              <SheetTitle className="text-xl">{deal.title}</SheetTitle>
              <SheetDescription className="flex items-center gap-1">
                <MapPin className="size-3.5" />
                {deal.region}, {deal.country}
              </SheetDescription>
              <div className="flex items-baseline gap-3 pt-1">
                <span className="text-3xl font-bold tabular-nums">
                  {formatPrice(deal.pricePerPerson)}
                </span>
                <span className="text-sm text-muted-foreground">
                  per persoon · {travelers}p ={" "}
                  <strong className="text-foreground">
                    {formatPrice(deal.pricePerPerson * travelers)}
                  </strong>
                </span>
              </div>
              {localAmount != null && localCurrency && (
                <p className="text-xs text-muted-foreground">
                  ≈ {formatLocal(localAmount, localCurrency)} ter plaatse
                </p>
              )}
            </SheetHeader>

            <ScrollArea className="flex-1">
              <div className="space-y-6 p-6">
                <div className="grid grid-cols-2 gap-3 text-sm sm:grid-cols-4">
                  <Stat icon={<Plane className="size-3.5" />} label="Vlucht" value={deal.flightTime} />
                  <Stat
                    icon={<Star className="size-3.5 fill-amber-400 text-amber-400" />}
                    label="Rating"
                    value={`${deal.rating.toFixed(1)}/10`}
                  />
                  <Stat label="Duur" value={`${deal.duration} dagen`} />
                  <Stat label="Vertrek" value={deal.startDate} />
                </div>

                <Separator />

                <div>
                  <h4 className="mb-2 text-sm font-semibold">Beschrijving</h4>
                  <p className="text-sm text-muted-foreground">{deal.description}</p>
                </div>

                <div>
                  <h4 className="mb-2 text-sm font-semibold">Hoogtepunten</h4>
                  <ul className="space-y-1 text-sm">
                    {deal.highlights.map((h, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="mt-1.5 size-1 shrink-0 rounded-full bg-primary" />
                        <span>{h}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="mb-2 text-sm font-semibold">Inclusief</h4>
                  <div className="flex flex-wrap gap-1.5">
                    {deal.inclusions.map((inc) => (
                      <Badge key={inc} variant="outline" className="font-normal">
                        ✓ {inc}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="mb-2 text-sm font-semibold">Beoordelingen</h4>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <RatingRow label="☀️ Zon" value={deal.ratings.sun} />
                    <RatingRow label="🍽️ Eten" value={deal.ratings.food} />
                    <RatingRow label="🏛️ Cultuur" value={deal.ratings.culture} />
                    <RatingRow label="🏊 Zwembad" value={deal.ratings.pool} />
                  </div>
                </div>

                <div>
                  <h4 className="mb-2 text-sm font-semibold">Keywords</h4>
                  <div className="flex flex-wrap gap-1.5">
                    {deal.keywords.map((k) => (
                      <Badge key={k} variant="secondary" className="font-normal">
                        {k}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </ScrollArea>

            <div className="space-y-2 border-t bg-background p-4">
              <MakeVacationButton dealId={deal.id} dealTitle={deal.title} />
              <Button asChild className="w-full">
                <a href={deal.providerUrl} target="_blank" rel="noopener noreferrer">
                  Bekijk op {deal.provider}
                  <ExternalLink className="ml-2 size-4" />
                </a>
              </Button>
              {deal.source === "user" && (
                <DeleteDealButton dealId={deal.id} dealTitle={deal.title} />
              )}
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}

/** Visuele banner bovenaan de sheet: echte foto indien aanwezig, anders een
 *  gradient per land — consistent met de DealCard-header. */
function DealBanner({ deal }: { deal: Deal }) {
  const imageUrl = normalizeImageUrl(deal.imageUrl);
  const visual = visualForCountry(deal.country);

  if (imageUrl) {
    return (
      <div className="relative h-40 w-full shrink-0 overflow-hidden">
        <Image
          src={imageUrl}
          alt={deal.title}
          fill
          className="object-cover"
          sizes="(max-width: 640px) 100vw, 640px"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background/70 to-transparent" />
      </div>
    );
  }

  return (
    <div
      className={cn(
        "flex h-32 w-full shrink-0 items-center justify-between bg-gradient-to-br px-6",
        visual.gradient
      )}
    >
      <span className="text-5xl drop-shadow-sm" aria-hidden>
        {emojiForType(deal.type)}
      </span>
      <span className="flex items-center gap-1.5 rounded-full bg-white/85 px-3 py-1 text-sm font-semibold text-slate-800 shadow-sm backdrop-blur-sm">
        <span aria-hidden>{visual.emoji}</span>
        {deal.country}
      </span>
    </div>
  );
}

function Stat({
  icon,
  label,
  value,
}: {
  icon?: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex flex-col gap-0.5">
      <span className="text-[10px] uppercase tracking-wide text-muted-foreground">
        {label}
      </span>
      <span className="flex items-center gap-1 text-sm font-medium">
        {icon}
        {value}
      </span>
    </div>
  );
}

function SourceBadge({ createdVia }: { createdVia?: Deal["createdVia"] }) {
  if (createdVia === "bookmarklet") {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-[#94adff] px-2 py-0.5 text-[11px] font-semibold text-[#1a2d5a]">
        <Bookmark className="size-3" />
        Via bookmarklet
      </span>
    );
  }
  if (createdVia === "link-paste") {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-[#e8fd94] px-2 py-0.5 text-[11px] font-semibold text-[#1a2d5a]">
        <Link2 className="size-3" />
        Via link
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-[#e8fd94] px-2 py-0.5 text-[11px] font-semibold text-[#1a2d5a]">
      <PenLine className="size-3" />
      Eigen
    </span>
  );
}

function RatingRow({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium">
        {"●".repeat(value)}
        <span className="text-muted-foreground">{"○".repeat(5 - value)}</span>
      </span>
    </div>
  );
}

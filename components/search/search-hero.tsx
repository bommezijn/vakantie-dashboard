"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Search, MapPin, Users, Wallet, Loader2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { cn } from "@/lib/utils";
import { DEFAULT_BUDGET, DEFAULT_TRAVELERS } from "@/lib/search-params";
import type { SearchQuery } from "@/types/search";

const ALL_COUNTRIES = [
  "Albanie",
  "Bulgarije",
  "Cyprus",
  "Egypte",
  "Griekenland",
  "Italie",
  "Kroatie",
  "Montenegro",
  "Portugal",
  "Spanje",
  "Turkije",
];

const COUNTRY_FLAGS: Record<string, string> = {
  Albanie: "🇦🇱",
  Bulgarije: "🇧🇬",
  Cyprus: "🇨🇾",
  Egypte: "🇪🇬",
  Griekenland: "🇬🇷",
  Italie: "🇮🇹",
  Kroatie: "🇭🇷",
  Montenegro: "🇲🇪",
  Portugal: "🇵🇹",
  Spanje: "🇪🇸",
  Turkije: "🇹🇷",
};

interface SearchHeroProps {
  initial?: Partial<SearchQuery>;
  compact?: boolean;
}

export function SearchHero({ initial, compact = false }: SearchHeroProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const [countries, setCountries] = useState<string[]>(initial?.countries ?? []);
  const [travelers, setTravelers] = useState<number>(
    initial?.travelers ?? DEFAULT_TRAVELERS
  );
  const [budget, setBudget] = useState<number>(
    initial?.maxBudget ?? DEFAULT_BUDGET
  );

  function handleSearch() {
    const params = new URLSearchParams();
    params.set("searched", "true");
    if (countries.length > 0) params.set("countries", countries.join(","));
    if (travelers !== DEFAULT_TRAVELERS) params.set("travelers", String(travelers));
    if (budget !== DEFAULT_BUDGET) params.set("budget", String(budget));

    startTransition(() => {
      router.push(`/?${params.toString()}`);
    });
  }

  return (
    <Card
      className={cn(
        "border-primary/15 bg-gradient-to-br from-card via-card to-primary/5 p-4 shadow-sm",
        compact ? "lg:p-4" : "lg:p-6"
      )}
    >
      {!compact && (
        <div className="mb-4 space-y-1">
          <h2 className="text-xl font-semibold tracking-tight lg:text-2xl">
            Vind je vakantie voor juli 2026
          </h2>
          <p className="text-sm text-muted-foreground">
            We doorzoeken Sunweb, TUI, Corendon en ByJune.
          </p>
        </div>
      )}

      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSearch();
        }}
        className="grid grid-cols-1 gap-3 md:grid-cols-12"
      >
        <Field
          icon={<MapPin className="size-4" />}
          label="Bestemming"
          className="md:col-span-5"
        >
          <CountrySelect value={countries} onChange={setCountries} />
        </Field>

        <Field
          icon={<Users className="size-4" />}
          label="Reizigers"
          className="md:col-span-2"
        >
          <Select
            value={String(travelers)}
            onValueChange={(v) => setTravelers(parseInt(v, 10))}
          >
            <SelectTrigger className="h-10 w-full border-0 shadow-none focus-visible:ring-0">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
                <SelectItem key={n} value={String(n)}>
                  {n} {n === 1 ? "persoon" : "personen"}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>

        <Field
          icon={<Wallet className="size-4" />}
          label="Max budget p.p."
          className="md:col-span-3"
        >
          <div className="relative">
            <span className="pointer-events-none absolute left-0 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
              €
            </span>
            <Input
              type="number"
              min={100}
              max={5000}
              step={50}
              value={budget}
              onChange={(e) => setBudget(parseInt(e.target.value, 10) || 0)}
              className="h-10 border-0 pl-4 text-base shadow-none focus-visible:ring-0"
            />
          </div>
        </Field>

        <div className="md:col-span-2">
          <Button
            type="submit"
            size="lg"
            disabled={isPending}
            className="h-full min-h-12 w-full gap-2 text-base"
          >
            {isPending ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <Search className="size-4" />
            )}
            {isPending ? "Zoeken…" : "Zoek"}
          </Button>
        </div>
      </form>
    </Card>
  );
}

function Field({
  icon,
  label,
  className,
  children,
}: {
  icon: React.ReactNode;
  label: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        "rounded-md border border-input bg-background px-3 py-2 transition-colors focus-within:border-ring focus-within:ring-[3px] focus-within:ring-ring/30",
        className
      )}
    >
      <div className="mb-0.5 flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
        {icon}
        {label}
      </div>
      {children}
    </div>
  );
}

function CountrySelect({
  value,
  onChange,
}: {
  value: string[];
  onChange: (v: string[]) => void;
}) {
  const [open, setOpen] = useState(false);

  const display =
    value.length === 0
      ? "Overal in Europa"
      : value.length === 1
        ? `${COUNTRY_FLAGS[value[0]] ?? ""} ${value[0]}`
        : `${value.length} landen geselecteerd`;

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex h-10 w-full items-center justify-between text-left text-base outline-none"
      >
        <span className={cn(value.length === 0 && "text-muted-foreground")}>
          {display}
        </span>
      </button>

      {open && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setOpen(false)}
            aria-hidden
          />
          <div className="absolute left-0 right-0 top-full z-50 mt-2 rounded-md border bg-popover p-2 shadow-md">
            <ToggleGroup
              type="multiple"
              value={value}
              onValueChange={(v) => onChange(v)}
              variant="outline"
              spacing={4}
              className="flex-wrap justify-start"
            >
              {ALL_COUNTRIES.map((c) => (
                <ToggleGroupItem
                  key={c}
                  value={c}
                  size="sm"
                  className="rounded-full text-xs"
                >
                  <span className="mr-1">{COUNTRY_FLAGS[c]}</span>
                  {c}
                </ToggleGroupItem>
              ))}
            </ToggleGroup>
            {value.length > 0 && (
              <button
                type="button"
                onClick={() => onChange([])}
                className="mt-2 w-full text-xs text-muted-foreground underline-offset-2 hover:underline"
              >
                Selectie wissen
              </button>
            )}
          </div>
        </>
      )}
    </div>
  );
}

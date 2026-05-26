"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { CheckCircle2, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { createUserDeal } from "@/app/actions/deals";

const PROVIDERS = ["TUI", "Sunweb", "Corendon", "ByJune", "Prijsvrij", "Vakantiediscounter", "Anders"];
const TYPES = ["villa", "appartement", "hotel", "aparthotel", "all-inclusive"];
const CATERING = ["logies", "ontbijt", "halfpension", "all-inclusive"];

export interface QuickAddInitialValues {
  url?: string;
  title?: string;
  image?: string;
  description?: string;
  price?: string;
  provider?: string;
  country?: string;
}

interface QuickAddDealFormProps {
  initial: QuickAddInitialValues;
}

/**
 * Pre-filled deal-add formulier voor de bookmarklet flow. Vergelijkbaar met
 * de dialog in AddDealLinkForm, maar:
 * - Geen URL-fetch stap (de bookmarklet heeft de data al opgehaald)
 * - Full page in plaats van dialog (eigen URL: /voeg-toe)
 * - Na opslaan terug naar de homepage
 */
export function QuickAddDealForm({ initial }: QuickAddDealFormProps) {
  const router = useRouter();
  const [isSubmitting, startSubmit] = useTransition();
  const [normalizedImage] = useState(() =>
    initial.image?.startsWith("//") ? `https:${initial.image}` : initial.image ?? ""
  );

  function onSubmit(formData: FormData) {
    const get = (k: string) => String(formData.get(k) ?? "").trim();
    const price = Number(get("pricePerPerson"));
    const duration = Number(get("duration"));

    if (!get("title") || Number.isNaN(price) || price <= 0 || Number.isNaN(duration) || duration <= 0) {
      toast.error("Vul titel, prijs en duur correct in");
      return;
    }

    startSubmit(async () => {
      try {
        await createUserDeal({
          title: get("title"),
          description: get("description"),
          destination: get("country"),
          country: get("country"),
          region: get("region"),
          provider: get("provider"),
          providerUrl: get("providerUrl"),
          type: get("type"),
          catering: get("catering"),
          pricePerPerson: price,
          duration,
          startDate: get("startDate"),
          flightTime: get("flightTime") || "—",
          imageUrl: get("imageUrl") || undefined,
        });
        toast.success("Deal toegevoegd");
        router.push("/?searched=true");
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Toevoegen mislukt");
      }
    });
  }

  return (
    <Card className="overflow-hidden p-0">
      {normalizedImage && (
        <div className="relative h-40 w-full overflow-hidden bg-muted">
          <Image
            src={normalizedImage}
            alt={initial.title ?? "Deal afbeelding"}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 768px"
            priority
          />
        </div>
      )}

      <form action={onSubmit} className="grid gap-3 p-5">
        <div className="mb-1 flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-emerald-700 dark:text-emerald-400">
          <CheckCircle2 className="size-4" />
          Gegevens binnengehaald — controleer en vul aan
        </div>

        <div className="grid gap-1.5">
          <Label htmlFor="title">Titel *</Label>
          <Input id="title" name="title" defaultValue={initial.title} required />
        </div>

        <div className="grid gap-1.5">
          <Label htmlFor="description">Beschrijving</Label>
          <Textarea id="description" name="description" rows={2} defaultValue={initial.description} />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="grid gap-1.5">
            <Label htmlFor="provider">Aanbieder</Label>
            <select
              id="provider"
              name="provider"
              defaultValue={initial.provider || "Anders"}
              className="h-9 rounded-md border border-input bg-transparent px-3 text-sm"
            >
              {PROVIDERS.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="providerUrl">URL</Label>
            <Input
              id="providerUrl"
              name="providerUrl"
              type="url"
              defaultValue={initial.url}
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3">
          <div className="grid gap-1.5">
            <Label htmlFor="country">Land *</Label>
            <Input id="country" name="country" defaultValue={initial.country} required placeholder="bv. Turkije" />
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="region">Regio</Label>
            <Input id="region" name="region" placeholder="bv. Side" />
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="flightTime">Vluchttijd</Label>
            <Input id="flightTime" name="flightTime" placeholder="bv. 4h 10m" />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3">
          <div className="grid gap-1.5">
            <Label htmlFor="pricePerPerson">Prijs p.p. (€) *</Label>
            <Input
              id="pricePerPerson"
              name="pricePerPerson"
              type="number"
              min="1"
              defaultValue={initial.price}
              required
            />
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="duration">Duur (dagen) *</Label>
            <Input id="duration" name="duration" type="number" min="1" required defaultValue="11" />
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="startDate">Vertrek</Label>
            <Input id="startDate" name="startDate" type="date" defaultValue="2026-07-01" required />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="grid gap-1.5">
            <Label htmlFor="type">Type</Label>
            <select
              id="type"
              name="type"
              defaultValue="hotel"
              className="h-9 rounded-md border border-input bg-transparent px-3 text-sm"
            >
              {TYPES.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="catering">Catering</Label>
            <select
              id="catering"
              name="catering"
              defaultValue="logies"
              className="h-9 rounded-md border border-input bg-transparent px-3 text-sm"
            >
              {CATERING.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
        </div>

        <input type="hidden" name="imageUrl" defaultValue={normalizedImage} />

        <div className="mt-2 flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={() => router.back()}>
            Annuleren
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting && <Loader2 className="mr-1 size-4 animate-spin" />}
            {isSubmitting ? "Bezig..." : "Opslaan"}
          </Button>
        </div>
      </form>
    </Card>
  );
}

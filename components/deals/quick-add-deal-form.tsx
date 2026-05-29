"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { CheckCircle2, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { DealFormFields } from "@/components/deals/deal-form-fields";
import { createUserDeal } from "@/app/actions/deals";

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
          createdVia: "bookmarklet",
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

        <DealFormFields
          defaults={{
            title: initial.title,
            description: initial.description,
            provider: initial.provider,
            providerUrl: initial.url,
            country: initial.country,
            price: initial.price,
            imageUrl: normalizedImage,
          }}
        />

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

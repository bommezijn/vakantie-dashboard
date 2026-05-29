"use client";

import { useState, useTransition } from "react";
import { Link as LinkIcon, Loader2, Plus, X, Database } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { DealFormFields } from "@/components/deals/deal-form-fields";
import { createUserDeal } from "@/app/actions/deals";
import { SUPABASE_CONFIGURED, NO_DATABASE_MESSAGE } from "@/lib/supabase/config";

interface ExtractedMeta {
  title: string;
  description: string;
  image: string;
  providerUrl: string;
  provider: string;
  siteName: string;
}

export function AddDealLinkForm() {
  const [expanded, setExpanded] = useState(false);
  const [url, setUrl] = useState("");
  const [isExtracting, startExtract] = useTransition();
  const [isSubmitting, startSubmit] = useTransition();
  const [meta, setMeta] = useState<ExtractedMeta | null>(null);
  const [open, setOpen] = useState(false);

  // Geen database → toon een uitlegregel i.p.v. een formulier dat tóch crasht.
  if (!SUPABASE_CONFIGURED) {
    return (
      <Card className="flex items-center gap-2 p-3 text-xs text-muted-foreground">
        <Database className="size-4 shrink-0" />
        {NO_DATABASE_MESSAGE}
      </Card>
    );
  }

  function onExtract(e: React.FormEvent) {
    e.preventDefault();
    if (!url.trim()) return;

    startExtract(async () => {
      const fallback: ExtractedMeta = {
        title: "",
        description: "",
        image: "",
        providerUrl: url.trim(),
        provider: "Anders",
        siteName: "",
      };
      try {
        const res = await fetch("/api/extract-link", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ url: url.trim() }),
        });
        const data = await res.json();
        if (!res.ok) {
          setMeta(fallback);
          setOpen(true);
          const msg: string = data.error ?? "Extractie mislukt";
          const isForbidden = msg.includes("403") || msg.includes("401");
          toast.warning(
            isForbidden
              ? "Deze website blokkeert automatisch ophalen — vul de details hieronder handmatig in."
              : `${msg} — vul de details handmatig in.`,
            { duration: 6000 }
          );
          return;
        }
        setMeta(data as ExtractedMeta);
        setOpen(true);
      } catch {
        setMeta(fallback);
        setOpen(true);
        toast.warning(
          "Pagina kon niet worden opgehaald — vul de details handmatig in.",
          { duration: 6000 }
        );
      }
    });
  }

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
          createdVia: "link-paste",
        });
        toast.success("Deal toegevoegd");
        setOpen(false);
        setMeta(null);
        setUrl("");
        setExpanded(false);
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Toevoegen mislukt");
      }
    });
  }

  return (
    <>
      {!expanded ? (
        <div className="flex justify-end">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setExpanded(true)}
            className="gap-1.5"
          >
            <Plus className="size-4" />
            Zelf een vakantie toevoegen
          </Button>
        </div>
      ) : (
        <Card className="p-3">
          <form onSubmit={onExtract} className="flex flex-col gap-2 sm:flex-row sm:items-center">
            <Label htmlFor="add-deal-url" className="shrink-0 text-sm">
              <LinkIcon className="size-4" />
              Voeg vakantie toe via link
            </Label>
            <Input
              id="add-deal-url"
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://www.tui.nl/vakantie/..."
              className="flex-1"
              disabled={isExtracting}
              autoFocus
            />
            <div className="flex gap-2">
              <Button type="submit" disabled={isExtracting || !url.trim()}>
                {isExtracting ? <Loader2 className="mr-1 size-4 animate-spin" /> : null}
                {isExtracting ? "Bezig..." : "Ophalen"}
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                aria-label="Sluiten"
                onClick={() => {
                  setExpanded(false);
                  setUrl("");
                }}
              >
                <X className="size-4" />
              </Button>
            </div>
          </form>
          <p className="mt-2 text-xs text-muted-foreground">
            Of vul direct handmatig in zonder URL via{" "}
            <button
              type="button"
              className="underline underline-offset-2 hover:text-foreground"
              onClick={() => {
                setMeta({
                  title: "",
                  description: "",
                  image: "",
                  providerUrl: "",
                  provider: "Anders",
                  siteName: "",
                });
                setOpen(true);
              }}
            >
              dit formulier
            </button>
            .
          </p>
        </Card>
      )}

      <Dialog
        open={open}
        onOpenChange={(o) => {
          setOpen(o);
          if (!o) setMeta(null);
        }}
      >
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Nieuwe deal toevoegen</DialogTitle>
            <DialogDescription>
              {meta?.title
                ? "Velden zijn gevuld uit de pagina-metadata. Vul de ontbrekende reisdetails aan."
                : "Vul de reisdetails in. Velden met * zijn verplicht."}
            </DialogDescription>
          </DialogHeader>

          {meta && (
            <form action={onSubmit} className="grid max-h-[60vh] gap-3 overflow-y-auto pr-1">
              <DealFormFields
                defaults={{
                  title: meta.title,
                  description: meta.description,
                  provider: meta.provider,
                  providerUrl: meta.providerUrl,
                  imageUrl: meta.image,
                }}
              />

              <DialogFooter className="mt-2">
                <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                  Annuleren
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Bezig..." : "Toevoegen"}
                </Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}

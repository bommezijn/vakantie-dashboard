"use client";

import { useState, useTransition } from "react";
import { Link as LinkIcon, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { createUserDeal } from "@/app/actions/deals";

interface ExtractedMeta {
  title: string;
  description: string;
  image: string;
  providerUrl: string;
  provider: string;
  siteName: string;
}

const PROVIDERS = ["TUI", "Sunweb", "Corendon", "ByJune", "Anders"];
const TYPES = ["villa", "appartement", "hotel", "aparthotel", "all-inclusive"];
const CATERING = ["logies", "ontbijt", "halfpension", "all-inclusive"];

export function AddDealLinkForm() {
  const [url, setUrl] = useState("");
  const [isExtracting, startExtract] = useTransition();
  const [isSubmitting, startSubmit] = useTransition();
  const [meta, setMeta] = useState<ExtractedMeta | null>(null);
  const [open, setOpen] = useState(false);

  function onExtract(e: React.FormEvent) {
    e.preventDefault();
    if (!url.trim()) return;

    startExtract(async () => {
      try {
        const res = await fetch("/api/extract-link", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ url: url.trim() }),
        });
        const data = await res.json();
        if (!res.ok) {
          // Open the dialog anyway so the user can fill in details manually
          const fallback: ExtractedMeta = {
            title: "",
            description: "",
            image: "",
            providerUrl: url.trim(),
            provider: "Anders",
            siteName: "",
          };
          setMeta(fallback);
          setOpen(true);
          // Show a contextual warning based on the status code
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
        // Network / timeout errors: still open dialog with empty fields
        const fallback: ExtractedMeta = {
          title: "",
          description: "",
          image: "",
          providerUrl: url.trim(),
          provider: "Anders",
          siteName: "",
        };
        setMeta(fallback);
        setOpen(true);
        toast.warning(
          `Pagina kon niet worden opgehaald — vul de details handmatig in.`,
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
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Toevoegen mislukt");
      }
    });
  }

  return (
    <>
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
          />
          <Button type="submit" disabled={isExtracting || !url.trim()}>
            {isExtracting ? <Loader2 className="mr-1 size-4 animate-spin" /> : null}
            {isExtracting ? "Bezig..." : "Ophalen"}
          </Button>
        </form>
      </Card>

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
                : "De website kon niet automatisch worden uitgelezen. Vul de reisdetails handmatig in."}
            </DialogDescription>
          </DialogHeader>

          {meta && (
            <form action={onSubmit} className="grid max-h-[60vh] gap-3 overflow-y-auto pr-1">
              <div className="grid gap-1.5">
                <Label htmlFor="title">Titel *</Label>
                <Input id="title" name="title" defaultValue={meta.title} required />
              </div>
              <div className="grid gap-1.5">
                <Label htmlFor="description">Beschrijving</Label>
                <Textarea
                  id="description"
                  name="description"
                  rows={2}
                  defaultValue={meta.description}
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="grid gap-1.5">
                  <Label htmlFor="provider">Aanbieder</Label>
                  <select
                    id="provider"
                    name="provider"
                    defaultValue={meta.provider}
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
                    defaultValue={meta.providerUrl}
                    required
                  />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div className="grid gap-1.5">
                  <Label htmlFor="country">Land *</Label>
                  <Input id="country" name="country" required placeholder="bv. Turkije" />
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
                    required
                  />
                </div>
                <div className="grid gap-1.5">
                  <Label htmlFor="duration">Duur (dagen) *</Label>
                  <Input
                    id="duration"
                    name="duration"
                    type="number"
                    min="1"
                    required
                    defaultValue="11"
                  />
                </div>
                <div className="grid gap-1.5">
                  <Label htmlFor="startDate">Vertrek</Label>
                  <Input
                    id="startDate"
                    name="startDate"
                    type="date"
                    defaultValue="2026-07-01"
                    required
                  />
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
              <input type="hidden" name="imageUrl" defaultValue={meta.image} />

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

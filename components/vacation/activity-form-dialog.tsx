"use client";

import { useState, useTransition } from "react";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { addActivity } from "@/app/actions/vacation";

interface ActivityFormDialogProps {
  planId: string;
}

export function ActivityFormDialog({ planId }: ActivityFormDialogProps) {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  function onSubmit(formData: FormData) {
    const name = String(formData.get("name") ?? "").trim();
    if (!name) {
      toast.error("Naam is verplicht");
      return;
    }

    const priceRaw = String(formData.get("price") ?? "").trim();
    const price = priceRaw ? Number(priceRaw) : undefined;
    if (priceRaw && Number.isNaN(price)) {
      toast.error("Prijs moet een getal zijn");
      return;
    }

    startTransition(async () => {
      try {
        await addActivity({
          planId,
          name,
          location: String(formData.get("location") ?? "") || undefined,
          url: String(formData.get("url") ?? "") || undefined,
          pricePerPerson: price,
          currency: String(formData.get("currency") ?? "EUR") || "EUR",
          notes: String(formData.get("notes") ?? "") || undefined,
        });
        toast.success("Activiteit toegevoegd");
        setOpen(false);
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Toevoegen mislukt");
      }
    });
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm">
          <Plus className="mr-1 size-4" />
          Activiteit toevoegen
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Nieuwe activiteit</DialogTitle>
          <DialogDescription>
            Excursie, restaurantbezoek of dagtrip — alles wat je wilt plannen.
          </DialogDescription>
        </DialogHeader>

        <form action={onSubmit} className="grid gap-3">
          <div className="grid gap-1.5">
            <Label htmlFor="name">Naam *</Label>
            <Input id="name" name="name" required placeholder="bv. Bezoek Hagia Sophia" />
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="location">Locatie</Label>
            <Input id="location" name="location" placeholder="bv. Istanbul" />
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="url">Link</Label>
            <Input id="url" name="url" type="url" placeholder="https://..." />
          </div>
          <div className="grid grid-cols-[1fr_100px] gap-3">
            <div className="grid gap-1.5">
              <Label htmlFor="price">Prijs p.p.</Label>
              <Input id="price" name="price" type="number" step="0.01" min="0" placeholder="0" />
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="currency">Valuta</Label>
              <Input id="currency" name="currency" defaultValue="EUR" maxLength={3} />
            </div>
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="notes">Notities</Label>
            <Textarea id="notes" name="notes" rows={3} placeholder="Opmerkingen, openingstijden, ..." />
          </div>

          <DialogFooter className="mt-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Annuleren
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? "Bezig..." : "Toevoegen"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

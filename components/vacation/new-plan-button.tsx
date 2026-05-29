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
import { createBlankPlan } from "@/app/actions/vacation";

export function NewPlanButton() {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  function onSubmit(formData: FormData) {
    const name = String(formData.get("name") ?? "").trim();
    if (!name) {
      toast.error("Naam is verplicht");
      return;
    }
    startTransition(async () => {
      try {
        await createBlankPlan(name);
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Aanmaken mislukt");
      }
    });
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-1 size-4" />
          Nieuw plan
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Nieuw vakantieplan</DialogTitle>
          <DialogDescription>Geef je plan een naam — je kunt activiteiten erna toevoegen.</DialogDescription>
        </DialogHeader>
        <form action={onSubmit} className="grid gap-3">
          <div className="grid gap-1.5">
            <Label htmlFor="name">Naam *</Label>
            <Input id="name" name="name" required placeholder="bv. Roadtrip Albanië" autoFocus />
          </div>
          <DialogFooter className="mt-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Annuleren
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? "Bezig..." : "Maak aan"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

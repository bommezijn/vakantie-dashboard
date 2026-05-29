"use client";

import { useTransition } from "react";
import { useQueryState } from "nuqs";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { dealParser } from "@/lib/search-params";
import { deleteUserDeal } from "@/app/actions/deals";

interface DeleteDealButtonProps {
  dealId: string;
  dealTitle: string;
}

export function DeleteDealButton({ dealId, dealTitle }: DeleteDealButtonProps) {
  const [isPending, startTransition] = useTransition();
  const [, setSelected] = useQueryState("deal", dealParser);

  function onDelete() {
    if (!confirm(`"${dealTitle}" definitief verwijderen?`)) return;

    startTransition(async () => {
      try {
        await deleteUserDeal(dealId);
        toast.success("Deal verwijderd");
        // Sluit het detail sheet — de revalidate in de action haalt de
        // bijgewerkte lijst op, zodat de card uit de grid verdwijnt.
        setSelected(null);
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Verwijderen mislukt");
      }
    });
  }

  return (
    <Button
      onClick={onDelete}
      disabled={isPending}
      variant="outline"
      className="w-full border-rose-300 text-rose-700 hover:bg-rose-50 hover:text-rose-800 dark:border-rose-900 dark:text-rose-400 dark:hover:bg-rose-950"
    >
      <Trash2 className="mr-2 size-4" />
      {isPending ? "Bezig..." : "Deal verwijderen"}
    </Button>
  );
}

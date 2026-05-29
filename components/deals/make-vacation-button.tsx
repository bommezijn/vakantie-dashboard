"use client";

import { useTransition } from "react";
import { Sparkles } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { createPlanFromDeal } from "@/app/actions/vacation";
import { SUPABASE_CONFIGURED } from "@/lib/supabase/config";

interface MakeVacationButtonProps {
  dealId: string;
  dealTitle: string;
}

export function MakeVacationButton({ dealId, dealTitle }: MakeVacationButtonProps) {
  const [isPending, startTransition] = useTransition();

  // Zonder database is er geen plek om het plan op te slaan.
  if (!SUPABASE_CONFIGURED) return null;

  function onClick() {
    startTransition(async () => {
      try {
        await createPlanFromDeal(dealId, dealTitle);
      } catch (err) {
        // redirect() throws NEXT_REDIRECT — let it propagate
        if (err instanceof Error && err.message.includes("NEXT_REDIRECT")) throw err;
        toast.error(err instanceof Error ? err.message : "Aanmaken mislukt");
      }
    });
  }

  return (
    <Button
      variant="secondary"
      className="w-full"
      onClick={onClick}
      disabled={isPending}
    >
      <Sparkles className="mr-2 size-4" />
      {isPending ? "Bezig..." : "Maak dit mijn vakantie"}
    </Button>
  );
}

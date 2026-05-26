"use client";

import { Compass, Plane, Wallet, Tags } from "lucide-react";
import { Card } from "@/components/ui/card";

const STEPS = [
  {
    icon: Compass,
    title: "Kies bestemming",
    text: "Eén land of meerdere — laat leeg voor alles in Europa.",
  },
  {
    icon: Plane,
    title: "Reizigers & budget",
    text: "Aantal personen en wat het per persoon mag kosten.",
  },
  {
    icon: Wallet,
    title: "Vergelijk agencies",
    text: "Sunweb, TUI, Corendon en ByJune in één overzicht.",
  },
  {
    icon: Tags,
    title: "Verfijn met keywords",
    text: "Pas na de zoekopdracht filter je op stijl en faciliteiten.",
  },
];

export function WelcomeState() {
  return (
    <Card className="p-6 lg:p-8">
      <div className="mx-auto max-w-2xl space-y-6 text-center">
        <div>
          <h3 className="text-lg font-semibold tracking-tight">
            Start je zoekopdracht
          </h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Vul hierboven je voorkeuren in. We doorzoeken meerdere Nederlandse
            reisbureaus en tonen alles op één plek.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-3 text-left sm:grid-cols-2">
          {STEPS.map((step, i) => (
            <div
              key={step.title}
              className="flex items-start gap-3 rounded-md border bg-muted/30 p-3"
            >
              <div className="grid size-8 shrink-0 place-items-center rounded-md bg-primary/10 text-primary">
                <step.icon className="size-4" />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-medium leading-tight">
                  {i + 1}. {step.title}
                </p>
                <p className="mt-0.5 text-xs text-muted-foreground">{step.text}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}

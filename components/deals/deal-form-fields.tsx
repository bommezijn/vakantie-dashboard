"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { DEAL_PROVIDERS, DEAL_TYPES, DEAL_CATERING } from "@/data/deal-options";

export interface DealFormDefaults {
  title?: string;
  description?: string;
  provider?: string;
  providerUrl?: string;
  country?: string;
  region?: string;
  flightTime?: string;
  price?: string | number;
  duration?: string | number;
  startDate?: string;
  type?: string;
  catering?: string;
  imageUrl?: string;
}

const selectClass =
  "h-9 rounded-md border border-input bg-transparent px-3 text-sm";

/**
 * Gedeelde velden voor beide deal-toevoeg-formulieren (link-paste dialog en
 * bookmarklet full-page). De wrapper-<form>, submit-knoppen en submit-logica
 * blijven bij de aanroeper — dit component levert alleen de invoervelden +
 * de verborgen imageUrl. Voorkomt dat de twee formulieren uit elkaar lopen.
 */
export function DealFormFields({ defaults }: { defaults: DealFormDefaults }) {
  return (
    <>
      <div className="grid gap-1.5">
        <Label htmlFor="title">Titel *</Label>
        <Input id="title" name="title" defaultValue={defaults.title} required />
      </div>

      <div className="grid gap-1.5">
        <Label htmlFor="description">Beschrijving</Label>
        <Textarea
          id="description"
          name="description"
          rows={2}
          defaultValue={defaults.description}
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="grid gap-1.5">
          <Label htmlFor="provider">Aanbieder</Label>
          <select
            id="provider"
            name="provider"
            defaultValue={defaults.provider || "Anders"}
            className={selectClass}
          >
            {DEAL_PROVIDERS.map((p) => (
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
            defaultValue={defaults.providerUrl}
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <div className="grid gap-1.5">
          <Label htmlFor="country">Land *</Label>
          <Input
            id="country"
            name="country"
            defaultValue={defaults.country}
            required
            placeholder="bv. Turkije"
          />
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
            defaultValue={defaults.price}
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
            defaultValue={defaults.duration ?? "11"}
          />
        </div>
        <div className="grid gap-1.5">
          <Label htmlFor="startDate">Vertrek</Label>
          <Input
            id="startDate"
            name="startDate"
            type="date"
            defaultValue={defaults.startDate ?? "2026-07-01"}
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
            defaultValue={defaults.type ?? "hotel"}
            className={selectClass}
          >
            {DEAL_TYPES.map((t) => (
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
            defaultValue={defaults.catering ?? "logies"}
            className={selectClass}
          >
            {DEAL_CATERING.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
      </div>

      <input type="hidden" name="imageUrl" defaultValue={defaults.imageUrl} />
    </>
  );
}

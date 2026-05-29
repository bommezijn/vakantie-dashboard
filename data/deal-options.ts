// Gedeelde keuzelijsten voor deal-formulieren. Eén bron van waarheid zodat
// AddDealLinkForm (link-paste) en QuickAddDealForm (bookmarklet) niet uit
// elkaar lopen — voorheen miste de link-form bv. Prijsvrij en Vakantiediscounter.
//
// "Anders" is een UI-only optie voor providers buiten onze adapter-set.
export const DEAL_PROVIDERS = [
  "TUI",
  "Sunweb",
  "Corendon",
  "ByJune",
  "Prijsvrij",
  "Vakantiediscounter",
  "Anders",
] as const;

export const DEAL_TYPES = [
  "villa",
  "appartement",
  "hotel",
  "aparthotel",
  "all-inclusive",
] as const;

export const DEAL_CATERING = [
  "logies",
  "ontbijt",
  "halfpension",
  "all-inclusive",
] as const;

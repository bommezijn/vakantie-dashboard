import {
  parseAsArrayOf,
  parseAsBoolean,
  parseAsInteger,
  parseAsString,
  parseAsStringEnum,
} from "nuqs";
import type { SortKey } from "@/types/deal";
import { DEFAULT_BUDGET, DEFAULT_SORT, DEFAULT_TRAVELERS } from "@/lib/defaults";

export { DEFAULT_BUDGET, DEFAULT_TRAVELERS, DEFAULT_SORT };

const SORT_KEYS: SortKey[] = [
  "price-asc",
  "price-desc",
  "rating-desc",
  "flight-asc",
  "duration-desc",
];

export const budgetParser = parseAsInteger
  .withDefault(DEFAULT_BUDGET)
  .withOptions({ clearOnDefault: true });

export const travelersParser = parseAsInteger
  .withDefault(DEFAULT_TRAVELERS)
  .withOptions({ clearOnDefault: true });

export const keywordsParser = parseAsArrayOf(parseAsString)
  .withDefault([])
  .withOptions({ clearOnDefault: true });

export const providersParser = parseAsArrayOf(parseAsString)
  .withDefault([])
  .withOptions({ clearOnDefault: true });

export const countriesParser = parseAsArrayOf(parseAsString)
  .withDefault([])
  .withOptions({ clearOnDefault: true });

export const showOverBudgetParser = parseAsBoolean
  .withDefault(false)
  .withOptions({ clearOnDefault: true });

export const sortParser = parseAsStringEnum(SORT_KEYS)
  .withDefault(DEFAULT_SORT)
  .withOptions({ clearOnDefault: true });

export const searchedParser = parseAsBoolean
  .withDefault(false)
  .withOptions({ clearOnDefault: true });

export type SourceFilter = "all" | "user" | "agency";

export const sourceParser = parseAsStringEnum<SourceFilter>([
  "all",
  "user",
  "agency",
])
  .withDefault("all")
  .withOptions({ clearOnDefault: true });

export const dealParser = parseAsString;

export const filterParsers = {
  budget: budgetParser,
  travelers: travelersParser,
  keywords: keywordsParser,
  providers: providersParser,
  countries: countriesParser,
  showOverBudget: showOverBudgetParser,
  sort: sortParser,
  source: sourceParser,
  searched: searchedParser,
};

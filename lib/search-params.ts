import {
  parseAsArrayOf,
  parseAsBoolean,
  parseAsInteger,
  parseAsString,
  parseAsStringEnum,
} from "nuqs";
import type { SortKey } from "@/types/deal";

export const DEFAULT_BUDGET = 800;
export const DEFAULT_TRAVELERS = 3;
export const DEFAULT_SORT: SortKey = "price-asc";

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

export const dealParser = parseAsString;

export const filterParsers = {
  budget: budgetParser,
  travelers: travelersParser,
  keywords: keywordsParser,
  providers: providersParser,
  countries: countriesParser,
  showOverBudget: showOverBudgetParser,
  sort: sortParser,
};

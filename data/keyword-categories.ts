export interface KeywordItem {
  id: string;
  icon: string;
}

export interface KeywordCategory {
  label: string;
  items: KeywordItem[];
}

export const keywordCategories: KeywordCategory[] = [
  {
    label: "Type",
    items: [
      { id: "villa", icon: "🏡" },
      { id: "appartement", icon: "🏢" },
      { id: "hotel", icon: "🏨" },
      { id: "aparthotel", icon: "🏬" },
      { id: "all-inclusive", icon: "🍹" },
    ],
  },
  {
    label: "Faciliteiten",
    items: [
      { id: "privezwembad", icon: "🏊" },
      { id: "huurauto-inclusief", icon: "🚗" },
      { id: "strand", icon: "🏖️" },
    ],
  },
  {
    label: "Sfeer",
    items: [
      { id: "rustig", icon: "🌿" },
      { id: "levendig", icon: "🎉" },
      { id: "kleinschalig", icon: "🏘️" },
      { id: "luxe", icon: "⭐" },
      { id: "budget", icon: "💸" },
      { id: "familie", icon: "👨" },
    ],
  },
  {
    label: "Interesses",
    items: [
      { id: "cultuur", icon: "🏛️" },
      { id: "eten", icon: "🍝" },
      { id: "historisch", icon: "⛩️" },
      { id: "natuur", icon: "🌲" },
      { id: "duiken", icon: "🤿" },
    ],
  },
];

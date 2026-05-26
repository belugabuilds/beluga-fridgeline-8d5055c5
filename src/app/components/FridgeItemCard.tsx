"use client";

import { FridgeItem, getDaysUntilExpiry, getUrgencyColor } from "../lib/storage";

const CATEGORY_ICONS: Record<string, string> = {
  Dairy: "🥛",
  "Meat & Fish": "🥩",
  Vegetables: "🥦",
  Fruit: "🍎",
  Leftovers: "🍱",
  Drinks: "🧃",
  Condiments: "🧂",
  Eggs: "🥚",
  "Bread & Grains": "🍞",
  Other: "📦",
};

interface Props {
  item: FridgeItem;
  selected: boolean;
  onDelete: (id: string) => void;
  onToggleSelect: (id: string) => void;
}

export default function FridgeItemCard({ item, selected, onDelete, onToggleSelect }: Props) {
  const days = getDaysUntilExpiry(item.expiryDate);
  const urgency = getUrgencyColor(days);
  const icon = CATEGORY_ICONS[item.category] || "📦";

  return (
    <div
      className={`relative flex items-center gap-3 bg-white rounded-xl border-2 p-3.5 transition-all cursor-pointer ${
        selected
          ? "border-emerald-400 shadow-md ring-1 ring-emerald-300"
          : `border-transparent shadow-sm hover:shadow-md hover:border-gray-200 ${
              urgency.border
            }`
      }`}
      onClick={() => onToggleSelect(item.id)}
    >
      {/* Selection indicator */}
      <div
        className={`shrink-0 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
          selected
            ? "bg-emerald-500 border-emerald-500"
            : "border-gray-300 bg-white"
        }`}
      >
        {selected && (
          <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
          </svg>
        )}
      </div>

      {/* Icon */}
      <span className="text-2xl shrink-0">{icon}</span>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-gray-800 truncate">{item.name}</p>
        <p className="text-xs text-gray-400">{item.category}</p>
      </div>

      {/* Expiry badge */}
      <div
        className={`shrink-0 text-xs font-bold px-2.5 py-1 rounded-full ${urgency.bg} ${urgency.text}`}
      >
        {urgency.label}
      </div>

      {/* Delete */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onDelete(item.id);
        }}
        className="shrink-0 text-gray-300 hover:text-red-400 transition-colors text-lg leading-none p-1"
        aria-label={`Delete ${item.name}`}
      >
        ×
      </button>
    </div>
  );
}

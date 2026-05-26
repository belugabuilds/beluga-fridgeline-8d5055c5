"use client";

import { FridgeItem, getDaysUntilExpiry } from "../lib/storage";
import FridgeItemCard from "./FridgeItemCard";

interface Props {
  items: FridgeItem[];
  selectedItems: string[];
  onDelete: (id: string) => void;
  onToggleSelect: (id: string) => void;
  onGetRecipes: () => void;
}

export default function InventoryList({
  items,
  selectedItems,
  onDelete,
  onToggleSelect,
  onGetRecipes,
}: Props) {
  const sortedItems = [...items].sort((a, b) => {
    return getDaysUntilExpiry(a.expiryDate) - getDaysUntilExpiry(b.expiryDate);
  });

  if (items.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-10 text-center">
        <p className="text-4xl mb-3">🧊</p>
        <p className="text-gray-500 font-medium">Your fridge is empty.</p>
        <p className="text-gray-400 text-sm mt-1">Add items using the button above to get started.</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-500">
          {items.length} item{items.length !== 1 ? "s" : ""} in your fridge
          {selectedItems.length > 0 && (
            <span className="ml-2 text-emerald-600 font-medium">
              · {selectedItems.length} selected
            </span>
          )}
        </p>
        {selectedItems.length > 0 && (
          <button
            onClick={onGetRecipes}
            className="text-sm bg-emerald-100 hover:bg-emerald-200 text-emerald-700 font-semibold px-3 py-1.5 rounded-lg transition-colors"
          >
            🍳 Get Recipes
          </button>
        )}
      </div>

      {selectedItems.length === 0 && (
        <p className="text-xs text-gray-400 bg-gray-50 rounded-lg px-3 py-2">
          💡 Tip: Tap items to select them, then get recipe suggestions.
        </p>
      )}

      <div className="space-y-2">
        {sortedItems.map((item) => (
          <FridgeItemCard
            key={item.id}
            item={item}
            selected={selectedItems.includes(item.id)}
            onDelete={onDelete}
            onToggleSelect={onToggleSelect}
          />
        ))}
      </div>
    </div>
  );
}

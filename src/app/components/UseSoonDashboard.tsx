"use client";

import { FridgeItem } from "../lib/storage";
import FridgeItemCard from "./FridgeItemCard";

interface Props {
  items: FridgeItem[];
  selectedItems: string[];
  onDelete: (id: string) => void;
  onToggleSelect: (id: string) => void;
  onGetRecipes: () => void;
}

export default function UseSoonDashboard({
  items,
  selectedItems,
  onDelete,
  onToggleSelect,
  onGetRecipes,
}: Props) {
  if (items.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-10 text-center">
        <p className="text-4xl mb-3">✅</p>
        <p className="text-gray-700 font-semibold">Nothing expiring soon!</p>
        <p className="text-gray-400 text-sm mt-1">
          No items are expiring within the next 3 days. Nice work!
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="bg-red-50 border border-red-100 rounded-xl p-4">
        <div className="flex items-start gap-3">
          <span className="text-2xl">⏰</span>
          <div>
            <p className="font-semibold text-red-700">Use These Soon!</p>
            <p className="text-sm text-red-500 mt-0.5">
              {items.length} item{items.length !== 1 ? "s" : ""} expiring within 3 days. Select them and get recipe ideas to use them up.
            </p>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-500">
          {selectedItems.filter(id => items.find(i => i.id === id)).length > 0 && (
            <span className="text-emerald-600 font-medium">
              {selectedItems.filter(id => items.find(i => i.id === id)).length} selected
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
          💡 Tap items to select them, then get recipe ideas.
        </p>
      )}

      <div className="space-y-2">
        {items.map((item) => (
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

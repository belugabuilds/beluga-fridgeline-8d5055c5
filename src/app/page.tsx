"use client";

import { useState, useEffect } from "react";
import { FridgeItem, STORAGE_KEY, loadItems, saveItems } from "./lib/storage";
import AddItemForm from "./components/AddItemForm";
import InventoryList from "./components/InventoryList";
import UseSoonDashboard from "./components/UseSoonDashboard";
import RecipeSuggestions from "./components/RecipeSuggestions";

export default function Home() {
  const [items, setItems] = useState<FridgeItem[]>([]);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<"inventory" | "usesoon" | "recipes">("inventory");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setItems(loadItems());
  }, []);

  const handleAddItem = (item: FridgeItem) => {
    const updated = [...items, item];
    setItems(updated);
    saveItems(updated);
  };

  const handleDeleteItem = (id: string) => {
    const updated = items.filter((i) => i.id !== id);
    setItems(updated);
    saveItems(updated);
    setSelectedItems((prev) => prev.filter((sid) => sid !== id));
  };

  const handleToggleSelect = (id: string) => {
    setSelectedItems((prev) =>
      prev.includes(id) ? prev.filter((sid) => sid !== id) : [...prev, id]
    );
  };

  const useSoonItems = items.filter((item) => {
    const days = getDaysUntilExpiry(item.expiryDate);
    return days <= 3;
  });

  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-gray-400 text-lg">Loading FridgeLine...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-emerald-100">
        <div className="max-w-3xl mx-auto px-4 py-4 flex items-center gap-3">
          <span className="text-3xl">🥬</span>
          <div>
            <h1 className="text-2xl font-bold text-emerald-700">FridgeLine</h1>
            <p className="text-sm text-gray-500">Track expiry dates. Waste less food.</p>
          </div>
          {useSoonItems.length > 0 && (
            <div className="ml-auto">
              <span className="bg-red-100 text-red-700 text-xs font-semibold px-3 py-1.5 rounded-full border border-red-200">
                ⚠️ {useSoonItems.length} item{useSoonItems.length > 1 ? "s" : ""} expiring soon
              </span>
            </div>
          )}
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-6 space-y-6">
        {/* Add Item Form */}
        <AddItemForm onAdd={handleAddItem} />

        {/* Tabs */}
        <div className="flex gap-1 bg-white rounded-xl p-1 shadow-sm border border-gray-100">
          <TabButton
            label="📦 Inventory"
            count={items.length}
            active={activeTab === "inventory"}
            onClick={() => setActiveTab("inventory")}
          />
          <TabButton
            label="⏰ Use Soon"
            count={useSoonItems.length}
            active={activeTab === "usesoon"}
            onClick={() => setActiveTab("usesoon")}
            urgent={useSoonItems.length > 0}
          />
          <TabButton
            label="🍳 Recipes"
            count={selectedItems.length}
            active={activeTab === "recipes"}
            onClick={() => setActiveTab("recipes")}
          />
        </div>

        {/* Tab Content */}
        {activeTab === "inventory" && (
          <InventoryList
            items={items}
            selectedItems={selectedItems}
            onDelete={handleDeleteItem}
            onToggleSelect={handleToggleSelect}
            onGetRecipes={() => setActiveTab("recipes")}
          />
        )}
        {activeTab === "usesoon" && (
          <UseSoonDashboard
            items={useSoonItems}
            selectedItems={selectedItems}
            onDelete={handleDeleteItem}
            onToggleSelect={handleToggleSelect}
            onGetRecipes={() => setActiveTab("recipes")}
          />
        )}
        {activeTab === "recipes" && (
          <RecipeSuggestions
            items={items}
            selectedItemIds={selectedItems}
            onToggleSelect={handleToggleSelect}
          />
        )}
      </main>
    </div>
  );
}

function getDaysUntilExpiry(expiryDate: string): number {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const expiry = new Date(expiryDate);
  expiry.setHours(0, 0, 0, 0);
  return Math.ceil((expiry.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
}

function TabButton({
  label,
  count,
  active,
  onClick,
  urgent,
}: {
  label: string;
  count: number;
  active: boolean;
  onClick: () => void;
  urgent?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg text-sm font-medium transition-all ${
        active
          ? "bg-emerald-600 text-white shadow-sm"
          : "text-gray-600 hover:bg-gray-50"
      }`}
    >
      <span>{label}</span>
      {count > 0 && (
        <span
          className={`text-xs rounded-full px-1.5 py-0.5 font-bold ${
            active
              ? "bg-white text-emerald-700"
              : urgent
              ? "bg-red-100 text-red-700"
              : "bg-gray-100 text-gray-600"
          }`}
        >
          {count}
        </span>
      )}
    </button>
  );
}

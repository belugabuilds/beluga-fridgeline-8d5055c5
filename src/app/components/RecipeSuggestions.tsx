"use client";

import { useState } from "react";
import { FridgeItem } from "../lib/storage";
import { getRecipesForItems, Recipe } from "../lib/recipes";

interface Props {
  items: FridgeItem[];
  selectedItemIds: string[];
  onToggleSelect: (id: string) => void;
}

export default function RecipeSuggestions({ items, selectedItemIds, onToggleSelect }: Props) {
  const [expandedRecipe, setExpandedRecipe] = useState<string | null>(null);

  const selectedItems = items.filter((i) => selectedItemIds.includes(i.id));
  const selectedNames = selectedItems.map((i) => i.name);
  const selectedCategories = selectedItems.map((i) => i.category);

  const recipes = selectedItemIds.length > 0
    ? getRecipesForItems(selectedNames, selectedCategories)
    : [];

  if (selectedItemIds.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-10 text-center">
        <p className="text-4xl mb-3">🍳</p>
        <p className="text-gray-700 font-semibold">No items selected</p>
        <p className="text-gray-400 text-sm mt-1">
          Go to the Inventory or Use Soon tab and select items to get recipe suggestions.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Selected items */}
      <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-4">
        <p className="text-sm font-semibold text-emerald-700 mb-2">Finding recipes using:</p>
        <div className="flex flex-wrap gap-2">
          {selectedItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onToggleSelect(item.id)}
              className="flex items-center gap-1.5 bg-white border border-emerald-200 text-emerald-700 text-xs font-medium px-2.5 py-1.5 rounded-full hover:bg-red-50 hover:border-red-200 hover:text-red-600 transition-colors group"
            >
              <span>{item.name}</span>
              <span className="text-emerald-300 group-hover:text-red-400">×</span>
            </button>
          ))}
        </div>
      </div>

      {/* Recipe results */}
      {recipes.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 text-center">
          <p className="text-3xl mb-2">🤔</p>
          <p className="text-gray-600 font-medium">No matching recipes found</p>
          <p className="text-gray-400 text-sm mt-1">
            Try selecting different items from your fridge.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          <p className="text-sm text-gray-500">
            {recipes.length} recipe suggestion{recipes.length !== 1 ? "s" : ""} found
          </p>
          {recipes.map((recipe) => (
            <RecipeCard
              key={recipe.id}
              recipe={recipe}
              expanded={expandedRecipe === recipe.id}
              onToggle={() =>
                setExpandedRecipe(expandedRecipe === recipe.id ? null : recipe.id)
              }
            />
          ))}
        </div>
      )}
    </div>
  );
}

function RecipeCard({
  recipe,
  expanded,
  onToggle,
}: {
  recipe: Recipe;
  expanded: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <button
        onClick={onToggle}
        className="w-full text-left p-4 hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-start gap-3">
          <span className="text-2xl mt-0.5">🍽️</span>
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <p className="font-semibold text-gray-800">{recipe.title}</p>
              <svg
                className={`shrink-0 w-4 h-4 text-gray-400 mt-0.5 transition-transform ${
                  expanded ? "rotate-180" : ""
                }`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
            <p className="text-sm text-gray-500 mt-0.5">{recipe.description}</p>
            <div className="flex items-center gap-3 mt-2">
              <span className="text-xs text-gray-400 flex items-center gap-1">
                <span>⏱</span>{recipe.time}
              </span>
              <span className="text-xs text-gray-400 flex items-center gap-1">
                <span>📊</span>{recipe.difficulty}
              </span>
            </div>
          </div>
        </div>
      </button>

      {expanded && (
        <div className="border-t border-gray-100 p-4 space-y-4 bg-gray-50">
          <div>
            <p className="text-sm font-semibold text-gray-700 mb-2">Ingredients</p>
            <div className="flex flex-wrap gap-1.5">
              {recipe.ingredients.map((ing, i) => (
                <span
                  key={i}
                  className="text-xs bg-white border border-gray-200 text-gray-600 px-2 py-1 rounded-full capitalize"
                >
                  {ing}
                </span>
              ))}
            </div>
          </div>

          <div>
            <p className="text-sm font-semibold text-gray-700 mb-2">Steps</p>
            <ol className="space-y-2">
              {recipe.steps.map((step, i) => (
                <li key={i} className="flex gap-3 text-sm text-gray-600">
                  <span className="shrink-0 w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 text-xs font-bold flex items-center justify-center">
                    {i + 1}
                  </span>
                  <span>{step}</span>
                </li>
              ))}
            </ol>
          </div>
        </div>
      )}
    </div>
  );
}

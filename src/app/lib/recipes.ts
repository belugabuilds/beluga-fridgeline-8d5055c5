import recipesData from "../data/recipes.json";

export interface Recipe {
  id: string;
  title: string;
  description: string;
  ingredients: string[];
  tags: string[];
  time: string;
  difficulty: string;
  steps: string[];
}

export function getRecipesForItems(itemNames: string[], itemCategories: string[]): Recipe[] {
  const normalizedNames = itemNames.map((n) => n.toLowerCase().trim());
  const normalizedCategories = itemCategories.map((c) => c.toLowerCase().trim());
  const searchTerms = [...normalizedNames, ...normalizedCategories];

  if (searchTerms.length === 0) return [];

  const scored = (recipesData as Recipe[]).map((recipe) => {
    const recipeTerms = [
      ...recipe.tags.map((t) => t.toLowerCase()),
      ...recipe.ingredients.map((i) => i.toLowerCase()),
    ];

    let score = 0;
    for (const term of searchTerms) {
      for (const rt of recipeTerms) {
        if (rt.includes(term) || term.includes(rt)) {
          score += 1;
        }
      }
    }
    return { recipe, score };
  });

  return scored
    .filter((s) => s.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 6)
    .map((s) => s.recipe);
}

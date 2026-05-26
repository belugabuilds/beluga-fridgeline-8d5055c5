export interface FridgeItem {
  id: string;
  name: string;
  category: string;
  expiryDate: string; // ISO date string YYYY-MM-DD
  addedAt: string; // ISO timestamp
}

export const STORAGE_KEY = "fridgeline_v1_items";

export function loadItems(): FridgeItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed as FridgeItem[];
  } catch {
    return [];
  }
}

export function saveItems(items: FridgeItem[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch {
    // Storage quota exceeded or unavailable
  }
}

export function getDaysUntilExpiry(expiryDate: string): number {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const expiry = new Date(expiryDate);
  expiry.setHours(0, 0, 0, 0);
  return Math.ceil((expiry.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
}

export function getUrgencyColor(days: number): {
  bg: string;
  text: string;
  border: string;
  label: string;
} {
  if (days < 0) {
    return {
      bg: "bg-gray-100",
      text: "text-gray-500",
      border: "border-gray-200",
      label: "Expired",
    };
  }
  if (days === 0) {
    return {
      bg: "bg-red-100",
      text: "text-red-700",
      border: "border-red-200",
      label: "Today!",
    };
  }
  if (days <= 3) {
    return {
      bg: "bg-red-50",
      text: "text-red-600",
      border: "border-red-200",
      label: `${days}d left`,
    };
  }
  if (days <= 7) {
    return {
      bg: "bg-yellow-50",
      text: "text-yellow-700",
      border: "border-yellow-200",
      label: `${days}d left`,
    };
  }
  return {
    bg: "bg-green-50",
    text: "text-green-700",
    border: "border-green-200",
    label: `${days}d left`,
  };
}

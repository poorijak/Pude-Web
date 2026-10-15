import type { PlacementCategory, PlacementItem } from "@/types/assessment";

export interface CategoryGroup {
  category: PlacementCategory;
  /** Zero-based positions of this category's items in the full sequence. */
  indexes: number[];
}

/** Consecutive items of the same category, in sequence order. */
export function groupByCategory(items: PlacementItem[]): CategoryGroup[] {
  const groups: CategoryGroup[] = [];
  items.forEach((item, index) => {
    const last = groups[groups.length - 1];
    if (last && last.category === item.category) last.indexes.push(index);
    else groups.push({ category: item.category, indexes: [index] });
  });
  return groups;
}

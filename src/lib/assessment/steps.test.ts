import { expect, it } from "vitest";
import type { PlacementItem } from "@/types/assessment";
import { groupByCategory } from "./steps";

const make = (category: PlacementItem["category"], n: number): PlacementItem =>
  ({
    id: `${category}-${n}`,
    order: n,
    category,
    instruction: "",
  }) as PlacementItem;

it("groups consecutive items by category with their positions", () => {
  const items = [
    make("comprehension", 1),
    make("comprehension", 2),
    make("naming", 3),
    make("repeat", 4),
  ];
  expect(groupByCategory(items)).toEqual([
    { category: "comprehension", indexes: [0, 1] },
    { category: "naming", indexes: [2] },
    { category: "repeat", indexes: [3] },
  ]);
});

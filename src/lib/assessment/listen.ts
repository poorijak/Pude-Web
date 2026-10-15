import type { PlacementItem } from "@/types/assessment";

/** Text read aloud by the "listen again" button for each item. */
export function getListenText(item: PlacementItem): string {
  switch (item.category) {
    case "comprehension":
      return item.audio_text;
    case "naming":
      return item.instruction;
    case "word_clue":
      return item.clue;
    case "repeat":
      return item.phrase;
    case "conversation":
      return item.question;
  }
}

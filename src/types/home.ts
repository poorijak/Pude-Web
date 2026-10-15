import type { User } from "./user";

export interface HomeData {
  user: User;
  /** Exercises completed today (Thailand date). */
  today_done: number;
  /** Thailand dates `YYYY-MM-DD` practiced in the current week. */
  practiced_dates: string[];
}

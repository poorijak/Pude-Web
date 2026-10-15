export type Level = 1 | 2 | 3;
export type Stage = 1 | 2 | 3 | 4 | 5;

export interface User {
  id: string;
  name: string;
  surname: string;
  profile_photo_url: string | null;
  current_level: Level;
  current_stage: Stage;
  current_streak: number;
  longest_streak: number;
  /** Thailand calendar date, `YYYY-MM-DD`. */
  last_practice_date: string | null;
}

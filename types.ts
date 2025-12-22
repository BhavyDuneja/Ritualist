export interface Habit {
  id: number;
  name: string;
  completed: number[]; // Derived from done, kept for spec compliance
  done: number[];      // Explicitly marked done (green)
  notDone: number[];   // Explicitly marked not done (red)
  color: string;       // Hex color code for customization
}

export type Weekday = 'Mon' | 'Tue' | 'Wed' | 'Thu' | 'Fri' | 'Sat' | 'Sun';

export interface AppState {
  habits: Habit[];
  title: string;
  firstDayOfWeek: Weekday;
}

export const WEEKDAYS: Weekday[] = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

export interface ThemeContextType {
  isDark: boolean;
  toggleTheme: () => void;
}

export type DayStatus = 'done' | 'not-done' | 'neutral';
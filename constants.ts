import { Habit, Weekday } from './types';

export const DAYS_IN_MONTH = 31;

export const HABIT_COLORS = [
  '#0ea5e9', // Sky 500 (Default)
  '#10b981', // Emerald 500
  '#f59e0b', // Amber 500
  '#f43f5e', // Rose 500
  '#8b5cf6', // Violet 500
  '#6366f1', // Indigo 500
];

export const INITIAL_HABITS: Habit[] = [
  {
    id: 1,
    name: 'Morning Meditation',
    completed: [],
    done: [],
    notDone: [],
    color: '#0ea5e9'
  },
  {
    id: 2,
    name: 'Read 30 Minutes',
    completed: [],
    done: [],
    notDone: [],
    color: '#8b5cf6'
  },
  {
    id: 3,
    name: 'Workout',
    completed: [],
    done: [],
    notDone: [],
    color: '#f43f5e'
  }
];

export const DEFAULT_TITLE = "Ritualist";
export const DEFAULT_START_DAY: Weekday = 'Mon';
export const STORAGE_KEY = 'focus_grow_data_v1';
export const THEME_KEY = 'focus_grow_theme';
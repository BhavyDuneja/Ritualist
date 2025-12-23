import { useState, useEffect, useCallback } from 'react';
import { Habit, AppState, Weekday, DayStatus } from '../types';
import { INITIAL_HABITS, DEFAULT_TITLE, DEFAULT_START_DAY, STORAGE_KEY, HABIT_COLORS } from '../constants';

export function useHabits() {
  const [state, setState] = useState<AppState>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        // Migration: Ensure all habits have a color if loading from old data
        const migratedHabits = parsed.habits.map((h: any) => ({
          ...h,
          color: h.color || HABIT_COLORS[0]
        }));
        return { ...parsed, habits: migratedHabits };
      }
    } catch (e) {
      console.error("Failed to parse local storage", e);
    }
    return {
      habits: INITIAL_HABITS,
      title: DEFAULT_TITLE,
      firstDayOfWeek: DEFAULT_START_DAY
    };
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  const addHabit = useCallback(() => {
    setState(prev => {
      const newId = prev.habits.length > 0 ? Math.max(...prev.habits.map(h => h.id)) + 1 : 1;
      // Pick a random color from the palette
      const randomColor = HABIT_COLORS[Math.floor(Math.random() * HABIT_COLORS.length)];
      
      return {
        ...prev,
        habits: [
          ...prev.habits,
          {
            id: newId,
            name: 'New Habit',
            completed: [],
            done: [],
            notDone: [],
            color: randomColor
          }
        ]
      };
    });
  }, []);

  const deleteHabit = useCallback((id: number) => {
    // Intentionally using loose equality for ID matching to handle potential string/number mismatches from storage
    // eslint-disable-next-line eqeqeq
    const habitToDelete = state.habits.find(h => h.id == id);
    if (!habitToDelete) return;

    // Use setTimeout to prevent blocking the UI thread immediately, aiding cleaner event handling
    setTimeout(() => {
        if (window.confirm(`Are you sure you want to delete "${habitToDelete.name}"?`)) {
            setState(prev => ({
                ...prev,
                habits: prev.habits.filter(h => h.id !== id)
            }));
        }
    }, 0);
  }, [state.habits]);

  const updateHabitName = useCallback((id: number, name: string) => {
    setState(prev => ({
      ...prev,
      habits: prev.habits.map(h => h.id === id ? { ...h, name } : h)
    }));
  }, []);

  const updateHabitColor = useCallback((id: number) => {
    setState(prev => ({
      ...prev,
      habits: prev.habits.map(h => {
        if (h.id === id) {
          const currentIndex = HABIT_COLORS.indexOf(h.color);
          const nextIndex = (currentIndex + 1) % HABIT_COLORS.length;
          return { ...h, color: HABIT_COLORS[nextIndex] };
        }
        return h;
      })
    }));
  }, []);

  const toggleDay = useCallback((habitId: number, day: number, type: 'left' | 'right') => {
    setState(prev => {
      return {
        ...prev,
        habits: prev.habits.map(h => {
          if (h.id !== habitId) return h;

          const isDone = h.done.includes(day);
          const isNotDone = h.notDone.includes(day);

          let newDone = [...h.done];
          let newNotDone = [...h.notDone];

          if (type === 'left') {
            // Toggle Done
            if (isDone) {
              newDone = newDone.filter(d => d !== day);
            } else {
              newDone.push(day);
              newNotDone = newNotDone.filter(d => d !== day); // Cannot be both
            }
          } else {
            // Toggle Not Done (Right click)
            if (isNotDone) {
              newNotDone = newNotDone.filter(d => d !== day);
            } else {
              newNotDone.push(day);
              newDone = newDone.filter(d => d !== day); // Cannot be both
            }
          }

          return {
            ...h,
            done: newDone,
            notDone: newNotDone,
            completed: newDone // Sync completed with done
          };
        })
      };
    });
  }, []);

  const setTitle = useCallback((title: string) => {
    setState(prev => ({ ...prev, title }));
  }, []);

  const setFirstDayOfWeek = useCallback((day: Weekday) => {
    setState(prev => ({ ...prev, firstDayOfWeek: day }));
  }, []);

  const resetAllProgress = useCallback(() => {
    setTimeout(() => {
        if (window.confirm("Are you sure you want to reset all progress? This will clear all 'Done' and 'Missed' marks for the current month.")) {
            setState(prev => ({
                ...prev,
                habits: prev.habits.map(h => ({
                    ...h,
                    done: [],
                    notDone: [],
                    completed: []
                }))
            }));
        }
    }, 0);
  }, []);

  return {
    habits: state.habits,
    title: state.title,
    firstDayOfWeek: state.firstDayOfWeek,
    addHabit,
    deleteHabit,
    updateHabitName,
    updateHabitColor,
    toggleDay,
    setTitle,
    setFirstDayOfWeek,
    resetAllProgress
  };
}
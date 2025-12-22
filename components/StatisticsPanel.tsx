import React from 'react';
import { Habit } from '../types';
import { DAYS_IN_MONTH } from '../constants';

interface StatisticsPanelProps {
  habits: Habit[];
  currentDay: number; // Day of the month (1-31)
}

export const StatisticsPanel: React.FC<StatisticsPanelProps> = ({ habits, currentDay }) => {
  
  const getStreaks = (doneDays: number[]) => {
    if (doneDays.length === 0) return { current: 0, best: 0 };
    
    // Sort numerically
    const sorted = [...doneDays].sort((a, b) => a - b);
    
    let maxStreak = 1;
    let currentRun = 1;
    
    // Calculate Longest Streak
    for (let i = 1; i < sorted.length; i++) {
      if (sorted[i] === sorted[i-1] + 1) {
        currentRun++;
      } else {
        maxStreak = Math.max(maxStreak, currentRun);
        currentRun = 1;
      }
    }
    maxStreak = Math.max(maxStreak, currentRun);
  
    // Calculate Current Streak (streak ending at the last marked day)
    let activeStreak = 1;
    for (let i = sorted.length - 1; i > 0; i--) {
      if (sorted[i] === sorted[i-1] + 1) {
          activeStreak++;
      } else {
          break;
      }
    }
    
    return { current: activeStreak, best: maxStreak };
  };

  return (
    <div className="grid gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3 xl:grid-cols-4">
      {habits.map(habit => {
        const doneCount = habit.done.length;
        
        // Missed Logic: Unticks before the latest tick mark.
        let missedCount = 0;
        
        if (habit.done.length > 0) {
            // Find the latest day marked as done
            const latestTick = Math.max(...habit.done);
            
            // Check days from 1 up to (latestTick - 1)
            for (let day = 1; day < latestTick; day++) {
                if (!habit.done.includes(day)) {
                    missedCount++;
                }
            }
        }
        // If no days are marked done, missed is 0 by definition of this logic 
        // (no "latest tick" exists to check before).

        const percent = Math.round((doneCount / DAYS_IN_MONTH) * 100);
        const { current, best } = getStreaks(habit.done);
        
        return (
          <div key={habit.id} className="flex flex-col rounded-xl border border-gray-200 bg-white p-3 shadow-sm transition-shadow hover:shadow-md dark:border-gray-800 dark:bg-gray-900 sm:p-4">
            <h4 className="mb-1.5 truncate text-sm font-semibold text-gray-900 dark:text-white sm:mb-2 sm:text-base" title={habit.name}>{habit.name}</h4>
            <div className="mb-2 flex items-end justify-between sm:mb-3">
               <span className="text-2xl font-bold transition-colors sm:text-3xl" style={{ color: habit.color }}>{percent}%</span>
               <span className="text-[10px] text-gray-500 dark:text-gray-400 sm:text-xs">completion</span>
            </div>
            
            <div className="mb-3 h-1.5 w-full overflow-hidden rounded-full bg-gray-100 dark:bg-gray-800 sm:mb-4 sm:h-2">
                <div className="h-full transition-colors duration-300" style={{ width: `${percent}%`, backgroundColor: habit.color }} />
            </div>

            <div className="mt-auto grid grid-cols-2 gap-y-2 gap-x-1.5 border-t border-gray-100 pt-2 text-[10px] dark:border-gray-800 sm:gap-y-3 sm:gap-x-2 sm:pt-3 sm:text-xs">
                {/* Stats Grid */}
                <div className="flex items-center gap-1.5 text-gray-600 dark:text-gray-400">
                    <span className="flex h-1.5 w-1.5 rounded-full" style={{ backgroundColor: habit.color }}></span>
                    <span>{doneCount} Done</span>
                </div>
                <div className="flex items-center gap-1.5 text-gray-600 dark:text-gray-400">
                    <span className="flex h-1.5 w-1.5 rounded-full bg-red-400"></span>
                    <span>{missedCount} Missed</span>
                </div>
                
                <div className="flex items-center gap-1.5 font-medium text-orange-600 dark:text-orange-400">
                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.1.2-2.2.5-3.27.7 2.27 1 3.27 2 4.77Z"/></svg>
                    <span>{current} Streak</span>
                </div>
                <div className="flex items-center gap-1.5 text-gray-600 dark:text-gray-400">
                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"/></svg>
                    <span>{best} Best</span>
                </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
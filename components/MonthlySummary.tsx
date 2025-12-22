import React from 'react';
import { Habit } from '../types';

interface MonthlySummaryProps {
  habits: Habit[];
  daysInMonth: number;
}

export const MonthlySummary: React.FC<MonthlySummaryProps> = ({ habits, daysInMonth }) => {
  const totalHabits = habits.length;
  
  // Calculate stats based on current month's days
  const totalCompleted = habits.reduce((acc, h) => {
    // Only count 'done' marks that are within the valid range for this month
    return acc + h.done.filter(d => d <= daysInMonth).length;
  }, 0);
  
  const totalPotential = totalHabits * daysInMonth;
  
  // Pending is strictly what hasn't been done yet in the potential pool
  const totalPending = Math.max(0, totalPotential - totalCompleted);
  
  const progress = totalPotential > 0 ? Math.round((totalCompleted / totalPotential) * 100) : 0;

  return (
    <div className="mb-6 rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
      <h3 className="mb-4 text-lg font-bold text-gray-900 dark:text-white">Monthly Overview</h3>
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        
        {/* Metric 1: Total Habits */}
        <div className="flex flex-col rounded-lg bg-gray-50 p-4 dark:bg-gray-800/50">
          <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Habits</span>
          <span className="mt-1 text-2xl font-bold text-gray-900 dark:text-white">{totalHabits}</span>
        </div>

        {/* Metric 2: Completed */}
        <div className="flex flex-col rounded-lg bg-emerald-50 p-4 dark:bg-emerald-900/20">
          <span className="text-sm font-medium text-emerald-600 dark:text-emerald-400">Completed Acts</span>
          <span className="mt-1 text-2xl font-bold text-emerald-700 dark:text-emerald-300">{totalCompleted}</span>
        </div>

        {/* Metric 3: Pending/Remaining potential */}
        <div className="flex flex-col rounded-lg bg-blue-50 p-4 dark:bg-blue-900/20">
          <span className="text-sm font-medium text-blue-600 dark:text-blue-400">Pending Actions</span>
          <span className="mt-1 text-2xl font-bold text-blue-700 dark:text-blue-300">{totalPending}</span>
        </div>

        {/* Metric 4: Progress */}
        <div className="flex flex-col rounded-lg bg-violet-50 p-4 dark:bg-violet-900/20">
          <span className="text-sm font-medium text-violet-600 dark:text-violet-400">Success Rate</span>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-violet-700 dark:text-violet-300">{progress}%</span>
          </div>
        </div>

      </div>
    </div>
  );
};
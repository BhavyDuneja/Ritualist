import React, { useState, useRef, useEffect } from 'react';
import { Habit } from '../types';
import { DAYS_IN_MONTH } from '../constants';

interface HeaderProps {
  title: string;
  setTitle: (t: string) => void;
  isDark: boolean;
  toggleTheme: () => void;
  habits: Habit[];
  onAddHabit: () => void;
  onExport: () => void;
  onReset: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  title,
  setTitle,
  isDark,
  toggleTheme,
  habits,
  onAddHabit,
  onExport,
  onReset
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [tempTitle, setTempTitle] = useState(title);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setTempTitle(title);
  }, [title]);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditing]);

  const handleBlur = () => {
    setIsEditing(false);
    if (tempTitle.trim()) {
      setTitle(tempTitle.trim());
    } else {
      setTempTitle(title); // Revert if empty
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleBlur();
    }
  };

  // Calculate Global Consistency (Visual only, real detailed stats are below)
  const totalPotential = habits.length * DAYS_IN_MONTH; // Simple estimate for header bar
  const totalCompleted = habits.reduce((acc, h) => acc + h.done.length, 0);
  const consistency = totalPotential > 0 ? Math.round((totalCompleted / totalPotential) * 100) : 0;

  return (
    <header className="mb-4 flex flex-col gap-4 border-b border-gray-200 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900 sm:mb-6 sm:gap-6 sm:p-6 lg:flex-row lg:items-center lg:justify-between">
      <div className="flex flex-col gap-2 sm:gap-3">
        <div className="flex items-center gap-2 sm:gap-4">
          {isEditing ? (
            <input
              ref={inputRef}
              type="text"
              value={tempTitle}
              onChange={(e) => setTempTitle(e.target.value)}
              onBlur={handleBlur}
              onKeyDown={handleKeyDown}
              className="rounded border border-gray-300 bg-transparent px-2 py-1 text-xl font-bold text-gray-900 focus:border-brand-500 focus:outline-none dark:border-gray-700 dark:text-white sm:text-2xl md:text-3xl"
            />
          ) : (
            <h1
              onClick={() => setIsEditing(true)}
              className="cursor-pointer rounded border border-transparent px-2 py-1 text-xl font-bold text-gray-900 hover:border-gray-300 hover:bg-gray-50 dark:text-white dark:hover:border-gray-700 dark:hover:bg-gray-800 sm:text-2xl md:text-3xl"
              title="Click to edit title"
            >
              {title}
            </h1>
          )}
          
          <div className="flex items-center gap-1 rounded-full border border-gray-200 bg-gray-50 p-1 dark:border-gray-700 dark:bg-gray-800">
            <button
                onClick={toggleTheme}
                className="flex h-7 w-7 items-center justify-center rounded-full text-gray-600 transition-colors hover:bg-white hover:shadow-sm dark:text-gray-400 dark:hover:bg-gray-700 sm:h-8 sm:w-8"
                title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
            >
                {isDark ? (
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="sm:w-4 sm:h-4"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>
                ) : (
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="sm:w-4 sm:h-4"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
                )}
            </button>
          </div>
        </div>
        
        {/* Powered by Anantasutra */}
        <div className="flex items-center gap-1.5 text-[10px] text-gray-500 dark:text-gray-400 sm:text-xs">
          <span>Powered by</span>
          <a 
            href="https://anantasutra.com" 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center gap-1 transition-opacity hover:opacity-80"
          >
            <img 
              src="/img/Screenshot 2025-10-22 091346.png" 
              alt="Anantasutra Logo" 
              className="h-4 w-auto object-contain sm:h-5"
            />
          </a>
        </div>
        
        <div className="flex flex-col gap-2 text-xs text-gray-600 dark:text-gray-400 sm:flex-row sm:items-center sm:gap-4 sm:text-sm">
           <span className="whitespace-nowrap">Overall Consistency</span>
           <div className="flex items-center gap-2 sm:gap-4">
             <div className="h-2 w-24 overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700 sm:h-2.5 sm:w-32">
               <div 
                  className="h-full bg-brand-500 transition-all duration-500"
                  style={{ width: `${consistency}%` }}
               />
             </div>
             <span className="font-medium whitespace-nowrap">{consistency}%</span>
           </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 sm:gap-3">
        <button
          onClick={onAddHabit}
          className="flex-1 rounded-lg bg-brand-600 px-3 py-2 text-xs font-semibold text-white shadow-sm transition-colors hover:bg-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 dark:ring-offset-gray-900 sm:flex-none sm:px-4 sm:text-sm"
        >
          + Add Habit
        </button>
        <button
          onClick={onExport}
          className="flex-1 rounded-lg border border-gray-300 bg-white px-3 py-2 text-xs font-semibold text-gray-700 shadow-sm transition-colors hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700 dark:ring-offset-gray-900 sm:flex-none sm:px-4 sm:text-sm"
        >
          Export
        </button>
        <button
          onClick={onReset}
          className="rounded-lg border border-red-200 bg-white px-3 py-2 text-xs font-semibold text-red-600 shadow-sm transition-colors hover:border-red-300 hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 dark:border-red-900/50 dark:bg-gray-800 dark:text-red-400 dark:hover:bg-red-900/20 dark:ring-offset-gray-900 sm:text-sm"
          title="Reset Month Progress"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="sm:w-[18px] sm:h-[18px]"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg>
        </button>
      </div>
    </header>
  );
};
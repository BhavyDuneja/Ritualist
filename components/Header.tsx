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
    <header className="mb-4 relative overflow-hidden border-b border-gray-200/50 bg-gradient-to-br from-white via-gray-50/50 to-white dark:from-gray-900 dark:via-gray-900/95 dark:to-gray-900 dark:border-gray-800/50 p-5 shadow-lg backdrop-blur-sm sm:mb-6 sm:p-6 md:p-8">
      {/* Decorative background elements */}
      <div className="absolute inset-0 opacity-5 dark:opacity-10">
        <div className="absolute top-0 right-0 w-64 h-64 bg-brand-500 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-purple-500 rounded-full blur-3xl"></div>
      </div>
      
      <div className="relative z-10 flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
        {/* Left Section - Branding & Title */}
        <div className="flex flex-col gap-4 flex-1">
          {/* Top Row: Logo + Title + Theme Toggle */}
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 pt-1">
              <img 
                src="/img/ritualistlogo.jpeg" 
                alt="Ritualist Logo" 
                className="h-10 w-auto object-contain sm:h-12 md:h-14 drop-shadow-sm"
              />
            </div>
            
            <div className="flex-1 min-w-0">
              {isEditing ? (
                <input
                  ref={inputRef}
                  type="text"
                  value={tempTitle}
                  onChange={(e) => setTempTitle(e.target.value)}
                  onBlur={handleBlur}
                  onKeyDown={handleKeyDown}
                  className="w-full rounded-lg border-2 border-brand-500/50 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm px-3 py-2 text-2xl font-bold text-gray-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 dark:border-brand-400 dark:text-white dark:focus:border-brand-400 sm:text-3xl md:text-4xl"
                />
              ) : (
                <h1
                  onClick={() => setIsEditing(true)}
                  className="cursor-pointer rounded-lg border-2 border-transparent px-3 py-2 text-2xl font-bold text-gray-900 transition-all hover:border-brand-500/30 hover:bg-white/60 dark:text-white dark:hover:bg-gray-800/60 sm:text-3xl md:text-4xl"
                  title="Click to edit title"
                >
                  {title}
                </h1>
              )}
            </div>
            
            <button
              onClick={toggleTheme}
              className="flex-shrink-0 flex h-10 w-10 items-center justify-center rounded-xl border border-gray-200/50 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm text-gray-600 transition-all hover:scale-110 hover:border-brand-500/50 hover:bg-white hover:shadow-lg dark:border-gray-700/50 dark:text-gray-400 dark:hover:border-brand-400/50 dark:hover:bg-gray-800 sm:h-12 sm:w-12"
              title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
            >
              {isDark ? (
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
              )}
            </button>
          </div>

          {/* Slogan - Prominent and Styled */}
          <div className="flex items-center gap-3 pl-1">
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-brand-500/30 to-transparent"></div>
            <p className="text-sm font-semibold tracking-wide text-brand-600 dark:text-brand-400 sm:text-base md:text-lg whitespace-nowrap">
              consistency without excuses
            </p>
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-brand-500/30 to-transparent"></div>
          </div>

          {/* Bottom Row: Anantasutra Branding + Consistency */}
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            {/* Powered by Anantasutra */}
            <div className="flex items-center gap-2.5 pl-1">
              <span className="text-xs font-medium text-gray-500 dark:text-gray-400 sm:text-sm">Powered by</span>
              <a 
                href="https://anantasutra.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 transition-all hover:scale-105 hover:opacity-90"
              >
                <img 
                  src="/img/anantasutralogo.png" 
                  alt="Anantasutra Logo" 
                  className="h-5 w-auto object-contain sm:h-6 drop-shadow-sm"
                />
              </a>
            </div>
            
            {/* Overall Consistency */}
            <div className="flex items-center gap-3 sm:gap-4">
              <span className="text-xs font-semibold text-gray-700 dark:text-gray-300 sm:text-sm whitespace-nowrap">Overall Consistency</span>
              <div className="flex items-center gap-3">
                <div className="h-2.5 w-28 overflow-hidden rounded-full bg-gray-200/80 dark:bg-gray-700/80 shadow-inner sm:h-3 sm:w-36">
                  <div 
                    className="h-full bg-gradient-to-r from-brand-500 to-brand-600 transition-all duration-700 shadow-sm"
                    style={{ width: `${consistency}%` }}
                  />
                </div>
                <span className="text-sm font-bold text-gray-900 dark:text-white sm:text-base min-w-[3rem]">{consistency}%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Section - Action Buttons */}
        <div className="flex flex-wrap gap-2.5 sm:gap-3 lg:flex-col lg:items-end">
          <button
            onClick={onAddHabit}
            className="flex-1 rounded-xl bg-gradient-to-r from-brand-600 to-brand-500 px-4 py-2.5 text-sm font-semibold text-white shadow-lg transition-all hover:scale-105 hover:shadow-xl hover:from-brand-500 hover:to-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-500/50 focus:ring-offset-2 dark:ring-offset-gray-900 sm:flex-none sm:px-5 sm:py-3 sm:text-base"
          >
            + Add Habit
          </button>
          <button
            onClick={onExport}
            className="flex-1 rounded-xl border-2 border-gray-300/50 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm px-4 py-2.5 text-sm font-semibold text-gray-700 shadow-md transition-all hover:scale-105 hover:border-brand-500/50 hover:bg-white hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-brand-500/50 focus:ring-offset-2 dark:border-gray-600/50 dark:text-gray-200 dark:hover:border-brand-400/50 dark:hover:bg-gray-800 dark:ring-offset-gray-900 sm:flex-none sm:px-5 sm:py-3 sm:text-base"
          >
            Export
          </button>
          <button
            onClick={onReset}
            className="rounded-xl border-2 border-red-300/50 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm px-4 py-2.5 text-sm font-semibold text-red-600 shadow-md transition-all hover:scale-105 hover:border-red-400 hover:bg-red-50/80 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-red-500/50 focus:ring-offset-2 dark:border-red-900/50 dark:text-red-400 dark:hover:bg-red-900/20 dark:ring-offset-gray-900 sm:px-5 sm:py-3 sm:text-base"
            title="Reset Month Progress"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="inline-block"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg>
          </button>
        </div>
      </div>
    </header>
  );
};
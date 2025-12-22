import React, { useState } from 'react';
import { Habit, WEEKDAYS } from '../types';

interface HabitTableProps {
  habits: Habit[];
  daysInMonth: number;
  startDayIndex: number; // 0 for Mon, 1 for Tue, etc based on WEEKDAYS array
  deleteHabit: (id: number) => void;
  updateHabitName: (id: number, name: string) => void;
  updateHabitColor: (id: number) => void;
  toggleDay: (habitId: number, day: number, type: 'left' | 'right') => void;
  currentMonthName: string;
}

export const HabitTable: React.FC<HabitTableProps> = ({
  habits,
  daysInMonth,
  startDayIndex,
  deleteHabit,
  updateHabitName,
  updateHabitColor,
  toggleDay,
  currentMonthName
}) => {
  const [viewMode, setViewMode] = useState<'daily' | 'weekly'>('daily');

  // Helper to get weekday for any day number (1-31)
  const getWeekday = (day: number) => {
    return WEEKDAYS[(startDayIndex + day - 1) % 7];
  };

  const getWeekGroup = (day: number) => {
    if (day <= 7) return 1;
    if (day <= 14) return 2;
    if (day <= 21) return 3;
    if (day <= 28) return 4;
    return 5;
  };

  const getWeeklyStats = (habit: Habit, start: number, end: number) => {
    let done = 0;
    let missed = 0;
    const effectiveEnd = Math.min(end, daysInMonth);
    const total = Math.max(0, effectiveEnd - start + 1);
    
    if (total === 0) return { done: 0, missed: 0, total: 0 };

    for (let i = start; i <= effectiveEnd; i++) {
        if (habit.done.includes(i)) done++;
        if (habit.notDone.includes(i)) missed++;
    }
    return { done, missed, total };
  };

  const WEEKS = [
    { id: 1, label: 'Week 1', sub: 'Days 1-7', start: 1, end: 7 },
    { id: 2, label: 'Week 2', sub: 'Days 8-14', start: 8, end: 14 },
    { id: 3, label: 'Week 3', sub: 'Days 15-21', start: 15, end: 21 },
    { id: 4, label: 'Week 4', sub: 'Days 22-28', start: 22, end: 28 },
    { id: 5, label: 'End', sub: `Days 29-${daysInMonth}`, start: 29, end: daysInMonth },
  ].filter(w => w.start <= daysInMonth);

  const isWeekEnd = (day: number) => [7, 14, 21, 28].includes(day);

  // --- Summary Calculation Helpers ---
  const getDayStats = (day: number) => {
    let doneCount = 0;
    const totalHabits = habits.length;

    habits.forEach(habit => {
        if (habit.done.includes(day)) doneCount++;
    });

    // Per user request: Not Done = Total - Done (Includes pending and explicitly missed)
    const notDoneCount = totalHabits - doneCount;

    const progress = totalHabits > 0 ? Math.round((doneCount / totalHabits) * 100) : 0;
    return { doneCount, notDoneCount, progress };
  };

  const renderDayHeader = (day: number) => {
    const weekday = getWeekday(day);
    const isWeekend = weekday === 'Sat' || weekday === 'Sun';
    const weekGroup = getWeekGroup(day);
    const isEvenWeek = weekGroup % 2 === 0;
    const isDivider = isWeekEnd(day);

      return (
      <th
        key={day}
        className={`min-w-[32px] border-b p-1 text-center text-[9px] dark:border-gray-700 sm:min-w-[36px] sm:p-1.5 sm:text-[10px] md:min-w-[40px] md:p-2 md:text-xs ${
          isDivider 
            ? 'border-r-2 border-r-gray-300 dark:border-r-gray-600' 
            : 'border-r border-r-gray-200'
        } ${
          isEvenWeek ? 'bg-gray-50/50 dark:bg-gray-800/30' : 'bg-white dark:bg-gray-900'
        }`}
      >
        <div className={`mb-0.5 font-bold sm:mb-1 ${isWeekend ? 'text-brand-500 dark:text-brand-400' : 'text-gray-700 dark:text-gray-300'}`}>
          {weekday}
        </div>
        <div className="text-gray-400">{day}</div>
      </th>
    );
  };

  // --- Render Footer Rows ---
  const renderSummaryRow = (type: 'Progress' | 'Done' | 'Not Done') => {
    const labelClass = "sticky left-0 z-20 border-r border-t border-gray-200 bg-gray-50 px-2 py-2 text-[10px] font-bold uppercase tracking-wider text-gray-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 sm:px-3 sm:py-2.5 sm:text-xs md:px-4 md:py-3";
    const spacerClass = "sticky left-40 z-20 border-r border-t border-gray-200 bg-gray-50 px-2 py-2 dark:border-gray-700 dark:bg-gray-800 sm:left-48 sm:px-3 sm:py-2.5 md:left-64 md:px-4 md:py-3";
    
    return (
      <tr className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
        <td className={labelClass}>{type}</td>
        <td className={spacerClass}></td>
        
        {viewMode === 'daily' && (
             Array.from({ length: daysInMonth }, (_, i) => i + 1).map((day) => {
               const { doneCount, notDoneCount, progress } = getDayStats(day);
               const isDivider = isWeekEnd(day);
               const weekGroup = getWeekGroup(day);
               const isEvenWeek = weekGroup % 2 === 0;

               let content;
               let cellColorClass = isEvenWeek ? 'bg-gray-50/30 dark:bg-gray-800/20' : '';
               
               if (type === 'Progress') {
                 if (progress === 100 && habits.length > 0) {
                    cellColorClass = "bg-green-50 dark:bg-green-900/20";
                    content = <span className="font-bold text-green-600 dark:text-green-400 animate-pulse">{progress}%</span>;
                 } else if (progress > 0) {
                    content = <span className="font-medium text-gray-600 dark:text-gray-400">{progress}%</span>;
                 } else {
                    content = <span className="text-gray-300 dark:text-gray-600">0%</span>;
                 }
               } else if (type === 'Done') {
                 content = doneCount > 0 ? <span className="font-semibold text-brand-600 dark:text-brand-400">{doneCount}</span> : <span className="text-gray-300">-</span>;
               } else if (type === 'Not Done') {
                 // Always show number if > 0
                 content = notDoneCount > 0 ? <span className="font-medium text-red-500">{notDoneCount}</span> : <span className="text-gray-300">-</span>;
               }

               return (
                 <td
                   key={day}
                   className={`h-8 border-t border-gray-200 text-center text-[9px] dark:border-gray-700 sm:h-9 sm:text-[10px] md:h-10 md:text-xs ${
                       isDivider 
                         ? 'border-r-2 border-r-gray-300 dark:border-r-gray-600' 
                         : 'border-r border-r-gray-100 dark:border-r-gray-800'
                   } ${cellColorClass}`}
                 >
                   {content}
                 </td>
               );
             })
        )}
      </tr>
    );
  };


  return (
    <div className="relative mb-8 flex w-full flex-col overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900">
      
      {/* Toolbar */}
      <div className="flex flex-col gap-3 border-b border-gray-100 bg-gray-50/50 px-3 py-2 dark:border-gray-800 dark:bg-gray-800/50 sm:flex-row sm:items-center sm:justify-between sm:gap-4 sm:px-4 sm:py-3">
         <div className="flex items-center gap-2 sm:gap-4">
             <h3 className="text-[10px] font-bold uppercase tracking-wider text-gray-500 sm:text-xs">Tracker View</h3>
             <div className="flex items-center gap-1 rounded-lg bg-gray-200 p-0.5 dark:bg-gray-700 sm:gap-2 sm:p-1">
                <button 
                  onClick={() => setViewMode('daily')}
                  className={`rounded-md px-2 py-0.5 text-[10px] font-bold transition-all sm:px-3 sm:py-1 sm:text-xs ${viewMode === 'daily' ? 'bg-white text-gray-900 shadow-sm dark:bg-gray-600 dark:text-white' : 'text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white'}`}
                >
                  Daily
                </button>
                <button 
                  onClick={() => setViewMode('weekly')}
                  className={`rounded-md px-2 py-0.5 text-[10px] font-bold transition-all sm:px-3 sm:py-1 sm:text-xs ${viewMode === 'weekly' ? 'bg-white text-gray-900 shadow-sm dark:bg-gray-600 dark:text-white' : 'text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white'}`}
                >
                  Weekly
                </button>
             </div>
         </div>

         <div className="flex items-center gap-1.5 sm:gap-2">
            <span className="text-[10px] text-gray-500 dark:text-gray-400 sm:text-xs">Current Month:</span>
            <div className="rounded bg-white px-2 py-0.5 text-xs font-bold text-gray-900 shadow-sm dark:bg-gray-800 dark:text-white border border-gray-200 dark:border-gray-700 sm:px-3 sm:py-1 sm:text-sm">
               {currentMonthName}
            </div>
         </div>
      </div>

      <div className="w-full overflow-x-auto pb-2">
        <table className="min-w-max border-collapse text-left">
          <thead className="z-40">
            <tr>
              <th className="sticky left-0 z-30 h-10 w-40 border-b border-r border-gray-200 bg-gray-50 px-2 text-[10px] font-bold uppercase tracking-wider text-gray-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 sm:w-48 sm:px-3 sm:text-xs md:w-64 md:px-4">
                Habits
              </th>
              <th className="sticky left-40 z-30 h-10 w-20 border-b border-r border-gray-200 bg-gray-50 px-2 text-[10px] font-bold uppercase tracking-wider text-gray-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 sm:left-48 sm:w-24 sm:px-3 sm:text-xs md:left-64 md:w-32 md:px-4">
                Progress
              </th>
              
              {viewMode === 'daily' ? (
                <>
                  <th colSpan={7} className="border-b border-r-2 border-gray-200 border-r-gray-300 bg-gray-50 px-2 text-center text-xs font-bold uppercase tracking-wider text-gray-500 dark:border-gray-700 dark:border-r-gray-600 dark:bg-gray-800 dark:text-gray-400">Week 1</th>
                  <th colSpan={7} className="border-b border-r-2 border-gray-200 border-r-gray-300 bg-gray-100/50 px-2 text-center text-xs font-bold uppercase tracking-wider text-gray-500 dark:border-gray-700 dark:border-r-gray-600 dark:bg-gray-800/50 dark:text-gray-400">Week 2</th>
                  <th colSpan={7} className="border-b border-r-2 border-gray-200 border-r-gray-300 bg-gray-50 px-2 text-center text-xs font-bold uppercase tracking-wider text-gray-500 dark:border-gray-700 dark:border-r-gray-600 dark:bg-gray-800 dark:text-gray-400">Week 3</th>
                  <th colSpan={7} className="border-b border-r-2 border-gray-200 border-r-gray-300 bg-gray-100/50 px-2 text-center text-xs font-bold uppercase tracking-wider text-gray-500 dark:border-gray-700 dark:border-r-gray-600 dark:bg-gray-800/50 dark:text-gray-400">Week 4</th>
                  {daysInMonth > 28 && (
                      <th colSpan={daysInMonth - 28} className="border-b border-gray-200 bg-gray-50 px-2 text-center text-xs font-bold uppercase tracking-wider text-gray-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400">End</th>
                  )}
                </>
              ) : (
                  <th colSpan={WEEKS.length} className="border-b border-gray-200 bg-gray-50 px-2 text-center text-xs font-bold uppercase tracking-wider text-gray-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400">
                    Weekly Breakdown
                  </th>
              )}
            </tr>
            <tr>
              <th className="sticky left-0 z-30 border-b border-r border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-900 sm:left-0 md:left-0"></th>
              <th className="sticky left-40 z-30 border-b border-r border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-900 sm:left-48 md:left-64"></th>
              
              {viewMode === 'daily' ? (
                 Array.from({ length: daysInMonth }, (_, i) => i + 1).map(renderDayHeader)
              ) : (
                 WEEKS.map((week, idx) => (
                    <th key={week.id} className={`min-w-[140px] border-b border-r border-gray-200 p-2 text-center text-xs dark:border-gray-700 ${idx % 2 !== 0 ? 'bg-gray-50/50 dark:bg-gray-800/30' : 'bg-white dark:bg-gray-900'}`}>
                        <div className="font-bold text-gray-700 dark:text-gray-300">{week.label}</div>
                        <div className="text-gray-400">{week.sub}</div>
                    </th>
                 ))
              )}
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
            {habits.map((habit) => {
              const progress = Math.round((habit.done.length / daysInMonth) * 100);

              return (
                <tr key={habit.id} className="group hover:bg-gray-50 dark:hover:bg-gray-800">
                  <td className="sticky left-0 z-20 w-40 border-r border-gray-200 bg-white px-2 py-2 group-hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-900 dark:group-hover:bg-gray-800 sm:w-48 sm:px-3 sm:py-2.5 md:w-64 md:px-4 md:py-3">
                    <div className="flex items-center justify-between gap-1 sm:gap-2">
                      <div className="flex w-full items-center gap-1.5 sm:gap-2">
                        <button
                            onClick={() => updateHabitColor(habit.id)}
                            className="h-2.5 w-2.5 shrink-0 rounded-full transition-transform hover:scale-125 focus:outline-none sm:h-3 sm:w-3"
                            style={{ backgroundColor: habit.color }}
                            title="Change color"
                        />
                        <input
                            type="text"
                            value={habit.name}
                            onChange={(e) => updateHabitName(habit.id, e.target.value)}
                            className="w-full min-w-0 bg-transparent text-xs font-medium text-gray-900 focus:outline-none dark:text-gray-200 sm:text-sm"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteHabit(habit.id);
                        }}
                        className="shrink-0 text-red-400 opacity-0 transition-opacity hover:text-red-600 focus:opacity-100 group-hover:opacity-100"
                        title="Delete Habit"
                        aria-label="Delete Habit"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="sm:w-4 sm:h-4"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
                      </button>
                    </div>
                  </td>

                  <td className="sticky left-40 z-20 w-20 border-r border-gray-200 bg-white px-1.5 py-2 group-hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-900 dark:group-hover:bg-gray-800 sm:left-48 sm:w-24 sm:px-2 sm:py-2.5 md:left-64 md:w-32 md:px-4 md:py-3">
                    <div className="flex flex-col gap-0.5 sm:gap-1">
                      <span className="text-[10px] font-semibold text-gray-600 dark:text-gray-400 sm:text-xs">{progress}%</span>
                      <div className="h-1 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700 sm:h-1.5">
                        <div
                          className="h-full transition-colors duration-300"
                          style={{ width: `${progress}%`, backgroundColor: habit.color }}
                        />
                      </div>
                    </div>
                  </td>

                  {viewMode === 'daily' ? (
                     Array.from({ length: daysInMonth }, (_, i) => i + 1).map((day) => {
                       const isDone = habit.done.includes(day);
                       const isNotDone = habit.notDone.includes(day);
                       const weekGroup = getWeekGroup(day);
                       const isEvenWeek = weekGroup % 2 === 0;
                       const isDivider = isWeekEnd(day);

                       return (
                         <td
                           key={day}
                           onContextMenu={(e) => {
                             e.preventDefault();
                             toggleDay(habit.id, day, 'right');
                           }}
                           onClick={() => toggleDay(habit.id, day, 'left')}
                           className={`h-10 w-8 cursor-pointer border-b border-gray-100 p-0 text-center transition-colors dark:border-gray-800 sm:h-11 sm:w-9 md:h-12 md:w-10 ${
                               isDivider 
                                 ? 'border-r-2 border-r-gray-300 dark:border-r-gray-600' 
                                 : 'border-r border-r-gray-100 dark:border-r-gray-800'
                           } ${
                               isEvenWeek ? 'bg-gray-50/30 dark:bg-gray-800/20' : ''
                           }`}
                         >
                            <div className="flex h-full w-full items-center justify-center">
                              {isDone ? (
                                <div 
                                    className="flex h-5 w-5 items-center justify-center rounded text-white shadow-sm transition-transform hover:scale-110 sm:h-5 sm:w-5 md:h-6 md:w-6"
                                    style={{ backgroundColor: habit.color }}
                                >
                                  <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="sm:w-3.5 sm:h-3.5 md:w-4 md:h-4"><polyline points="20 6 9 17 4 12"/></svg>
                                </div>
                              ) : isNotDone ? (
                                <div className="flex h-5 w-5 items-center justify-center rounded bg-red-100 text-red-500 transition-transform hover:scale-110 dark:bg-red-900/30 dark:text-red-400 sm:h-5 sm:w-5 md:h-6 md:w-6">
                                  <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="sm:w-3.5 sm:h-3.5 md:w-4 md:h-4"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                                </div>
                              ) : (
                                <div className="h-5 w-5 rounded border border-gray-200 hover:border-brand-400 dark:border-gray-700 dark:hover:border-brand-600 sm:h-5 sm:w-5 md:h-6 md:w-6" />
                              )}
                            </div>
                         </td>
                       );
                     })
                  ) : (
                     WEEKS.map((week, idx) => {
                        const { done, missed, total } = getWeeklyStats(habit, week.start, week.end);
                        const percent = total > 0 ? Math.round((done / total) * 100) : 0;
                        const isEven = idx % 2 !== 0;

                        return (
                            <td key={week.id} className={`border-r border-gray-100 p-4 dark:border-gray-800 ${isEven ? 'bg-gray-50/30 dark:bg-gray-800/20' : ''}`}>
                                <div className="flex flex-col gap-2">
                                    <div className="flex items-end justify-between">
                                        <span className="text-lg font-bold text-gray-900 dark:text-white">{done}<span className="text-sm font-normal text-gray-400">/{total}</span></span>
                                        {missed > 0 && <span className="text-xs font-medium text-red-500">{missed} missed</span>}
                                    </div>
                                    <div className="h-2 w-full overflow-hidden rounded-full bg-gray-100 dark:bg-gray-800">
                                         <div className="h-full rounded-full" style={{ width: `${percent}%`, backgroundColor: percent < 50 ? '#fb923c' : habit.color }}></div>
                                    </div>
                                </div>
                            </td>
                        )
                     })
                  )}
                </tr>
              );
            })}
            
            {/* Spacer Row to create gap before footer - Increased Padding to h-20 */}
            <tr className="h-12 sm:h-16 md:h-20">
                <td className="sticky left-0 z-20 bg-white border-r border-gray-100 dark:bg-gray-900 dark:border-gray-800"></td>
                <td className="sticky left-40 z-20 bg-white border-r border-gray-100 dark:bg-gray-900 dark:border-gray-800 sm:left-48 md:left-64"></td>
                <td colSpan={viewMode === 'daily' ? daysInMonth : WEEKS.length} className="bg-transparent"></td>
            </tr>

          </tbody>
          
          {/* Footer for Daily Overview - ONLY visible in Daily Mode */}
          {viewMode === 'daily' && (
            <tfoot className="z-40 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] border-t-2 border-gray-100 dark:border-gray-800">
              {renderSummaryRow('Progress')}
              {renderSummaryRow('Done')}
              {renderSummaryRow('Not Done')}
            </tfoot>
          )}

        </table>
      </div>
    </div>
  );
};
import React, { useRef, useState, useMemo } from 'react';
import html2canvas from 'html2canvas';
import { useTheme } from './hooks/useTheme';
import { useHabits } from './hooks/useHabits';
import { Header } from './components/Header';
import { HabitTable } from './components/HabitTable';
import { AnalyticsChart } from './components/AnalyticsChart';
import { StatisticsPanel } from './components/StatisticsPanel';

const App: React.FC = () => {
  const { isDark, toggleTheme } = useTheme();
  const {
    habits,
    title,
    addHabit,
    deleteHabit,
    updateHabitName,
    updateHabitColor,
    toggleDay,
    setTitle,
    resetAllProgress
  } = useHabits();

  // Dynamic Date Logic
  // This uses the user's local system time. It works offline and handles leap years.
  const currentDate = useMemo(() => new Date(), []);
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth(); // 0-11
  const currentDay = currentDate.getDate(); // 1-31
  
  // Calculate days in current month (handles leap years automatically)
  const daysInMonth = useMemo(() => new Date(currentYear, currentMonth + 1, 0).getDate(), [currentYear, currentMonth]);
  
  // Calculate which weekday the 1st of the month falls on
  const startDayIndex = useMemo(() => {
    const jsDay = new Date(currentYear, currentMonth, 1).getDay();
    // Convert Sun(0) to 6, Mon(1) to 0, etc.
    return (jsDay + 6) % 7;
  }, [currentYear, currentMonth]);

  const currentMonthName = currentDate.toLocaleString('default', { month: 'long', year: 'numeric' });

  // Ref for the exportable area (Chart only)
  const exportRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<HTMLDivElement>(null);

  const handleExport = async () => {
    if (exportRef.current) {
      try {
        const canvas = await html2canvas(exportRef.current, {
          backgroundColor: isDark ? '#111827' : '#ffffff', // Match chart card bg
          scale: 2 // High res
        });
        const image = canvas.toDataURL("image/png");
        const link = document.createElement('a');
        link.href = image;
        link.download = `ritualist-trend-${new Date().toISOString().split('T')[0]}.png`;
        link.click();
      } catch (err) {
        console.error("Export failed:", err);
        alert("Failed to export. Please try again.");
      }
    }
  };

  return (
    <div className="min-h-screen pb-12 relative sm:pb-16 md:pb-20">
      <Header
        title={title}
        setTitle={setTitle}
        isDark={isDark}
        toggleTheme={toggleTheme}
        habits={habits}
        onAddHabit={addHabit}
        onExport={handleExport}
        onReset={resetAllProgress}
      />

      <main className="container mx-auto max-w-[98%] px-2 sm:max-w-[95%] sm:px-4 xl:max-w-7xl">
        
        {/* Main Tracker Section */}
        <section className="mb-6 animate-fade-in sm:mb-8 md:mb-10">
           <HabitTable
             habits={habits}
             daysInMonth={daysInMonth}
             startDayIndex={startDayIndex}
             currentMonthName={currentMonthName}
             deleteHabit={deleteHabit}
             updateHabitName={updateHabitName}
             updateHabitColor={updateHabitColor}
             toggleDay={toggleDay}
           />
        </section>

        {/* Analytics Section */}
        <div className="p-1 bg-gray-50 dark:bg-gray-950 rounded-xl sm:p-2">
            <div className="grid gap-4 sm:gap-6 lg:grid-cols-3 lg:gap-8">
                {/* Chart takes up 2 columns on large screens */}
                <section className="lg:col-span-2">
                    {/* Wrap only the chart with the exportRef */}
                    <div ref={exportRef}>
                      <AnalyticsChart
                          habits={habits}
                          isDark={isDark}
                          chartRef={chartRef} 
                      />
                    </div>
                </section>

                {/* Stats take up 1 column on large screens, or full width below */}
                <section className="lg:col-span-1">
                     <div className="mb-3 flex items-center justify-between sm:mb-4 lg:hidden">
                        <h3 className="text-base font-bold text-gray-900 dark:text-white sm:text-lg">Habit Statistics</h3>
                     </div>
                     {/* Simplified Side Panel for Quick Stats */}
                     <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900 h-full sm:p-6">
                        <h3 className="mb-3 text-base font-bold text-gray-900 dark:text-white sm:mb-4 sm:text-lg">Quick Status</h3>
                        <div className="flex flex-col gap-3 sm:gap-4">
                            {habits.slice(0, 5).map(h => (
                                <div key={h.id} className="flex flex-col gap-1 border-b border-gray-100 pb-2 last:border-0 dark:border-gray-800">
                                    <div className="flex justify-between text-xs sm:text-sm">
                                        <span className="font-medium text-gray-700 dark:text-gray-300 truncate w-24 sm:w-32">{h.name}</span>
                                        <span className="font-bold transition-colors whitespace-nowrap" style={{ color: h.color }}>{Math.round(h.done.length / daysInMonth * 100)}%</span>
                                    </div>
                                    <div className="h-1.5 w-full rounded-full bg-gray-100 dark:bg-gray-800">
                                        <div 
                                            className="h-full rounded-full transition-colors duration-300" 
                                            style={{ width: `${Math.round(h.done.length / daysInMonth * 100)}%`, backgroundColor: h.color }}
                                        ></div>
                                    </div>
                                </div>
                            ))}
                            {habits.length > 5 && <div className="text-xs text-gray-400 text-center italic">...and {habits.length - 5} more</div>}
                        </div>
                     </div>
                </section>
            </div>
        </div>

        {/* Detailed Stats Grid below */}
        <section className="mt-6 sm:mt-8 md:mt-10">
            <h3 className="mb-4 text-lg font-bold text-gray-900 dark:text-white sm:mb-6 sm:text-xl">Detailed Breakdown</h3>
            <StatisticsPanel habits={habits} currentDay={currentDay} />
        </section>

      </main>
      
      <footer className="mt-12 py-6 text-center text-xs text-gray-500 dark:text-gray-500 sm:mt-16 sm:py-8 sm:text-sm md:mt-20">
        <div className="flex flex-col items-center gap-2 sm:flex-row sm:justify-center sm:gap-4">
          <p className="font-medium text-gray-700 dark:text-gray-300">Ritualist by Anantasutra</p>
          <span className="hidden sm:inline">•</span>
          <p>© {new Date().getFullYear()} Anantasutra. All rights reserved.</p>
        </div>
        <p className="mt-2 text-[10px] text-gray-400 dark:text-gray-500">ritualist.anantasutra.com</p>
      </footer>
    </div>
  );
};

export default App;
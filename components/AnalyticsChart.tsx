import React, { useMemo } from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { Habit } from '../types';
import { DAYS_IN_MONTH } from '../constants';

interface AnalyticsChartProps {
  habits: Habit[];
  isDark: boolean;
  chartRef: React.RefObject<HTMLDivElement>;
}

export const AnalyticsChart: React.FC<AnalyticsChartProps> = ({ habits, isDark, chartRef }) => {
  const data = useMemo(() => {
    return Array.from({ length: DAYS_IN_MONTH }, (_, i) => {
      const day = i + 1;
      const completedCount = habits.filter(h => h.done.includes(day)).length;
      const totalHabits = habits.length;
      const percentage = totalHabits > 0 ? Math.round((completedCount / totalHabits) * 100) : 0;
      return {
        day,
        percentage
      };
    });
  }, [habits]);

  if (habits.length === 0) return null;

  return (
    <div ref={chartRef} className="rounded-xl border border-gray-200 bg-white p-3 shadow-sm dark:border-gray-800 dark:bg-gray-900 sm:p-4 md:p-6">
      <h3 className="mb-3 text-base font-bold text-gray-900 dark:text-white sm:mb-4 sm:text-lg md:mb-6">Daily Consistency Trend</h3>
      <div className="h-48 w-full sm:h-56 md:h-64">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={data}
            margin={{
              top: 10,
              right: 30,
              left: 0,
              bottom: 0,
            }}
          >
            <defs>
              <linearGradient id="colorPv" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={isDark ? "#334155" : "#e2e8f0"} />
            <XAxis 
              dataKey="day" 
              tick={{ fontSize: 12, fill: isDark ? "#94a3b8" : "#64748b" }} 
              axisLine={false}
              tickLine={false}
              interval={2} // Show every 3rd day
            />
            <YAxis 
              tick={{ fontSize: 12, fill: isDark ? "#94a3b8" : "#64748b" }} 
              axisLine={false}
              tickLine={false}
              unit="%"
              domain={[0, 100]}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: isDark ? '#1e293b' : '#fff',
                borderColor: isDark ? '#334155' : '#e2e8f0',
                borderRadius: '8px',
                color: isDark ? '#f8fafc' : '#0f172a',
              }}
              formatter={(value: number) => [`${value}%`, 'Consistency']}
            />
            <Area
              type="monotone"
              dataKey="percentage"
              stroke="#0ea5e9"
              fillOpacity={1}
              fill="url(#colorPv)"
              strokeWidth={2}
              activeDot={{ r: 6 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
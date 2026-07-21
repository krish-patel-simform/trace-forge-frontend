import React from 'react';

export interface DateRange {
  startDate: Date;
  endDate: Date;
}

interface DateRangePickerProps {
  value: DateRange;
  onChange: (range: DateRange) => void;
}

export const DateRangePicker: React.FC<DateRangePickerProps> = ({ value, onChange }) => {
  // A simplistic date range picker for V1.
  // In a real application, you'd use a robust library like react-datepicker or similar.

  const setPreset = (days: number) => {
    const end = new Date();
    const start = new Date();
    start.setDate(start.getDate() - days);
    onChange({ startDate: start, endDate: end });
  };

  return (
    <div className="flex items-center gap-2 bg-white dark:bg-dark-card border border-gray-200 dark:border-dark-border rounded-lg p-1 shadow-sm">
      <div className="px-2 text-xs text-gray-500 hidden sm:block">
        {value.startDate.toLocaleDateString()} - {value.endDate.toLocaleDateString()}
      </div>
      <button 
        onClick={() => setPreset(1)}
        className="px-3 py-1.5 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-dark-border rounded-md transition-colors"
      >
        24h
      </button>
      <button 
        onClick={() => setPreset(7)}
        className="px-3 py-1.5 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-dark-border rounded-md transition-colors"
      >
        7d
      </button>
      <button 
        onClick={() => setPreset(30)}
        className="px-3 py-1.5 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-dark-border rounded-md transition-colors"
      >
        30d
      </button>
    </div>
  );
};

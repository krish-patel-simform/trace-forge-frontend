import React from 'react';

export interface Column<T> {
  header: string;
  accessorKey: keyof T | string;
  cell?: (item: T) => React.ReactNode;
}

interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  keyExtractor: (item: T, index: number) => string | number;
}

export function DataTable<T>({ data, columns, keyExtractor }: DataTableProps<T>) {
  if (data.length === 0) {
    return (
      <div className="py-8 text-center text-gray-500 dark:text-gray-400 text-sm">
        No data available
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm text-left">
        <thead className="text-xs text-gray-500 uppercase bg-gray-50 dark:bg-dark-border dark:text-gray-400">
          <tr>
            {columns.map((col, index) => (
              <th key={index} className="px-6 py-3 font-medium">
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((item, rowIndex) => (
            <tr 
              key={keyExtractor(item, rowIndex)} 
              className="bg-white border-b dark:bg-dark-card dark:border-dark-border hover:bg-gray-50 dark:hover:bg-dark-bg transition-colors"
            >
              {columns.map((col, colIndex) => (
                <td key={colIndex} className="px-6 py-4">
                  {col.cell ? col.cell(item) : String(item[col.accessorKey as keyof T] || '')}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

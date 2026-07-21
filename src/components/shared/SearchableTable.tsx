import React, { useState, useRef, useEffect } from "react";
import { Search, X } from "lucide-react";
import { DataTable, type Column } from "./DataTable";
import { Input } from "../ui/Input";

interface SearchableTableProps<T> {
  title: string;
  icon: React.ReactNode;
  data: T[];
  columns: Column<T>[];
  keyExtractor: (item: T, index: number) => string | number;
  filterFn: (item: T, query: string) => boolean;
  emptyMessage?: React.ReactNode;
}

export function SearchableTable<T>({
  title,
  icon,
  data,
  columns,
  keyExtractor,
  filterFn,
  emptyMessage
}: SearchableTableProps<T>) {
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isSearchExpanded && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isSearchExpanded]);

  const filteredData = searchQuery.trim() 
    ? data.filter(item => filterFn(item, searchQuery))
    : data;

  return (
    <div className="bg-white dark:bg-dark-card border border-gray-200 dark:border-dark-border rounded-xl shadow-sm overflow-hidden flex flex-col h-full">
      <div className="p-4 border-b border-gray-200 dark:border-dark-border flex items-center justify-between min-h-[72px]">
        {!isSearchExpanded ? (
          <div className="flex items-center justify-between w-full animate-in fade-in duration-300">
            <div className="flex items-center gap-2">
              <span className="text-primary-500">{icon}</span>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                {title}
              </h3>
            </div>
            <button 
              onClick={() => setIsSearchExpanded(true)}
              className="p-2 text-gray-400 hover:text-primary-500 hover:bg-gray-100 dark:hover:bg-dark-bg rounded-full transition-colors"
              title="Search"
            >
              <Search className="w-5 h-5" />
            </button>
          </div>
        ) : (
          <div className="flex items-center w-full animate-in slide-in-from-right-4 fade-in duration-300 relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <Input
              ref={inputRef}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={`Search ${title.toLowerCase()}...`}
              className="pl-10 pr-10 border-primary-500 ring-1 ring-primary-500 shadow-sm"
              onBlur={() => {
                if (!searchQuery) setIsSearchExpanded(false);
              }}
              onKeyDown={(e) => {
                if (e.key === 'Escape') {
                  setSearchQuery('');
                  setIsSearchExpanded(false);
                }
              }}
            />
            <button
              onClick={() => {
                setSearchQuery('');
                setIsSearchExpanded(false);
              }}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>
      <div className="flex-1 overflow-auto">
        <DataTable
          data={filteredData}
          columns={columns}
          keyExtractor={keyExtractor}
        />
        {emptyMessage && data.length === 0 && (
          emptyMessage
        )}
      </div>
    </div>
  );
}

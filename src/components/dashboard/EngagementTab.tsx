import React from "react";
import { MousePointer2, AppWindow, Target } from "lucide-react";
import { BarChart } from "../charts/BarChart";
import { SearchableTable } from "../shared/SearchableTable";
import type { ClickData, SearchData, CustomEventData, ScrollData } from "../../types/analytics";

interface EngagementTabProps {
  topClicks: ClickData[];
  topSearches: SearchData[];
  customEvents: CustomEventData[];
  scrollDepths: ScrollData[];
  selectedScrollPath: string;
  setSelectedScrollPath: (path: string) => void;
}

export const EngagementTab: React.FC<EngagementTabProps> = ({
  topClicks,
  topSearches,
  customEvents,
  scrollDepths,
  selectedScrollPath,
  setSelectedScrollPath
}) => {
  return (
    <div className="space-y-6 mt-6 animate-in fade-in duration-500">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:h-[450px]">
        {/* Top Clicks */}
        <SearchableTable
          title="Top Clicked Elements"
          icon={<MousePointer2 className="w-5 h-5" />}
          data={topClicks}
          keyExtractor={(item, index) => item.pagePath + String(index)}
          filterFn={(c, query) => 
            !!(c.text?.toLowerCase().includes(query.toLowerCase()) || 
            c.pagePath?.toLowerCase().includes(query.toLowerCase()) || 
            c.name?.toLowerCase().includes(query.toLowerCase()))
          }
          columns={[
            {
              header: "Element",
              accessorKey: "text",
              cell: (item) => (
                <div>
                  <div className="font-medium">{item.name || item.text || 'Unnamed'}</div>
                  <div className="text-xs text-gray-500 truncate max-w-[200px]">
                    {item.pagePath}
                  </div>
                </div>
              ),
            },
            { header: "Clicks", accessorKey: "clicks" },
            { header: "Users", accessorKey: "uniqueUsers" },
          ]}
        />

        
        {/* Top Searches */}
        <SearchableTable
          title="Top Searches"
          icon={<AppWindow className="w-5 h-5" />}
          data={topSearches}
          keyExtractor={(item) => item.query}
          filterFn={(s, query) => !!s.query?.toLowerCase().includes(query.toLowerCase())}
          columns={[
            { header: "Query", accessorKey: "query", cell: (item) => <span className="font-medium">"{item.query}"</span> },
            { header: "Searches", accessorKey: "searches" },
            { header: "Users", accessorKey: "uniqueUsers" },
          ]}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:h-[450px]">
        {/* Custom Events */}
        <SearchableTable
          title="Custom Events"
          icon={<Target className="w-5 h-5" />}
          data={customEvents}
          keyExtractor={(item) => item.eventName}
          filterFn={(e, query) => !!e.eventName?.toLowerCase().includes(query.toLowerCase())}
          columns={[
            { header: "Event Name", accessorKey: "eventName", cell: (item) => <span className="font-medium">{item.eventName}</span> },
            { header: "Occurrences", accessorKey: "occurrences" },
            { header: "Users", accessorKey: "uniqueUsers" },
          ]}
          emptyMessage={
            <div className="p-8 text-center text-gray-500 dark:text-gray-400 border-t border-gray-100 dark:border-dark-border">
              <p className="mb-2">No custom events tracked yet.</p>
              <code className="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded text-xs font-mono">
                TraceForge.track('my_event')
              </code>
            </div>
          }
        />

        {/* Scroll Depth Chart */}
        <div className="bg-white dark:bg-dark-card border border-gray-200 dark:border-dark-border rounded-xl shadow-sm flex flex-col h-full">
          <div className="p-4 border-b border-gray-200 dark:border-dark-border flex items-center justify-between min-h-[72px]">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Scroll Depth Distribution
            </h3>
            {scrollDepths.length > 0 && (
              <select
                value={selectedScrollPath}
                onChange={(e) => setSelectedScrollPath(e.target.value)}
                className="bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block p-2.5 outline-none max-w-[200px]"
              >
                {scrollDepths.map((d) => (
                  <option key={d.path} value={d.path}>
                    {d.path}
                  </option>
                ))}
              </select>
            )}
          </div>
          <div className="p-6 flex-1 overflow-auto">
            {scrollDepths.length > 0 ? (
              <BarChart
                data={
                  scrollDepths
                    .find((d) => d.path === selectedScrollPath)
                    ?.distribution.map((dist) => ({
                      depth: `${dist.depth}%`,
                      count: dist.count,
                    }))
                    .sort((a, b) => parseInt(a.depth) - parseInt(b.depth)) || []
                }
                xKey="depth"
                yKey="count"
                height={300}
              />
            ) : (
              <div className="h-full flex items-center justify-center text-gray-500">
                No scroll data available.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

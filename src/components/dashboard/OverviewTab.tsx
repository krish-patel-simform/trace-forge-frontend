import React from "react";
import { Globe, MousePointer2, Clock, Activity, Monitor, AppWindow, Navigation } from "lucide-react";
import { MetricCard } from "../charts/MetricCard";
import { LineChart } from "../charts/LineChart";
import { BarChart } from "../charts/BarChart";
import { PieChart } from "../charts/PieChart";
import { SearchableTable } from "../shared/SearchableTable";
import type { OverviewData, TimeSeriesData, TopPageData, ReferrerData } from "../../types/analytics";

interface OverviewTabProps {
  overview: OverviewData | null;
  timeSeries: TimeSeriesData[];
  topPages: TopPageData[];
  referrers: ReferrerData[];
  systems: {
    browsers: Record<string, unknown>[];
    os: Record<string, unknown>[];
    devices: Record<string, unknown>[];
  };
}

export const OverviewTab: React.FC<OverviewTabProps> = ({
  overview,
  timeSeries,
  topPages,
  referrers,
  systems
}) => {
  return (
    <div className="space-y-6 mt-6 animate-in fade-in duration-500">
      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Total Page Views"
          value={overview?.pageViews || 0}
          icon={<Globe className="w-5 h-5" />}
        />
        <MetricCard
          title="Total Sessions"
          value={overview?.sessions ?? 0}
          icon={<MousePointer2 className="w-5 h-5" />}
        />
        <MetricCard
          title="Avg Session Duration"
          value={`${overview?.avgSessionDuration || 0}s`}
          icon={<Clock className="w-5 h-5" />}
        />
        <MetricCard
          title="Active Events (24h)"
          value={timeSeries[timeSeries.length - 1]?.pageViews || 0}
          icon={<Activity className="w-5 h-5" />}
        />
      </div>

      {/* Time Series Chart */}
      <div className="bg-white dark:bg-dark-card border border-gray-200 dark:border-dark-border rounded-xl p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
          Traffic Over Time
        </h3>
        <LineChart
          data={timeSeries}
          xKey="formattedDate"
          series={[
            { key: "pageViews", name: "Page Views", color: "#4f46e5" },
            { key: "sessions", name: "Sessions", color: "#10b981" },
          ]}
          variant="area"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:h-[450px]">
        {/* Top Pages */}
        <SearchableTable
          title="Top Pages"
          icon={<AppWindow className="w-5 h-5" />}
          data={topPages}
          keyExtractor={(item) => item.path}
          filterFn={(item, query) => item.path?.toLowerCase().includes(query.toLowerCase())}
          columns={[
            {
              header: "Path",
              accessorKey: "path",
              cell: (item) => (
                <span className="font-mono text-xs">{item.path}</span>
              ),
            },
            { header: "Views", accessorKey: "views" },
            { header: "Unique", accessorKey: "uniqueVisitors" },
          ]}
        />

        {/* Referrers */}
        <div className="bg-white dark:bg-dark-card border border-gray-200 dark:border-dark-border rounded-xl shadow-sm overflow-hidden flex flex-col h-full">
          <div className="p-4 border-b border-gray-200 dark:border-dark-border flex items-center gap-2 min-h-[72px]">
            <Navigation className="w-5 h-5 text-primary-500" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Top Referrers
            </h3>
          </div>
          <div className="p-6 flex-1 overflow-auto">
            <BarChart
              data={referrers}
              xKey="referrer"
              yKey="views"
              horizontal={true}
              height={300}
            />
          </div>
        </div>
      </div>

      {/* System Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-dark-card border border-gray-200 dark:border-dark-border rounded-xl p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
            Browsers
          </h3>
          <PieChart data={systems.browsers} dataKey="count" nameKey="name" />
        </div>
        <div className="bg-white dark:bg-dark-card border border-gray-200 dark:border-dark-border rounded-xl p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
            Operating Systems
          </h3>
          <PieChart data={systems.os} dataKey="count" nameKey="name" />
        </div>
        <div className="bg-white dark:bg-dark-card border border-gray-200 dark:border-dark-border rounded-xl p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-6">
            <Monitor className="w-5 h-5 text-primary-500" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Devices
            </h3>
          </div>
          <PieChart data={systems.devices} dataKey="count" nameKey="name" />
        </div>
      </div>
    </div>
  );
};

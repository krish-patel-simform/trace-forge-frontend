import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  Activity,
  Globe,
  MousePointer2,
  Clock,
  Monitor,
  AppWindow,
  Navigation,
  Target,
  Zap,
} from "lucide-react";
import { apiClient as api } from "../../api/client";
import { Tabs, type Tab } from "../../components/ui/Tabs";
import { LiveIndicator } from "../../components/realtime/LiveIndicator";
import { LiveUserCount } from "../../components/realtime/LiveUserCount";
import { LiveEventFeed } from "../../components/realtime/LiveEventFeed";
import { MetricCard } from "../../components/charts/MetricCard";
import { LineChart } from "../../components/charts/LineChart";
import { BarChart } from "../../components/charts/BarChart";
import { PieChart } from "../../components/charts/PieChart";
import { DataTable } from "../../components/shared/DataTable";
import {
  DateRangePicker,
  type DateRange,
} from "../../components/shared/DateRangePicker";
import { format } from "date-fns";

type OverviewData = {
  pageViews: number;
  sessions: number;
  avgSessionDuration: number;
};

type TimeSeriesData = {
  timestamp: string;
  formattedDate: string;
  pageViews: number;
  sessions: number;
};

type TopPageData = {
  path: string;
  views: number;
};

type ReferrerData = {
  referrer: string;
  visits: number;
};

type ClickData = {
  text: string;
  path: string;
  name?: string;
  clicks: number;
  uniqueUsers: number;
};

type CustomEventData = {
  eventName: string;
  occurrences: number;
  uniqueUsers: number;
};

type ScrollData = {
  path: string;
  distribution: { depth: number; count: number }[];
};

export const ProjectDashboardPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  const [dateRange, setDateRange] = useState<DateRange>(() => {
    const end = new Date();
    const start = new Date();
    start.setDate(start.getDate() - 7);
    return { startDate: start, endDate: end };
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [overview, setOverview] = useState<OverviewData | null>(null);
  const [timeSeries, setTimeSeries] = useState<TimeSeriesData[]>([]);
  const [topPages, setTopPages] = useState<TopPageData[]>([]);
  const [referrers, setReferrers] = useState<ReferrerData[]>([]);
  const [systems, setSystems] = useState<{
    browsers: Record<string, unknown>[];
    os: Record<string, unknown>[];
    devices: Record<string, unknown>[];
  }>({ browsers: [], os: [], devices: [] });

  const [topClicks, setTopClicks] = useState<ClickData[]>([]);
  const [customEvents, setCustomEvents] = useState<CustomEventData[]>([]);
  const [scrollDepths, setScrollDepths] = useState<ScrollData[]>([]);
  const [selectedScrollPath, setSelectedScrollPath] = useState<string>("");

  useEffect(() => {
    const fetchAnalytics = async () => {
      if (!id) return;
      try {
        setLoading(true);
        setError(null);

        const params = {
          startDate: dateRange.startDate.toISOString(),
          endDate: dateRange.endDate.toISOString(),
        };

        const [overviewRes, timeSeriesRes, pagesRes, referrersRes, systemsRes, clicksRes, customRes, scrollRes] =
          await Promise.all([
            api.get(`/projects/${id}/analytics/overview`, { params }),
            api.get(`/projects/${id}/analytics/timeseries`, { params }),
            api.get(`/projects/${id}/analytics/pages`, { params }),
            api.get(`/projects/${id}/analytics/referrers`, { params }),
            api.get(`/projects/${id}/analytics/systems`, { params }),
            api.get(`/projects/${id}/analytics/engagement/clicks`, { params }),
            api.get(`/projects/${id}/analytics/engagement/custom`, { params }),
            api.get(`/projects/${id}/analytics/engagement/scroll`, { params }),
          ]);

        setOverview(overviewRes.data);

        // Format dates for time series
        const formattedTimeSeries = timeSeriesRes.data.map(
          (item: Record<string, unknown>) => ({
            ...item,
            formattedDate: format(new Date(item.timestamp as string), "MMM dd"),
          }),
        );

        setTimeSeries(formattedTimeSeries);
        setTopPages(pagesRes.data);
        setReferrers(referrersRes.data);
        setSystems(systemsRes.data);
        setTopClicks(clicksRes.data);
        setCustomEvents(customRes.data);
        setScrollDepths(scrollRes.data);
        
        if (scrollRes.data.length > 0 && !selectedScrollPath) {
          setSelectedScrollPath(scrollRes.data[0].path);
        }
      } catch (err: unknown) {
        console.error("Failed to fetch analytics:", err);
        const errorMsg =
          err instanceof Error && "response" in err
            ? (err as { response?: { data?: { error?: string } } }).response
                ?.data?.error
            : "Failed to load dashboard data";
        setError(errorMsg || "Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, [id, dateRange]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error) {
    return <div className="bg-red-50 text-red-600 p-4 rounded-lg">{error}</div>;
  }

  const overviewContent = (
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Pages */}
        <div className="bg-white dark:bg-dark-card border border-gray-200 dark:border-dark-border rounded-xl shadow-sm overflow-hidden flex flex-col">
          <div className="p-6 border-b border-gray-200 dark:border-dark-border flex items-center gap-2">
            <AppWindow className="w-5 h-5 text-primary-500" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Top Pages
            </h3>
          </div>
          <DataTable
            data={topPages}
            keyExtractor={(item) => item.path}
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
        </div>

        {/* Referrers */}
        <div className="bg-white dark:bg-dark-card border border-gray-200 dark:border-dark-border rounded-xl shadow-sm overflow-hidden flex flex-col">
          <div className="p-6 border-b border-gray-200 dark:border-dark-border flex items-center gap-2">
            <Navigation className="w-5 h-5 text-primary-500" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Top Referrers
            </h3>
          </div>
          <div className="p-6">
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

  const engagementContent = (
    <div className="space-y-6 mt-6 animate-in fade-in duration-500">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Clicks */}
        <div className="bg-white dark:bg-dark-card border border-gray-200 dark:border-dark-border rounded-xl shadow-sm overflow-hidden flex flex-col">
          <div className="p-6 border-b border-gray-200 dark:border-dark-border flex items-center gap-2">
            <MousePointer2 className="w-5 h-5 text-primary-500" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Top Clicked Elements
            </h3>
          </div>
          <DataTable
            data={topClicks}
            keyExtractor={(item, index) => item.path + index}
            columns={[
              {
                header: "Element",
                accessorKey: "text",
                cell: (item) => (
                  <div>
                    <div className="font-medium">{item.name || item.text || 'Unnamed'}</div>
                    <div className="text-xs text-gray-500 font-mono truncate max-w-[200px]" title={item.path}>
                      {item.path}
                    </div>
                  </div>
                ),
              },
              { header: "Clicks", accessorKey: "clicks" },
              { header: "Users", accessorKey: "uniqueUsers" },
            ]}
          />
        </div>

        {/* Custom Events */}
        <div className="bg-white dark:bg-dark-card border border-gray-200 dark:border-dark-border rounded-xl shadow-sm overflow-hidden flex flex-col">
          <div className="p-6 border-b border-gray-200 dark:border-dark-border flex items-center gap-2">
            <Target className="w-5 h-5 text-primary-500" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Custom Events
            </h3>
          </div>
          <DataTable
            data={customEvents}
            keyExtractor={(item) => item.eventName}
            columns={[
              { header: "Event Name", accessorKey: "eventName", cell: (item) => <span className="font-medium">{item.eventName}</span> },
              { header: "Occurrences", accessorKey: "occurrences" },
              { header: "Users", accessorKey: "uniqueUsers" },
            ]}
          />
          {customEvents.length === 0 && (
            <div className="p-8 text-center text-gray-500 dark:text-gray-400 border-t border-gray-100 dark:border-dark-border">
              <p className="mb-2">No custom events tracked yet.</p>
              <code className="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded text-xs font-mono">
                TraceForge.track('my_event')
              </code>
            </div>
          )}
        </div>
      </div>

      {/* Scroll Depth Chart */}
      <div className="bg-white dark:bg-dark-card border border-gray-200 dark:border-dark-border rounded-xl p-6 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Scroll Depth Distribution
          </h3>
          {scrollDepths.length > 0 && (
            <select
              value={selectedScrollPath}
              onChange={(e) => setSelectedScrollPath(e.target.value)}
              className="bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block p-2.5 outline-none"
            >
              {scrollDepths.map((d) => (
                <option key={d.path} value={d.path}>
                  {d.path}
                </option>
              ))}
            </select>
          )}
        </div>
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
          <div className="h-[300px] flex items-center justify-center text-gray-500">
            No scroll data available.
          </div>
        )}
      </div>
    </div>
  );

  const realtimeContent = (
    <div className="space-y-6 mt-6 animate-in fade-in duration-500">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <LiveUserCount />
        </div>
        <div className="lg:col-span-2">
          <LiveEventFeed />
        </div>
      </div>
    </div>
  );

  const tabs: Tab[] = [
    {
      id: "overview",
      label: "Overview",
      icon: <Activity className="w-4 h-4" />,
      content: overviewContent,
    },
    {
      id: "engagement",
      label: "Engagement",
      icon: <Target className="w-4 h-4" />,
      content: engagementContent,
    },
    {
      id: "realtime",
      label: "Real-time",
      icon: <Zap className="w-4 h-4" />,
      content: realtimeContent,
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Analytics Dashboard
          </h1>
          <LiveIndicator />
        </div>
        <DateRangePicker value={dateRange} onChange={setDateRange} />
      </div>

      <Tabs tabs={tabs} />
    </div>
  );
};

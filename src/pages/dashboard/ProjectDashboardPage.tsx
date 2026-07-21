import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Activity, Target, Zap } from "lucide-react";
import { useSocketRoom } from "../../hooks/useSocketRoom";
import { apiClient as api } from "../../api/client";
import { Tabs, type Tab } from "../../components/ui/Tabs";
import { LiveIndicator } from "../../components/realtime/LiveIndicator";
import { LiveUserCount } from "../../components/realtime/LiveUserCount";
import { LiveEventFeed } from "../../components/realtime/LiveEventFeed";
import {
  DateRangePicker,
  type DateRange,
} from "../../components/shared/DateRangePicker";
import { format } from "date-fns";

import { OverviewTab } from "../../components/dashboard/OverviewTab";
import { EngagementTab } from "../../components/dashboard/EngagementTab";

import type {
  OverviewData,
  TimeSeriesData,
  TopPageData,
  ReferrerData,
  ClickData,
  SearchData,
  CustomEventData,
  ScrollData,
} from "../../types/analytics";

export const ProjectDashboardPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  // Join the Socket.IO project room for real-time events
  useSocketRoom(id);

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
  const [topSearches, setTopSearches] = useState<SearchData[]>([]);
  const [customEvents, setCustomEvents] = useState<CustomEventData[]>([]);
  const [scrollDepths, setScrollDepths] = useState<ScrollData[]>([]);
  const [selectedScrollPath, setSelectedScrollPath] = useState<string>("");
  // Ref sentinel: tracks whether we've set the initial scroll path selection
  const scrollPathInitialized = React.useRef(false);

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

        const [overviewRes, timeSeriesRes, pagesRes, referrersRes, systemsRes, clicksRes, searchesRes, customRes, scrollRes] =
          await Promise.all([
            api.get(`/projects/${id}/analytics/overview`, { params }),
            api.get(`/projects/${id}/analytics/timeseries`, { params }),
            api.get(`/projects/${id}/analytics/pages`, { params }),
            api.get(`/projects/${id}/analytics/referrers`, { params }),
            api.get(`/projects/${id}/analytics/systems`, { params }),
            api.get(`/projects/${id}/analytics/engagement/clicks`, { params }),
            api.get(`/projects/${id}/analytics/engagement/searches`, { params }),
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
        setTopSearches(searchesRes.data);
        setCustomEvents(customRes.data);
        setScrollDepths(scrollRes.data);
        
        if (scrollRes.data.length > 0 && !scrollPathInitialized.current) {
          scrollPathInitialized.current = true;
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
      content: <OverviewTab
        overview={overview}
        timeSeries={timeSeries}
        topPages={topPages}
        referrers={referrers}
        systems={systems}
      />,
    },
    {
      id: "engagement",
      label: "Engagement",
      icon: <Target className="w-4 h-4" />,
      content: <EngagementTab
        topClicks={topClicks}
        topSearches={topSearches}
        customEvents={customEvents}
        scrollDepths={scrollDepths}
        selectedScrollPath={selectedScrollPath}
        setSelectedScrollPath={setSelectedScrollPath}
      />,
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

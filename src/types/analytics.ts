export type OverviewData = {
  pageViews: number;
  sessions: number;
  avgSessionDuration: number;
};

export type TimeSeriesData = {
  timestamp: string;
  formattedDate: string;
  pageViews: number;
  sessions: number;
};

export type TopPageData = {
  path: string;
  views: number;
  uniqueVisitors?: number;
};

export type ReferrerData = {
  referrer: string;
  visits: number;
  views?: number;
};

export type ClickData = {
  text: string;
  /** The page URL where the element was clicked, e.g. "/" or "/about" */
  pagePath: string;
  name?: string;
  clicks: number;
  uniqueUsers: number;
};


export type SearchData = {
  query: string;
  searches: number;
  uniqueUsers: number;
};

export type CustomEventData = {
  eventName: string;
  occurrences: number;
  uniqueUsers: number;
};

export type ScrollData = {
  path: string;
  distribution: { depth: number; count: number }[];
};

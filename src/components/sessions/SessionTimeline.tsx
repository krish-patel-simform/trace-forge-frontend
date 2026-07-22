import React from 'react';

interface Event {
  _id: string;
  eventType: string;
  timestamp: string;
  context: {
    path: string;
    url?: string;
  };
  payload?: Record<string, unknown>;
}

export const SessionTimeline: React.FC<{ events: Event[] }> = ({ events }) => {
  return (
    <div className="relative border-l border-gray-700 ml-4 space-y-6 py-4">
      {events.map((event, index) => {
        let icon = '⚡';
        let label = event.eventType;
        if (event.eventType === 'page_view' || event.eventType === 'pageview') {
          icon = '📄';
          label = 'Page View';
        } else if (event.eventType === 'click') {
          icon = '🖱️';
          label = 'Click';
        } else if (event.eventType === 'add_to_cart') {
          icon = '🛒';
          label = 'Add to Cart';
        }

        return (
          <div key={event._id || index} className="pl-6 relative">
            <div className="absolute -left-3 top-1 bg-gray-800 border border-gray-700 w-6 h-6 rounded-full flex items-center justify-center text-xs shadow-md">
              {icon}
            </div>
            <div className="bg-gray-800 border border-gray-700 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-2">
                <h4 className="font-semibold text-gray-100 flex items-center gap-2">
                  {label}
                  {event.payload?.pageName && (
                    <span className="text-sm font-normal text-blue-400 bg-blue-900/30 px-2 py-0.5 rounded border border-blue-800/50">
                      {String(event.payload.pageName)}
                    </span>
                  )}
                  <span className="text-sm font-normal text-gray-400 bg-gray-900 px-2 py-0.5 rounded border border-gray-800">
                    {event.context?.path || '/'}
                  </span>
                </h4>
                <span className="text-xs text-gray-500">
                  {new Date(event.timestamp).toLocaleTimeString()}
                </span>
              </div>
              
              {event.payload && Object.keys(event.payload).length > 0 && (
                <div className="mt-3 bg-gray-900/50 rounded p-3 border border-gray-800">
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    {Object.entries(event.payload).map(([key, value]) => {
                      if (key === 'sessionId' || key === 'userId' || key === 'pageName') return null;
                      return (
                        <div key={key} className="flex flex-col">
                          <span className="text-gray-500 text-xs font-mono">{key}</span>
                          <span className="text-gray-300 truncate" title={String(value)}>
                            {String(value)}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

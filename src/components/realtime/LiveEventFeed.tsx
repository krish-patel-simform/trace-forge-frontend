import React from 'react';
import { useLiveEvents } from '../../hooks/useLiveEvents';
import { format } from 'date-fns';

export const LiveEventFeed: React.FC = () => {
  const { liveEvents } = useLiveEvents();

  return (
    <div className="bg-white dark:bg-dark-card rounded-xl shadow-sm border border-gray-100 dark:border-dark-border overflow-hidden flex flex-col h-[400px]">
      <div className="p-4 border-b border-gray-100 dark:border-dark-border flex justify-between items-center">
        <h3 className="font-semibold text-gray-900 dark:text-white">Live Event Feed</h3>
        <span className="px-2.5 py-1 bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400 text-xs font-medium rounded-full">
          Real-time
        </span>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {liveEvents.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-gray-400">
            <p>Waiting for events...</p>
          </div>
        ) : (
          liveEvents.map((event) => (
            <div 
              key={event.id}
              className="flex items-start space-x-3 p-3 rounded-lg bg-gray-50 dark:bg-dark-bg border border-gray-100 dark:border-dark-border animate-fade-in-down"
            >
              <div className="mt-0.5">
                <span className="w-2 h-2 rounded-full bg-blue-500 inline-block" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                  {event.name || event.type}
                </p>
                <div className="flex items-center space-x-2 mt-1">
                  <span className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    {event.type.replace('_', ' ')}
                  </span>
                  <span className="text-xs text-gray-300 dark:text-gray-600">•</span>
                  <span className="text-xs text-gray-400 font-mono">
                    {event.sessionId.substring(0, 8)}
                  </span>
                </div>
              </div>
              <div className="text-xs text-gray-400 whitespace-nowrap">
                {format(new Date(event.timestamp), 'HH:mm:ss')}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

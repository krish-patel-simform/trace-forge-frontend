import React from 'react';
import { useLiveUsers } from '../../hooks/useLiveUsers';
import { Users } from 'lucide-react';

export const LiveUserCount: React.FC = () => {
  const { activeUsers, isConnected } = useLiveUsers();

  return (
    <div className="bg-white dark:bg-dark-card rounded-xl p-6 shadow-sm border border-gray-100 dark:border-dark-border flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
          Active Users Right Now
        </p>
        <div className="flex items-center space-x-3">
          <span className="text-3xl font-bold text-gray-900 dark:text-white">
            {activeUsers}
          </span>
          {isConnected && (
            <span className="flex h-3 w-3 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
            </span>
          )}
        </div>
      </div>
      <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
        <Users className="w-8 h-8 text-blue-500" />
      </div>
    </div>
  );
};

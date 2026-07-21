import React from 'react';
import { useSocket } from '../../hooks/useSocket';

export const LiveIndicator: React.FC = () => {
  const { isConnected } = useSocket();

  return (
    <div className="flex items-center space-x-2">
      <div className={`w-2.5 h-2.5 rounded-full ${isConnected ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`} />
      <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
        {isConnected ? 'Live' : 'Disconnected'}
      </span>
    </div>
  );
};

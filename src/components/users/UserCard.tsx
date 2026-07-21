import React from 'react';
import { Link } from 'react-router-dom';
import { useProjects } from '../../hooks/useProjects';

export interface UserData {
  externalUserId: string;
  properties?: {
    name?: string;
    email?: string;
    [key: string]: unknown;
  };
  totalSessions: number;
  lastSeen: string | Date;
}

interface UserCardProps<T extends UserData = UserData> {
  user: T;
}

export const UserCard: React.FC<UserCardProps> = ({ user }) => {
  const { activeProject } = useProjects();
  const properties = user.properties || {};
  const name = properties.name || properties.email || user.externalUserId;

  return (
    <Link 
      to={`/projects/${activeProject?._id}/users/${user.externalUserId}`}
      className="block bg-gray-800 border border-gray-700 rounded-lg p-5 hover:border-blue-500 transition-colors"
    >
      <div className="flex items-center gap-4 mb-4">
        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg shadow-inner">
          {name.charAt(0).toUpperCase()}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-gray-100 truncate">{name}</h3>
          <p className="text-sm text-gray-400 truncate">ID: {user.externalUserId}</p>
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4 mt-4 pt-4 border-t border-gray-700 text-sm">
        <div>
          <span className="text-gray-500 block text-xs">Sessions</span>
          <span className="text-gray-300">{user.totalSessions}</span>
        </div>
        <div>
          <span className="text-gray-500 block text-xs">Last Seen</span>
          <span className="text-gray-300 block">{new Date(user.lastSeen).toLocaleDateString()}</span>
        </div>
      </div>
    </Link>
  );
};

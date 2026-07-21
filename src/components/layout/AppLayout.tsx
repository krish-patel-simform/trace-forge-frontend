import React from 'react';
import { Outlet, NavLink } from 'react-router-dom';
import { Activity, Folder, Settings, LogOut } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useProjects } from '../../contexts/ProjectContext';

export const AppLayout: React.FC = () => {
  const { user, logout } = useAuth();
  const { activeProject } = useProjects();

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-dark-bg text-gray-900 dark:text-gray-100">
      {/* Sidebar */}
      <aside className="w-64 border-r border-gray-200 dark:border-dark-border bg-white dark:bg-dark-card hidden md:flex flex-col">
        <div className="h-16 flex items-center px-6 border-b border-gray-200 dark:border-dark-border">
          <div className="flex items-center gap-2 text-primary-600">
            <Activity className="w-6 h-6" />
            <span className="text-xl font-bold">TraceForge</span>
          </div>
        </div>

        <div className="p-4">
          <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Projects</div>
          <NavLink 
            to="/projects"
            end
            className={({ isActive }) => 
              `flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                isActive ? 'bg-primary-50 text-primary-700 dark:bg-primary-900/20 dark:text-primary-400' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-dark-border'
              }`
            }
          >
            <Folder className="w-5 h-5" />
            <span>All Projects</span>
          </NavLink>
          
          {activeProject && (
            <NavLink 
              to={`/projects/${activeProject._id}/settings`}
              className={({ isActive }) => 
                `flex items-center gap-3 px-3 py-2 mt-1 rounded-lg transition-colors ${
                  isActive ? 'bg-primary-50 text-primary-700 dark:bg-primary-900/20 dark:text-primary-400' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-dark-border'
                }`
              }
            >
              <Settings className="w-5 h-5" />
              <span>Project Settings</span>
            </NavLink>
          )}
        </div>

        <div className="mt-auto p-4 border-t border-gray-200 dark:border-dark-border">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 overflow-hidden">
              <div className="w-8 h-8 rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400 flex items-center justify-center font-bold">
                {user?.name?.charAt(0).toUpperCase()}
              </div>
              <div className="truncate">
                <div className="text-sm font-medium truncate">{user?.name}</div>
                <div className="text-xs text-gray-500 truncate">{user?.email}</div>
              </div>
            </div>
            <button onClick={logout} className="p-2 text-gray-500 hover:text-red-500 transition-colors rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20">
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Header */}
        <header className="h-16 flex items-center px-6 border-b border-gray-200 dark:border-dark-border bg-white/50 dark:bg-dark-card/50 backdrop-blur-sm sticky top-0 z-10">
          <div className="flex items-center text-sm">
            <span className="text-gray-500">Workspace</span>
            <span className="mx-2 text-gray-400">/</span>
            <span className="font-medium">{activeProject ? activeProject.name : 'Projects'}</span>
          </div>
        </header>

        {/* Page Content */}
        <div className="flex-1 overflow-auto p-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

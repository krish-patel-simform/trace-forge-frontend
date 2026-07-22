import React, { useEffect } from "react";
import { Outlet, NavLink, useParams, useLocation } from "react-router-dom";
import { Activity, Folder, Settings, LogOut, LayoutDashboard, Users, Clock } from "lucide-react";
import { useAuth } from "../../hooks/useAuth";
import { useProjects } from "../../hooks/useProjects";
import { ProjectSwitcher } from "./ProjectSwitcher";
import { ThemeToggle } from "../ui/ThemeToggle";

export const AppLayout: React.FC = () => {
  const { user, logout } = useAuth();
  const { projects, activeProject, setActiveProject } = useProjects();
  const params = useParams<{ id?: string }>();
  const location = useLocation();

  // Keep activeProject in sync with URL route parameter :id if present
  useEffect(() => {
    // Path structure: /projects/:id/...
    const pathParts = location.pathname.split("/").filter(Boolean);
    if (pathParts[0] === "projects" && pathParts[1] && pathParts[1] !== "projects") {
      const urlProjectId = pathParts[1];
      if (urlProjectId && urlProjectId !== activeProject?._id && projects.length > 0) {
        const found = projects.find((p) => p._id === urlProjectId);
        if (found) {
          setActiveProject(found);
        }
      }
    }
  }, [params.id, location.pathname, projects, activeProject?._id, setActiveProject]);

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-dark-bg text-gray-900 dark:text-gray-100">
      {/* Sidebar */}
      <aside className="w-64 border-r border-gray-200 dark:border-dark-border bg-white dark:bg-dark-card hidden md:flex flex-col">
        <div className="h-16 flex items-center px-6 border-b border-gray-200 dark:border-dark-border">
          <div className="flex items-center gap-2 text-primary-600 dark:text-primary-400">
            <Activity className="w-6 h-6" />
            <span className="text-xl font-bold tracking-tight">TraceForge</span>
          </div>
        </div>

        <div className="p-4 space-y-1">
          <div className="text-[11px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider px-3 mb-2">
            Workspace
          </div>

          <NavLink
            to="/projects"
            end
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium transition-colors ${
                isActive
                  ? "bg-primary-50 text-primary-700 dark:bg-primary-900/20 dark:text-primary-400"
                  : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-dark-border/50"
              }`
            }
          >
            <Folder className="w-4 h-4" />
            <span>All Projects</span>
          </NavLink>

          {activeProject && (
            <>
              <div className="text-[11px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider px-3 mt-6 mb-2">
                Project Nav
              </div>

              <NavLink
                to={`/projects/${activeProject._id}/dashboard`}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-primary-50 text-primary-700 dark:bg-primary-900/20 dark:text-primary-400"
                      : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-dark-border/50"
                  }`
                }
              >
                <LayoutDashboard className="w-4 h-4" />
                <span>Dashboard</span>
              </NavLink>

              <NavLink
                to={`/projects/${activeProject._id}/sessions`}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-primary-50 text-primary-700 dark:bg-primary-900/20 dark:text-primary-400"
                      : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-dark-border/50"
                  }`
                }
              >
                <Clock className="w-4 h-4" />
                <span>Sessions</span>
              </NavLink>

              <NavLink
                to={`/projects/${activeProject._id}/users`}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-primary-50 text-primary-700 dark:bg-primary-900/20 dark:text-primary-400"
                      : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-dark-border/50"
                  }`
                }
              >
                <Users className="w-4 h-4" />
                <span>Users</span>
              </NavLink>

              <NavLink
                to={`/projects/${activeProject._id}/settings`}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-primary-50 text-primary-700 dark:bg-primary-900/20 dark:text-primary-400"
                      : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-dark-border/50"
                  }`
                }
              >
                <Settings className="w-4 h-4" />
                <span>Project Settings</span>
              </NavLink>
            </>
          )}
        </div>

        <div className="mt-auto p-4 border-t border-gray-200 dark:border-dark-border">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 overflow-hidden">
              <div className="w-8 h-8 rounded-full bg-primary-100 dark:bg-primary-900/40 text-primary-700 dark:text-primary-300 flex items-center justify-center font-bold text-sm shrink-0">
                {user?.name?.charAt(0).toUpperCase()}
              </div>
              <div className="truncate">
                <div className="text-sm font-semibold truncate text-gray-900 dark:text-gray-100">
                  {user?.name}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400 truncate">
                  {user?.email}
                </div>
              </div>
            </div>
            <button
              type="button"
              onClick={logout}
              className="p-2 text-gray-400 hover:text-red-500 dark:hover:text-red-400 transition-colors rounded-xl hover:bg-red-50 dark:hover:bg-red-900/20"
              title="Logout"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Header */}
        <header className="h-16 flex items-center justify-between px-6 border-b border-gray-200 dark:border-dark-border bg-white/70 dark:bg-dark-card/70 backdrop-blur-md sticky top-0 z-10">
          {/* Header Left: Workspace Breadcrumb + Project Switcher */}
          <div className="flex items-center gap-2 text-sm">
            <span className="text-gray-500 dark:text-gray-400 font-medium hidden sm:inline">
              Workspace
            </span>
            <span className="text-gray-300 dark:text-gray-600 hidden sm:inline">/</span>
            <ProjectSwitcher />
          </div>

          {/* Header Right: Theme Toggle & Actions */}
          <div className="flex items-center gap-3">
            <ThemeToggle />
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

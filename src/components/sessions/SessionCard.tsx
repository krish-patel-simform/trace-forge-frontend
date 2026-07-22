import React from "react";
import { Link } from "react-router-dom";
import { useProjects } from "../../hooks/useProjects";

export interface SessionData {
  sessionId: string;
  startedAt: string | Date;
  endedAt: string | Date;
  isReturningUser?: boolean;
  eventCount: number;
  device?: {
    browser?: string;
    os?: string;
  };
  entryPage?: string;
}

interface SessionCardProps<T extends SessionData = SessionData> {
  session: T;
}

export const SessionCard: React.FC<SessionCardProps> = ({ session }) => {
  const { activeProject } = useProjects();
  const durationInSeconds = Math.floor(
    (new Date(session.endedAt).getTime() -
      new Date(session.startedAt).getTime()) /
      1000,
  );

  return (
    <Link
      to={`/projects/${activeProject?._id}/sessions/${session.sessionId}`}
      className="block bg-white dark:bg-dark-card border border-gray-200 dark:border-dark-border rounded-lg p-5 hover:border-primary-500 dark:hover:border-primary-500 transition-colors shadow-sm"
    >
      <div className="flex justify-between items-start mb-4">
        <div>
          <div className="flex items-center gap-2">
            <h3
              className="font-semibold text-gray-900 dark:text-gray-100 truncate w-48"
              title={session.sessionId}
            >
              {session.sessionId.substring(0, 8)}...
            </h3>
            {session.isReturningUser && (
              <span className="text-xs bg-green-50 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800 px-2 py-0.5 rounded-full border">
                Returning
              </span>
            )}
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            {new Date(session.startedAt).toLocaleString()}
          </p>
        </div>
        <div className="text-right">
          <div className="text-sm font-medium text-gray-700 dark:text-gray-300">
            {durationInSeconds}s
          </div>
          <div className="text-xs text-gray-400 dark:text-gray-500">
            {session.eventCount} events
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mt-4 pt-4 border-t border-gray-100 dark:border-dark-border text-sm">
        <div>
          <span className="text-gray-400 dark:text-gray-500 block text-xs">Device</span>
          <span className="text-gray-700 dark:text-gray-300 capitalize">
            {session.device?.browser || "Unknown"} on{" "}
            {session.device?.os || "Unknown"}
          </span>
        </div>
        <div>
          <span className="text-gray-400 dark:text-gray-500 block text-xs">Entry Page</span>
          <span className="text-gray-700 dark:text-gray-300 truncate block">
            {session.entryPage || "/"}
          </span>
        </div>
      </div>
    </Link>
  );
};

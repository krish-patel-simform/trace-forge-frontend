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
      className="block bg-gray-800 border border-gray-700 rounded-lg p-5 hover:border-blue-500 transition-colors"
    >
      <div className="flex justify-between items-start mb-4">
        <div>
          <div className="flex items-center gap-2">
            <h3
              className="font-semibold text-gray-100 truncate w-48"
              title={session.sessionId}
            >
              {session.sessionId.substring(0, 8)}...
            </h3>
            {session.isReturningUser && (
              <span className="text-xs bg-green-900/30 text-green-400 border border-green-800 px-2 py-0.5 rounded-full">
                Returning
              </span>
            )}
          </div>
          <p className="text-sm text-gray-400 mt-1">
            {new Date(session.startedAt).toLocaleString()}
          </p>
        </div>
        <div className="text-right">
          <div className="text-sm font-medium text-gray-300">
            {durationInSeconds}s
          </div>
          <div className="text-xs text-gray-500">
            {session.eventCount} events
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mt-4 pt-4 border-t border-gray-700 text-sm">
        <div>
          <span className="text-gray-500 block text-xs">Device</span>
          <span className="text-gray-300 capitalize">
            {session.device?.browser || "Unknown"} on{" "}
            {session.device?.os || "Unknown"}
          </span>
        </div>
        <div>
          <span className="text-gray-500 block text-xs">Entry Page</span>
          <span className="text-gray-300 truncate block">
            {session.entryPage || "/"}
          </span>
        </div>
      </div>
    </Link>
  );
};

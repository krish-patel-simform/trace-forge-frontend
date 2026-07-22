import React, { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useUserProfile, useUserSessions } from "../../hooks/useUsers";
import { SessionCard } from "../../components/sessions/SessionCard";

export const UserProfilePage: React.FC = () => {
  const { id, userId } = useParams<{ id: string; userId: string }>();
  const {
    user,
    loading: userLoading,
    error: userError,
  } = useUserProfile(userId || "");
  const [page, setPage] = useState(1);
  const {
    sessions,
    loading: sessionsLoading,
    totalPages,
  } = useUserSessions(userId || "", page, 10);

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="mb-6">
        <Link
          to={`/projects/${id}/users`}
          className="text-primary-600 dark:text-primary-400 hover:underline mb-2 inline-block"
        >
          ← Back to Users
        </Link>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-1">
          User Profile
        </h1>
      </div>

      {userLoading && (
        <div className="text-gray-500 dark:text-gray-400">
          Loading user profile...
        </div>
      )}
      {userError && <div className="text-red-500">{userError}</div>}

      {user && (
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6 mb-8 shadow-sm">
          <div className="flex items-center gap-6 mb-6 pb-6 border-b border-gray-100 dark:border-gray-700">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary-500 to-purple-600 flex items-center justify-center text-white font-bold text-3xl shadow-inner shrink-0">
              {(
                user.properties?.name ||
                user.properties?.email ||
                user.externalUserId
              )
                .charAt(0)
                .toUpperCase()}
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                {user.properties?.name ||
                  user.properties?.email ||
                  "Unknown User"}
              </h2>
              <p className="text-gray-500 dark:text-gray-400 font-mono text-sm mt-1">
                ID: {user.externalUserId}
              </p>
            </div>
          </div>

          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">
            Properties
          </h3>
          {Object.keys(user.properties || {}).length === 0 ? (
            <p className="text-sm text-gray-400 dark:text-gray-500">
              No properties recorded.
            </p>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {Object.entries(user.properties || {}).map(([key, value]) => (
                <div
                  key={key}
                  className="bg-gray-50 dark:bg-gray-900 rounded-lg p-3 border border-gray-100 dark:border-gray-800"
                >
                  <span className="text-gray-400 dark:text-gray-500 block text-xs font-mono mb-1">
                    {key}
                  </span>
                  <span
                    className="text-gray-800 dark:text-gray-300 truncate block font-medium"
                    title={String(value)}
                  >
                    {String(value)}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      <div className="mt-8">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-200 mb-4 border-b border-gray-200 dark:border-gray-800 pb-2">
          Session History
        </h3>
        {sessionsLoading ? (
          <div className="text-gray-500 dark:text-gray-400">
            Loading sessions...
          </div>
        ) : sessions.length === 0 ? (
          <div className="text-gray-500 dark:text-gray-400">
            No sessions found for this user.
          </div>
        ) : (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {sessions.map((session) => (
                <SessionCard key={session.sessionId} session={session} />
              ))}
            </div>

            {totalPages > 1 && (
              <div className="flex justify-center gap-4 mt-6">
                <button
                  disabled={page === 1}
                  onClick={() => setPage((p) => p - 1)}
                  className="px-4 py-2 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg disabled:opacity-50 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition"
                >
                  Previous
                </button>
                <span className="flex items-center text-gray-500 dark:text-gray-400">
                  Page {page} of {totalPages}
                </span>
                <button
                  disabled={page === totalPages}
                  onClick={() => setPage((p) => p + 1)}
                  className="px-4 py-2 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg disabled:opacity-50 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition"
                >
                  Next
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

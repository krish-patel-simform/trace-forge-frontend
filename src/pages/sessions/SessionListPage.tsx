import React, { useState } from 'react';
import { useSessions } from '../../hooks/useSessions';
import { SessionCard } from '../../components/sessions/SessionCard';

export const SessionListPage: React.FC = () => {
  const [page, setPage] = useState(1);
  const { sessions, loading, error, totalPages, total } = useSessions(page, 20);

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-100">Sessions</h1>
        <div className="text-sm text-gray-400">
          Total Sessions: {total}
        </div>
      </div>

      {loading && <div className="text-gray-400">Loading sessions...</div>}
      {error && <div className="text-red-500">{error}</div>}

      {!loading && sessions.length === 0 && (
        <div className="text-gray-400">No sessions found.</div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {sessions.map((session) => (
          <SessionCard key={session.sessionId} session={session} />
        ))}
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center gap-4">
          <button
            disabled={page === 1}
            onClick={() => setPage(p => p - 1)}
            className="px-4 py-2 bg-gray-800 text-gray-300 rounded disabled:opacity-50 border border-gray-700 hover:bg-gray-700 transition"
          >
            Previous
          </button>
          <span className="flex items-center text-gray-400">
            Page {page} of {totalPages}
          </span>
          <button
            disabled={page === totalPages}
            onClick={() => setPage(p => p + 1)}
            className="px-4 py-2 bg-gray-800 text-gray-300 rounded disabled:opacity-50 border border-gray-700 hover:bg-gray-700 transition"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

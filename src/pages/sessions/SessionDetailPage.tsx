import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useSessionDetail } from '../../hooks/useSessions';
import { SessionTimeline } from '../../components/sessions/SessionTimeline';

export const SessionDetailPage: React.FC = () => {
  const { id, sessionId } = useParams<{ id: string; sessionId: string }>();
  const { events, loading, error } = useSessionDetail(sessionId || '');

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-6">
        <Link to={`/projects/${id}/sessions`} className="text-blue-500 hover:underline mb-2 inline-block">
          &larr; Back to Sessions
        </Link>
        <h1 className="text-2xl font-bold text-gray-100 mb-1">Session Detail</h1>
        <p className="text-sm text-gray-400 font-mono">{sessionId}</p>
      </div>

      {loading && <div className="text-gray-400">Loading events...</div>}
      {error && <div className="text-red-500">{error}</div>}

      {!loading && events.length === 0 && (
        <div className="text-gray-400">No events found for this session.</div>
      )}

      {events.length > 0 && (
        <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
          <h2 className="text-xl font-semibold text-gray-200 mb-6 border-b border-gray-800 pb-2">Event Timeline</h2>
          <SessionTimeline events={events} />
        </div>
      )}
    </div>
  );
};

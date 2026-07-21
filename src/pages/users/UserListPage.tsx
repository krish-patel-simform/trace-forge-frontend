import React, { useState } from 'react';
import { useUsers } from '../../hooks/useUsers';
import { UserCard } from '../../components/users/UserCard';

export const UserListPage: React.FC = () => {
  const [page, setPage] = useState(1);
  const { users, loading, error, totalPages, total } = useUsers(page, 20);

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-100">Users</h1>
        <div className="text-sm text-gray-400">
          Total Users: {total}
        </div>
      </div>

      {loading && <div className="text-gray-400">Loading users...</div>}
      {error && <div className="text-red-500">{error}</div>}

      {!loading && users.length === 0 && (
        <div className="text-gray-400">No identified users found. Use TraceForge.identify() to track users.</div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {users.map((user) => (
          <UserCard key={user.externalUserId} user={user} />
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

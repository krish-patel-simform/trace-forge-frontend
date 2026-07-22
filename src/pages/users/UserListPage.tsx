import React, { useState } from 'react';
import { useUsers } from '../../hooks/useUsers';
import { UserCard } from '../../components/users/UserCard';

export const UserListPage: React.FC = () => {
  const [page, setPage] = useState(1);
  const { users, loading, error, totalPages, total } = useUsers(page, 20);

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Users</h1>
        <div className="text-sm text-gray-500 dark:text-gray-400">
          Total Users: {total}
        </div>
      </div>

      {loading && <div className="text-gray-500 dark:text-gray-400">Loading users...</div>}
      {error && <div className="text-red-500">{error}</div>}

      {!loading && users.length === 0 && (
        <div className="text-center py-16 text-gray-500 dark:text-gray-400">
          <p className="text-lg font-medium mb-2">No identified users found.</p>
          <p className="text-sm">Use <code className="bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded font-mono text-primary-600 dark:text-primary-400">TraceForge.identify()</code> to track users.</p>
        </div>
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
            className="px-4 py-2 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg disabled:opacity-50 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition"
          >
            Previous
          </button>
          <span className="flex items-center text-gray-500 dark:text-gray-400">
            Page {page} of {totalPages}
          </span>
          <button
            disabled={page === totalPages}
            onClick={() => setPage(p => p + 1)}
            className="px-4 py-2 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg disabled:opacity-50 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};


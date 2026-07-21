import { useState, useEffect, useCallback } from 'react';
import { userApi } from '../api/user.api';
import { useProjects } from './useProjects';
import { AxiosError } from 'axios';
import type { UserData } from '../components/users/UserCard';
import type { SessionData } from '../components/sessions/SessionCard';

export const useUsers = (page: number = 1, limit: number = 10) => {
  const { activeProject } = useProjects();
  const [users, setUsers] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  const fetchUsers = useCallback(async () => {
    if (!activeProject) return;
    setLoading(true);
    setError(null);
    try {
      const data = await userApi.getUsers(activeProject._id, page, limit);
      setUsers(data.users);
      setTotalPages(data.totalPages);
      setTotal(data.total);
    } catch (err) {
      const axiosError = err as AxiosError<{ message: string }>;
      setError(axiosError.response?.data?.message || 'Failed to fetch users');
    } finally {
      setLoading(false);
    }
  }, [activeProject, page, limit]);

  useEffect(() => {
    let isMounted = true;
    const loadData = async () => {
      if (!activeProject) return;
      try {
        const data = await userApi.getUsers(activeProject._id, page, limit);
        if (isMounted) {
          setUsers(data.users);
          setTotalPages(data.totalPages);
          setTotal(data.total);
        }
      } catch (err) {
        if (isMounted) {
          const axiosError = err as AxiosError<{ message: string }>;
          setError(axiosError.response?.data?.message || 'Failed to fetch users');
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    loadData();
    return () => { isMounted = false; };
  }, [activeProject, page, limit]);

  return { users, loading, error, totalPages, total, refetch: fetchUsers };
};

export const useUserProfile = (userId: string) => {
  const { activeProject } = useProjects();
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUser = useCallback(async () => {
    if (!activeProject || !userId) return;
    setLoading(true);
    setError(null);
    try {
      const data = await userApi.getUserProfile(activeProject._id, userId);
      setUser(data);
    } catch (err) {
      const axiosError = err as AxiosError<{ message: string }>;
      setError(axiosError.response?.data?.message || 'Failed to fetch user profile');
    } finally {
      setLoading(false);
    }
  }, [activeProject, userId]);

  useEffect(() => {
    let isMounted = true;
    const loadData = async () => {
      if (!activeProject || !userId) return;
      try {
        const data = await userApi.getUserProfile(activeProject._id, userId);
        if (isMounted) setUser(data);
      } catch (err) {
        if (isMounted) {
          const axiosError = err as AxiosError<{ message: string }>;
          setError(axiosError.response?.data?.message || 'Failed to fetch user profile');
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    loadData();
    return () => { isMounted = false; };
  }, [activeProject, userId]);

  return { user, loading, error, refetch: fetchUser };
};

export const useUserSessions = (userId: string, page: number = 1, limit: number = 10) => {
  const { activeProject } = useProjects();
  const [sessions, setSessions] = useState<SessionData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  const fetchSessions = useCallback(async () => {
    if (!activeProject || !userId) return;
    setLoading(true);
    setError(null);
    try {
      const data = await userApi.getUserSessions(activeProject._id, userId, page, limit);
      setSessions(data.sessions);
      setTotalPages(data.totalPages);
      setTotal(data.total);
    } catch (err) {
      const axiosError = err as AxiosError<{ message: string }>;
      setError(axiosError.response?.data?.message || 'Failed to fetch user sessions');
    } finally {
      setLoading(false);
    }
  }, [activeProject, userId, page, limit]);

  useEffect(() => {
    let isMounted = true;
    const loadData = async () => {
      if (!activeProject || !userId) return;
      try {
        const data = await userApi.getUserSessions(activeProject._id, userId, page, limit);
        if (isMounted) {
          setSessions(data.sessions);
          setTotalPages(data.totalPages);
          setTotal(data.total);
        }
      } catch (err) {
        if (isMounted) {
          const axiosError = err as AxiosError<{ message: string }>;
          setError(axiosError.response?.data?.message || 'Failed to fetch user sessions');
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    loadData();
    return () => { isMounted = false; };
  }, [activeProject, userId, page, limit]);

  return { sessions, loading, error, totalPages, total, refetch: fetchSessions };
};

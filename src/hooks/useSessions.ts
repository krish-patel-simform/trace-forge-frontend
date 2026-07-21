import { useState, useEffect, useCallback } from 'react';
import { sessionApi } from '../api/session.api';
import { useProjects } from './useProjects';
import { AxiosError } from 'axios';
import type { SessionData } from '../components/sessions/SessionCard';

export interface EventData {
  _id: string;
  eventType: string;
  timestamp: string;
  context: {
    path: string;
    url?: string;
  };
  payload?: Record<string, unknown>;
}

export const useSessions = (page: number = 1, limit: number = 10) => {
  const { activeProject } = useProjects();
  const [sessions, setSessions] = useState<SessionData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  const fetchSessions = useCallback(async () => {
    if (!activeProject) return;
    setLoading(true);
    setError(null);
    try {
      const data = await sessionApi.getSessions(activeProject._id, page, limit);
      setSessions(data.sessions);
      setTotalPages(data.totalPages);
      setTotal(data.total);
    } catch (err) {
      const axiosError = err as AxiosError<{ message: string }>;
      setError(axiosError.response?.data?.message || 'Failed to fetch sessions');
    } finally {
      setLoading(false);
    }
  }, [activeProject, page, limit]);

  useEffect(() => {
    let isMounted = true;
    const loadData = async () => {
      if (!activeProject) return;
      try {
        const data = await sessionApi.getSessions(activeProject._id, page, limit);
        if (isMounted) {
          setSessions(data.sessions);
          setTotalPages(data.totalPages);
          setTotal(data.total);
        }
      } catch (err) {
        if (isMounted) {
          const axiosError = err as AxiosError<{ message: string }>;
          setError(axiosError.response?.data?.message || 'Failed to fetch sessions');
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    loadData();
    return () => { isMounted = false; };
  }, [activeProject, page, limit]);

  return { sessions, loading, error, totalPages, total, refetch: fetchSessions };
};

export const useSessionDetail = (sessionId: string) => {
  const { activeProject } = useProjects();
  const [events, setEvents] = useState<EventData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchEvents = useCallback(async () => {
    if (!activeProject || !sessionId) return;
    setLoading(true);
    setError(null);
    try {
      const data = await sessionApi.getSessionEvents(activeProject._id, sessionId);
      setEvents(data);
    } catch (err) {
      const axiosError = err as AxiosError<{ message: string }>;
      setError(axiosError.response?.data?.message || 'Failed to fetch session events');
    } finally {
      setLoading(false);
    }
  }, [activeProject, sessionId]);

  useEffect(() => {
    let isMounted = true;
    const loadData = async () => {
      if (!activeProject || !sessionId) return;
      try {
        const data = await sessionApi.getSessionEvents(activeProject._id, sessionId);
        if (isMounted) {
          setEvents(data);
        }
      } catch (err) {
        if (isMounted) {
          const axiosError = err as AxiosError<{ message: string }>;
          setError(axiosError.response?.data?.message || 'Failed to fetch session events');
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    loadData();
    return () => { isMounted = false; };
  }, [activeProject, sessionId]);

  return { events, loading, error, refetch: fetchEvents };
};

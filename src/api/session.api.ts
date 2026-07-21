import { apiClient } from './client';

export const sessionApi = {
  getSessions: async (projectId: string, page: number = 1, limit: number = 10) => {
    const response = await apiClient.get(`/projects/${projectId}/sessions`, {
      params: { page, limit },
    });
    return response.data;
  },
  getSessionEvents: async (projectId: string, sessionId: string) => {
    const response = await apiClient.get(`/projects/${projectId}/sessions/${sessionId}`);
    return response.data.events;
  },
};

import { apiClient } from './client';

export const userApi = {
  getUsers: async (projectId: string, page: number = 1, limit: number = 10) => {
    const response = await apiClient.get(`/projects/${projectId}/users`, {
      params: { page, limit },
    });
    return response.data;
  },
  getUserProfile: async (projectId: string, userId: string) => {
    const response = await apiClient.get(`/projects/${projectId}/users/${userId}`);
    return response.data.user;
  },
  getUserSessions: async (projectId: string, userId: string, page: number = 1, limit: number = 10) => {
    const response = await apiClient.get(`/projects/${projectId}/users/${userId}/sessions`, {
      params: { page, limit },
    });
    return response.data;
  },
};

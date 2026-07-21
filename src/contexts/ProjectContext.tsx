import React, { createContext, useContext, useState, useEffect } from 'react';
import { apiClient } from '../api/client';
import { useAuth } from './AuthContext';

export interface Project {
  _id: string;
  name: string;
  websiteUrl: string;
  description: string;
  apiKeyPrefix: string;
  createdAt: string;
}

interface ProjectContextType {
  projects: Project[];
  activeProject: Project | null;
  loading: boolean;
  setActiveProject: (project: Project | null) => void;
  fetchProjects: () => Promise<void>;
  createProject: (data: { name: string; websiteUrl: string; description: string }) => Promise<{ project: Project; apiKey: string }>;
}

const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

export const ProjectProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [activeProject, setActiveProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchProjects = async () => {
    if (!user) return;
    try {
      setLoading(true);
      const res = await apiClient.get('/projects');
      setProjects(res.data.data.projects);
      if (res.data.data.projects.length > 0 && !activeProject) {
        setActiveProject(res.data.data.projects[0]);
      }
    } catch (error) {
      console.error("Failed to fetch projects", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, [user]);

  const createProject = async (data: { name: string; websiteUrl: string; description: string }) => {
    const res = await apiClient.post('/projects', data);
    const newProject = res.data.data.project;
    const apiKey = res.data.data.apiKey;
    setProjects(prev => [...prev, newProject]);
    setActiveProject(newProject);
    return { project: newProject, apiKey };
  };

  return (
    <ProjectContext.Provider value={{ projects, activeProject, loading, setActiveProject, fetchProjects, createProject }}>
      {children}
    </ProjectContext.Provider>
  );
};

export const useProjects = () => {
  const context = useContext(ProjectContext);
  if (context === undefined) {
    throw new Error('useProjects must be used within a ProjectProvider');
  }
  return context;
};

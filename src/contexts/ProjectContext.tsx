import React, { createContext, useState, useEffect } from "react";
import { apiClient } from "../api/client";
import { useAuth } from "../hooks/useAuth";

export interface Project {
  _id: string;
  name: string;
  websiteUrl: string;
  description: string;
  apiKeyPrefix: string;
  createdAt: string;
}

export interface ProjectContextType {
  projects: Project[];
  activeProject: Project | null;
  loading: boolean;
  setActiveProject: React.Dispatch<React.SetStateAction<Project | null>>;
  setProjects: React.Dispatch<React.SetStateAction<Project[]>>;
  fetchProjects: () => Promise<void>;
  createProject: (data: {
    name: string;
    websiteUrl: string;
    description: string;
  }) => Promise<{ project: Project; apiKey: string }>;
}

// eslint-disable-next-line react-refresh/only-export-components
export const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

export const ProjectProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { user } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [activeProject, setActiveProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchProjects = async () => {
    if (!user) return;
    try {
      setLoading(true);
      const res = await apiClient.get("/projects");
      setProjects(res.data.data);
      if (res.data.data.length > 0) {
        setActiveProject((prev) => prev || res.data.data[0]);
      }
    } catch (error) {
      console.error("Failed to fetch projects", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let isMounted = true;

    const loadProjects = async () => {
      if (!user) return;
      try {
        // We do NOT call setLoading(true) here because it is initialized to true.
        // This avoids the 'calling setState synchronously within an effect' warning.
        const res = await apiClient.get("/projects");
        if (isMounted) {
          setProjects(res.data.data);
          if (res.data.data.length > 0) {
            setActiveProject((prev) => prev || res.data.data[0]);
          }
        }
      } catch (error) {
        if (isMounted) {
          console.error("Failed to fetch projects", error);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadProjects();

    return () => {
      isMounted = false;
    };
  }, [user]);

  const createProject = async (data: {
    name: string;
    websiteUrl: string;
    description: string;
  }) => {
    const res = await apiClient.post("/projects", data);
    const newProject = res.data.data.project;
    const apiKey = res.data.data.apiKey;
    setProjects((prev) => [...prev, newProject]);
    setActiveProject(newProject);
    return { project: newProject, apiKey };
  };

  return (
    <ProjectContext.Provider
      value={{
        projects,
        setProjects,
        activeProject,
        loading,
        setActiveProject,
        fetchProjects,
        createProject,
      }}
    >
      {children}
    </ProjectContext.Provider>
  );
};

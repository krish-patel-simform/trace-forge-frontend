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

  const ACTIVE_PROJECT_KEY = "traceforce-active-project-id";

  const handleSetActiveProject: React.Dispatch<React.SetStateAction<Project | null>> = (action) => {
    setActiveProject((prev) => {
      const next = typeof action === "function" ? action(prev) : action;
      if (next?._id) {
        localStorage.setItem(ACTIVE_PROJECT_KEY, next._id);
      } else {
        localStorage.removeItem(ACTIVE_PROJECT_KEY);
      }
      return next;
    });
  };

  const fetchProjects = async () => {
    if (!user) return;
    try {
      setLoading(true);
      const res = await apiClient.get("/projects");
      const fetchedProjects: Project[] = res.data.data;
      setProjects(fetchedProjects);
      if (fetchedProjects.length > 0) {
        const savedId = localStorage.getItem(ACTIVE_PROJECT_KEY);
        const match = fetchedProjects.find((p) => p._id === savedId);
        setActiveProject((prev) => prev || match || fetchedProjects[0]);
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
        const res = await apiClient.get("/projects");
        if (isMounted) {
          const fetchedProjects: Project[] = res.data.data;
          setProjects(fetchedProjects);
          if (fetchedProjects.length > 0) {
            const savedId = localStorage.getItem(ACTIVE_PROJECT_KEY);
            const match = fetchedProjects.find((p) => p._id === savedId);
            setActiveProject((prev) => prev || match || fetchedProjects[0]);
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
    handleSetActiveProject(newProject);
    return { project: newProject, apiKey };
  };

  return (
    <ProjectContext.Provider
      value={{
        projects,
        setProjects,
        activeProject,
        loading,
        setActiveProject: handleSetActiveProject,
        fetchProjects,
        createProject,
      }}
    >
      {children}
    </ProjectContext.Provider>
  );
};

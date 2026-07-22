import React, { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  ChevronDown,
  Check,
  Plus,
  Search,
  Folder,
  Globe,
  ExternalLink,
} from "lucide-react";
import { useProjects } from "../../hooks/useProjects";
import { type Project } from "../../contexts/ProjectContext";
import { Modal } from "../ui/Modal";
import { Input } from "../ui/Input";
import { Button } from "../ui/Button";

export const ProjectSwitcher: React.FC = () => {
  const { projects, activeProject, setActiveProject, createProject } = useProjects();
  const navigate = useNavigate();
  const location = useLocation();

  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Quick Create Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [name, setName] = useState("");
  const [websiteUrl, setWebsiteUrl] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelectProject = (project: Project) => {
    setActiveProject(project);
    setIsOpen(false);
    setSearchQuery("");

    // Determine subview (dashboard, settings, sessions, users, etc.) from current path
    const pathParts = location.pathname.split("/").filter(Boolean);
    // Path looks like ['projects', ':id', 'dashboard'] or ['projects']
    if (pathParts.length >= 3 && pathParts[0] === "projects") {
      const subView = pathParts.slice(2).join("/");
      navigate(`/projects/${project._id}/${subView}`);
    } else {
      navigate(`/projects/${project._id}/dashboard`);
    }
  };

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    setIsCreating(true);
    try {
      const { project } = await createProject({ name, websiteUrl, description });
      setName("");
      setWebsiteUrl("");
      setDescription("");
      setIsModalOpen(false);
      setIsOpen(false);
      navigate(`/projects/${project._id}/dashboard`);
    } catch (error) {
      console.error("Failed to create project", error);
    } finally {
      setIsCreating(false);
    }
  };

  const filteredProjects = projects.filter(
    (p) =>
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.websiteUrl.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-gray-200 dark:border-dark-border bg-white dark:bg-dark-card hover:bg-gray-50 dark:hover:bg-dark-border/60 transition-all duration-200 shadow-xs focus:outline-none focus:ring-2 focus:ring-primary-500/30"
      >
        <div className="w-5 h-5 rounded-md bg-gradient-to-tr from-primary-600 to-primary-400 text-white flex items-center justify-center text-xs font-bold shadow-xs">
          {activeProject ? activeProject.name.charAt(0).toUpperCase() : <Folder className="w-3 h-3" />}
        </div>

        <div className="flex flex-col items-start text-left">
          <span className="text-sm font-semibold text-gray-900 dark:text-gray-100 max-w-[140px] sm:max-w-[200px] truncate leading-tight">
            {activeProject ? activeProject.name : "Select Project"}
          </span>
        </div>

        <ChevronDown
          className={`w-4 h-4 text-gray-400 dark:text-gray-500 transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {/* Dropdown Panel */}
      {isOpen && (
        <div className="absolute left-0 mt-2 w-72 bg-white dark:bg-dark-card border border-gray-200 dark:border-dark-border rounded-2xl shadow-2xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-150">
          {/* Header & Search */}
          <div className="p-3 border-b border-gray-100 dark:border-dark-border bg-gray-50/50 dark:bg-dark-border/20">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                Projects ({projects.length})
              </span>
              <button
                type="button"
                onClick={() => {
                  setIsOpen(false);
                  navigate("/projects");
                }}
                className="text-xs text-primary-600 dark:text-primary-400 font-medium hover:underline flex items-center gap-1"
              >
                View all <ExternalLink className="w-3 h-3" />
              </button>
            </div>
            {projects.length > 3 && (
              <div className="relative">
                <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search project..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-8 pr-3 py-1.5 text-xs rounded-lg border border-gray-200 dark:border-dark-border bg-white dark:bg-dark-bg text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500/30"
                />
              </div>
            )}
          </div>

          {/* Project List */}
          <div className="max-h-60 overflow-y-auto py-1">
            {filteredProjects.length === 0 ? (
              <div className="p-4 text-center text-xs text-gray-500 dark:text-gray-400">
                No matching projects
              </div>
            ) : (
              filteredProjects.map((project) => {
                const isActive = activeProject?._id === project._id;
                return (
                  <button
                    key={project._id}
                    type="button"
                    onClick={() => handleSelectProject(project)}
                    className={`w-full flex items-center justify-between px-3.5 py-2.5 text-left text-xs transition-colors ${
                      isActive
                        ? "bg-primary-50/70 dark:bg-primary-900/25 text-primary-900 dark:text-primary-300 font-medium"
                        : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-dark-border/50"
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0 pr-2">
                      <div
                        className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs shrink-0 ${
                          isActive
                            ? "bg-primary-600 text-white shadow-xs"
                            : "bg-gray-100 dark:bg-dark-border text-gray-600 dark:text-gray-300"
                        }`}
                      >
                        {project.name.charAt(0).toUpperCase()}
                      </div>
                      <div className="truncate">
                        <div className="font-semibold truncate">{project.name}</div>
                        {project.websiteUrl && (
                          <div className="text-[11px] text-gray-400 dark:text-gray-500 truncate flex items-center gap-1">
                            <Globe className="w-2.5 h-2.5 shrink-0" />
                            {project.websiteUrl.replace(/^https?:\/\//, "")}
                          </div>
                        )}
                      </div>
                    </div>
                    {isActive && (
                      <Check className="w-4 h-4 text-primary-600 dark:text-primary-400 shrink-0" />
                    )}
                  </button>
                );
              })
            )}
          </div>

          {/* Footer - Create New Project */}
          <div className="p-2 border-t border-gray-100 dark:border-dark-border bg-gray-50/60 dark:bg-dark-border/30">
            <button
              type="button"
              onClick={() => {
                setIsOpen(false);
                setIsModalOpen(true);
              }}
              className="w-full flex items-center justify-center gap-2 px-3 py-2 text-xs font-semibold rounded-xl text-primary-600 dark:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/30 transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Create New Project</span>
            </button>
          </div>
        </div>
      )}

      {/* Create Project Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Create New Project"
      >
        <form onSubmit={handleCreateSubmit} className="space-y-4">
          <Input
            label="Project Name"
            placeholder="e.g. My SaaS App"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <Input
            label="Website URL"
            placeholder="https://example.com"
            value={websiteUrl}
            onChange={(e) => setWebsiteUrl(e.target.value)}
          />
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Description
            </label>
            <textarea
              className="px-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-dark-border bg-white dark:bg-dark-bg text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm"
              rows={3}
              placeholder="Brief description of your property..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div className="flex justify-end gap-3 mt-6">
            <Button
              type="button"
              variant="secondary"
              onClick={() => setIsModalOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isCreating}>
              {isCreating ? "Creating..." : "Create Project"}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

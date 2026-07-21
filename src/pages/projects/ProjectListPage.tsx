import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useProjects } from "../../hooks/useProjects";
import { type Project } from "../../contexts/ProjectContext";
import { Button } from "../../components/ui/Button";
import { Card } from "../../components/ui/Card";
import { Modal } from "../../components/ui/Modal";
import { Input } from "../../components/ui/Input";
import { Plus, Globe, Calendar, ArrowRight, Key } from "lucide-react";

export const ProjectListPage: React.FC = () => {
  const { projects, loading, createProject, setActiveProject } = useProjects();
  const navigate = useNavigate();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [name, setName] = useState("");
  const [websiteUrl, setWebsiteUrl] = useState("");
  const [description, setDescription] = useState("");

  // For showing the API key after creation
  const [newApiKey, setNewApiKey] = useState<string | null>(null);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsCreating(true);
    try {
      const { apiKey } = await createProject({ name, websiteUrl, description });
      setNewApiKey(apiKey);
      setName("");
      setWebsiteUrl("");
      setDescription("");
    } catch (error) {
      console.error(error);
    } finally {
      setIsCreating(false);
    }
  };

  const closeCreateModal = () => {
    setIsModalOpen(false);
    if (newApiKey) {
      // If they close after creating, reset the key view
      setNewApiKey(null);
    }
  };

  const goToProject = (project: Project) => {
    setActiveProject(project);
    navigate(`/projects/${project._id}/settings`);
  };

  if (loading) {
    return (
      <div className="flex justify-center mt-20">
        <div className="w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto py-8">
      <div className="flex justify-between items-end mb-10">
        <div>
          <h1 className="text-3xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-400 tracking-tight">
            Your Projects
          </h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-2 font-medium">
            Manage your analytics properties and API keys
          </p>
        </div>
        <Button 
          onClick={() => setIsModalOpen(true)}
          className="shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5 flex items-center bg-gradient-to-r from-primary-600 to-primary-500 hover:from-primary-500 hover:to-primary-600"
        >
          <Plus className="w-5 h-5 mr-2" />
          New Project
        </Button>
      </div>

      {projects.length === 0 ? (
        <Card className="p-16 text-center border-2 border-dashed border-gray-200 dark:border-dark-border bg-gray-50/50 dark:bg-dark-card/50 transition-all duration-300 hover:bg-gray-50 dark:hover:bg-dark-card">
          <div className="w-20 h-20 bg-gradient-to-br from-primary-50 to-primary-100 dark:from-primary-900/20 dark:to-primary-800/20 text-primary-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-sm transform transition-transform hover:scale-105 duration-500">
            <Globe className="w-10 h-10 animate-pulse" />
          </div>
          <h3 className="text-2xl font-bold mb-3 text-gray-900 dark:text-white">No projects yet</h3>
          <p className="text-gray-500 dark:text-gray-400 mb-8 max-w-md mx-auto text-base leading-relaxed">
            Create your first project to get an API key and start tracking
            analytics for your website instantly.
          </p>
          <Button 
            onClick={() => setIsModalOpen(true)}
            className="px-8 py-2.5 shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5"
          >
            Create First Project
          </Button>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project) => (
            <Card
              key={project._id}
              className="group hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 cursor-pointer border border-gray-100 dark:border-dark-border bg-white dark:bg-dark-card overflow-hidden relative flex flex-col h-full"
            >
              {/* Subtle top border gradient accent on hover */}
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary-400 to-primary-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              
              <div className="p-6 flex flex-col flex-grow" onClick={() => goToProject(project)}>
                <div className="flex justify-between items-start mb-5">
                  <h3 className="text-xl font-bold truncate pr-4 text-gray-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors duration-300">
                    {project.name}
                  </h3>
                  <div className="p-2 bg-gray-50 dark:bg-gray-800 rounded-full text-gray-400 group-hover:bg-primary-50 dark:group-hover:bg-primary-900/30 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-all duration-300 transform group-hover:scale-110 shadow-sm">
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </div>

                <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2 mb-6 flex-grow leading-relaxed">
                  {project.description || "No description provided"}
                </p>

                <div className="space-y-3 text-xs text-gray-500 dark:text-gray-400 mt-auto border-t border-gray-50 dark:border-gray-800 pt-5">
                  <div className="flex items-center gap-3 p-2.5 rounded-lg bg-gray-50 dark:bg-gray-800/50 group-hover:bg-primary-50/50 dark:group-hover:bg-primary-900/10 transition-colors duration-300">
                    <Globe className="w-4 h-4 text-gray-400 group-hover:text-primary-500 transition-colors duration-300" />
                    <span className="truncate font-medium text-gray-700 dark:text-gray-300">{project.websiteUrl}</span>
                  </div>
                  <div className="flex items-center gap-3 px-2.5">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <span className="font-medium">
                      Created {new Date(project.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                    </span>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={closeCreateModal}
        title={newApiKey ? "Project Created!" : "Create New Project"}
      >
        {newApiKey ? (
          <div className="space-y-6 animate-in fade-in zoom-in duration-300">
            <div className="bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 p-4 rounded-xl flex gap-4 items-start border border-green-100 dark:border-green-900/30">
              <div className="p-2 bg-green-100 dark:bg-green-800/40 rounded-full shrink-0">
                <Key className="w-5 h-5" />
              </div>
              <div className="text-sm pt-0.5">
                <p className="font-bold text-base mb-1">Here is your API Key</p>
                <p className="opacity-90">
                  Please copy this key now. For security reasons, you won't be
                  able to see it again once you close this modal.
                </p>
              </div>
            </div>

            <div className="relative group">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-primary-500 to-green-500 rounded-xl blur opacity-20 group-hover:opacity-40 transition duration-500"></div>
              <div className="relative bg-gray-50 dark:bg-dark-border p-4 rounded-xl font-mono text-sm break-all text-gray-800 dark:text-gray-200 border border-gray-200 dark:border-gray-700 shadow-inner">
                {newApiKey}
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <Button
                className="w-full shadow-md hover:shadow-lg transition-all"
                onClick={() => {
                  navigator.clipboard.writeText(newApiKey);
                  alert("API Key copied to clipboard!");
                }}
              >
                Copy to Clipboard
              </Button>
              <Button
                variant="ghost"
                className="w-full"
                onClick={closeCreateModal}
              >
                Done
              </Button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleCreate} className="space-y-5">
            <Input
              label="Project Name"
              placeholder="e.g. Production Website"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
            <Input
              label="Website URL"
              type="url"
              placeholder="https://example.com"
              value={websiteUrl}
              onChange={(e) => setWebsiteUrl(e.target.value)}
              required
            />
            <div className="flex flex-col space-y-1.5">
              <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                Description (Optional)
              </label>
              <textarea
                className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm text-gray-900 focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none dark:bg-dark-card dark:border-dark-border dark:text-gray-100 transition-all duration-200 shadow-sm"
                rows={3}
                placeholder="Briefly describe what this project is for..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
            <div className="pt-6 flex justify-end gap-3 border-t border-gray-100 dark:border-gray-800 mt-2">
              <Button type="button" variant="ghost" onClick={closeCreateModal}>
                Cancel
              </Button>
              <Button type="submit" isLoading={isCreating} className="shadow-md hover:shadow-lg transition-all">
                Create Project
              </Button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
};

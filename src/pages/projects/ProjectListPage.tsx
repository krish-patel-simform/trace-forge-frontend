import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProjects } from '../../contexts/ProjectContext';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Modal } from '../../components/ui/Modal';
import { Input } from '../../components/ui/Input';
import { Plus, Globe, Calendar, ArrowRight, Key } from 'lucide-react';

export const ProjectListPage: React.FC = () => {
  const { projects, loading, createProject, setActiveProject } = useProjects();
  const navigate = useNavigate();
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [name, setName] = useState('');
  const [websiteUrl, setWebsiteUrl] = useState('');
  const [description, setDescription] = useState('');
  
  // For showing the API key after creation
  const [newApiKey, setNewApiKey] = useState<string | null>(null);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsCreating(true);
    try {
      const { apiKey } = await createProject({ name, websiteUrl, description });
      setNewApiKey(apiKey);
      setName('');
      setWebsiteUrl('');
      setDescription('');
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

  const goToProject = (project: any) => {
    setActiveProject(project);
    navigate(`/projects/${project._id}/settings`);
  };

  if (loading) {
    return <div className="flex justify-center mt-20"><div className="w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div></div>;
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold">Your Projects</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Manage your analytics properties</p>
        </div>
        <Button onClick={() => setIsModalOpen(true)}>
          <Plus className="w-4 h-4 mr-2" />
          New Project
        </Button>
      </div>

      {projects.length === 0 ? (
        <Card className="p-12 text-center border-dashed">
          <div className="w-16 h-16 bg-primary-50 dark:bg-primary-900/20 text-primary-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <Globe className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-medium mb-2">No projects yet</h3>
          <p className="text-gray-500 dark:text-gray-400 mb-6 max-w-sm mx-auto">
            Create your first project to get an API key and start tracking analytics for your website.
          </p>
          <Button onClick={() => setIsModalOpen(true)}>Create First Project</Button>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map(project => (
            <Card key={project._id} className="group hover:shadow-md transition-shadow cursor-pointer" >
              <div className="p-6" onClick={() => goToProject(project)}>
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-lg font-semibold truncate pr-4">{project.name}</h3>
                  <div className="p-1.5 bg-gray-100 dark:bg-dark-border rounded-lg text-gray-500 group-hover:bg-primary-50 group-hover:text-primary-600 transition-colors">
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
                
                <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2 mb-4 h-10">
                  {project.description || 'No description provided'}
                </p>
                
                <div className="space-y-2 text-xs text-gray-500 dark:text-gray-400">
                  <div className="flex items-center gap-2">
                    <Globe className="w-3.5 h-3.5" />
                    <span className="truncate">{project.websiteUrl}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>Created {new Date(project.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      <Modal isOpen={isModalOpen} onClose={closeCreateModal} title={newApiKey ? "Project Created!" : "Create New Project"}>
        {newApiKey ? (
          <div className="space-y-6">
            <div className="bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 p-4 rounded-lg flex gap-3">
              <Key className="w-5 h-5 shrink-0" />
              <div className="text-sm">
                <p className="font-semibold mb-1">Here is your API Key</p>
                <p>Please copy this key now. For security reasons, you won't be able to see it again.</p>
              </div>
            </div>
            
            <div className="bg-gray-100 dark:bg-dark-border p-3 rounded-lg font-mono text-sm break-all">
              {newApiKey}
            </div>
            
            <Button className="w-full" onClick={() => {
              navigator.clipboard.writeText(newApiKey);
              // Simple alert for now
              alert('API Key copied to clipboard!');
            }}>
              Copy to Clipboard
            </Button>
            
            <Button variant="ghost" className="w-full" onClick={closeCreateModal}>
              Done
            </Button>
          </div>
        ) : (
          <form onSubmit={handleCreate} className="space-y-4">
            <Input 
              label="Project Name" 
              placeholder="e.g. Production Website" 
              value={name}
              onChange={e => setName(e.target.value)}
              required
            />
            <Input 
              label="Website URL" 
              type="url"
              placeholder="https://example.com" 
              value={websiteUrl}
              onChange={e => setWebsiteUrl(e.target.value)}
              required
            />
            <div className="flex flex-col space-y-1">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Description (Optional)</label>
              <textarea 
                className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm text-gray-900 focus:ring-2 focus:ring-primary-500 outline-none dark:bg-dark-card dark:border-dark-border dark:text-gray-100"
                rows={3}
                value={description}
                onChange={e => setDescription(e.target.value)}
              />
            </div>
            <div className="pt-4 flex justify-end gap-3">
              <Button type="button" variant="ghost" onClick={closeCreateModal}>Cancel</Button>
              <Button type="submit" isLoading={isCreating}>Create Project</Button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
};

import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useProjects } from '../../contexts/ProjectContext';
import { apiClient } from '../../api/client';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Key, Copy, AlertTriangle, RefreshCw, Trash2 } from 'lucide-react';

export const ProjectSettingsPage: React.FC = () => {
  const { id } = useParams();
  const { projects, setProjects } = useProjects() as any; // any to bypass strict type for now as we just need basic function
  
  const project = projects.find((p: any) => p._id === id);
  
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [newApiKey, setNewApiKey] = useState<string | null>(null);

  if (!project) {
    return <div>Project not found</div>;
  }

  const handleRegenerateKey = async () => {
    if (!window.confirm("Are you sure? The old API key will stop working immediately.")) return;
    
    setIsRegenerating(true);
    try {
      const res = await apiClient.post(`/projects/${id}/regenerate-key`);
      setNewApiKey(res.data.data.apiKey);
      // Update prefix in local state (would be better to call fetchProjects, but this is quicker)
      const updatedProject = { ...project, apiKeyPrefix: res.data.data.project.apiKeyPrefix };
      if (setProjects) {
        setProjects((prev: any) => prev.map((p: any) => p._id === id ? updatedProject : p));
      }
    } catch (error) {
      console.error(error);
      alert("Failed to regenerate key");
    } finally {
      setIsRegenerating(false);
    }
  };

  const copyKey = (text: string) => {
    navigator.clipboard.writeText(text);
    alert('Copied to clipboard!');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Project Settings</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">Manage configuration and credentials for {project.name}</p>
      </div>

      <Card className="p-6">
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Key className="w-5 h-5 text-gray-500" />
          API Key Authentication
        </h2>
        
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
          This key is required to authenticate requests from your SDK to the TraceForge ingestion API.
        </p>

        {newApiKey ? (
          <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4 mb-6">
            <h3 className="text-green-800 dark:text-green-400 font-medium flex items-center gap-2 mb-2">
              <AlertTriangle className="w-4 h-4" />
              New API Key Generated
            </h3>
            <p className="text-sm text-green-700 dark:text-green-500 mb-4">
              Please copy this key immediately. You will not be able to see it again.
            </p>
            <div className="flex items-center gap-3">
              <code className="flex-1 bg-white dark:bg-dark-card p-3 rounded border border-green-200 dark:border-green-800 text-sm font-mono break-all">
                {newApiKey}
              </code>
              <Button onClick={() => copyKey(newApiKey)} variant="secondary">
                <Copy className="w-4 h-4 mr-2" />
                Copy
              </Button>
            </div>
            <div className="mt-4 pt-4 border-t border-green-200/50 dark:border-green-800/50 flex justify-end">
              <Button variant="ghost" onClick={() => setNewApiKey(null)} className="text-green-700 dark:text-green-400">
                I have copied it
              </Button>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <label className="block text-xs font-medium text-gray-500 mb-1">Current Key Prefix</label>
              <div className="bg-gray-50 dark:bg-dark-border px-4 py-3 rounded-lg font-mono text-sm border border-gray-200 dark:border-gray-700 flex items-center justify-between">
                <span>{project.apiKeyPrefix}••••••••••••••••••••••••</span>
                <span className="text-xs bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded text-gray-600 dark:text-gray-300">Hidden for security</span>
              </div>
            </div>
            <div className="pt-5">
              <Button onClick={handleRegenerateKey} variant="secondary" isLoading={isRegenerating}>
                <RefreshCw className="w-4 h-4 mr-2" />
                Regenerate
              </Button>
            </div>
          </div>
        )}
      </Card>
      
      <Card className="p-6 border-red-200 dark:border-red-900/30">
        <h2 className="text-lg font-semibold text-red-600 dark:text-red-400 mb-2 flex items-center gap-2">
          <Trash2 className="w-5 h-5" />
          Danger Zone
        </h2>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
          Deleting a project is irreversible. All associated analytics data will be permanently deleted.
        </p>
        <Button variant="danger" disabled>
          Delete Project
        </Button>
      </Card>
    </div>
  );
};

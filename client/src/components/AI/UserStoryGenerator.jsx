import React, { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { Sparkles, Copy, Download } from 'lucide-react';

import { generateUserStories } from '../../services/aiService';
import { getAllProjects } from '../../services/projectService';

const UserStoryGenerator = () => {
  const [projectDescription, setProjectDescription] = useState('');
  const [selectedProject, setSelectedProject] = useState('');
  const [generatedStories, setGeneratedStories] = useState([]);

  const { data: projects = [] } = useQuery({
    queryKey: ['projects'],
    queryFn: getAllProjects,
  });

  const generateMutation = useMutation({
    mutationFn: generateUserStories,
    onSuccess: (data) => {
      setGeneratedStories(data.userStories);
      toast.success(`Generated ${data.count} user stories!`);
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to generate user stories');
    },
  });

  const handleGenerate = () => {
    if (!projectDescription.trim()) {
      toast.error('Please enter a project description');
      return;
    }

    generateMutation.mutate({
      projectDescription: projectDescription.trim(),
      projectId: selectedProject || undefined,
    });
  };

  const copyStory = (story) => {
    navigator.clipboard.writeText(story);
    toast.success('Story copied to clipboard');
  };

  const exportStories = () => {
    const content = generatedStories.join('\n\n');
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'user-stories.txt';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center gap-3 mb-6">
          <Sparkles className="w-8 h-8 text-purple-600" />
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              AI User Story Generator
            </h1>
            <p className="text-gray-600">
              Generate detailed user stories from project descriptions using AI
            </p>
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Link to Project (Optional)
            </label>
            <select
              value={selectedProject}
              onChange={(e) => setSelectedProject(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="">Select a project to save stories</option>
              {projects.map((project) => (
                <option key={project.id} value={project.id}>
                  {project.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Project Description *
            </label>
            <textarea
              value={projectDescription}
              onChange={(e) => setProjectDescription(e.target.value)}
              placeholder="Describe your project in detail. For example: 'An ecommerce website where customers can browse products, add to cart, and make payments online. Admin should manage products and view orders.'"
              rows={6}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          <button
            onClick={handleGenerate}
            disabled={generateMutation.isLoading}
            className="bg-purple-600 text-white px-6 py-3 rounded-md hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            <Sparkles className="w-5 h-5" />
            {generateMutation.isLoading ? 'Generating...' : 'Generate User Stories'}
          </button>

          {generatedStories.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-900">
                  Generated User Stories ({generatedStories.length})
                </h2>
                <button
                  onClick={exportStories}
                  className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
                >
                  <Download className="w-4 h-4" />
                  Export
                </button>
              </div>

              <div className="space-y-3">
                {generatedStories.map((story, index) => (
                  <div
                    key={index}
                    className="bg-gray-50 p-4 rounded-md border border-gray-200"
                  >
                    <div className="flex items-start justify-between">
                      <p className="text-gray-800 flex-1">{story}</p>
                      <button
                        onClick={() => copyStory(story)}
                        className="ml-3 p-1 text-gray-500 hover:text-gray-700"
                        title="Copy story"
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserStoryGenerator;

import api from './api';

export const generateUserStories = async ({ projectDescription, projectId }) => {
  const response = await api.post('/ai/generate-user-stories', {
    projectDescription,
    projectId
  });
  return response.data;
};

export const getUserStoriesForProject = async (projectId) => {
  const response = await api.get(`/ai/user-stories/${projectId}`);
  return response.data.userStories;
};

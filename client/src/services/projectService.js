import api from './api';

export const getAllProjects = async () => {
  const response = await api.get('/projects');
  return response.data.projects; 
};

export const getProjectById = async (id) => {
  const response = await api.get(`/projects/${id}`);
  return response.data;
};

export const createProject = async (projectData) => {
  const response = await api.post('/projects', projectData);
  return response.data;
};

export const updateProject = async (id, projectData) => {
  const response = await api.put(`/projects/${id}`, projectData);
  return response.data;
};

export const deleteProject = async (id) => {
  const response = await api.delete(`/projects/${id}`);
  return response.data;
};

export const getProjectStats = async () => {
  const response = await api.get('/projects/stats/overview');
  return response.data.stats; 
};

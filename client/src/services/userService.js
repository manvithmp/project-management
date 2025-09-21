import api from './api';

export const getAllUsers = async () => {
  const response = await api.get('/users');
  return response.data.users;
};

export const createUser = async (userData) => {
  const response = await api.post('/users', userData);
  return response.data;
};

export const updateUser = async (id, userData) => {
  const response = await api.put(`/users/${id}`, userData);
  return response.data;
};

export const deleteUser = async (id) => {
  const response = await api.delete(`/users/${id}`);
  return response.data;
};

export const generateUserStories = async (data) => {
  const response = await api.post('/ai/generate-user-stories', data);
  return response.data;
};

export const getProjectUserStories = async (projectId) => {
  const response = await api.get(`/ai/user-stories/${projectId}`);
  return response.data;
};

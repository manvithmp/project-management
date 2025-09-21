import api from './api';

export const authService = {
  async login(email, password) {
    try {
      console.log('🔐 Attempting login with:', { email });
      const response = await api.post('/auth/login', { email, password });
      console.log('✅ Login response:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Login error:', error.response?.data);
      throw error;
    }
  },

  async register(userData) {
    try {
      console.log('📝 Attempting registration with:', userData);
      const response = await api.post('/auth/register', userData);
      console.log('✅ Registration response:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Registration error:', error.response?.data);
      throw error;
    }
  },

  async getProfile() {
    const response = await api.get('/auth/profile');
    return response.data;
  },

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  getCurrentUser() {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  },

  getToken() {
    return localStorage.getItem('token');
  }
};

export default authService;

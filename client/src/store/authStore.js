import { create } from 'zustand';
import api from '../services/api';

export const useAuthStore = create((set, get) => ({
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: true,

  initialize: () => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('agentflow_token');
      const userStr = localStorage.getItem('agentflow_user');
      if (token && userStr) {
        try {
          const user = JSON.parse(userStr);
          set({ user, token, isAuthenticated: true, isLoading: false });
          return;
        } catch (e) {
          localStorage.removeItem('agentflow_token');
          localStorage.removeItem('agentflow_user');
        }
      }
      set({ user: null, token: null, isAuthenticated: false, isLoading: false });
    }
  },

  login: async (email, password) => {
    set({ isLoading: true });
    try {
      const response = await api.post('/auth/login', { email, password });
      const { user, token } = response.data.data;

      localStorage.setItem('agentflow_token', token);
      localStorage.setItem('agentflow_user', JSON.stringify(user));

      set({ user, token, isAuthenticated: true, isLoading: false });
      return { success: true, user };
    } catch (error) {
      set({ isLoading: false });
      throw new Error(error.response?.data?.message || 'Login failed');
    }
  },

  register: async (name, email, password, role = 'operator') => {
    set({ isLoading: true });
    try {
      const response = await api.post('/auth/register', { name, email, password, role });
      const { user, token } = response.data.data;

      localStorage.setItem('agentflow_token', token);
      localStorage.setItem('agentflow_user', JSON.stringify(user));

      set({ user, token, isAuthenticated: true, isLoading: false });
      return { success: true, user };
    } catch (error) {
      set({ isLoading: false });
      throw new Error(error.response?.data?.message || error.response?.data?.errors?.[0]?.msg || 'Registration failed');
    }
  },

  logout: () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('agentflow_token');
      localStorage.removeItem('agentflow_user');
    }
    set({ user: null, token: null, isAuthenticated: false, isLoading: false });
  },

  fetchMe: async () => {
    try {
      const response = await api.get('/auth/me');
      const user = response.data.data;
      localStorage.setItem('agentflow_user', JSON.stringify(user));
      set({ user, isAuthenticated: true });
      return user;
    } catch (error) {
      get().logout();
    }
  },
}));

import { apiRequest } from './api.js';
import { STORAGE_KEYS } from '../utils/constants.js';

export const authService = {
  async login(email, password) {
    try {
      const response = await apiRequest('/auth/login', {
        method: 'POST',
        body: { email, password }
      });
      
      if (response.accessToken) {
        localStorage.setItem(STORAGE_KEYS.TOKEN, response.accessToken);
        return { success: true, token: response.accessToken };
      }
      
      return { success: false, error: 'Invalid response format' };
    } catch (error) {
      return { 
        success: false, 
        error: error.message || 'Login failed' 
      };
    }
  },

  async register(userData) {
    try {
      await apiRequest('/auth/register', {
        method: 'POST',
        body: userData
      });
      
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        error: error.message || 'Registration failed' 
      };
    }
  },

  async getCurrentUser() {
    try {
      const user = await apiRequest('/users/me');
      return { success: true, user };
    } catch (error) {
      return { 
        success: false, 
        error: error.message || 'Failed to fetch user' 
      };
    }
  },

  logout() {
    localStorage.removeItem(STORAGE_KEYS.TOKEN);
    localStorage.removeItem(STORAGE_KEYS.USER);
  },

  getToken() {
    return localStorage.getItem(STORAGE_KEYS.TOKEN);
  },

  isAuthenticated() {
    return !!this.getToken();
  }
};
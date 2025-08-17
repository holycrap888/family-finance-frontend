import { apiRequest } from './api.js';

export const userService = {
  async updateSettings(settings) {
    try {
      const response = await apiRequest('/users/settings', {
        method: 'PUT',
        body: { settings }
      });
      return { success: true, data: response };
    } catch (error) {
      return { 
        success: false, 
        error: error.message || 'Failed to update settings' 
      };
    }
  },

  async getUser(userId) {
    try {
      const user = await apiRequest(`/users/${userId}`);
      return { success: true, data: user };
    } catch (error) {
      return { 
        success: false, 
        error: error.message || 'Failed to fetch user' 
      };
    }
  }
};
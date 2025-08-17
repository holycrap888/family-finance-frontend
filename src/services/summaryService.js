import { apiRequest } from './api.js';

export const summaryService = {
  async getSummary(month) {
    try {
      const params = month ? `?month=${month}` : '';
      const summary = await apiRequest(`/summary${params}`);
      return { success: true, data: summary };
    } catch (error) {
      return { 
        success: false, 
        error: error.message || 'Failed to fetch summary' 
      };
    }
  },

  async getChartData(month) {
    try {
      const params = month ? `?month=${month}` : '';
      const chartData = await apiRequest(`/summary/chart${params}`);
      return { success: true, data: chartData };
    } catch (error) {
      return { 
        success: false, 
        error: error.message || 'Failed to fetch chart data' 
      };
    }
  }
};
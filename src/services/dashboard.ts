import api from './api';

export const dashboardService = {
  getRecentTransactions: async () => {
    const response = await api.get('/fees/transactions/recent');
    return response.data;
  },
  getRecentActivities: async () => {
    const response = await api.get('/audit/logs/recent');
    return response.data;
  },
};
import { useQuery } from 'react-query';
import { dashboardService, AdminDashboardData } from '../services/dashboard';
import { useSelector } from 'react-redux';
import { RootState } from '../store';

export const useAdminDashboard = () => {
  const { token, isAuthenticated } = useSelector((state: RootState) => state.auth);
  
  return useQuery<AdminDashboardData>(
    'adminDashboard',
    () => dashboardService.getAdminDashboard(),
    {
      enabled: !!token && isAuthenticated,
      staleTime: 5 * 60 * 1000, // 5 minutes
      cacheTime: 10 * 60 * 1000, // 10 minutes
      refetchOnWindowFocus: true,
      refetchInterval: 5 * 60 * 1000, // Refetch every 5 minutes
      retry: 3,
      onError: (error) => {
        console.error('Failed to fetch admin dashboard data:', error);
      },
    }
  );
};

// Legacy hook for the Material-UI AdminDashboard component
export const useDashboard = () => {
  // Return mock data for now since this component expects a different interface
  return {
    recentTransactions: { data: [] },
    isTransactionsLoading: false,
    recentActivities: { data: [] },
    isActivitiesLoading: false,
  };
};
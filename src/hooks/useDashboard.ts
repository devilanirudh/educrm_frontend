import { useQuery } from 'react-query';
import { dashboardService } from '../services/dashboard';

export const useDashboard = () => {
  const { data: recentTransactions, isLoading: isTransactionsLoading } = useQuery(
    'recentTransactions',
    dashboardService.getRecentTransactions
  );

  const { data: recentActivities, isLoading: isActivitiesLoading } = useQuery(
    'recentActivities',
    dashboardService.getRecentActivities
  );

  return {
    recentTransactions,
    isTransactionsLoading,
    recentActivities,
    isActivitiesLoading,
  };
};
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { notificationsService, NotificationFilters } from '../services/notifications';
import { useSelector } from 'react-redux';
import { RootState } from '../store';

export const useNotifications = (params?: NotificationFilters) => {
  const { token, isAuthenticated } = useSelector((state: RootState) => state.auth);
  
  return useQuery(
    ['notifications', params],
    () => notificationsService.getUserNotifications(params),
    {
      enabled: !!token && isAuthenticated, // Only run if user is authenticated and token exists
      staleTime: 5 * 60 * 1000, // 5 minutes
      cacheTime: 30 * 60 * 1000, // 30 minutes
      refetchOnWindowFocus: false,
      retry: false, // Don't retry failed requests
      onError: (error) => {
        console.log('🔔 Notifications API not available, using empty list');
      },
    }
  );
};

export const useUnreadNotifications = () => {
  const { token, isAuthenticated } = useSelector((state: RootState) => state.auth);
  
  return useQuery(
    ['notifications', 'unread'],
    () => notificationsService.getUserNotifications({ unread_only: true }),
    {
      enabled: !!token && isAuthenticated, // Only run if user is authenticated and token exists
      staleTime: 2 * 60 * 1000, // 2 minutes
      cacheTime: 10 * 60 * 1000, // 10 minutes
      refetchOnWindowFocus: true,
    }
  );
};

export const useUnreadCount = () => {
  const { token, isAuthenticated } = useSelector((state: RootState) => state.auth);
  
  // Debug log to see authentication state
  console.log('🔐 Auth state in useUnreadCount:', { token: !!token, isAuthenticated, tokenLength: token?.length });
  
  return useQuery(
    ['notifications', 'unread-count'],
    () => notificationsService.getUnreadCount(),
    {
      enabled: !!token && isAuthenticated, // Only run if user is authenticated and token exists
      staleTime: 1 * 60 * 1000, // 1 minute
      cacheTime: 5 * 60 * 1000, // 5 minutes
      refetchOnWindowFocus: true,
      refetchInterval: 30 * 1000, // Refetch every 30 seconds
      retry: false, // Don't retry failed requests
      onError: (error) => {
        console.log('🔔 Notifications API not available, using fallback count');
      },
    }
  );
};

export const useMarkNotificationAsRead = () => {
  const queryClient = useQueryClient();
  
  return useMutation(
    (id: number) => notificationsService.markAsRead(id),
    {
      onSuccess: () => {
        // Invalidate and refetch notifications
        queryClient.invalidateQueries(['notifications']);
        queryClient.invalidateQueries(['notifications', 'unread-count']);
      },
    }
  );
};

export const useMarkAllNotificationsAsRead = () => {
  const queryClient = useQueryClient();
  
  return useMutation(
    () => notificationsService.markAllAsRead(),
    {
      onSuccess: () => {
        // Invalidate and refetch notifications
        queryClient.invalidateQueries(['notifications']);
        queryClient.invalidateQueries(['notifications', 'unread-count']);
      },
    }
  );
};

export const useDeleteNotification = () => {
  const queryClient = useQueryClient();
  
  return useMutation(
    (id: number) => notificationsService.deleteNotification(id),
    {
      onSuccess: () => {
        // Invalidate and refetch notifications
        queryClient.invalidateQueries(['notifications']);
        queryClient.invalidateQueries(['notifications', 'unread-count']);
      },
    }
  );
};

export const useCreateNotification = () => {
  const queryClient = useQueryClient();
  
  return useMutation(
    (data: any) => notificationsService.createNotification(data),
    {
      onSuccess: () => {
        // Invalidate and refetch notifications
        queryClient.invalidateQueries(['notifications']);
        queryClient.invalidateQueries(['notifications', 'unread-count']);
      },
    }
  );
};

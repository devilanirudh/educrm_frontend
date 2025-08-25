import api from './api';
import { NotificationPayload } from '../types/api';

export interface NotificationFilters {
  unread_only?: boolean;
  limit?: number;
  offset?: number;
  notification_type?: string;
}

export interface NotificationCreateRequest {
  user_id: number;
  title: string;
  message: string;
  notification_type: 'info' | 'warning' | 'error' | 'success' | 'reminder';
  action_url?: string;
  action_text?: string;
  data?: Record<string, any>;
  channels?: string[];
  priority?: 'low' | 'normal' | 'high' | 'urgent';
  scheduled_at?: string;
  source_type?: string;
  source_id?: number;
}

const notificationsService = {
  // Get user notifications
  getUserNotifications: async (params?: NotificationFilters): Promise<NotificationPayload[]> => {
    const queryParams = new URLSearchParams();
    if (params?.unread_only) queryParams.append('unread_only', 'true');
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.offset) queryParams.append('offset', params.offset.toString());
    if (params?.notification_type) queryParams.append('notification_type', params.notification_type);
    
    const url = `/communication/notifications${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    console.log('🔔 Fetching notifications from:', url);
    const response = await api.get<NotificationPayload[]>(url);
    console.log('🔔 Notifications response:', response.data);
    return response.data;
  },

  // Get notification by ID
  getNotification: async (id: number): Promise<NotificationPayload> => {
    const response = await api.get<NotificationPayload>(`/communication/notifications/${id}`);
    return response.data;
  },

  // Mark notification as read
  markAsRead: async (id: number): Promise<void> => {
    const response = await api.put(`/communication/notifications/${id}/read`);
    return response.data;
  },

  // Mark all notifications as read
  markAllAsRead: async (): Promise<void> => {
    const response = await api.put('/communication/notifications/read-all');
    return response.data;
  },

  // Delete notification
  deleteNotification: async (id: number): Promise<void> => {
    const response = await api.delete(`/communication/notifications/${id}`);
    return response.data;
  },

  // Get unread count
  getUnreadCount: async (): Promise<{ count: number }> => {
    const response = await api.get<{ count: number }>('/communication/notifications/unread-count');
    return response.data;
  },

  // Create notification (admin only)
  createNotification: async (data: NotificationCreateRequest): Promise<NotificationPayload> => {
    const response = await api.post<NotificationPayload>('/communication/notifications', data);
    return response.data;
  },

  // Send notification to multiple users
  sendBulkNotification: async (data: {
    user_ids: number[];
    title: string;
    message: string;
    notification_type: 'info' | 'warning' | 'error' | 'success' | 'reminder';
    action_url?: string;
    action_text?: string;
    data?: Record<string, any>;
    channels?: string[];
    priority?: 'low' | 'normal' | 'high' | 'urgent';
  }): Promise<{ success_count: number; failed_count: number }> => {
    const response = await api.post('/communication/notifications/bulk', data);
    return response.data;
  },
};

export { notificationsService };

import React, { useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  BellIcon,
  XMarkIcon,
  TrashIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
  CheckCircleIcon,
  ClockIcon,
} from '@heroicons/react/24/outline';
import { useUnreadCount, useNotifications, useMarkNotificationAsRead, useMarkAllNotificationsAsRead, useDeleteNotification } from '../../hooks/useNotifications';
import { NotificationPayload } from '../../types/api';

interface NotificationsDropdownProps {
  isOpen: boolean;
  onClose: () => void;
}

const NotificationsDropdown: React.FC<NotificationsDropdownProps> = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const dropdownRef = useRef<HTMLDivElement>(null);
  

  
  // Hooks
  const { data: unreadCount = { count: 0 } } = useUnreadCount();
  const { data: notifications = [], isLoading, error } = useNotifications({ limit: 10 });
  const markAsRead = useMarkNotificationAsRead();
  const markAllAsRead = useMarkAllNotificationsAsRead();
  const deleteNotification = useDeleteNotification();



  // Use real notifications from API
  const displayNotifications = notifications;

  // Click outside to close
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  // Handle notification click
  const handleNotificationClick = (notification: NotificationPayload) => {
    // Mark as read
    if (!notification.is_read) {
      markAsRead.mutate(notification.id);
    }

    // Navigate to action URL if available
    if (notification.action_url) {
      navigate(notification.action_url);
    }

    onClose();
  };

  // Handle mark all as read
  const handleMarkAllAsRead = () => {
    markAllAsRead.mutate();
  };

  // Handle delete notification
  const handleDeleteNotification = (e: React.MouseEvent, notificationId: number) => {
    e.stopPropagation();
    deleteNotification.mutate(notificationId);
  };

  // Get notification icon based on type
  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <CheckCircleIcon className="w-5 h-5 text-success-600" />;
      case 'warning':
        return <ExclamationTriangleIcon className="w-5 h-5 text-warning-600" />;
      case 'error':
        return <ExclamationTriangleIcon className="w-5 h-5 text-error-600" />;
      case 'reminder':
        return <ClockIcon className="w-5 h-5 text-info-600" />;
      default:
        return <InformationCircleIcon className="w-5 h-5 text-brand-600" />;
    }
  };

  // Format time ago
  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)}d ago`;
    return date.toLocaleDateString();
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex justify-end pt-16">
      <div className="fixed inset-0 bg-black bg-opacity-25" onClick={onClose} />
      <div
        ref={dropdownRef}
        className="relative w-96 max-h-96 bg-white rounded-2xl shadow-strong border border-surface-200 overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-surface-200">
          <h3 className="text-lg font-semibold text-surface-900">Notifications</h3>
          <div className="flex items-center gap-2">
            {unreadCount.count > 0 && (
              <button
                onClick={handleMarkAllAsRead}
                disabled={markAllAsRead.isLoading}
                className="text-sm text-brand-600 hover:text-brand-700 font-medium disabled:opacity-50"
              >
                {markAllAsRead.isLoading ? 'Marking...' : 'Mark all read'}
              </button>
            )}
            <button
              onClick={onClose}
              className="text-surface-400 hover:text-surface-600"
            >
              <XMarkIcon className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="max-h-80 overflow-y-auto">
          {isLoading ? (
            <div className="p-4 text-center">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-brand-600 mx-auto"></div>
              <p className="text-surface-500 mt-2">Loading notifications...</p>
            </div>
          ) : error ? (
            <div className="p-4 text-center">
              <p className="text-error-600">Failed to load notifications</p>
            </div>
          ) : displayNotifications.length === 0 ? (
            <div className="p-8 text-center">
              <BellIcon className="w-12 h-12 text-surface-300 mx-auto mb-3" />
              <p className="text-surface-500">No notifications yet</p>
              <p className="text-sm text-surface-400 mt-1">You're all caught up!</p>
            </div>
          ) : (
            <div className="divide-y divide-surface-100">
              {displayNotifications.map((notification) => (
                <div
                  key={notification.id}
                  onClick={() => handleNotificationClick(notification)}
                  className={`p-4 hover:bg-surface-50 cursor-pointer transition-colors duration-200 ${
                    !notification.is_read ? 'bg-surface-25' : ''
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 mt-0.5">
                      {getNotificationIcon(notification.notification_type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <p className={`text-sm font-medium ${
                            !notification.is_read ? 'text-surface-900' : 'text-surface-700'
                          }`}>
                            {notification.title}
                          </p>
                          <p className="text-sm text-surface-600 mt-1 line-clamp-2">
                            {notification.message}
                          </p>
                          <div className="flex items-center justify-between mt-2">
                            <p className="text-xs text-surface-400">
                              {formatTimeAgo(notification.created_at)}
                            </p>
                            {notification.action_text && (
                              <span className="text-xs text-brand-600 font-medium">
                                {notification.action_text}
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-1 ml-2">
                          {!notification.is_read && (
                            <div className="w-2 h-2 bg-brand-600 rounded-full"></div>
                          )}
                          <button
                            onClick={(e) => handleDeleteNotification(e, notification.id)}
                            disabled={deleteNotification.isLoading}
                            className="text-surface-400 hover:text-error-600 p-1 rounded transition-colors duration-200"
                          >
                            <TrashIcon className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-surface-200 bg-surface-25">
          <button
            onClick={() => {
              navigate('/notifications');
              onClose();
            }}
            className="w-full text-sm text-brand-600 hover:text-brand-700 font-medium"
          >
            View all notifications
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotificationsDropdown;

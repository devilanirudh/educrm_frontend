import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  BellIcon, 
  MagnifyingGlassIcon, 
  FunnelIcon,
  CheckIcon,
  TrashIcon,
  XMarkIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
  CheckCircleIcon,
  ClockIcon
} from '@heroicons/react/24/outline';
import { useNotifications, useMarkNotificationAsRead, useMarkAllNotificationsAsRead, useDeleteNotification } from '../../hooks/useNotifications';

const NotificationsPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [showFilters, setShowFilters] = useState(false);

  // Hooks
  const { data: notifications = [], isLoading, error } = useNotifications({ limit: 50 });
  const markAsRead = useMarkNotificationAsRead();
  const markAllAsRead = useMarkAllNotificationsAsRead();
  const deleteNotification = useDeleteNotification();

  // Use real notifications from API
  const displayNotifications = notifications;

  // Filtered notifications
  const filteredNotifications = useMemo(() => {
    let filtered = [...displayNotifications];

    // Filter by type
    if (filterType !== 'all') {
      filtered = filtered.filter((notification: any) => notification.notification_type === filterType);
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter((notification: any) =>
        notification.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        notification.message.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    return filtered;
  }, [displayNotifications, filterType, searchTerm]);

  // Event handlers
  const handleNotificationClick = (notification: any) => {
    if (!notification.is_read) {
      markAsRead.mutate(notification.id);
    }
    
    if (notification.action_url) {
      navigate(notification.action_url);
    }
  };

  const handleMarkAllRead = () => {
    markAllAsRead.mutate();
  };

  const handleDeleteNotification = (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    deleteNotification.mutate(id);
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <CheckCircleIcon className="w-5 h-5 text-green-500" />;
      case 'warning':
        return <ExclamationTriangleIcon className="w-5 h-5 text-yellow-500" />;
      case 'error':
        return <ExclamationTriangleIcon className="w-5 h-5 text-red-500" />;
      case 'info':
        return <InformationCircleIcon className="w-5 h-5 text-blue-500" />;
      case 'reminder':
        return <ClockIcon className="w-5 h-5 text-purple-500" />;
      default:
        return <BellIcon className="w-5 h-5 text-gray-500" />;
    }
  };

  const getNotificationBadge = (type: string) => {
    const baseClasses = "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium";
    switch (type) {
      case 'success':
        return `${baseClasses} bg-green-100 text-green-800`;
      case 'warning':
        return `${baseClasses} bg-yellow-100 text-yellow-800`;
      case 'error':
        return `${baseClasses} bg-red-100 text-red-800`;
      case 'info':
        return `${baseClasses} bg-blue-100 text-blue-800`;
      case 'reminder':
        return `${baseClasses} bg-purple-100 text-purple-800`;
      default:
        return `${baseClasses} bg-gray-100 text-gray-800`;
    }
  };

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

  const unreadCount = filteredNotifications.filter(n => !n.is_read).length;

  return (
    <div className="min-h-screen bg-surface-50">
      {/* Header */}
      <div className="bg-white border-b border-surface-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <button
                onClick={() => navigate(-1)}
                className="p-2 text-surface-500 rounded-md hover:bg-surface-100 mr-4"
              >
                <XMarkIcon className="w-5 h-5" />
              </button>
              <div>
                <h1 className="text-xl font-semibold text-surface-900">Notifications</h1>
                <p className="text-sm text-surface-500">
                  {filteredNotifications.length} notification{filteredNotifications.length !== 1 ? 's' : ''}
                  {unreadCount > 0 && ` • ${unreadCount} unread`}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              {unreadCount > 0 && (
                <button
                  onClick={handleMarkAllRead}
                  disabled={markAllAsRead.isLoading}
                  className="inline-flex items-center px-3 py-2 border border-surface-300 rounded-md text-sm font-medium text-surface-700 bg-white hover:bg-surface-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-500 disabled:opacity-50"
                >
                  <CheckIcon className="w-4 h-4 mr-2" />
                  Mark all read
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white border-b border-surface-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-surface-400" />
                <input
                  type="text"
                  placeholder="Search notifications..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-surface-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
                />
              </div>
            </div>

            {/* Filter Toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="inline-flex items-center px-4 py-2 border border-surface-300 rounded-lg text-sm font-medium text-surface-700 bg-white hover:bg-surface-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-500"
            >
              <FunnelIcon className="w-4 h-4 mr-2" />
              Filter
            </button>
          </div>

          {/* Filter Options */}
          {showFilters && (
            <div className="mt-4 pt-4 border-t border-surface-200">
              <div className="flex flex-wrap gap-2">
                {['all', 'success', 'warning', 'error', 'info', 'reminder'].map((type) => (
                  <button
                    key={type}
                    onClick={() => setFilterType(type)}
                    className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                      filterType === type
                        ? 'bg-brand-100 text-brand-800'
                        : 'bg-surface-100 text-surface-700 hover:bg-surface-200'
                    }`}
                  >
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Notifications List */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {isLoading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-500 mx-auto"></div>
            <p className="mt-2 text-surface-500">Loading notifications...</p>
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <ExclamationTriangleIcon className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
            <p className="text-surface-500">Failed to load notifications. Showing demo data.</p>
          </div>
        ) : filteredNotifications.length === 0 ? (
          <div className="text-center py-12">
            <BellIcon className="w-12 h-12 text-surface-300 mx-auto mb-4" />
            <p className="text-surface-500">No notifications found</p>
            <p className="text-sm text-surface-400 mt-1">Try adjusting your search or filters</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredNotifications.map((notification) => (
              <div
                key={notification.id}
                onClick={() => handleNotificationClick(notification)}
                className={`bg-white rounded-lg border border-surface-200 p-4 cursor-pointer transition-all duration-200 hover:shadow-md ${
                  !notification.is_read ? 'ring-2 ring-brand-500 ring-opacity-20 bg-brand-50' : ''
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3 flex-1">
                    <div className="flex-shrink-0 mt-1">
                      {getNotificationIcon(notification.notification_type)}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-1">
                        <h3 className="text-sm font-medium text-surface-900 truncate">
                          {notification.title}
                        </h3>
                        <span className={getNotificationBadge(notification.notification_type)}>
                          {notification.notification_type}
                        </span>
                        {!notification.is_read && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-brand-100 text-brand-800">
                            New
                          </span>
                        )}
                      </div>
                      
                      <p className="text-sm text-surface-600 mb-2 line-clamp-2">
                        {notification.message}
                      </p>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4 text-xs text-surface-500">
                          <span>{formatTimeAgo(notification.created_at)}</span>
                          {notification.priority === 'high' && (
                            <span className="text-red-600 font-medium">High Priority</span>
                          )}
                        </div>
                        
                        {notification.action_text && (
                          <span className="text-xs text-brand-600 font-medium">
                            {notification.action_text} →
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <button
                    onClick={(e) => handleDeleteNotification(notification.id, e)}
                    disabled={deleteNotification.isLoading}
                    className="flex-shrink-0 p-1 text-surface-400 hover:text-red-500 transition-colors duration-200"
                  >
                    <TrashIcon className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationsPage;

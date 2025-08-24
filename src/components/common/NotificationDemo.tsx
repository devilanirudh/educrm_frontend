import React from 'react';
import { useCreateNotification } from '../../hooks/useNotifications';
import { BellIcon } from '@heroicons/react/24/outline';

const NotificationDemo: React.FC = () => {
  const createNotification = useCreateNotification();

  const demoNotifications = [
    {
      title: "Welcome to E-School!",
      message: "Thank you for joining our educational platform. We're excited to have you here!",
      notification_type: "success" as const,
      action_url: "/dashboard",
      action_text: "Go to Dashboard"
    },
    {
      title: "Assignment Due Tomorrow",
      message: "Your Mathematics assignment is due tomorrow. Please submit it on time.",
      notification_type: "reminder" as const,
      action_url: "/assignments",
      action_text: "View Assignment"
    },
    {
      title: "Exam Schedule Updated",
      message: "The mid-term exam schedule has been updated. Please check the new dates.",
      notification_type: "info" as const,
      action_url: "/exams",
      action_text: "View Schedule"
    },
    {
      title: "Fee Payment Overdue",
      message: "Your monthly fee payment is overdue. Please make the payment to avoid any issues.",
      notification_type: "warning" as const,
      action_url: "/fees",
      action_text: "Pay Now"
    },
    {
      title: "System Maintenance",
      message: "The system will be under maintenance tonight from 2 AM to 4 AM. Please save your work.",
      notification_type: "error" as const,
      action_url: "/announcements",
      action_text: "Read More"
    }
  ];

  const handleCreateNotification = async (notification: any) => {
    try {
      await createNotification.mutateAsync({
        user_id: 1, // Demo user ID
        ...notification,
        channels: ["web"]
      });
      alert("Notification created successfully!");
    } catch (error) {
      console.error("Failed to create notification:", error);
      alert("Failed to create notification. Check console for details.");
    }
  };

  return (
    <div className="bg-white rounded-2xl p-6 shadow-soft border border-surface-200">
      <div className="flex items-center gap-2 mb-4">
        <BellIcon className="w-5 h-5 text-brand-600" />
        <h3 className="text-lg font-semibold text-surface-900">Notification Demo</h3>
      </div>
      <p className="text-surface-600 mb-4">
        Click the buttons below to create test notifications. These will appear in your notification dropdown.
      </p>
      
      <div className="space-y-3">
        {demoNotifications.map((notification, index) => (
          <button
            key={index}
            onClick={() => handleCreateNotification(notification)}
            disabled={createNotification.isLoading}
            className={`w-full p-3 rounded-xl border text-left transition-colors duration-200 ${
              notification.notification_type === 'success' 
                ? 'border-success-200 bg-success-50 hover:bg-success-100' :
              notification.notification_type === 'warning' 
                ? 'border-warning-200 bg-warning-50 hover:bg-warning-100' :
              notification.notification_type === 'error' 
                ? 'border-error-200 bg-error-50 hover:bg-error-100' :
              notification.notification_type === 'reminder' 
                ? 'border-info-200 bg-info-50 hover:bg-info-100' :
                'border-surface-200 bg-surface-50 hover:bg-surface-100'
            }`}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h4 className="font-medium text-surface-900">{notification.title}</h4>
                <p className="text-sm text-surface-600 mt-1">{notification.message}</p>
              </div>
              <div className="text-xs text-surface-400 ml-2">
                {notification.notification_type}
              </div>
            </div>
          </button>
        ))}
      </div>
      
      {createNotification.isLoading && (
        <div className="mt-4 p-3 bg-brand-50 border border-brand-200 rounded-xl">
          <div className="flex items-center gap-2">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-brand-600"></div>
            <span className="text-sm text-brand-700">Creating notification...</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationDemo;

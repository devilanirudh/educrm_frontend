import React, { useState } from 'react';
import { 
  useLiveClasses, 
  useStartLiveClass, 
  useEndLiveClass, 
  useJoinLiveClass
} from '../../hooks/useLiveClasses';
import { liveClassesService } from '../../services/liveClasses';
import { useAuth } from '../../hooks/useAuth';
import { LiveClass } from '../../services/liveClasses';
// Simple toast replacement
const toast = {
  success: (message: string) => alert(`Success: ${message}`),
  error: (message: string) => alert(`Error: ${message}`)
};

interface LiveClassListProps {
  title?: string;
  showCreateButton?: boolean;
  onCreateClick?: () => void;
}

const LiveClassList: React.FC<LiveClassListProps> = ({ 
  title = "Live Classes", 
  showCreateButton = false,
  onCreateClick 
}) => {
  const { user } = useAuth();
  const { data: liveClasses, isLoading, error } = useLiveClasses();
  const startLiveClassMutation = useStartLiveClass();
  const endLiveClassMutation = useEndLiveClass();
  const joinLiveClassMutation = useJoinLiveClass();
  const [selectedClass, setSelectedClass] = useState<LiveClass | null>(null);

  // Debug logging
  console.log('🔍 LiveClassList Data:', {
    liveClasses,
    isLoading,
    error,
    userRole: user?.role,
    userId: user?.id
  });

  const handleStartClass = async (liveClass: LiveClass) => {
    try {
      await startLiveClassMutation.mutateAsync(liveClass.id);
      toast.success('Live class started successfully!');
    } catch (error: any) {
      toast.error(error.response?.data?.detail || 'Failed to start live class');
    }
  };

  const handleEndClass = async (liveClass: LiveClass) => {
    try {
      await endLiveClassMutation.mutateAsync(liveClass.id);
      toast.success('Live class ended successfully!');
    } catch (error: any) {
      toast.error(error.response?.data?.detail || 'Failed to end live class');
    }
  };

  const handleJoinClass = async (liveClass: LiveClass) => {
    try {
      // Navigate to embedded join route instead of opening a new window
      window.location.href = `/live-classes/join/${liveClass.id}`;
    } catch (error: any) {
      toast.error(error.response?.data?.detail || 'Failed to join live class');
    }
  };

  const formatDateTime = (dateTime: string) => {
    return new Date(dateTime).toLocaleString();
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      scheduled: { color: 'bg-blue-100 text-blue-800', text: 'Scheduled' },
      in_progress: { color: 'bg-green-100 text-green-800', text: 'Live Now' },
      completed: { color: 'bg-gray-100 text-gray-800', text: 'Completed' },
      canceled: { color: 'bg-red-100 text-red-800', text: 'Canceled' }
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.scheduled;
    
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
        {config.text}
      </span>
    );
  };

  const getActionButtons = (liveClass: LiveClass) => {
    const canManage = liveClassesService.canManageClass(liveClass, user?.id || 0, user?.role || '');
    const canJoin = liveClassesService.canJoinClass(liveClass, user?.role || '');
    
    // Debug logging
    console.log('🔍 LiveClassList Debug:', {
      liveClassId: liveClass.id,
      liveClassStatus: liveClass.status,
      userRole: user?.role,
      userId: user?.id,
      canManage,
      canJoin,
      teacherId: liveClass.teacher_id
    });

    return (
      <div className="flex space-x-2">
        {canManage && liveClass.status === 'scheduled' && (
          <button
            onClick={() => handleStartClass(liveClass)}
            disabled={startLiveClassMutation.isLoading}
            className="px-3 py-1 text-xs font-medium text-white bg-green-600 rounded hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 disabled:opacity-50"
          >
            Start
          </button>
        )}

        {canManage && liveClass.status === 'in_progress' && (
          <button
            onClick={() => handleEndClass(liveClass)}
            disabled={endLiveClassMutation.isLoading}
            className="px-3 py-1 text-xs font-medium text-white bg-red-600 rounded hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 disabled:opacity-50"
          >
            End
          </button>
        )}

        {canJoin && liveClass.status === 'in_progress' && (
          <button
            onClick={() => handleJoinClass(liveClass)}
            disabled={joinLiveClassMutation.isLoading}
            className="px-3 py-1 text-xs font-medium text-white bg-blue-600 rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
          >
            Join
          </button>
        )}

        {liveClass.status === 'scheduled' && canJoin && (
          <button
            onClick={() => setSelectedClass(liveClass)}
            className="px-3 py-1 text-xs font-medium text-gray-700 bg-gray-100 rounded hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500"
          >
            Details
          </button>
        )}
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-20 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="text-center text-red-600">
          Failed to load live classes. Please try again.
        </div>
      </div>
    );
  }

  const upcomingClasses = liveClasses?.filter(cls => cls.status === 'scheduled') || [];
  const activeClasses = liveClasses?.filter(cls => cls.status === 'in_progress') || [];
  const completedClasses = liveClasses?.filter(cls => cls.status === 'completed') || [];

  // Debug filtering
  console.log('🔍 LiveClassList Filtering:', {
    totalClasses: liveClasses?.length || 0,
    upcomingCount: upcomingClasses.length,
    activeCount: activeClasses.length,
    completedCount: completedClasses.length,
    activeClasses: activeClasses.map(c => ({ id: c.id, status: c.status, topic: c.topic }))
  });

  // Debug logging for filtering
  console.log('🔍 LiveClassList Filtering:', {
    totalClasses: liveClasses?.length || 0,
    upcomingCount: upcomingClasses.length,
    activeCount: activeClasses.length,
    completedCount: completedClasses.length,
    allStatuses: liveClasses?.map(cls => ({ id: cls.id, status: cls.status })) || []
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
        {showCreateButton && onCreateClick && (
          <button
            onClick={onCreateClick}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Schedule New Class
          </button>
        )}
      </div>

      {/* Active Classes */}
      {activeClasses.length > 0 && (
        <div className="bg-white rounded-lg shadow-md">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Live Now</h3>
          </div>
          <div className="divide-y divide-gray-200">
            {activeClasses.map((liveClass) => (
              <div key={liveClass.id} className="px-6 py-4">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3">
                      <h4 className="text-lg font-medium text-gray-900">{liveClass.topic}</h4>
                      {getStatusBadge(liveClass.status)}
                    </div>
                    <p className="text-sm text-gray-600 mt-1">
                      {liveClass.class?.name} {liveClass.class?.section && `- ${liveClass.class.section}`}
                    </p>
                    <p className="text-sm text-gray-500 mt-1">
                      Started: {formatDateTime(liveClass.start_time)} | Duration: {liveClass.duration} minutes
                    </p>
                    {liveClass.description && (
                      <p className="text-sm text-gray-600 mt-2">{liveClass.description}</p>
                    )}
                  </div>
                  <div className="ml-4">
                    {getActionButtons(liveClass)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Upcoming Classes */}
      {upcomingClasses.length > 0 && (
        <div className="bg-white rounded-lg shadow-md">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Upcoming Classes</h3>
          </div>
          <div className="divide-y divide-gray-200">
            {upcomingClasses.map((liveClass) => (
              <div key={liveClass.id} className="px-6 py-4">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3">
                      <h4 className="text-lg font-medium text-gray-900">{liveClass.topic}</h4>
                      {getStatusBadge(liveClass.status)}
                    </div>
                    <p className="text-sm text-gray-600 mt-1">
                      {liveClass.class?.name} {liveClass.class?.section && `- ${liveClass.class.section}`}
                    </p>
                    <p className="text-sm text-gray-500 mt-1">
                      Starts: {formatDateTime(liveClass.start_time)} | Duration: {liveClass.duration} minutes
                    </p>
                    {liveClass.description && (
                      <p className="text-sm text-gray-600 mt-2">{liveClass.description}</p>
                    )}
                  </div>
                  <div className="ml-4">
                    {getActionButtons(liveClass)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Completed Classes */}
      {completedClasses.length > 0 && (
        <div className="bg-white rounded-lg shadow-md">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Completed Classes</h3>
          </div>
          <div className="divide-y divide-gray-200">
            {completedClasses.slice(0, 5).map((liveClass) => (
              <div key={liveClass.id} className="px-6 py-4">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3">
                      <h4 className="text-lg font-medium text-gray-900">{liveClass.topic}</h4>
                      {getStatusBadge(liveClass.status)}
                    </div>
                    <p className="text-sm text-gray-600 mt-1">
                      {liveClass.class?.name} {liveClass.class?.section && `- ${liveClass.class.section}`}
                    </p>
                    <p className="text-sm text-gray-500 mt-1">
                      Completed: {formatDateTime(liveClass.start_time)} | Duration: {liveClass.duration} minutes
                    </p>
                    {liveClass.recording_url && (
                      <a
                        href={liveClass.recording_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-blue-600 hover:text-blue-800 mt-2 inline-block"
                      >
                        View Recording
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {liveClasses?.length === 0 && (
        <div className="bg-white rounded-lg shadow-md p-12 text-center">
          <div className="text-gray-500">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">No live classes</h3>
            <p className="mt-1 text-sm text-gray-500">
              Get started by scheduling a new live class.
            </p>
            {showCreateButton && onCreateClick && (
              <div className="mt-6">
                <button
                  onClick={onCreateClick}
                  className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Schedule New Class
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Class Details Modal */}
      {selectedClass && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Class Details</h3>
              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium text-gray-700">Topic:</label>
                  <p className="text-sm text-gray-900">{selectedClass.topic}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Class:</label>
                  <p className="text-sm text-gray-900">
                    {selectedClass.class?.name} {selectedClass.class?.section && `- ${selectedClass.class.section}`}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Start Time:</label>
                  <p className="text-sm text-gray-900">{formatDateTime(selectedClass.start_time)}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Duration:</label>
                  <p className="text-sm text-gray-900">{selectedClass.duration} minutes</p>
                </div>
                {selectedClass.description && (
                  <div>
                    <label className="text-sm font-medium text-gray-700">Description:</label>
                    <p className="text-sm text-gray-900">{selectedClass.description}</p>
                  </div>
                )}
                {selectedClass.is_password_protected && (
                  <div>
                    <label className="text-sm font-medium text-gray-700">Password:</label>
                    <p className="text-sm text-gray-900">{selectedClass.meeting_password}</p>
                  </div>
                )}
              </div>
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={() => setSelectedClass(null)}
                  className="px-3 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LiveClassList;
import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import LiveClassForm from '../../components/live-classes/LiveClassForm';
import LiveClassList from '../../components/live-classes/LiveClassList';

const LiveClassesPage: React.FC = () => {
  const { user } = useAuth();
  const [showForm, setShowForm] = useState(false);

  const canCreateLiveClass = user?.role === 'admin' || user?.role === 'super_admin' || user?.role === 'teacher';

  const handleFormSuccess = () => {
    setShowForm(false);
  };

  const handleFormCancel = () => {
    setShowForm(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Live Classes</h1>
          <p className="mt-2 text-gray-600">
            Schedule and manage live classes with Jitsi Meet integration
          </p>
        </div>

        {/* Create Form */}
        {showForm && canCreateLiveClass && (
          <div className="mb-8">
            <LiveClassForm 
              onSuccess={handleFormSuccess}
              onCancel={handleFormCancel}
            />
          </div>
        )}

        {/* Live Classes List */}
        <LiveClassList 
          showCreateButton={canCreateLiveClass && !showForm}
          onCreateClick={() => setShowForm(true)}
        />

        {/* Role-based Instructions */}
        {user?.role === 'admin' && (
          <div className="mt-6 bg-green-50 border border-green-200 rounded-lg p-6">
            <h3 className="text-sm font-medium text-green-800 mb-2">Admin Instructions</h3>
            <ul className="text-sm text-green-700 space-y-1">
              <li>• You can schedule live classes for any class</li>
              <li>• Teachers will be automatically assigned based on class assignments</li>
              <li>• All students in the selected class will be notified</li>
              <li>• You can monitor all live classes and attendance</li>
            </ul>
          </div>
        )}

        {user?.role === 'teacher' && (
          <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-lg p-6">
            <h3 className="text-sm font-medium text-yellow-800 mb-2">Teacher Instructions</h3>
            <ul className="text-sm text-yellow-700 space-y-1">
              <li>• You can schedule live classes for classes you teach</li>
              <li>• Start the class when ready to begin the session</li>
              <li>• Students can join once you start the class</li>
              <li>• End the class when the session is complete</li>
            </ul>
          </div>
        )}

        {user?.role === 'student' && (
          <div className="mt-6 bg-purple-50 border border-purple-200 rounded-lg p-6">
            <h3 className="text-sm font-medium text-purple-800 mb-2">Student Instructions</h3>
            <ul className="text-sm text-purple-700 space-y-1">
              <li>• You can see all live classes for your class</li>
              <li>• Join live classes when they are active</li>
              <li>• Participate in interactive features like chat and whiteboard</li>
              <li>• Access recordings after class completion</li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default LiveClassesPage;

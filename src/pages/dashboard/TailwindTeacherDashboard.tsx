import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ClockIcon, 
  BookOpenIcon, 
  ClipboardDocumentListIcon,
  ChartBarIcon,
  UserGroupIcon,
  BellIcon,
  CalendarIcon,
  AcademicCapIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';

const TailwindTeacherDashboard: React.FC = () => {
  const navigate = useNavigate();

  // Mock data for teacher dashboard
  const todaySchedule = [
    { id: 1, time: '08:00 - 09:00', subject: 'Mathematics', class: 'Class 10A', room: 'Room 101' },
    { id: 2, time: '09:15 - 10:15', subject: 'Mathematics', class: 'Class 9B', room: 'Room 102' },
    { id: 3, time: '10:30 - 11:30', subject: 'Mathematics', class: 'Class 11A', room: 'Room 103' },
    { id: 4, time: '14:00 - 15:00', subject: 'Mathematics', class: 'Class 12A', room: 'Room 101' },
  ];

  const pendingAssignments = [
    { id: 1, title: 'Algebra Quiz', class: 'Class 10A', dueDate: '2024-01-20', submissions: 15, total: 25 },
    { id: 2, title: 'Geometry Assignment', class: 'Class 9B', dueDate: '2024-01-22', submissions: 8, total: 20 },
    { id: 3, title: 'Calculus Problem Set', class: 'Class 11A', dueDate: '2024-01-25', submissions: 12, total: 18 },
  ];

  const recentGrades = [
    { id: 1, student: 'John Doe', assignment: 'Algebra Quiz', grade: 'A', score: 95 },
    { id: 2, student: 'Jane Smith', assignment: 'Geometry Assignment', grade: 'B+', score: 87 },
    { id: 3, student: 'Mike Johnson', assignment: 'Calculus Problem Set', grade: 'A-', score: 92 },
  ];

  const notifications = [
    { id: 1, type: 'info', message: 'Staff meeting tomorrow at 3 PM', time: '2 hours ago' },
    { id: 2, type: 'success', message: 'New assignment submitted by Sarah Wilson', time: '4 hours ago' },
    { id: 3, type: 'warning', message: 'Class 10A attendance below 80%', time: '6 hours ago' },
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-surface-900">Teacher Dashboard</h1>
          <p className="mt-1 text-sm text-surface-600">
            Welcome back, Mr. Johnson! Here's your teaching schedule and updates.
          </p>
        </div>
        <div className="mt-4 sm:mt-0 flex space-x-3">
          <button className="inline-flex items-center px-4 py-2 bg-surface-100 text-surface-700 text-sm font-medium rounded-xl hover:bg-surface-200 transition-colors duration-200">
            <CalendarIcon className="w-4 h-4 mr-2" />
            View Calendar
          </button>
          <button className="inline-flex items-center px-4 py-2 bg-brand-600 text-white text-sm font-medium rounded-xl hover:bg-brand-700 transition-colors duration-200">
            <ClipboardDocumentListIcon className="w-4 h-4 mr-2" />
            Create Assignment
          </button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl p-6 shadow-soft border border-surface-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-surface-600">Total Classes</p>
              <p className="text-2xl font-bold text-surface-900 mt-1">8</p>
            </div>
            <div className="p-3 bg-brand-500 rounded-xl">
              <BookOpenIcon className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-soft border border-surface-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-surface-600">Students</p>
              <p className="text-2xl font-bold text-surface-900 mt-1">156</p>
            </div>
            <div className="p-3 bg-success-500 rounded-xl">
              <UserGroupIcon className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-soft border border-surface-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-surface-600">Pending Grades</p>
              <p className="text-2xl font-bold text-surface-900 mt-1">23</p>
            </div>
            <div className="p-3 bg-warn-500 rounded-xl">
              <ClipboardDocumentListIcon className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-soft border border-surface-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-surface-600">Avg. Attendance</p>
              <p className="text-2xl font-bold text-surface-900 mt-1">92%</p>
            </div>
            <div className="p-3 bg-error-500 rounded-xl">
              <ChartBarIcon className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Today's Schedule and Pending Assignments */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Today's Schedule */}
        <div className="bg-white rounded-2xl p-6 shadow-soft border border-surface-200">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-surface-900">Today's Schedule</h3>
            <ClockIcon className="w-5 h-5 text-surface-400" />
          </div>
          <div className="space-y-4">
            {todaySchedule.map((classItem) => (
              <div key={classItem.id} className="flex items-center justify-between p-4 bg-surface-50 rounded-xl">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-brand-100 rounded-xl flex items-center justify-center">
                    <AcademicCapIcon className="w-6 h-6 text-brand-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-surface-900">{classItem.subject}</p>
                    <p className="text-xs text-surface-500">{classItem.class} • {classItem.room}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-surface-900">{classItem.time}</p>
                  <button className="text-xs text-brand-600 hover:text-brand-700 font-medium">
                    Take Attendance
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Pending Assignments */}
        <div className="bg-white rounded-2xl p-6 shadow-soft border border-surface-200">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-surface-900">Pending Assignments</h3>
            <button 
              onClick={() => navigate('/assignments')}
              className="text-sm text-brand-600 hover:text-brand-700 font-medium"
            >
              View All →
            </button>
          </div>
          <div className="space-y-4">
            {pendingAssignments.map((assignment) => (
              <div key={assignment.id} className="p-4 bg-surface-50 rounded-xl">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-sm font-medium text-surface-900">{assignment.title}</h4>
                  <span className="text-xs text-surface-500">{assignment.dueDate}</span>
                </div>
                <p className="text-xs text-surface-500 mb-3">{assignment.class}</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="text-xs text-surface-500">
                      {assignment.submissions}/{assignment.total} submitted
                    </span>
                    <div className="w-16 bg-surface-200 rounded-full h-2">
                      <div 
                        className="bg-brand-500 h-2 rounded-full" 
                        style={{ width: `${(assignment.submissions / assignment.total) * 100}%` }}
                      />
                    </div>
                  </div>
                  <button className="text-xs text-brand-600 hover:text-brand-700 font-medium">
                    Grade
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Grades and Notifications */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Grades */}
        <div className="bg-white rounded-2xl p-6 shadow-soft border border-surface-200">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-surface-900">Recent Grades</h3>
            <button 
              onClick={() => navigate('/grades')}
              className="text-sm text-brand-600 hover:text-brand-700 font-medium"
            >
              View All →
            </button>
          </div>
          <div className="space-y-4">
            {recentGrades.map((grade) => (
              <div key={grade.id} className="flex items-center justify-between p-3 bg-surface-50 rounded-xl">
                <div>
                  <p className="text-sm font-medium text-surface-900">{grade.student}</p>
                  <p className="text-xs text-surface-500">{grade.assignment}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-surface-900">{grade.grade}</p>
                  <p className="text-xs text-surface-500">{grade.score}%</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Notifications */}
        <div className="bg-white rounded-2xl p-6 shadow-soft border border-surface-200">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-surface-900">Notifications</h3>
            <BellIcon className="w-5 h-5 text-surface-400" />
          </div>
          <div className="space-y-4">
            {notifications.map((notification) => (
              <div key={notification.id} className="flex items-start space-x-3 p-3 bg-surface-50 rounded-xl">
                <div className={`w-2 h-2 rounded-full mt-2 ${
                  notification.type === 'success' ? 'bg-success-500' :
                  notification.type === 'warning' ? 'bg-warn-500' : 'bg-brand-500'
                }`} />
                <div className="flex-1">
                  <p className="text-sm text-surface-900">{notification.message}</p>
                  <p className="text-xs text-surface-500 mt-1">{notification.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-2xl p-6 shadow-soft border border-surface-200">
        <h3 className="text-lg font-semibold text-surface-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-4">
          <button 
            onClick={() => navigate('/assignments/new')}
            className="flex flex-col items-center p-4 bg-surface-50 rounded-xl hover:bg-surface-100 transition-colors duration-200"
          >
            <ClipboardDocumentListIcon className="w-6 h-6 text-brand-600 mb-2" />
            <span className="text-sm font-medium text-surface-900">New Assignment</span>
          </button>
          <button 
            onClick={() => navigate('/attendance')}
            className="flex flex-col items-center p-4 bg-surface-50 rounded-xl hover:bg-surface-100 transition-colors duration-200"
          >
            <CheckCircleIcon className="w-6 h-6 text-success-600 mb-2" />
            <span className="text-sm font-medium text-surface-900">Take Attendance</span>
          </button>
          <button 
            onClick={() => navigate('/grades')}
            className="flex flex-col items-center p-4 bg-surface-50 rounded-xl hover:bg-surface-100 transition-colors duration-200"
          >
            <ChartBarIcon className="w-6 h-6 text-warn-600 mb-2" />
            <span className="text-sm font-medium text-surface-900">Grade Assignments</span>
          </button>
          <button 
            onClick={() => navigate('/communication')}
            className="flex flex-col items-center p-4 bg-surface-50 rounded-xl hover:bg-surface-100 transition-colors duration-200"
          >
            <BellIcon className="w-6 h-6 text-error-600 mb-2" />
            <span className="text-sm font-medium text-surface-900">Send Message</span>
          </button>
          <button 
            onClick={() => navigate('/reports')}
            className="flex flex-col items-center p-4 bg-surface-50 rounded-xl hover:bg-surface-100 transition-colors duration-200"
          >
            <ChartBarIcon className="w-6 h-6 text-brand-600 mb-2" />
            <span className="text-sm font-medium text-surface-900">View Reports</span>
          </button>
          <button 
            onClick={() => navigate('/live-classes')}
            className="flex flex-col items-center p-4 bg-surface-50 rounded-xl hover:bg-surface-100 transition-colors duration-200"
          >
            <AcademicCapIcon className="w-6 h-6 text-success-600 mb-2" />
            <span className="text-sm font-medium text-surface-900">Start Class</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default TailwindTeacherDashboard;

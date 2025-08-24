import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  BookOpenIcon, 
  ClipboardDocumentListIcon,
  VideoCameraIcon,
  ChartBarIcon,
  BellIcon,
  CalendarIcon,
  CheckCircleIcon,
  DocumentTextIcon,
  UserGroupIcon
} from '@heroicons/react/24/outline';

const TailwindStudentDashboard: React.FC = () => {
  const navigate = useNavigate();

  // Mock data for student dashboard
  const upcomingAssignments = [
    { id: 1, title: 'Algebra Quiz', subject: 'Mathematics', dueDate: '2024-01-20', status: 'pending' },
    { id: 2, title: 'Essay on Shakespeare', subject: 'English', dueDate: '2024-01-22', status: 'in-progress' },
    { id: 3, title: 'Science Lab Report', subject: 'Physics', dueDate: '2024-01-25', status: 'pending' },
  ];

  const upcomingExams = [
    { id: 1, subject: 'Mathematics', date: '2024-01-28', time: '09:00 AM', room: 'Room 101' },
    { id: 2, subject: 'English Literature', date: '2024-01-30', time: '10:30 AM', room: 'Room 102' },
    { id: 3, subject: 'Physics', date: '2024-02-02', time: '02:00 PM', room: 'Room 103' },
  ];

  const liveClasses = [
    { id: 1, subject: 'Mathematics', teacher: 'Mr. Johnson', time: '08:00 AM', status: 'live' },
    { id: 2, subject: 'English', teacher: 'Ms. Smith', time: '10:00 AM', status: 'upcoming' },
    { id: 3, subject: 'Physics', teacher: 'Dr. Brown', time: '02:00 PM', status: 'upcoming' },
  ];

  const recentGrades = [
    { id: 1, subject: 'Mathematics', assignment: 'Algebra Quiz', grade: 'A', score: 95 },
    { id: 2, subject: 'English', assignment: 'Essay Writing', grade: 'B+', score: 87 },
    { id: 3, subject: 'Physics', assignment: 'Lab Report', grade: 'A-', score: 92 },
  ];

  const notifications = [
    { id: 1, type: 'success', message: 'New assignment posted: Algebra Quiz', time: '2 hours ago' },
    { id: 2, type: 'info', message: 'Live class starting in 10 minutes', time: '4 hours ago' },
    { id: 3, type: 'warning', message: 'Exam schedule updated', time: '6 hours ago' },
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-surface-900">Student Dashboard</h1>
          <p className="mt-1 text-sm text-surface-600">
            Welcome back, Sarah! Here's your learning progress and upcoming activities.
          </p>
        </div>
        <div className="mt-4 sm:mt-0 flex space-x-3">
          <button className="inline-flex items-center px-4 py-2 bg-surface-100 text-surface-700 text-sm font-medium rounded-xl hover:bg-surface-200 transition-colors duration-200">
            <CalendarIcon className="w-4 h-4 mr-2" />
            View Schedule
          </button>
          <button className="inline-flex items-center px-4 py-2 bg-brand-600 text-white text-sm font-medium rounded-xl hover:bg-brand-700 transition-colors duration-200">
            <VideoCameraIcon className="w-4 h-4 mr-2" />
            Join Live Class
          </button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl p-6 shadow-soft border border-surface-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-surface-600">Current GPA</p>
              <p className="text-2xl font-bold text-surface-900 mt-1">3.8</p>
            </div>
            <div className="p-3 bg-brand-500 rounded-xl">
              <ChartBarIcon className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-soft border border-surface-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-surface-600">Pending Assignments</p>
              <p className="text-2xl font-bold text-surface-900 mt-1">5</p>
            </div>
            <div className="p-3 bg-warn-500 rounded-xl">
              <ClipboardDocumentListIcon className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-soft border border-surface-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-surface-600">Upcoming Exams</p>
              <p className="text-2xl font-bold text-surface-900 mt-1">3</p>
            </div>
            <div className="p-3 bg-error-500 rounded-xl">
              <DocumentTextIcon className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-soft border border-surface-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-surface-600">Attendance</p>
              <p className="text-2xl font-bold text-surface-900 mt-1">96%</p>
            </div>
            <div className="p-3 bg-success-500 rounded-xl">
              <CheckCircleIcon className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Assignments and Exams */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upcoming Assignments */}
        <div className="bg-white rounded-2xl p-6 shadow-soft border border-surface-200">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-surface-900">Upcoming Assignments</h3>
            <button 
              onClick={() => navigate('/assignments')}
              className="text-sm text-brand-600 hover:text-brand-700 font-medium"
            >
              View All →
            </button>
          </div>
          <div className="space-y-4">
            {upcomingAssignments.map((assignment) => (
              <div key={assignment.id} className="p-4 bg-surface-50 rounded-xl">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-sm font-medium text-surface-900">{assignment.title}</h4>
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                    assignment.status === 'completed' ? 'bg-success-100 text-success-800' :
                    assignment.status === 'in-progress' ? 'bg-warn-100 text-warn-800' :
                    'bg-surface-100 text-surface-800'
                  }`}>
                    {assignment.status}
                  </span>
                </div>
                <p className="text-xs text-surface-500 mb-2">{assignment.subject}</p>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-surface-500">Due: {assignment.dueDate}</span>
                  <button className="text-xs text-brand-600 hover:text-brand-700 font-medium">
                    Start
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Upcoming Exams */}
        <div className="bg-white rounded-2xl p-6 shadow-soft border border-surface-200">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-surface-900">Upcoming Exams</h3>
            <button 
              onClick={() => navigate('/exams')}
              className="text-sm text-brand-600 hover:text-brand-700 font-medium"
            >
              View All →
            </button>
          </div>
          <div className="space-y-4">
            {upcomingExams.map((exam) => (
              <div key={exam.id} className="p-4 bg-surface-50 rounded-xl">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-sm font-medium text-surface-900">{exam.subject}</h4>
                  <span className="text-xs text-surface-500">{exam.date}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <span className="text-xs text-surface-500">{exam.time}</span>
                    <span className="text-xs text-surface-500">Room {exam.room}</span>
                  </div>
                  <button className="text-xs text-brand-600 hover:text-brand-700 font-medium">
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Live Classes and Recent Grades */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Live Classes */}
        <div className="bg-white rounded-2xl p-6 shadow-soft border border-surface-200">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-surface-900">Live Classes</h3>
            <button 
              onClick={() => navigate('/live-classes')}
              className="text-sm text-brand-600 hover:text-brand-700 font-medium"
            >
              View All →
            </button>
          </div>
          <div className="space-y-4">
            {liveClasses.map((classItem) => (
              <div key={classItem.id} className="p-4 bg-surface-50 rounded-xl">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-sm font-medium text-surface-900">{classItem.subject}</h4>
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                    classItem.status === 'live' ? 'bg-error-100 text-error-800' : 'bg-surface-100 text-surface-800'
                  }`}>
                    {classItem.status}
                  </span>
                </div>
                <p className="text-xs text-surface-500 mb-2">{classItem.teacher}</p>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-surface-500">{classItem.time}</span>
                  <button className={`text-xs font-medium ${
                    classItem.status === 'live' 
                      ? 'text-error-600 hover:text-error-700' 
                      : 'text-brand-600 hover:text-brand-700'
                  }`}>
                    {classItem.status === 'live' ? 'Join Now' : 'Remind Me'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Grades */}
        <div className="bg-white rounded-2xl p-6 shadow-soft border border-surface-200">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-surface-900">Recent Grades</h3>
            <button 
              onClick={() => navigate('/report-cards')}
              className="text-sm text-brand-600 hover:text-brand-700 font-medium"
            >
              View All →
            </button>
          </div>
          <div className="space-y-4">
            {recentGrades.map((grade) => (
              <div key={grade.id} className="flex items-center justify-between p-3 bg-surface-50 rounded-xl">
                <div>
                  <p className="text-sm font-medium text-surface-900">{grade.subject}</p>
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
      </div>

      {/* Notifications and Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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

        {/* Quick Actions */}
        <div className="bg-white rounded-2xl p-6 shadow-soft border border-surface-200">
          <h3 className="text-lg font-semibold text-surface-900 mb-4">Quick Actions</h3>
          <div className="grid grid-cols-2 gap-4">
            <button 
              onClick={() => navigate('/assignments')}
              className="flex flex-col items-center p-4 bg-surface-50 rounded-xl hover:bg-surface-100 transition-colors duration-200"
            >
              <ClipboardDocumentListIcon className="w-6 h-6 text-brand-600 mb-2" />
              <span className="text-sm font-medium text-surface-900">View Assignments</span>
            </button>
            <button 
              onClick={() => navigate('/exams')}
              className="flex flex-col items-center p-4 bg-surface-50 rounded-xl hover:bg-surface-100 transition-colors duration-200"
            >
              <DocumentTextIcon className="w-6 h-6 text-warn-600 mb-2" />
              <span className="text-sm font-medium text-surface-900">Exam Schedule</span>
            </button>
            <button 
              onClick={() => navigate('/live-classes')}
              className="flex flex-col items-center p-4 bg-surface-50 rounded-xl hover:bg-surface-100 transition-colors duration-200"
            >
              <VideoCameraIcon className="w-6 h-6 text-error-600 mb-2" />
              <span className="text-sm font-medium text-surface-900">Live Classes</span>
            </button>
            <button 
              onClick={() => navigate('/report-cards')}
              className="flex flex-col items-center p-4 bg-surface-50 rounded-xl hover:bg-surface-100 transition-colors duration-200"
            >
              <ChartBarIcon className="w-6 h-6 text-success-600 mb-2" />
              <span className="text-sm font-medium text-surface-900">Report Cards</span>
            </button>
            <button 
              onClick={() => navigate('/library')}
              className="flex flex-col items-center p-4 bg-surface-50 rounded-xl hover:bg-surface-100 transition-colors duration-200"
            >
              <BookOpenIcon className="w-6 h-6 text-brand-600 mb-2" />
              <span className="text-sm font-medium text-surface-900">Library</span>
            </button>
            <button 
              onClick={() => navigate('/transport')}
              className="flex flex-col items-center p-4 bg-surface-50 rounded-xl hover:bg-surface-100 transition-colors duration-200"
            >
              <UserGroupIcon className="w-6 h-6 text-success-600 mb-2" />
              <span className="text-sm font-medium text-surface-900">Transport</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TailwindStudentDashboard;

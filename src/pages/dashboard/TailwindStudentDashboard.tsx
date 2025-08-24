import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from 'react-query';
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
import api from '../../services/api';

const TailwindStudentDashboard: React.FC = () => {
  const navigate = useNavigate();

  // Fetch student dashboard data
  const { data: dashboardData, isLoading, error } = useQuery(
    'studentDashboard',
    async () => {
      // We'll implement these API calls later
      const [assignmentsRes, examsRes, liveClassesRes, gradesRes] = await Promise.all([
        api.get('/assignments?page=1&per_page=5'), // Recent assignments
        api.get('/exams?page=1&per_page=5'), // Upcoming exams
        api.get('/live-classes?page=1&per_page=5'), // Live classes
        api.get('/grades?page=1&per_page=5'), // Recent grades
      ]);
      
      return {
        assignments: assignmentsRes.data,
        exams: examsRes.data,
        liveClasses: liveClassesRes.data,
        grades: gradesRes.data,
      };
    },
    {
      staleTime: 5 * 60 * 1000, // 5 minutes
    }
  );

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-surface-900">Student Dashboard</h1>
            <p className="mt-1 text-sm text-surface-600">
              Loading your learning progress...
            </p>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-white rounded-2xl p-6 shadow-soft border border-surface-200 animate-pulse">
              <div className="h-4 bg-surface-200 rounded w-3/4 mb-2"></div>
              <div className="h-8 bg-surface-200 rounded w-1/2 mb-2"></div>
              <div className="h-3 bg-surface-200 rounded w-1/3"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-surface-900">Student Dashboard</h1>
            <p className="mt-1 text-sm text-surface-600">
              Error loading dashboard data. Please try again.
            </p>
          </div>
        </div>
        <div className="bg-white rounded-2xl p-6 shadow-soft border border-surface-200">
          <p className="text-surface-600">Failed to load dashboard data. Please refresh the page.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-surface-900">Student Dashboard</h1>
          <p className="mt-1 text-sm text-surface-600">
            Welcome back! Here's your learning progress and upcoming activities.
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
              <p className="text-2xl font-bold text-surface-900 mt-1">
                {dashboardData?.assignments?.total || '0'}
              </p>
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
              <p className="text-2xl font-bold text-surface-900 mt-1">
                {dashboardData?.exams?.total || '0'}
              </p>
            </div>
            <div className="p-3 bg-error-500 rounded-xl">
              <DocumentTextIcon className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-soft border border-surface-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-surface-600">Live Classes</p>
              <p className="text-2xl font-bold text-surface-900 mt-1">
                {dashboardData?.liveClasses?.total || '0'}
              </p>
            </div>
            <div className="p-3 bg-success-500 rounded-xl">
              <VideoCameraIcon className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
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
            {dashboardData?.assignments?.items?.slice(0, 3).map((assignment: any) => (
              <div key={assignment.id} className="flex items-center justify-between p-3 bg-surface-50 rounded-xl">
                <div>
                  <p className="text-sm font-medium text-surface-900">{assignment.title}</p>
                  <p className="text-xs text-surface-500">{assignment.subject}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-surface-500">{assignment.due_date}</p>
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                    assignment.status === 'completed' 
                      ? 'bg-success-100 text-success-800' 
                      : 'bg-warn-100 text-warn-800'
                  }`}>
                    {assignment.status}
                  </span>
                </div>
              </div>
            )) || (
              <div className="text-center py-4">
                <p className="text-surface-500">No upcoming assignments</p>
              </div>
            )}
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
            {dashboardData?.exams?.items?.slice(0, 3).map((exam: any) => (
              <div key={exam.id} className="flex items-center justify-between p-3 bg-surface-50 rounded-xl">
                <div>
                  <p className="text-sm font-medium text-surface-900">{exam.subject}</p>
                  <p className="text-xs text-surface-500">{exam.date} at {exam.time}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-surface-500">Room {exam.room}</p>
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-brand-100 text-brand-800">
                    Upcoming
                  </span>
                </div>
              </div>
            )) || (
              <div className="text-center py-4">
                <p className="text-surface-500">No upcoming exams</p>
              </div>
            )}
          </div>
        </div>

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
            {dashboardData?.liveClasses?.items?.slice(0, 3).map((liveClass: any) => (
              <div key={liveClass.id} className="flex items-center justify-between p-3 bg-surface-50 rounded-xl">
                <div>
                  <p className="text-sm font-medium text-surface-900">{liveClass.subject}</p>
                  <p className="text-xs text-surface-500">{liveClass.teacher}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-surface-500">{liveClass.time}</p>
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                    liveClass.status === 'live' 
                      ? 'bg-error-100 text-error-800' 
                      : 'bg-success-100 text-success-800'
                  }`}>
                    {liveClass.status}
                  </span>
                </div>
              </div>
            )) || (
              <div className="text-center py-4">
                <p className="text-surface-500">No live classes scheduled</p>
              </div>
            )}
          </div>
        </div>
      </div>

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
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-surface-200">
                <th className="text-left py-3 px-4 text-sm font-medium text-surface-600">Subject</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-surface-600">Assignment</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-surface-600">Grade</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-surface-600">Score</th>
              </tr>
            </thead>
            <tbody>
              {dashboardData?.grades?.items?.slice(0, 5).map((grade: any) => (
                <tr key={grade.id} className="border-b border-surface-100">
                  <td className="py-3 px-4 text-sm text-surface-900">{grade.subject}</td>
                  <td className="py-3 px-4 text-sm text-surface-900">{grade.assignment}</td>
                  <td className="py-3 px-4 text-sm font-medium text-surface-900">{grade.grade}</td>
                  <td className="py-3 px-4 text-sm text-surface-900">{grade.score}%</td>
                </tr>
              )) || (
                <tr>
                  <td colSpan={4} className="py-8 text-center text-surface-500">
                    No recent grades available
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-2xl p-6 shadow-soft border border-surface-200">
        <h3 className="text-lg font-semibold text-surface-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-4">
          <button 
            onClick={() => navigate('/assignments')}
            className="flex flex-col items-center p-4 bg-surface-50 rounded-xl hover:bg-surface-100 transition-colors duration-200"
          >
            <ClipboardDocumentListIcon className="w-6 h-6 text-brand-600 mb-2" />
            <span className="text-sm font-medium text-surface-900">Assignments</span>
          </button>
          <button 
            onClick={() => navigate('/exams')}
            className="flex flex-col items-center p-4 bg-surface-50 rounded-xl hover:bg-surface-100 transition-colors duration-200"
          >
            <DocumentTextIcon className="w-6 h-6 text-error-600 mb-2" />
            <span className="text-sm font-medium text-surface-900">Exams</span>
          </button>
          <button 
            onClick={() => navigate('/live-classes')}
            className="flex flex-col items-center p-4 bg-surface-50 rounded-xl hover:bg-surface-100 transition-colors duration-200"
          >
            <VideoCameraIcon className="w-6 h-6 text-success-600 mb-2" />
            <span className="text-sm font-medium text-surface-900">Live Classes</span>
          </button>
          <button 
            onClick={() => navigate('/grades')}
            className="flex flex-col items-center p-4 bg-surface-50 rounded-xl hover:bg-surface-100 transition-colors duration-200"
          >
            <ChartBarIcon className="w-6 h-6 text-warn-600 mb-2" />
            <span className="text-sm font-medium text-surface-900">Grades</span>
          </button>
          <button 
            onClick={() => navigate('/schedule')}
            className="flex flex-col items-center p-4 bg-surface-50 rounded-xl hover:bg-surface-100 transition-colors duration-200"
          >
            <CalendarIcon className="w-6 h-6 text-brand-600 mb-2" />
            <span className="text-sm font-medium text-surface-900">Schedule</span>
          </button>
          <button 
            onClick={() => navigate('/communication')}
            className="flex flex-col items-center p-4 bg-surface-50 rounded-xl hover:bg-surface-100 transition-colors duration-200"
          >
            <BellIcon className="w-6 h-6 text-success-600 mb-2" />
            <span className="text-sm font-medium text-surface-900">Messages</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default TailwindStudentDashboard;

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from 'react-query';
import { 
  UserGroupIcon, 
  AcademicCapIcon,
  CurrencyDollarIcon,
  ChartBarIcon,
  CalendarIcon,
  BellIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  ClockIcon,
  DocumentTextIcon
} from '@heroicons/react/24/outline';
import api from '../../services/api';

const ParentDashboard: React.FC = () => {
  const navigate = useNavigate();

  // Fetch parent dashboard data
  const { data: dashboardData, isLoading, error } = useQuery(
    'parentDashboard',
    async () => {
      // We'll implement these API calls later
      const [childrenRes, feesRes, attendanceRes, gradesRes] = await Promise.all([
        api.get('/students?page=1&per_page=5'), // Children data
        api.get('/fees?page=1&per_page=5'), // Fees information
        api.get('/attendance?page=1&per_page=5'), // Attendance data
        api.get('/grades?page=1&per_page=5'), // Children's grades
      ]);
      
      return {
        children: childrenRes.data,
        fees: feesRes.data,
        attendance: attendanceRes.data,
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
            <h1 className="text-2xl font-bold text-surface-900">Parent Dashboard</h1>
            <p className="mt-1 text-sm text-surface-600">
              Loading your children's progress...
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
            <h1 className="text-2xl font-bold text-surface-900">Parent Dashboard</h1>
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
          <h1 className="text-2xl font-bold text-surface-900">Parent Dashboard</h1>
          <p className="mt-1 text-sm text-surface-600">
            Welcome back! Here's your children's academic progress and important updates.
          </p>
        </div>
        <div className="mt-4 sm:mt-0 flex space-x-3">
          <button className="inline-flex items-center px-4 py-2 bg-surface-100 text-surface-700 text-sm font-medium rounded-xl hover:bg-surface-200 transition-colors duration-200">
            <CalendarIcon className="w-4 h-4 mr-2" />
            View Calendar
          </button>
          <button className="inline-flex items-center px-4 py-2 bg-brand-600 text-white text-sm font-medium rounded-xl hover:bg-brand-700 transition-colors duration-200">
            <BellIcon className="w-4 h-4 mr-2" />
            Contact School
          </button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl p-6 shadow-soft border border-surface-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-surface-600">Children</p>
              <p className="text-2xl font-bold text-surface-900 mt-1">
                {dashboardData?.children?.total || '0'}
              </p>
            </div>
            <div className="p-3 bg-brand-500 rounded-xl">
              <UserGroupIcon className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-soft border border-surface-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-surface-600">Average GPA</p>
              <p className="text-2xl font-bold text-surface-900 mt-1">3.8</p>
            </div>
            <div className="p-3 bg-success-500 rounded-xl">
              <AcademicCapIcon className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-soft border border-surface-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-surface-600">Attendance Rate</p>
              <p className="text-2xl font-bold text-surface-900 mt-1">96.2%</p>
            </div>
            <div className="p-3 bg-warn-500 rounded-xl">
              <CheckCircleIcon className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-soft border border-surface-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-surface-600">Outstanding Fees</p>
              <p className="text-2xl font-bold text-surface-900 mt-1">$450</p>
            </div>
            <div className="p-3 bg-error-500 rounded-xl">
              <CurrencyDollarIcon className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Children's Progress */}
        <div className="bg-white rounded-2xl p-6 shadow-soft border border-surface-200">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-surface-900">Children's Progress</h3>
            <button 
              onClick={() => navigate('/students')}
              className="text-sm text-brand-600 hover:text-brand-700 font-medium"
            >
              View All →
            </button>
          </div>
          <div className="space-y-4">
            {dashboardData?.children?.items?.slice(0, 3).map((child: any) => (
              <div key={child.id} className="flex items-center justify-between p-3 bg-surface-50 rounded-xl">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-brand-100 rounded-full flex items-center justify-center">
                    <span className="text-sm font-medium text-brand-600">
                      {child.first_name?.[0]}{child.last_name?.[0]}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-surface-900">
                      {child.first_name} {child.last_name}
                    </p>
                    <p className="text-xs text-surface-500">Class {child.class}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-surface-900">GPA: 3.8</p>
                  <p className="text-xs text-surface-500">96% attendance</p>
                </div>
              </div>
            )) || (
              <div className="text-center py-4">
                <p className="text-surface-500">No children data available</p>
              </div>
            )}
          </div>
        </div>

        {/* Fee Status */}
        <div className="bg-white rounded-2xl p-6 shadow-soft border border-surface-200">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-surface-900">Fee Status</h3>
            <button 
              onClick={() => navigate('/fees')}
              className="text-sm text-brand-600 hover:text-brand-700 font-medium"
            >
              View All →
            </button>
          </div>
          <div className="space-y-4">
            {dashboardData?.fees?.items?.slice(0, 3).map((fee: any) => (
              <div key={fee.id} className="flex items-center justify-between p-3 bg-surface-50 rounded-xl">
                <div>
                  <p className="text-sm font-medium text-surface-900">{fee.student_name}</p>
                  <p className="text-xs text-surface-500">{fee.fee_type}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-surface-900">${fee.amount}</p>
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                    fee.status === 'paid' 
                      ? 'bg-success-100 text-success-800' 
                      : 'bg-error-100 text-error-800'
                  }`}>
                    {fee.status}
                  </span>
                </div>
              </div>
            )) || (
              <div className="text-center py-4">
                <p className="text-surface-500">No fee information available</p>
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
                <th className="text-left py-3 px-4 text-sm font-medium text-surface-600">Student</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-surface-600">Subject</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-surface-600">Assignment</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-surface-600">Grade</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-surface-600">Score</th>
              </tr>
            </thead>
            <tbody>
              {dashboardData?.grades?.items?.slice(0, 5).map((grade: any) => (
                <tr key={grade.id} className="border-b border-surface-100">
                  <td className="py-3 px-4 text-sm text-surface-900">{grade.student}</td>
                  <td className="py-3 px-4 text-sm text-surface-900">{grade.subject}</td>
                  <td className="py-3 px-4 text-sm text-surface-900">{grade.assignment}</td>
                  <td className="py-3 px-4 text-sm font-medium text-surface-900">{grade.grade}</td>
                  <td className="py-3 px-4 text-sm text-surface-900">{grade.score}%</td>
                </tr>
              )) || (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-surface-500">
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
            onClick={() => navigate('/fees')}
            className="flex flex-col items-center p-4 bg-surface-50 rounded-xl hover:bg-surface-100 transition-colors duration-200"
          >
            <CurrencyDollarIcon className="w-6 h-6 text-brand-600 mb-2" />
            <span className="text-sm font-medium text-surface-900">Pay Fees</span>
          </button>
          <button 
            onClick={() => navigate('/attendance')}
            className="flex flex-col items-center p-4 bg-surface-50 rounded-xl hover:bg-surface-100 transition-colors duration-200"
          >
            <CheckCircleIcon className="w-6 h-6 text-success-600 mb-2" />
            <span className="text-sm font-medium text-surface-900">Attendance</span>
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
          <button 
            onClick={() => navigate('/transport')}
            className="flex flex-col items-center p-4 bg-surface-50 rounded-xl hover:bg-surface-100 transition-colors duration-200"
          >
            <UserGroupIcon className="w-6 h-6 text-error-600 mb-2" />
            <span className="text-sm font-medium text-surface-900">Transport</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ParentDashboard;

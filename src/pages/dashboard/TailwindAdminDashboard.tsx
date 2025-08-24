import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from 'react-query';
import { 
  UsersIcon, 
  AcademicCapIcon, 
  BookOpenIcon, 
  ChartBarIcon,
  CurrencyDollarIcon,
  ExclamationTriangleIcon,
  ClockIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  EyeIcon
} from '@heroicons/react/24/outline';
import api from '../../services/api';

const TailwindAdminDashboard: React.FC = () => {
  const navigate = useNavigate();

  // Fetch dashboard data
  const { data: dashboardData, isLoading, error } = useQuery(
    'adminDashboard',
    async () => {
      // We'll implement these API calls later
      const [studentsRes, teachersRes, classesRes] = await Promise.all([
        api.get('/students?page=1&per_page=1'), // Just to get total count
        api.get('/teachers?page=1&per_page=1'), // Just to get total count
        api.get('/classes?page=1&per_page=1'), // Just to get total count
      ]);
      
      return {
        students: studentsRes.data,
        teachers: teachersRes.data,
        classes: classesRes.data,
      };
    },
    {
      staleTime: 5 * 60 * 1000, // 5 minutes
    }
  );

  // KPI data - will be populated with real data
  const kpiData = [
    {
      title: 'Total Students',
      value: dashboardData?.students?.total || '0',
      change: '+12%',
      changeType: 'increase' as const,
      icon: UsersIcon,
      color: 'bg-brand-500',
      href: '/students?status=active'
    },
    {
      title: 'Total Teachers',
      value: dashboardData?.teachers?.total || '0',
      change: '+5%',
      changeType: 'increase' as const,
      icon: AcademicCapIcon,
      color: 'bg-success-500',
      href: '/teachers?status=active'
    },
    {
      title: 'Active Classes',
      value: dashboardData?.classes?.total || '0',
      change: '+8%',
      changeType: 'increase' as const,
      icon: BookOpenIcon,
      color: 'bg-warn-500',
      href: '/classes?status=active'
    },
    {
      title: 'Attendance Rate',
      value: '94.2%',
      change: '+2.1%',
      changeType: 'increase' as const,
      icon: ChartBarIcon,
      color: 'bg-error-500',
      href: '/attendance?range=this-month'
    }
  ];

  const handleKPIClick = (href: string) => {
    navigate(href);
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-surface-900">Admin Dashboard</h1>
            <p className="mt-1 text-sm text-surface-600">
              Loading dashboard data...
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
            <h1 className="text-2xl font-bold text-surface-900">Admin Dashboard</h1>
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
          <h1 className="text-2xl font-bold text-surface-900">Admin Dashboard</h1>
          <p className="mt-1 text-sm text-surface-600">
            Welcome back! Here's what's happening with your school today.
          </p>
        </div>
        <div className="mt-4 sm:mt-0">
          <button className="inline-flex items-center px-4 py-2 bg-brand-600 text-white text-sm font-medium rounded-xl hover:bg-brand-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-500 transition-colors duration-200">
            <EyeIcon className="w-4 h-4 mr-2" />
            View Reports
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpiData.map((kpi) => (
          <div
            key={kpi.title}
            onClick={() => handleKPIClick(kpi.href)}
            className="bg-white rounded-2xl p-6 shadow-soft hover:shadow-medium transition-shadow duration-200 cursor-pointer border border-surface-200"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-surface-600">{kpi.title}</p>
                <p className="text-2xl font-bold text-surface-900 mt-1">{kpi.value}</p>
                <div className="flex items-center mt-2">
                  {kpi.changeType === 'increase' ? (
                    <ArrowUpIcon className="w-4 h-4 text-success-500 mr-1" />
                  ) : (
                    <ArrowDownIcon className="w-4 h-4 text-error-500 mr-1" />
                  )}
                  <span className={`text-sm font-medium ${
                    kpi.changeType === 'increase' ? 'text-success-600' : 'text-error-600'
                  }`}>
                    {kpi.change}
                  </span>
                  <span className="text-sm text-surface-500 ml-1">from last month</span>
                </div>
              </div>
              <div className={`p-3 rounded-xl ${kpi.color}`}>
                <kpi.icon className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Students by Class Chart */}
      <div className="bg-white rounded-2xl p-6 shadow-soft border border-surface-200">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-surface-900">Students by Class</h3>
          <button 
            onClick={() => navigate('/reports?tab=students')}
            className="text-sm text-brand-600 hover:text-brand-700 font-medium"
          >
            View More →
          </button>
        </div>
        <div className="h-64 bg-surface-50 rounded-xl flex items-center justify-center">
          <div className="text-center">
            <ChartBarIcon className="w-12 h-12 text-surface-400 mx-auto mb-2" />
            <p className="text-surface-600">Chart will be implemented with Chart.js or Recharts</p>
            <p className="text-sm text-surface-500 mt-2">Showing distribution of students across classes</p>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-2xl p-6 shadow-soft border border-surface-200">
        <h3 className="text-lg font-semibold text-surface-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-4">
          <button 
            onClick={() => navigate('/students/new')}
            className="flex flex-col items-center p-4 bg-surface-50 rounded-xl hover:bg-surface-100 transition-colors duration-200"
          >
            <UsersIcon className="w-6 h-6 text-brand-600 mb-2" />
            <span className="text-sm font-medium text-surface-900">Add Student</span>
          </button>
          <button 
            onClick={() => navigate('/teachers/new')}
            className="flex flex-col items-center p-4 bg-surface-50 rounded-xl hover:bg-surface-100 transition-colors duration-200"
          >
            <AcademicCapIcon className="w-6 h-6 text-success-600 mb-2" />
            <span className="text-sm font-medium text-surface-900">Add Teacher</span>
          </button>
          <button 
            onClick={() => navigate('/classes/new')}
            className="flex flex-col items-center p-4 bg-surface-50 rounded-xl hover:bg-surface-100 transition-colors duration-200"
          >
            <BookOpenIcon className="w-6 h-6 text-warn-600 mb-2" />
            <span className="text-sm font-medium text-surface-900">Create Class</span>
          </button>
          <button 
            onClick={() => navigate('/fees/new')}
            className="flex flex-col items-center p-4 bg-surface-50 rounded-xl hover:bg-surface-100 transition-colors duration-200"
          >
            <CurrencyDollarIcon className="w-6 h-6 text-error-600 mb-2" />
            <span className="text-sm font-medium text-surface-900">Manage Fees</span>
          </button>
          <button 
            onClick={() => navigate('/reports')}
            className="flex flex-col items-center p-4 bg-surface-50 rounded-xl hover:bg-surface-100 transition-colors duration-200"
          >
            <ChartBarIcon className="w-6 h-6 text-brand-600 mb-2" />
            <span className="text-sm font-medium text-surface-900">View Reports</span>
          </button>
          <button 
            onClick={() => navigate('/communication')}
            className="flex flex-col items-center p-4 bg-surface-50 rounded-xl hover:bg-surface-100 transition-colors duration-200"
          >
            <ClockIcon className="w-6 h-6 text-success-600 mb-2" />
            <span className="text-sm font-medium text-surface-900">Send Message</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default TailwindAdminDashboard;

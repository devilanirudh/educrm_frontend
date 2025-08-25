import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  UsersIcon, 
  AcademicCapIcon, 
  BookOpenIcon, 
  ChartBarIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  EyeIcon,
  ClockIcon,
  ExclamationTriangleIcon,
  BellIcon
} from '@heroicons/react/24/outline';
import { useAdminDashboard } from '../../hooks/useDashboard';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const TailwindAdminDashboard: React.FC = () => {
  const navigate = useNavigate();

  // Fetch dashboard data using the new hook
  const { data: dashboardData, isLoading, error } = useAdminDashboard();

  // KPI data from API
  const kpiData = [
    {
      title: 'Total Students',
      value: dashboardData?.kpis?.total_students?.current?.toString() || '0',
      change: `${(dashboardData?.kpis?.total_students?.change_percentage || 0) > 0 ? '+' : ''}${dashboardData?.kpis?.total_students?.change_percentage || 0}%`,
      changeType: dashboardData?.kpis?.total_students?.change_type || 'no_change',
      icon: UsersIcon,
      color: 'bg-brand-500',
      href: '/students?status=active'
    },
    {
      title: 'Total Teachers',
      value: dashboardData?.kpis?.total_teachers?.current?.toString() || '0',
      change: `${(dashboardData?.kpis?.total_teachers?.change_percentage || 0) > 0 ? '+' : ''}${dashboardData?.kpis?.total_teachers?.change_percentage || 0}%`,
      changeType: dashboardData?.kpis?.total_teachers?.change_type || 'no_change',
      icon: AcademicCapIcon,
      color: 'bg-success-500',
      href: '/teachers?status=active'
    },
    {
      title: 'Active Classes',
      value: dashboardData?.kpis?.active_classes?.current?.toString() || '0',
      change: `${(dashboardData?.kpis?.active_classes?.change_percentage || 0) > 0 ? '+' : ''}${dashboardData?.kpis?.active_classes?.change_percentage || 0}%`,
      changeType: dashboardData?.kpis?.active_classes?.change_type || 'no_change',
      icon: BookOpenIcon,
      color: 'bg-warn-500',
      href: '/classes?status=active'
    },
    {
      title: 'Attendance Rate',
      value: `${dashboardData?.kpis?.attendance_rate?.current || 0}%`,
      change: `${(dashboardData?.kpis?.attendance_rate?.change_percentage || 0) > 0 ? '+' : ''}${dashboardData?.kpis?.attendance_rate?.change_percentage || 0}%`,
      changeType: dashboardData?.kpis?.attendance_rate?.change_type || 'no_change',
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
        <div className="h-64">
          {dashboardData?.charts?.students_by_class && dashboardData.charts.students_by_class.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dashboardData.charts.students_by_class}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis 
                  dataKey="label" 
                  tick={{ fontSize: 12 }}
                  angle={-45}
                  textAnchor="end"
                  height={80}
                />
                <YAxis 
                  tick={{ fontSize: 12 }}
                  label={{ value: 'Number of Students', angle: -90, position: 'insideLeft', fontSize: 12 }}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'white', 
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                  }}
                  formatter={(value: any) => [`${value} students`, 'Students']}
                />
                <Bar 
                  dataKey="value" 
                  fill="#3b82f6" 
                  radius={[4, 4, 0, 0]}
                  name="Students"
                />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full bg-surface-50 rounded-xl flex items-center justify-center">
              <div className="text-center">
                <ChartBarIcon className="w-12 h-12 text-surface-400 mx-auto mb-2" />
                <p className="text-surface-600">No class data available</p>
                <p className="text-sm text-surface-500 mt-2">Add classes and students to see the distribution</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl p-6 shadow-soft border border-surface-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-surface-600">Unread Notifications</p>
              <p className="text-2xl font-bold text-surface-900 mt-1">{dashboardData?.quick_stats?.unread_notifications || 0}</p>
            </div>
            <div className="p-3 rounded-xl bg-brand-500">
              <BellIcon className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-2xl p-6 shadow-soft border border-surface-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-surface-600">Upcoming Events</p>
              <p className="text-2xl font-bold text-surface-900 mt-1">{dashboardData?.quick_stats?.upcoming_events || 0}</p>
            </div>
            <div className="p-3 rounded-xl bg-success-500">
              <ClockIcon className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-2xl p-6 shadow-soft border border-surface-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-surface-600">Overdue Fees</p>
              <p className="text-2xl font-bold text-surface-900 mt-1">{dashboardData?.quick_stats?.overdue_fees || 0}</p>
            </div>
            <div className="p-3 rounded-xl bg-error-500">
              <ExclamationTriangleIcon className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
      </div>




    </div>
  );
};

export default TailwindAdminDashboard;

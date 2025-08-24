import React from 'react';
import { useNavigate } from 'react-router-dom';
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

const TailwindAdminDashboard: React.FC = () => {
  const navigate = useNavigate();

  // Mock data - replace with actual API calls
  const kpiData = [
    {
      title: 'Total Students',
      value: '1,234',
      change: '+12%',
      changeType: 'increase',
      icon: UsersIcon,
      color: 'bg-brand-500',
      href: '/students?status=active'
    },
    {
      title: 'Total Teachers',
      value: '89',
      change: '+5%',
      changeType: 'increase',
      icon: AcademicCapIcon,
      color: 'bg-success-500',
      href: '/teachers?status=active'
    },
    {
      title: 'Active Classes',
      value: '45',
      change: '+8%',
      changeType: 'increase',
      icon: BookOpenIcon,
      color: 'bg-warn-500',
      href: '/classes?status=active'
    },
    {
      title: 'Attendance Rate',
      value: '94.2%',
      change: '+2.1%',
      changeType: 'increase',
      icon: ChartBarIcon,
      color: 'bg-error-500',
      href: '/attendance?range=this-month'
    }
  ];

  const recentPayments = [
    { id: 1, student: 'John Doe', amount: 500, date: '2024-01-15', status: 'completed' },
    { id: 2, student: 'Jane Smith', amount: 750, date: '2024-01-14', status: 'completed' },
    { id: 3, student: 'Mike Johnson', amount: 300, date: '2024-01-13', status: 'pending' },
    { id: 4, student: 'Sarah Wilson', amount: 600, date: '2024-01-12', status: 'completed' },
    { id: 5, student: 'Tom Brown', amount: 450, date: '2024-01-11', status: 'completed' },
  ];

  const systemAlerts = [
    { id: 1, type: 'warning', message: 'Payment gateway experiencing delays', time: '2 hours ago' },
    { id: 2, type: 'error', message: 'Low inventory alert: Textbooks running low', time: '4 hours ago' },
    { id: 3, type: 'info', message: 'Transport route 3 delayed by 15 minutes', time: '6 hours ago' },
  ];

  const recentActivities = [
    { id: 1, action: 'New student registered', user: 'Admin', time: '10 minutes ago' },
    { id: 2, action: 'Assignment submitted', user: 'John Doe', time: '15 minutes ago' },
    { id: 3, action: 'Payment received', user: 'Jane Smith', time: '1 hour ago' },
    { id: 4, action: 'Class schedule updated', user: 'Teacher Mike', time: '2 hours ago' },
    { id: 5, action: 'Exam results published', user: 'Admin', time: '3 hours ago' },
  ];

  const handleKPIClick = (href: string) => {
    navigate(href);
  };

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

      {/* Charts and Finance Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Students by Class Chart */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-soft border border-surface-200">
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
            </div>
          </div>
        </div>

        {/* Recent Payments */}
        <div className="bg-white rounded-2xl p-6 shadow-soft border border-surface-200">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-surface-900">Recent Payments</h3>
            <button 
              onClick={() => navigate('/fees-payments?tab=transactions')}
              className="text-sm text-brand-600 hover:text-brand-700 font-medium"
            >
              View All →
            </button>
          </div>
          <div className="space-y-4">
            {recentPayments.map((payment) => (
              <div key={payment.id} className="flex items-center justify-between p-3 bg-surface-50 rounded-xl">
                <div>
                  <p className="text-sm font-medium text-surface-900">{payment.student}</p>
                  <p className="text-xs text-surface-500">{payment.date}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-surface-900">${payment.amount}</p>
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                    payment.status === 'completed' 
                      ? 'bg-success-100 text-success-800' 
                      : 'bg-warn-100 text-warn-800'
                  }`}>
                    {payment.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Alerts and Activities */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* System Alerts */}
        <div className="bg-white rounded-2xl p-6 shadow-soft border border-surface-200">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-surface-900">System Alerts</h3>
            <ExclamationTriangleIcon className="w-5 h-5 text-warn-500" />
          </div>
          <div className="space-y-4">
            {systemAlerts.map((alert) => (
              <div key={alert.id} className="flex items-start space-x-3 p-3 bg-surface-50 rounded-xl">
                <div className={`w-2 h-2 rounded-full mt-2 ${
                  alert.type === 'error' ? 'bg-error-500' :
                  alert.type === 'warning' ? 'bg-warn-500' : 'bg-brand-500'
                }`} />
                <div className="flex-1">
                  <p className="text-sm text-surface-900">{alert.message}</p>
                  <p className="text-xs text-surface-500 mt-1">{alert.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activities */}
        <div className="bg-white rounded-2xl p-6 shadow-soft border border-surface-200">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-surface-900">Recent Activities</h3>
            <ClockIcon className="w-5 h-5 text-surface-400" />
          </div>
          <div className="space-y-4">
            {recentActivities.map((activity) => (
              <div key={activity.id} className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-brand-500 rounded-full mt-2 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-surface-900 truncate">{activity.action}</p>
                  <div className="flex items-center mt-1">
                    <span className="text-xs text-surface-500">{activity.user}</span>
                    <span className="text-xs text-surface-400 mx-2">•</span>
                    <span className="text-xs text-surface-500">{activity.time}</span>
                  </div>
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

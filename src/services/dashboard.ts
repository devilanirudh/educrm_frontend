import api from './api';

export interface KPIData {
  current: number;
  previous: number;
  change_percentage: number;
  change_type: 'increase' | 'decrease' | 'no_change';
}

export interface ChartDataPoint {
  label: string;
  value: number;
}

export interface RecentActivity {
  id: number;
  action: string;
  details: string;
  timestamp: string;
  user_name?: string;
  user_role?: string;
}

export interface QuickStats {
  pending_assignments: number;
  unread_notifications: number;
  upcoming_events: number;
  overdue_fees: number;
}

export interface AdminDashboardData {
  kpis: {
    total_students: KPIData;
    total_teachers: KPIData;
    active_classes: KPIData;
    attendance_rate: KPIData;
  };
  charts: {
    students_by_class: ChartDataPoint[];
    attendance_trend: ChartDataPoint[];
  };
  recent_activities: RecentActivity[];
  quick_stats: QuickStats;
}

const dashboardService = {
  // Get admin dashboard data
  getAdminDashboard: async (): Promise<AdminDashboardData> => {
    const response = await api.get<AdminDashboardData>('/dashboard/admin/dashboard');
    return response.data;
  },
};

export { dashboardService };
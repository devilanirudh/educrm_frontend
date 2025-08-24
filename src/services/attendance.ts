import api from './api';

export interface AttendanceRecord {
  id: number;
  student_id: number;
  class_id: number;
  date: string;
  status: 'present' | 'absent' | 'late' | 'excused' | 'half_day' | 'sick_leave' | 'personal_leave' | 'emergency_leave';
  check_in_time?: string;
  check_out_time?: string;
  reason?: string;
  notes?: string;
  total_hours?: number;
  expected_hours?: number;
  check_in_location?: { lat: number; lng: number; address?: string };
  check_out_location?: { lat: number; lng: number; address?: string };
  check_in_device?: string;
  check_out_device?: string;
  is_verified: boolean;
  marked_by: number;
  verified_by?: number;
  verified_at?: string;
  created_at: string;
  updated_at: string;
}

export interface AttendancePolicy {
  id: number;
  name: string;
  description?: string;
  class_id?: number;
  academic_year: string;
  school_start_time: string;
  school_end_time: string;
  late_threshold_minutes: number;
  early_departure_threshold_minutes: number;
  minimum_attendance_percentage: number;
  max_consecutive_absences: number;
  max_total_absences: number;
  notify_parents_on_absence: boolean;
  notify_parents_on_late: boolean;
  notify_after_consecutive_absences: number;
  auto_mark_absent_after_minutes?: number;
  allow_self_check_in: boolean;
  allow_self_check_out: boolean;
  grace_period_minutes: number;
  half_day_threshold_hours: number;
  working_days: string[];
  is_active: boolean;
  created_by: number;
  created_at: string;
  updated_at: string;
}

export interface AttendanceSession {
  id: number;
  class_id: number;
  subject_id?: number;
  session_name: string;
  start_time: string;
  end_time: string;
  late_threshold_minutes: number;
  is_required: boolean;
  weight: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface AttendanceReport {
  report_summary: {
    total_records: number;
    present_count: number;
    absent_count: number;
    late_count: number;
    excused_count: number;
    overall_attendance_percentage: number;
    date_range: {
      start_date: string;
      end_date: string;
    };
  };
  student_statistics?: Array<{
    student_id: number;
    student_name: string;
    class_name: string;
    total_days: number;
    present_days: number;
    absent_days: number;
    late_days: number;
    excused_days: number;
    attendance_percentage: number;
    details?: AttendanceRecord[];
  }>;
  detailed_records?: AttendanceRecord[];
}

export interface AttendanceAnalytics {
  summary: {
    total_days: number;
    total_records: number;
    overall_attendance_percentage: number;
    date_range: {
      start_date: string;
      end_date: string;
    };
  };
  status_breakdown: Record<string, number>;
  daily_trends: Array<{
    date: string;
    total: number;
    present: number;
    absent: number;
    late: number;
    excused: number;
    attendance_percentage: number;
  }>;
  top_absent_students: any[];
  improvement_suggestions: any[];
}

export interface BulkAttendanceData {
  class_id: number;
  date: string;
  records: Array<{
    student_id: number;
    class_id: number;
    date: string;
    status: string;
    check_in_time?: string;
    check_out_time?: string;
    reason?: string;
    notes?: string;
    expected_hours?: number;
  }>;
  policy_id?: number;
}

export interface CheckInResponse {
  message: string;
  check_in_time: string;
  status: string;
}

export interface CheckOutResponse {
  message: string;
  check_out_time: string;
  total_hours: number;
}

class AttendanceService {
  // Attendance Records
  async getStudentAttendance(
    studentId: number,
    startDate?: string,
    endDate?: string
  ): Promise<AttendanceReport> {
    const params = new URLSearchParams();
    if (startDate) params.append('start_date', startDate);
    if (endDate) params.append('end_date', endDate);

    const response = await api.get(`/students/${studentId}/attendance?${params}`);
    return response.data;
  }

  async markAttendance(
    studentId: number,
    attendanceData: {
      class_id: number;
      date: string;
      status: string;
      check_in_time?: string;
      check_out_time?: string;
      reason?: string;
    }
  ): Promise<{ message: string }> {
    const response = await api.post(`/students/${studentId}/attendance`, attendanceData);
    return response.data;
  }

  async markBulkAttendance(bulkData: BulkAttendanceData): Promise<{
    message: string;
    success_count: number;
    error_count: number;
    errors: string[];
  }> {
    const response = await api.post('/attendance/bulk', bulkData);
    return response.data;
  }

  // Attendance Policies
  async getAttendancePolicies(params?: {
    class_id?: number;
    academic_year?: string;
    is_active?: boolean;
  }): Promise<{ policies: AttendancePolicy[] }> {
    const queryParams = new URLSearchParams();
    if (params?.class_id) queryParams.append('class_id', params.class_id.toString());
    if (params?.academic_year) queryParams.append('academic_year', params.academic_year);
    if (params?.is_active !== undefined) queryParams.append('is_active', params.is_active.toString());

    const response = await api.get(`/attendance/policies?${queryParams}`);
    return response.data;
  }

  async createAttendancePolicy(policyData: {
    name: string;
    description?: string;
    class_id?: number;
    academic_year: string;
    school_start_time: string;
    school_end_time: string;
    late_threshold_minutes?: number;
    early_departure_threshold_minutes?: number;
    minimum_attendance_percentage?: number;
    max_consecutive_absences?: number;
    max_total_absences?: number;
    notify_parents_on_absence?: boolean;
    notify_parents_on_late?: boolean;
    notify_after_consecutive_absences?: number;
    auto_mark_absent_after_minutes?: number;
    allow_self_check_in?: boolean;
    allow_self_check_out?: boolean;
    grace_period_minutes?: number;
    half_day_threshold_hours?: number;
    working_days?: string[];
  }): Promise<{ message: string; policy_id: number }> {
    const response = await api.post('/attendance/policies', policyData);
    return response.data;
  }

  async updateAttendancePolicy(
    policyId: number,
    policyData: Partial<AttendancePolicy>
  ): Promise<{ message: string }> {
    const response = await api.put(`/attendance/policies/${policyId}`, policyData);
    return response.data;
  }

  async deleteAttendancePolicy(policyId: number): Promise<{ message: string }> {
    const response = await api.delete(`/attendance/policies/${policyId}`);
    return response.data;
  }

  // Attendance Sessions
  async getAttendanceSessions(params?: {
    class_id?: number;
    is_active?: boolean;
  }): Promise<{ sessions: AttendanceSession[] }> {
    const queryParams = new URLSearchParams();
    if (params?.class_id) queryParams.append('class_id', params.class_id.toString());
    if (params?.is_active !== undefined) queryParams.append('is_active', params.is_active.toString());

    const response = await api.get(`/attendance/sessions?${queryParams}`);
    return response.data;
  }

  async createAttendanceSession(sessionData: {
    class_id: number;
    subject_id?: number;
    session_name: string;
    start_time: string;
    end_time: string;
    late_threshold_minutes?: number;
    is_required?: boolean;
    weight?: number;
  }): Promise<{ message: string; session_id: number }> {
    const response = await api.post('/attendance/sessions', sessionData);
    return response.data;
  }

  // Attendance Reports
  async generateAttendanceReport(reportData: {
    class_id?: number;
    student_id?: number;
    start_date: string;
    end_date: string;
    include_details?: boolean;
    group_by?: string;
  }): Promise<AttendanceReport> {
    const response = await api.post('/attendance/reports', reportData);
    return response.data;
  }

  // Attendance Analytics
  async getAttendanceAnalytics(params?: {
    class_id?: number;
    student_id?: number;
    start_date?: string;
    end_date?: string;
  }): Promise<AttendanceAnalytics> {
    const queryParams = new URLSearchParams();
    if (params?.class_id) queryParams.append('class_id', params.class_id.toString());
    if (params?.student_id) queryParams.append('student_id', params.student_id.toString());
    if (params?.start_date) queryParams.append('start_date', params.start_date);
    if (params?.end_date) queryParams.append('end_date', params.end_date);

    const response = await api.get(`/attendance/analytics?${queryParams}`);
    return response.data;
  }

  // Student Self Check-in/Check-out
  async studentCheckIn(data: {
    class_id: number;
    location?: { lat: number; lng: number };
  }): Promise<CheckInResponse> {
    const response = await api.post('/attendance/check-in', data);
    return response.data;
  }

  async studentCheckOut(data: {
    class_id: number;
    location?: { lat: number; lng: number };
  }): Promise<CheckOutResponse> {
    const response = await api.post('/attendance/check-out', data);
    return response.data;
  }

  // Attendance Exceptions
  async createAttendanceException(exceptionData: {
    student_id: number;
    date: string;
    exception_type: string;
    reason: string;
    mark_as_present?: boolean;
    exclude_from_calculation?: boolean;
  }): Promise<{ message: string; exception_id: number }> {
    const response = await api.post('/attendance/exceptions', exceptionData);
    return response.data;
  }

  async getAttendanceExceptions(params?: {
    student_id?: number;
    start_date?: string;
    end_date?: string;
  }): Promise<{ exceptions: any[] }> {
    const queryParams = new URLSearchParams();
    if (params?.student_id) queryParams.append('student_id', params.student_id.toString());
    if (params?.start_date) queryParams.append('start_date', params.start_date);
    if (params?.end_date) queryParams.append('end_date', params.end_date);

    const response = await api.get(`/attendance/exceptions?${queryParams}`);
    return response.data;
  }

  // Attendance Notifications
  async getAttendanceNotifications(params?: {
    student_id?: number;
    notification_type?: string;
    is_sent?: boolean;
  }): Promise<{ notifications: any[] }> {
    const queryParams = new URLSearchParams();
    if (params?.student_id) queryParams.append('student_id', params.student_id.toString());
    if (params?.notification_type) queryParams.append('notification_type', params.notification_type);
    if (params?.is_sent !== undefined) queryParams.append('is_sent', params.is_sent.toString());

    const response = await api.get(`/attendance/notifications?${queryParams}`);
    return response.data;
  }

  // Export Functions
  async exportAttendanceReport(reportData: {
    class_id?: number;
    student_id?: number;
    start_date: string;
    end_date: string;
    format?: 'pdf' | 'excel' | 'csv';
  }): Promise<Blob> {
    const response = await api.post('/attendance/export', reportData, {
      responseType: 'blob'
    });
    return response.data;
  }

  // Utility Functions
  getAttendanceStatusColor(status: string): string {
    switch (status) {
      case 'present': return 'success';
      case 'absent': return 'error';
      case 'late': return 'warning';
      case 'excused': return 'info';
      case 'half_day': return 'warning';
      case 'sick_leave': return 'info';
      case 'personal_leave': return 'info';
      case 'emergency_leave': return 'error';
      default: return 'default';
    }
  }

  getAttendanceStatusLabel(status: string): string {
    switch (status) {
      case 'present': return 'Present';
      case 'absent': return 'Absent';
      case 'late': return 'Late';
      case 'excused': return 'Excused';
      case 'half_day': return 'Half Day';
      case 'sick_leave': return 'Sick Leave';
      case 'personal_leave': return 'Personal Leave';
      case 'emergency_leave': return 'Emergency Leave';
      default: return status;
    }
  }

  calculateAttendancePercentage(present: number, total: number): number {
    if (total === 0) return 0;
    return Math.round((present / total) * 100);
  }

  formatTime(timeString: string): string {
    if (!timeString) return '-';
    const date = new Date(timeString);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  }

  formatDate(dateString: string): string {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }
}

export const attendanceService = new AttendanceService();
export default attendanceService;

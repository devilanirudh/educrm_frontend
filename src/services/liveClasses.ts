import api from './api';

export interface LiveClass {
  id: number;
  topic: string;
  start_time: string;
  duration: number;
  status: 'scheduled' | 'in_progress' | 'completed' | 'canceled';
  recording_url?: string;
  teacher_id: number;
  class_id: number;
  
  // Jitsi Meet specific fields
  jitsi_room_name?: string;
  jitsi_meeting_url?: string;
  jitsi_meeting_id?: string;
  jitsi_settings?: any;
  jitsi_token?: string;
  description?: string;
  max_participants?: number;
  is_password_protected?: boolean;
  meeting_password?: string;
  allow_join_before_host?: boolean;
  mute_upon_entry?: boolean;
  video_off_upon_entry?: boolean;
  enable_chat?: boolean;
  enable_whiteboard?: boolean;
  enable_screen_sharing?: boolean;
  enable_recording?: boolean;
  enable_breakout_rooms?: boolean;
  enable_polls?: boolean;
  enable_reactions?: boolean;
  
  // Related data
  teacher?: {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
  };
  class?: {
    id: number;
    name: string;
    section?: string;
  };
}

export interface LiveClassCreate {
  topic: string;
  start_time: string;
  duration: number;
  class_id: number;
  description?: string;
  max_participants?: number;
  is_password_protected?: boolean;
  meeting_password?: string;
  allow_join_before_host?: boolean;
  mute_upon_entry?: boolean;
  video_off_upon_entry?: boolean;
  enable_chat?: boolean;
  enable_whiteboard?: boolean;
  enable_screen_sharing?: boolean;
  enable_recording?: boolean;
  enable_breakout_rooms?: boolean;
  enable_polls?: boolean;
  enable_reactions?: boolean;
}

export interface LiveClassJoinResponse {
  success: boolean;
  meeting_url: string;
  jitsi_token: string;
  participant_name: string;
  participant_role: string;
  settings: any;
  attendance_id: number;
}

export interface ClassAttendance {
  id: number;
  join_time: string;
  leave_time?: string;
  live_class_id: number;
  user_id: number;
  jitsi_participant_id?: string;
  jitsi_join_token?: string;
  connection_quality?: string;
  device_info?: any;
  user?: {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
  };
}

export interface LiveClassInfo {
  live_class: LiveClass;
  jitsi_info: any;
  meeting_url: string;
  room_name: string;
}

class LiveClassesService {
  // Get all live classes (filtered by user role)
  async getLiveClasses(skip: number = 0, limit: number = 100): Promise<LiveClass[]> {
    const response = await api.get(`/live-classes/?skip=${skip}&limit=${limit}`);
    return response.data;
  }

  // Create a new live class (admin/teacher only)
  async createLiveClass(liveClassData: LiveClassCreate): Promise<LiveClass> {
    const response = await api.post('/live-classes/', liveClassData);
    return response.data;
  }

  // Get a specific live class
  async getLiveClass(id: number): Promise<LiveClass> {
    const response = await api.get(`/live-classes/${id}`);
    return response.data;
  }

  // Get detailed live class info including Jitsi meeting info
  async getLiveClassInfo(id: number): Promise<LiveClassInfo> {
    const response = await api.get(`/live-classes/${id}/info`);
    return response.data;
  }

  // Start a live class (teacher only)
  async startLiveClass(id: number): Promise<LiveClass> {
    const response = await api.post(`/live-classes/${id}/start`);
    return response.data;
  }

  // End a live class (teacher only)
  async endLiveClass(id: number): Promise<LiveClass> {
    const response = await api.post(`/live-classes/${id}/end`);
    return response.data;
  }

  // Join a live class
  async joinLiveClass(id: number): Promise<LiveClassJoinResponse> {
    const response = await api.post(`/live-classes/${id}/join`);
    return response.data;
  }

  // Leave a live class
  async leaveLiveClass(id: number): Promise<ClassAttendance> {
    const response = await api.post(`/live-classes/${id}/leave`);
    return response.data;
  }

  // Get attendance for a live class
  async getLiveClassAttendance(id: number): Promise<ClassAttendance[]> {
    const response = await api.get(`/live-classes/${id}/attendance`);
    return response.data;
  }

  // Update live class settings
  async updateLiveClass(id: number, updates: Partial<LiveClassCreate>): Promise<LiveClass> {
    const response = await api.put(`/live-classes/${id}`, updates);
    return response.data;
  }

  // Delete a live class
  async deleteLiveClass(id: number): Promise<void> {
    await api.delete(`/live-classes/${id}`);
  }

  // Get upcoming live classes
  async getUpcomingLiveClasses(): Promise<LiveClass[]> {
    const response = await api.get('/live-classes/?status=scheduled');
    return response.data;
  }

  // Get live classes by class
  async getLiveClassesByClass(classId: number): Promise<LiveClass[]> {
    const response = await api.get(`/live-classes/?class_id=${classId}`);
    return response.data;
  }

  // Get live classes by teacher
  async getLiveClassesByTeacher(teacherId: number): Promise<LiveClass[]> {
    const response = await api.get(`/live-classes/?teacher_id=${teacherId}`);
    return response.data;
  }

  // Generate Jitsi meeting URL
  generateJitsiMeetingUrl(roomName: string): string {
    return `https://ec2-16-171-4-237.eu-north-1.compute.amazonaws.com:8443/${roomName}`;
  }

  // Format date for display
  formatDateTime(dateTime: string): string {
    return new Date(dateTime).toLocaleString();
  }

  // Get status badge color
  getStatusColor(status: string): string {
    switch (status) {
      case 'scheduled':
        return 'bg-blue-100 text-blue-800';
      case 'in_progress':
        return 'bg-green-100 text-green-800';
      case 'completed':
        return 'bg-gray-100 text-gray-800';
      case 'canceled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  }

  // Check if user can join class
  canJoinClass(liveClass: LiveClass, userRole: string): boolean {
    if (liveClass.status !== 'in_progress') {
      return false;
    }
    
    // Admins and Super Admins can join active classes
    if (userRole === 'admin' || userRole === 'super_admin') {
      return true;
    }
    
    // Teachers can always join
    if (userRole === 'teacher') {
      return true;
    }
    
    // Students can join if class is active
    if (userRole === 'student') {
      return true;
    }
    
    return false;
  }

  // Check if user can manage class
  canManageClass(liveClass: LiveClass, userId: number, userRole: string): boolean {
    if (userRole === 'admin' || userRole === 'super_admin') {
      return true;
    }
    
    if (userRole === 'teacher' && liveClass.teacher_id === userId) {
      return true;
    }
    
    return false;
  }
}

export const liveClassesService = new LiveClassesService();

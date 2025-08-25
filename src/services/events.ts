import api from './api';

export interface Event {
  id: number;
  title: string;
  description?: string;
  event_type: string;
  date: string;
  start_time?: string;
  end_time?: string;
  location?: string;
  target_type: string;
  target_class_id?: number;
  status: string;
  created_by: number;
  created_at: string;
  updated_at: string;
  creator_name?: string;
  target_class_name?: string;
}

export interface EventCreateRequest {
  title: string;
  description?: string;
  event_type?: string;
  start?: string;  // ISO datetime string
  end?: string;    // ISO datetime string
  location?: string;
  audience?: string;  // 'all', 'teachers', 'class'
  target_class_id?: number;
}

export interface EventUpdateRequest {
  title?: string;
  description?: string;
  event_type?: string;
  start?: string;
  end?: string;
  location?: string;
  audience?: string;
  target_class_id?: number;
  status?: string;
}

class EventsService {
  // Get all events (role-based filtering)
  async getEvents(params?: {
    skip?: number;
    limit?: number;
    target_type?: string;
    status?: string;
  }): Promise<Event[]> {
    const queryParams = new URLSearchParams();
    if (params?.skip) queryParams.append('skip', params.skip.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.target_type) queryParams.append('target_type', params.target_type);
    if (params?.status) queryParams.append('status', params.status);

    const response = await api.get(`/events?${queryParams}`);
    return response.data;
  }

  // Get specific event
  async getEvent(id: number): Promise<Event> {
    const response = await api.get(`/events/${id}`);
    return response.data;
  }

  // Create new event
  async createEvent(data: EventCreateRequest): Promise<Event> {
    const response = await api.post('/events', data);
    return response.data;
  }

  // Update event
  async updateEvent(id: number, data: EventUpdateRequest): Promise<Event> {
    const response = await api.put(`/events/${id}`, data);
    return response.data;
  }

  // Delete event
  async deleteEvent(id: number): Promise<{ message: string }> {
    const response = await api.delete(`/events/${id}`);
    return response.data;
  }

  // Get student's events
  async getMyEvents(): Promise<Event[]> {
    const response = await api.get('/events/my-events');
    return response.data;
  }

  // Get parent's child events
  async getChildEvents(): Promise<Event[]> {
    const response = await api.get('/events/child-events');
    return response.data;
  }

  // Utility functions
  formatEventDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }

  formatEventTime(timeString?: string): string {
    if (!timeString) return '';
    const date = new Date(`2000-01-01T${timeString}`);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  }

  getTargetTypeLabel(targetType: string): string {
    switch (targetType) {
      case 'school_wide': return 'All School';
      case 'teachers': return 'Teachers Only';
      case 'class_specific': return 'Specific Class';
      default: return targetType;
    }
  }

  getStatusColor(status: string): string {
    switch (status) {
      case 'active': return 'success';
      case 'cancelled': return 'error';
      case 'completed': return 'info';
      default: return 'default';
    }
  }
}

export const eventsService = new EventsService();
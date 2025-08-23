/**
 * Teacher management service
 */

import api, { buildUrl, upload } from './api';
import { PaginatedResponse, QueryParams } from '../types/api';

// Teacher types
export interface Teacher {
  id: number;
  employee_id: string;
  qualifications?: string;
  specialization?: string;
  experience?: number;
  hire_date: string;
  department?: string;
  designation?: string;
  employment_type: string;
  salary?: number;
  bank_account_number?: string;
  bank_name?: string;
  bank_ifsc?: string;
  alternative_phone?: string;
  emergency_contact_name?: string;
  emergency_contact_phone?: string;
  emergency_contact_relationship?: string;
  last_appraisal_date?: string;
  next_appraisal_date?: string;
  performance_rating?: number;
  is_active: boolean;
  resignation_date?: string;
  resignation_reason?: string;
  teaching_philosophy?: string;
  awards_recognitions?: string;
  publications?: string;
  created_at: string;
  updated_at: string;
  dynamic_data?: Record<string, any>;
  
  // Relationships
  user: {
    id: number;
    email: string;
    first_name: string;
    last_name: string;
    phone?: string;
    profile_picture?: string;
    date_of_birth?: string;
    gender?: string;
    address?: string;
    city?: string;
    state?: string;
    country?: string;
    postal_code?: string;
  };
  subjects?: Array<{
    id: number;
    name: string;
    code: string;
    description?: string;
    credits?: number;
  }>;
  classes?: Array<{
    id: number;
    name: string;
    section?: string;
    academic_year: string;
  }>;
}

export interface TeacherCreateRequest {
  user_data: {
    email: string;
    first_name: string;
    last_name: string;
    password: string;
    phone?: string;
    date_of_birth?: string;
    gender?: string;
    address?: string;
    city?: string;
    state?: string;
    country?: string;
    postal_code?: string;
  };
  employee_id: string;
  qualifications?: string;
  specialization?: string;
  experience?: number;
  hire_date: string;
  department?: string;
  designation?: string;
  employment_type: string;
  salary?: number;
  bank_account_number?: string;
  bank_name?: string;
  bank_ifsc?: string;
  alternative_phone?: string;
  emergency_contact_name?: string;
  emergency_contact_phone?: string;
  emergency_contact_relationship?: string;
  teaching_philosophy?: string;
  awards_recognitions?: string;
  publications?: string;
}

export interface TeacherUpdateRequest {
  user_data?: {
    first_name?: string;
    last_name?: string;
    phone?: string;
    date_of_birth?: string;
    gender?: string;
    address?: string;
    city?: string;
    state?: string;
    country?: string;
    postal_code?: string;
  };
  qualifications?: string;
  specialization?: string;
  experience?: number;
  department?: string;
  designation?: string;
  employment_type?: string;
  salary?: number;
  bank_account_number?: string;
  bank_name?: string;
  bank_ifsc?: string;
  alternative_phone?: string;
  emergency_contact_name?: string;
  emergency_contact_phone?: string;
  emergency_contact_relationship?: string;
  last_appraisal_date?: string;
  next_appraisal_date?: string;
  performance_rating?: number;
  is_active?: boolean;
  resignation_date?: string;
  resignation_reason?: string;
  teaching_philosophy?: string;
  awards_recognitions?: string;
  publications?: string;
}

export interface TeacherFilters extends QueryParams {
  limit?: number;
  department?: string;
  designation?: string;
  employment_type?: string;
  is_active?: boolean;
  specialization?: string;
  experience_min?: number;
  experience_max?: number;
  hire_date_from?: string;
  hire_date_to?: string;
  filters?: Record<string, any>;
}

export const teachersService = {
  // Get all teachers with pagination and filters
  getTeachers: async (params?: TeacherFilters): Promise<PaginatedResponse<Teacher>> => {
    const url = buildUrl('/teachers', params);
    const response = await api.get<PaginatedResponse<Teacher>>(url);
    return response.data;
  },

  // Get teacher by ID
  getTeacher: async (id: number): Promise<Teacher> => {
    const response = await api.get<Teacher>(`/teachers/${id}`);
    return response.data;
  },

  // Create new teacher
  createTeacher: async (data: TeacherCreateRequest): Promise<Teacher> => {
    const response = await api.post<Teacher>('/teachers', data);
    return response.data;
  },

  // Create teacher from dynamic form data
  createTeacherFromDynamicForm: async (dynamicData: Record<string, any>): Promise<any> => {
    const response = await api.post('/teachers/dynamic', { dynamic_data: dynamicData });
    return response.data;
  },

  // Update teacher
  updateTeacher: async (id: number, data: TeacherUpdateRequest): Promise<Teacher> => {
    const response = await api.put<Teacher>(`/teachers/${id}`, data);
    return response.data;
  },

  // Delete teacher
  deleteTeacher: async (id: number): Promise<void> => {
    const response = await api.delete(`/teachers/${id}`);
    return response.data;
  },

  // Get teacher subjects
  getTeacherSubjects: async (id: number): Promise<any[]> => {
    const response = await api.get<any[]>(`/teachers/${id}/subjects`);
    return response.data;
  },

  // Get teacher classes
  getTeacherClasses: async (id: number): Promise<any[]> => {
    const response = await api.get<any[]>(`/teachers/${id}/classes`);
    return response.data;
  },

  // Get teacher timetable
  getTeacherTimetable: async (id: number): Promise<any> => {
    const response = await api.get(`/teachers/${id}/timetable`);
    return response.data;
  },

  // Get teacher attendance
  getTeacherAttendance: async (id: number, params?: { start_date?: string; end_date?: string }): Promise<any[]> => {
    const url = buildUrl(`/teachers/${id}/attendance`, params);
    const response = await api.get<any[]>(url);
    return response.data;
  },

  // Get teacher assignments
  getTeacherAssignments: async (id: number, params?: { status?: string; class_id?: number }): Promise<any[]> => {
    const url = buildUrl(`/teachers/${id}/assignments`, params);
    const response = await api.get<any[]>(url);
    return response.data;
  },

  // Get teacher exams
  getTeacherExams: async (id: number, params?: { status?: string; class_id?: number }): Promise<any[]> => {
    const url = buildUrl(`/teachers/${id}/exams`, params);
    const response = await api.get<any[]>(url);
    return response.data;
  },

  // Teacher performance
  getTeacherPerformance: async (id: number, params?: { period?: string }): Promise<any[]> => {
    const url = buildUrl(`/teachers/${id}/performance`, params);
    const response = await api.get<any[]>(url);
    return response.data;
  },

  // Add teacher performance evaluation
  addPerformanceEvaluation: async (id: number, data: any): Promise<any> => {
    const response = await api.post(`/teachers/${id}/performance`, data);
    return response.data;
  },

  // Teacher qualifications
  getTeacherQualifications: async (id: number): Promise<any[]> => {
    const response = await api.get<any[]>(`/teachers/${id}/qualifications`);
    return response.data;
  },

  addQualification: async (id: number, data: any): Promise<any> => {
    const response = await api.post(`/teachers/${id}/qualifications`, data);
    return response.data;
  },

  updateQualification: async (id: number, qualificationId: number, data: any): Promise<any> => {
    const response = await api.put(`/teachers/${id}/qualifications/${qualificationId}`, data);
    return response.data;
  },

  deleteQualification: async (id: number, qualificationId: number): Promise<void> => {
    const response = await api.delete(`/teachers/${id}/qualifications/${qualificationId}`);
    return response.data;
  },

  // Teacher training
  getTeacherTraining: async (id: number): Promise<any[]> => {
    const response = await api.get<any[]>(`/teachers/${id}/training`);
    return response.data;
  },

  addTraining: async (id: number, data: any): Promise<any> => {
    const response = await api.post(`/teachers/${id}/training`, data);
    return response.data;
  },

  updateTraining: async (id: number, trainingId: number, data: any): Promise<any> => {
    const response = await api.put(`/teachers/${id}/training/${trainingId}`, data);
    return response.data;
  },

  deleteTraining: async (id: number, trainingId: number): Promise<void> => {
    const response = await api.delete(`/teachers/${id}/training/${trainingId}`);
    return response.data;
  },

  // Teacher documents
  getTeacherDocuments: async (id: number): Promise<any[]> => {
    const response = await api.get<any[]>(`/teachers/${id}/documents`);
    return response.data;
  },

  uploadDocument: async (id: number, file: File, documentType: string, documentName: string): Promise<any> => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('document_type', documentType);
    formData.append('document_name', documentName);
    const response = await api.post(`/teachers/${id}/documents`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  },

  deleteDocument: async (id: number, documentId: number): Promise<void> => {
    const response = await api.delete(`/teachers/${id}/documents/${documentId}`);
    return response.data;
  },

  // Teacher leave management
  getTeacherLeaves: async (id: number, params?: { status?: string; leave_type?: string }): Promise<any[]> => {
    const url = buildUrl(`/teachers/${id}/leaves`, params);
    const response = await api.get<any[]>(url);
    return response.data;
  },

  applyLeave: async (id: number, data: any): Promise<any> => {
    const response = await api.post(`/teachers/${id}/leaves`, data);
    return response.data;
  },

  updateLeave: async (id: number, leaveId: number, data: any): Promise<any> => {
    const response = await api.put(`/teachers/${id}/leaves/${leaveId}`, data);
    return response.data;
  },

  approveLeave: async (id: number, leaveId: number): Promise<any> => {
    const response = await api.post(`/teachers/${id}/leaves/${leaveId}/approve`);
    return response.data;
  },

  rejectLeave: async (id: number, leaveId: number, reason: string): Promise<any> => {
    const response = await api.post(`/teachers/${id}/leaves/${leaveId}/reject`, { reason });
    return response.data;
  },

  // Bulk operations
  bulkUpdateTeachers: async (teacher_ids: number[], data: Partial<TeacherUpdateRequest>): Promise<any> => {
    const response = await api.post('/teachers/bulk-update', { teacher_ids, data });
    return response.data;
  },

  bulkDeleteTeachers: async (teacher_ids: number[]): Promise<any> => {
    const response = await api.post('/teachers/bulk-delete', { teacher_ids });
    return response.data;
  },

  // Import/Export
  exportTeachers: async (params?: TeacherFilters): Promise<Blob> => {
    const url = buildUrl('/teachers/export', params);
    const response = await api.get(url, { responseType: 'blob' });
    return response.data;
  },

  importTeachers: async (file: File): Promise<any> => {
    const response = await upload('/teachers/import', file);
    return response.data;
  },

  // Teacher statistics
  getTeacherStats: async (params?: { department?: string; employment_type?: string }): Promise<any> => {
    const url = buildUrl('/teachers/stats', params);
    const response = await api.get(url);
    return response.data;
  },

  getTeacherHeadcountTrend: async (): Promise<any> => {
    const response = await api.get('/teachers/stats/headcount-trend');
    return response.data;
  },

  // Generate teacher ID card
  generateTeacherCard: async (id: number): Promise<Blob> => {
    const response = await api.get(`/teachers/${id}/id-card`, { responseType: 'blob' });
    return response.data;
  },

  // Upload teacher photo
  uploadTeacherPhoto: async (id: number, file: File): Promise<any> => {
    const response = await upload(`/teachers/${id}/photo`, file);
    return response.data;
  },

  // Get teacher dashboard data
  getTeacherDashboard: async (id: number): Promise<any> => {
    const response = await api.get(`/teachers/${id}/dashboard`);
    return response.data;
  },

  // Assign subjects to teacher
  assignSubjects: async (id: number, subject_ids: number[]): Promise<any> => {
    const response = await api.post(`/teachers/${id}/assign-subjects`, { subject_ids });
    return response.data;
  },

  // Assign classes to teacher
  assignClasses: async (id: number, class_ids: number[]): Promise<any> => {
    const response = await api.post(`/teachers/${id}/assign-classes`, { class_ids });
    return response.data;
  },

  // Generate PDF
  generatePdf: async (id: number): Promise<Blob> => {
    const response = await api.get(`/teachers/${id}/pdf`, { responseType: 'blob' });
    return response.data;
  },
};

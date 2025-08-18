/**
 * Teacher management service
 */

import { api, buildUrl } from './api';
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
  department?: string;
  designation?: string;
  employment_type?: string;
  is_active?: boolean;
  specialization?: string;
  experience_min?: number;
  experience_max?: number;
  hire_date_from?: string;
  hire_date_to?: string;
}

export const teachersService = {
  // Get all teachers with pagination and filters
  getTeachers: async (params?: TeacherFilters): Promise<PaginatedResponse<Teacher>> => {
    const url = buildUrl('/teachers', params);
    return api.get<PaginatedResponse<Teacher>>(url);
  },

  // Get teacher by ID
  getTeacher: async (id: number): Promise<Teacher> => {
    return api.get<Teacher>(`/teachers/${id}`);
  },

  // Create new teacher
  createTeacher: async (data: TeacherCreateRequest): Promise<Teacher> => {
    return api.post<Teacher>('/teachers', data);
  },

  // Update teacher
  updateTeacher: async (id: number, data: TeacherUpdateRequest): Promise<Teacher> => {
    return api.put<Teacher>(`/teachers/${id}`, data);
  },

  // Delete teacher
  deleteTeacher: async (id: number): Promise<void> => {
    return api.delete(`/teachers/${id}`);
  },

  // Get teacher subjects
  getTeacherSubjects: async (id: number): Promise<any[]> => {
    return api.get<any[]>(`/teachers/${id}/subjects`);
  },

  // Get teacher classes
  getTeacherClasses: async (id: number): Promise<any[]> => {
    return api.get<any[]>(`/teachers/${id}/classes`);
  },

  // Get teacher timetable
  getTeacherTimetable: async (id: number): Promise<any> => {
    return api.get(`/teachers/${id}/timetable`);
  },

  // Get teacher attendance
  getTeacherAttendance: async (id: number, params?: { start_date?: string; end_date?: string }): Promise<any[]> => {
    const url = buildUrl(`/teachers/${id}/attendance`, params);
    return api.get<any[]>(url);
  },

  // Get teacher assignments
  getTeacherAssignments: async (id: number, params?: { status?: string; class_id?: number }): Promise<any[]> => {
    const url = buildUrl(`/teachers/${id}/assignments`, params);
    return api.get<any[]>(url);
  },

  // Get teacher exams
  getTeacherExams: async (id: number, params?: { status?: string; class_id?: number }): Promise<any[]> => {
    const url = buildUrl(`/teachers/${id}/exams`, params);
    return api.get<any[]>(url);
  },

  // Teacher performance
  getTeacherPerformance: async (id: number, params?: { period?: string }): Promise<any[]> => {
    const url = buildUrl(`/teachers/${id}/performance`, params);
    return api.get<any[]>(url);
  },

  // Add teacher performance evaluation
  addPerformanceEvaluation: async (id: number, data: any): Promise<any> => {
    return api.post(`/teachers/${id}/performance`, data);
  },

  // Teacher qualifications
  getTeacherQualifications: async (id: number): Promise<any[]> => {
    return api.get<any[]>(`/teachers/${id}/qualifications`);
  },

  addQualification: async (id: number, data: any): Promise<any> => {
    return api.post(`/teachers/${id}/qualifications`, data);
  },

  updateQualification: async (id: number, qualificationId: number, data: any): Promise<any> => {
    return api.put(`/teachers/${id}/qualifications/${qualificationId}`, data);
  },

  deleteQualification: async (id: number, qualificationId: number): Promise<void> => {
    return api.delete(`/teachers/${id}/qualifications/${qualificationId}`);
  },

  // Teacher training
  getTeacherTraining: async (id: number): Promise<any[]> => {
    return api.get<any[]>(`/teachers/${id}/training`);
  },

  addTraining: async (id: number, data: any): Promise<any> => {
    return api.post(`/teachers/${id}/training`, data);
  },

  updateTraining: async (id: number, trainingId: number, data: any): Promise<any> => {
    return api.put(`/teachers/${id}/training/${trainingId}`, data);
  },

  deleteTraining: async (id: number, trainingId: number): Promise<void> => {
    return api.delete(`/teachers/${id}/training/${trainingId}`);
  },

  // Teacher documents
  getTeacherDocuments: async (id: number): Promise<any[]> => {
    return api.get<any[]>(`/teachers/${id}/documents`);
  },

  uploadDocument: async (id: number, file: File, documentType: string, documentName: string): Promise<any> => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('document_type', documentType);
    formData.append('document_name', documentName);
    return api.post(`/teachers/${id}/documents`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  },

  deleteDocument: async (id: number, documentId: number): Promise<void> => {
    return api.delete(`/teachers/${id}/documents/${documentId}`);
  },

  // Teacher leave management
  getTeacherLeaves: async (id: number, params?: { status?: string; leave_type?: string }): Promise<any[]> => {
    const url = buildUrl(`/teachers/${id}/leaves`, params);
    return api.get<any[]>(url);
  },

  applyLeave: async (id: number, data: any): Promise<any> => {
    return api.post(`/teachers/${id}/leaves`, data);
  },

  updateLeave: async (id: number, leaveId: number, data: any): Promise<any> => {
    return api.put(`/teachers/${id}/leaves/${leaveId}`, data);
  },

  approveLeave: async (id: number, leaveId: number): Promise<any> => {
    return api.post(`/teachers/${id}/leaves/${leaveId}/approve`);
  },

  rejectLeave: async (id: number, leaveId: number, reason: string): Promise<any> => {
    return api.post(`/teachers/${id}/leaves/${leaveId}/reject`, { reason });
  },

  // Bulk operations
  bulkUpdateTeachers: async (teacher_ids: number[], data: Partial<TeacherUpdateRequest>): Promise<any> => {
    return api.post('/teachers/bulk-update', { teacher_ids, data });
  },

  bulkDeleteTeachers: async (teacher_ids: number[]): Promise<any> => {
    return api.post('/teachers/bulk-delete', { teacher_ids });
  },

  // Import/Export
  exportTeachers: async (params?: TeacherFilters): Promise<Blob> => {
    const url = buildUrl('/teachers/export', params);
    return api.get(url, { responseType: 'blob' });
  },

  importTeachers: async (file: File): Promise<any> => {
    return api.upload('/teachers/import', file);
  },

  // Teacher statistics
  getTeacherStats: async (params?: { department?: string; employment_type?: string }): Promise<any> => {
    const url = buildUrl('/teachers/stats', params);
    return api.get(url);
  },

  // Generate teacher ID card
  generateTeacherCard: async (id: number): Promise<Blob> => {
    return api.get(`/teachers/${id}/id-card`, { responseType: 'blob' });
  },

  // Upload teacher photo
  uploadTeacherPhoto: async (id: number, file: File): Promise<any> => {
    return api.upload(`/teachers/${id}/photo`, file);
  },

  // Get teacher dashboard data
  getTeacherDashboard: async (id: number): Promise<any> => {
    return api.get(`/teachers/${id}/dashboard`);
  },

  // Assign subjects to teacher
  assignSubjects: async (id: number, subject_ids: number[]): Promise<any> => {
    return api.post(`/teachers/${id}/assign-subjects`, { subject_ids });
  },

  // Assign classes to teacher
  assignClasses: async (id: number, class_ids: number[]): Promise<any> => {
    return api.post(`/teachers/${id}/assign-classes`, { class_ids });
  },
};

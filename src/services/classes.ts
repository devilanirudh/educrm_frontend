/**
 * Class management service
 */

import api, { buildUrl, upload } from './api';
import { PaginatedResponse, QueryParams } from '../types/api';

// Class types
export interface Class {
  id: number;
  name: string;
  section: string;
  stream?: string;
  grade_level: number;
  academic_year: string;
  max_students?: number;
  room_number?: string;
  class_teacher_id?: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  dynamic_data?: Record<string, any>;

  // Relationships
  class_teacher?: {
    id: number;
    first_name: string;
    last_name: string;
  };
  subjects?: Array<{
    id: number;
    name: string;
    code: string;
  }>;
  students?: Array<{
    id: number;
    first_name: string;
    last_name: string;
  }>;
}

export interface ClassCreateRequest {
  name: string;
  section: string;
  stream?: string;
  grade_level: number;
  academic_year: string;
  max_students?: number;
  room_number?: string;
  class_teacher_id?: number;
  dynamic_data?: Record<string, any>;
}

export interface ClassUpdateRequest {
  name?: string;
  section?: string;
  stream?: string;
  grade_level?: number;
  academic_year?: string;
  max_students?: number;
  room_number?: string;
  class_teacher_id?: number;
  is_active?: boolean;
  dynamic_data?: Record<string, any>;
}

export interface ClassFilters extends QueryParams {
  limit?: number;
  grade_level?: number;
  section?: string;
  stream?: string;
  academic_year?: string;
  class_teacher_id?: number;
  is_active?: boolean;
  filters?: Record<string, any>;
}

export const classesService = {
  // Get all classes with pagination and filters
  getClasses: async (params?: ClassFilters): Promise<PaginatedResponse<Class>> => {
    const url = buildUrl('/classes', params);
    const response = await api.get<PaginatedResponse<Class>>(url);
    return response.data;
  },

  // Get class by ID
  getClass: async (id: number): Promise<Class> => {
    const response = await api.get<Class>(`/classes/${id}`);
    return response.data;
  },

  // Create new class
  createClass: async (data: ClassCreateRequest): Promise<Class> => {
    const response = await api.post<Class>('/classes', data);
    return response.data;
  },

  // Create class from dynamic form data
  createClassFromDynamicForm: async (dynamicData: Record<string, any>): Promise<any> => {
    const response = await api.post('/classes/dynamic', { dynamic_data: dynamicData });
    return response.data;
  },

  // Update class
  updateClass: async (id: number, data: ClassUpdateRequest): Promise<Class> => {
    const response = await api.put<Class>(`/classes/${id}`, data);
    return response.data;
  },

  // Delete class
  deleteClass: async (id: number): Promise<void> => {
    const response = await api.delete(`/classes/${id}`);
    return response.data;
  },

  // Toggle class status (activate/deactivate)
  toggleClassStatus: async (id: number): Promise<{ message: string; is_active: boolean }> => {
    const response = await api.patch(`/classes/${id}/toggle-status`);
    return response.data;
  },

  // Get class students
  getClassStudents: async (id: number, params?: { is_active?: boolean }): Promise<{students: any[], total: number, class: any}> => {
    const url = buildUrl(`/classes/${id}/students`, params);
    const response = await api.get<{students: any[], total: number, class: any}>(url);
    return response.data;
  },

  // Get class subjects
  getClassSubjects: async (id: number): Promise<any[]> => {
    const response = await api.get<any[]>(`/classes/${id}/subjects`);
    return response.data;
  },

  // Assign students to class
  assignStudents: async (id: number, student_ids: number[]): Promise<any> => {
    const response = await api.post(`/classes/${id}/assign-students`, { student_ids });
    return response.data;
  },

  // Assign subjects to class
  assignSubjects: async (id: number, subject_ids: number[]): Promise<any> => {
    const response = await api.post(`/classes/${id}/assign-subjects`, { subject_ids });
    return response.data;
  },

  // Assign teacher to class
  assignTeacher: async (id: number, teacher_id: number): Promise<any> => {
    const response = await api.post(`/classes/${id}/assign-teacher`, { teacher_id });
    return response.data;
  },

  // Bulk operations
  bulkUpdateClasses: async (class_ids: number[], data: Partial<ClassUpdateRequest>): Promise<any> => {
    const response = await api.post('/classes/bulk-update', { class_ids, data });
    return response.data;
  },

  bulkDeleteClasses: async (class_ids: number[]): Promise<any> => {
    const response = await api.post('/classes/bulk-delete', { class_ids });
    return response.data;
  },

  // Import/Export
  exportClasses: async (params?: ClassFilters): Promise<Blob> => {
    const url = buildUrl('/classes/export', params);
    const response = await api.get(url, { responseType: 'blob' });
    return response.data;
  },

  importClasses: async (file: File): Promise<any> => {
    const response = await upload('/classes/import', file);
    return response.data;
  },

  // Class statistics
  getClassStats: async (params?: { academic_year?: string }): Promise<any> => {
    const url = buildUrl('/classes/stats', params);
    const response = await api.get(url);
    return response.data;
  },

  // Generate class report
  generateClassReport: async (id: number, params?: { report_type?: string }): Promise<Blob> => {
    const url = buildUrl(`/classes/${id}/report`, params);
    const response = await api.get(url, { responseType: 'blob' });
    return response.data;
  },
};
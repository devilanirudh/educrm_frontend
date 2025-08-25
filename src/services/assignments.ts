/**
 * Assignment management service
 */

import api, { buildUrl, upload } from './api';
import { PaginatedResponse, QueryParams } from '../types/api';

// Assignment types
export interface Assignment {
  id: number;
  title: string;
  description?: string;
  class_id: number;
  subject_id: number;
  teacher_id: number;
  due_date: string;
  instructions?: string;
  max_score?: number;
  is_published: boolean;
  status?: string;
  created_at: string;
  updated_at: string;
  dynamic_data?: Record<string, any>;

  // Relationships
  class?: {
    id: number;
    name: string;
    section: string;
  };
  subject?: {
    id: number;
    name: string;
    code: string;
  };
  teacher?: {
    id: number;
    first_name: string;
    last_name: string;
  };
  submissions?: Array<{
    id: number;
    student_id: number;
    submitted_at: string;
    status: string;
  }>;
}

export interface AssignmentCreateRequest {
  title: string;
  description?: string;
  teacher_id: number;
  class_id: number;
  subject_id: number;
  due_date: string;
  instructions?: string;
  max_score?: number;
  is_published?: boolean;
  dynamic_data?: Record<string, any>;
}

export interface AssignmentUpdateRequest {
  title?: string;
  description?: string;
  class_id?: number;
  subject_id?: number;
  teacher_id?: number;
  due_date?: string;
  instructions?: string;
  max_score?: number;
  is_published?: boolean;
  dynamic_data?: Record<string, any>;
}

export interface AssignmentFilters extends QueryParams {
  limit?: number;
  class_id?: number;
  subject_id?: number;
  teacher_id?: number;
  is_published?: boolean;
  due_date_from?: string;
  due_date_to?: string;
  max_score_min?: number;
  max_score_max?: number;
  filters?: Record<string, any>;
}

export const assignmentsService = {
  // Get all assignments with pagination and filters
  getAssignments: async (params?: AssignmentFilters): Promise<PaginatedResponse<Assignment>> => {
    const url = buildUrl('/assignments', params);
    const response = await api.get<PaginatedResponse<Assignment>>(url);
    return response.data;
  },

  // Get assignments for the current teacher (teacher-specific)
  getMyCreatedAssignments: async (params?: AssignmentFilters): Promise<PaginatedResponse<Assignment>> => {
    const url = buildUrl('/assignments/my-created-assignments', params);
    const response = await api.get<PaginatedResponse<Assignment>>(url);
    return response.data;
  },

  // Get assignments for the current student (student-specific)
  getMyAssignments: async (params?: { 
    skip?: number; 
    limit?: number; 
    search?: string; 
    subject_id?: number; 
    status?: string; 
  }): Promise<{
    assignments: Assignment[];
    total: number;
    page: number;
    pages: number;
    has_next: boolean;
    has_prev: boolean;
  }> => {
    const url = buildUrl('/assignments/my-assignments', params);
    const response = await api.get<{
      assignments: Assignment[];
      total: number;
      page: number;
      pages: number;
      has_next: boolean;
      has_prev: boolean;
    }>(url);
    return response.data;
  },

  // Get assignment by ID
  getAssignment: async (id: number): Promise<Assignment> => {
    const response = await api.get<Assignment>(`/assignments/${id}`);
    return response.data;
  },

  // Create new assignment
  createAssignment: async (data: AssignmentCreateRequest): Promise<Assignment> => {
    const response = await api.post<Assignment>('/assignments', data);
    return response.data;
  },

  // Create assignment from dynamic form data
  createAssignmentFromDynamicForm: async (dynamicData: Record<string, any>): Promise<any> => {
    const response = await api.post('/assignments/dynamic', { dynamic_data: dynamicData });
    return response.data;
  },

  // Update assignment
  updateAssignment: async (id: number, data: AssignmentUpdateRequest): Promise<Assignment> => {
    const response = await api.put<Assignment>(`/assignments/${id}`, data);
    return response.data;
  },

  // Delete assignment
  deleteAssignment: async (id: number): Promise<void> => {
    const response = await api.delete(`/assignments/${id}`);
    return response.data;
  },

  // Get assignment submissions
  getAssignmentSubmissions: async (id: number, params?: { status?: string; student_id?: number }): Promise<any[]> => {
    const url = buildUrl(`/assignments/${id}/submissions`, params);
    const response = await api.get<any[]>(url);
    return response.data;
  },

  // Submit assignment (student submission)
  submitAssignment: async (assignmentId: number, data: { submission_text?: string; attachment_paths?: string[] }): Promise<any> => {
    const response = await api.post(`/assignments/${assignmentId}/submit`, data);
    return response.data;
  },

  // Grade submission
  gradeSubmission: async (assignmentId: number, submissionId: number, data: { score: number; feedback?: string }): Promise<any> => {
    const response = await api.post(`/assignments/${assignmentId}/submissions/${submissionId}/grade`, data);
    return response.data;
  },

  // Get student's own submission for an assignment
  getMySubmission: async (assignmentId: number): Promise<any> => {
    const response = await api.get(`/assignments/${assignmentId}/my-submission`);
    return response.data;
  },

  // Bulk operations
  bulkUpdateAssignments: async (assignment_ids: number[], data: Partial<AssignmentUpdateRequest>): Promise<any> => {
    const response = await api.post('/assignments/bulk-update', { assignment_ids, data });
    return response.data;
  },

  bulkDeleteAssignments: async (assignment_ids: number[]): Promise<any> => {
    const response = await api.post('/assignments/bulk-delete', { assignment_ids });
    return response.data;
  },

  // Publish/unpublish assignments
  publishAssignment: async (id: number): Promise<any> => {
    const response = await api.post(`/assignments/${id}/publish`);
    return response.data;
  },

  unpublishAssignment: async (id: number): Promise<any> => {
    const response = await api.post(`/assignments/${id}/unpublish`);
    return response.data;
  },

  // Import/Export
  exportAssignments: async (params?: AssignmentFilters): Promise<Blob> => {
    const url = buildUrl('/assignments/export', params);
    const response = await api.get(url, { responseType: 'blob' });
    return response.data;
  },

  importAssignments: async (file: File): Promise<any> => {
    const response = await upload('/assignments/import', file);
    return response.data;
  },

  // Assignment statistics
  getAssignmentStats: async (): Promise<any> => {
    const response = await api.get('/assignments/stats');
    return response.data;
  },

  // Upload file for assignment
  uploadFile: async (file: File): Promise<{
    message: string;
    filename: string;
    file_url: string;
    file_path: string;
    file_size: number;
  }> => {
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await api.post('/assignments/upload-file', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Generate assignment report
  generateAssignmentReport: async (id: number, params?: { report_type?: string }): Promise<Blob> => {
    const url = buildUrl(`/assignments/${id}/report`, params);
    const response = await api.get(url, { responseType: 'blob' });
    return response.data;
  },

  // Dropdown data methods
  getAvailableTeachers: async (): Promise<Array<{ value: string; label: string }>> => {
    const response = await api.get('/assignments/available-teachers');
    return response.data.teachers;
  },

  getAvailableClasses: async (teacherId: number): Promise<Array<{ value: string; label: string }>> => {
    const response = await api.get(`/assignments/available-classes/${teacherId}`);
    return response.data.classes;
  },

  getAvailableSubjects: async (teacherId: number, classId: number): Promise<Array<{ value: string; label: string }>> => {
    const response = await api.get(`/assignments/available-subjects/${teacherId}/${classId}`);
    return response.data.subjects;
  },
};
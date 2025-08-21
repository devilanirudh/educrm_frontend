/**
 * Assignment management service
 */

import { api, buildUrl } from './api';
import { PaginatedResponse, QueryParams } from '../types/api';

// Assignment types
export interface Assignment {
  id: number;
  title: string;
  description?: string;
  due_date: string;
  status: 'draft' | 'published' | 'closed';
  class_id: number;
  subject_id: number;
  attachment_url?: string;
  created_at: string;
  updated_at: string;
  
  // Relationships
  class: {
    id: number;
    name: string;
  };
  subject: {
    id: number;
    name: string;
  };
}

export interface AssignmentCreateRequest {
  title: string;
  description?: string;
  due_date: string;
  status: 'draft' | 'published';
  class_id: number;
  subject_id: number;
  attachment?: File;
}

export interface AssignmentUpdateRequest {
  title?: string;
  description?: string;
  due_date?: string;
  status?: 'draft' | 'published' | 'closed';
  class_id?: number;
  subject_id?: number;
  attachment?: File;
}

export interface AssignmentFilters extends QueryParams {
  class_id?: number;
  subject_id?: number;
  status?: 'draft' | 'published' | 'closed';
  due_date_from?: string;
  due_date_to?: string;
}

export const assignmentsService = {
  // Get all assignments with pagination and filters
  getAssignments: async (params?: AssignmentFilters): Promise<PaginatedResponse<Assignment>> => {
    const url = buildUrl('/assignments', params);
    return api.get<PaginatedResponse<Assignment>>(url);
  },

  // Get assignment by ID
  getAssignment: async (id: number): Promise<Assignment> => {
    return api.get<Assignment>(`/assignments/${id}`);
  },

  // Create new assignment
  createAssignment: async (data: AssignmentCreateRequest): Promise<Assignment> => {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined) {
        formData.append(key, value);
      }
    });
    return api.post<Assignment>('/assignments', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },

  // Update assignment
  updateAssignment: async (id: number, data: AssignmentUpdateRequest): Promise<Assignment> => {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined) {
        formData.append(key, value);
      }
    });
    return api.post<Assignment>(`/assignments/${id}`, formData, { // Using POST for multipart/form-data with potential method override
      headers: { 'Content-Type': 'multipart/form-data', 'X-HTTP-Method-Override': 'PUT' },
    });
  },

  // Delete assignment
  deleteAssignment: async (id: number): Promise<void> => {
    return api.delete(`/assignments/${id}`);
  },
};
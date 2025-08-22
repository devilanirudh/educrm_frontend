import api from './api';
import { PaginatedResponse } from '../types/api';

export interface Assignment {
  id: number;
  title: string;
  description: string;
  class_id: number;
  subject_id: number;
  teacher_id: number;
  due_date: string;
  attachment_paths: string[];
  instructions: string;
  max_score: number;
  is_published: boolean;
  created_at: string;
  updated_at: string;
  // These fields are not in the backend model but are in the frontend component
  class: { name: string };
  subject: { name: string };
  status: string;
}

export interface AssignmentCreateRequest {
  title: string;
  description: string;
  class_id: number;
  subject_id: number;
  teacher_id: number;
  due_date: string;
  attachment_paths?: string[];
  instructions?: string;
  max_score?: number;
  is_published?: boolean;
}

export type AssignmentUpdateRequest = Partial<AssignmentCreateRequest>;

export const assignmentsService = {
  getAssignments: async (params: { page: number; per_page: number; search?: string, class_id?: number }) => {
    const response = await api.get<PaginatedResponse<Assignment>>('/assignments', { params });
    return response.data;
  },
  createAssignment: async (data: AssignmentCreateRequest) => {
    const response = await api.post('/assignments', data);
    return response.data;
  },
  updateAssignment: async (id: number, data: AssignmentUpdateRequest) => {
    const response = await api.put(`/assignments/${id}`, data);
    return response.data;
  },
  deleteAssignment: async (id: number) => {
    const response = await api.delete(`/assignments/${id}`);
    return response.data;
  },
  submitAssignment: async (id: number, data: { submission_text: string, attachment_paths: string[] }) => {
    const response = await api.post(`/assignments/${id}/submit`, data);
    return response.data;
  },
};
/**
 * Exam management service
 */

import { api, buildUrl } from './api';
import { PaginatedResponse, QueryParams } from '../types/api';

// Exam types
export interface Exam {
  id: number;
  name: string;
  exam_id: string;
  class: {
    id: number;
    name: string;
  };
  subjects: Array<{
    id: number;
    name: string;
  }>;
  exam_date: string;
  status: 'Upcoming' | 'Ongoing' | 'Completed' | 'Cancelled';
  description?: string;
  created_at: string;
  updated_at: string;
}

export interface ExamCreateRequest {
  name: string;
  class_id: number;
  subject_ids: number[];
  exam_date: string;
  status: 'Upcoming' | 'Ongoing' | 'Completed' | 'Cancelled';
  description?: string;
}

export interface ExamUpdateRequest {
  name?: string;
  class_id?: number;
  subject_ids?: number[];
  exam_date?: string;
  status?: 'Upcoming' | 'Ongoing' | 'Completed' | 'Cancelled';
  description?: string;
}

export interface ExamFilters extends QueryParams {
  class_id?: number;
  subject_id?: number;
  status?: 'Upcoming' | 'Ongoing' | 'Completed' | 'Cancelled';
  exam_date_from?: string;
  exam_date_to?: string;
}

export const examsService = {
  // Get all exams with pagination and filters
  getExams: async (params?: ExamFilters): Promise<PaginatedResponse<Exam>> => {
    const url = buildUrl('/exams', params);
    return api.get<PaginatedResponse<Exam>>(url);
  },

  // Get exam by ID
  getExam: async (id: number): Promise<Exam> => {
    return api.get<Exam>(`/exams/${id}`);
  },

  // Create new exam
  createExam: async (data: ExamCreateRequest): Promise<Exam> => {
    return api.post<Exam>('/exams', data);
  },

  // Update exam
  updateExam: async (id: number, data: ExamUpdateRequest): Promise<Exam> => {
    return api.put<Exam>(`/exams/${id}`, data);
  },

  // Delete exam
  deleteExam: async (id: number): Promise<void> => {
    return api.delete(`/exams/${id}`);
  },
};
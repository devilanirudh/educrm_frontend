/**
 * Exam management service
 */

import api, { buildUrl, upload } from './api';
import { PaginatedResponse, QueryParams } from '../types/api';

// Exam types
export interface Exam {
  id: number;
  title: string;
  description?: string;
  class_id: number;
  subject_id: number;
  teacher_id: number;
  exam_type: string;
  exam_date: string;
  start_time: string;
  end_time: string;
  duration_minutes: number;
  max_score: number;
  passing_score?: number;
  instructions?: string;
  status: string;
  created_at: string;
  updated_at: string;
  dynamic_data?: Record<string, any>;

  // Relationships
  class?: {
    id: number;
    name: string;
    section: string;
  };
  results?: Array<{
    id: number;
    student_id: number;
    marks_obtained: number;
    grade: string;
    submitted_at: string;
  }>;
}

export interface ExamCreateRequest {
  name: string;
  description?: string;
  class_id: number;
  exam_date: string;
  start_time: string;
  end_time: string;
  duration_minutes: number;
  total_marks: number;
  passing_marks?: number;
  instructions?: string;
  status?: string;
  dynamic_data?: Record<string, any>;
}

export interface ExamUpdateRequest {
  name?: string;
  description?: string;
  class_id?: number;
  exam_date?: string;
  start_time?: string;
  end_time?: string;
  duration_minutes?: number;
  total_marks?: number;
  passing_marks?: number;
  instructions?: string;
  status?: string;
  dynamic_data?: Record<string, any>;
}

export interface ExamFilters extends QueryParams {
  limit?: number;
  class_id?: number;
  status?: string;
  exam_date_from?: string;
  exam_date_to?: string;
  max_score_min?: number;
  max_score_max?: number;
  filters?: Record<string, any>;
}

export const examsService = {
  // Get all exams with pagination and filters
  getExams: async (params?: ExamFilters): Promise<PaginatedResponse<Exam>> => {
    const url = buildUrl('/exams', params);
    const response = await api.get<PaginatedResponse<Exam>>(url);
    return response.data;
  },

  // Get exam by ID
  getExam: async (id: number): Promise<Exam> => {
    const response = await api.get<Exam>(`/exams/${id}`);
    return response.data;
  },

  // Create new exam
  createExam: async (data: ExamCreateRequest): Promise<Exam> => {
    const response = await api.post<Exam>('/exams', data);
    return response.data;
  },

  // Create exam from dynamic form data
  createExamFromDynamicForm: async (dynamicData: Record<string, any>): Promise<any> => {
    const response = await api.post('/exams/dynamic', { dynamic_data: dynamicData });
    return response.data;
  },

  // Update exam
  updateExam: async (id: number, data: ExamUpdateRequest): Promise<Exam> => {
    const response = await api.put<Exam>(`/exams/${id}`, data);
    return response.data;
  },

  // Delete exam
  deleteExam: async (id: number): Promise<void> => {
    const response = await api.delete(`/exams/${id}`);
    return response.data;
  },

  // Get exam results
  getExamResults: async (id: number, params?: { student_id?: number; grade?: string }): Promise<any[]> => {
    const url = buildUrl(`/exams/${id}/results`, params);
    const response = await api.get<any[]>(url);
    return response.data;
  },

  // Submit exam result
  submitExamResult: async (examId: number, data: { student_id: number; marks_obtained: number; grade?: string }): Promise<any> => {
    const response = await api.post(`/exams/${examId}/results`, data);
    return response.data;
  },

  // Update exam status
  updateExamStatus: async (id: number, status: string): Promise<any> => {
    const response = await api.post(`/exams/${id}/status`, { status });
    return response.data;
  },

  // Bulk operations
  bulkUpdateExams: async (exam_ids: number[], data: Partial<ExamUpdateRequest>): Promise<any> => {
    const response = await api.post('/exams/bulk-update', { exam_ids, data });
    return response.data;
  },

  bulkDeleteExams: async (exam_ids: number[]): Promise<any> => {
    const response = await api.post('/exams/bulk-delete', { exam_ids });
    return response.data;
  },

  // Start/Stop exam
  startExam: async (id: number): Promise<any> => {
    const response = await api.post(`/exams/${id}/start`);
    return response.data;
  },

  stopExam: async (id: number): Promise<any> => {
    const response = await api.post(`/exams/${id}/stop`);
    return response.data;
  },

  // Import/Export
  exportExams: async (params?: ExamFilters): Promise<Blob> => {
    const url = buildUrl('/exams/export', params);
    const response = await api.get(url, { responseType: 'blob' });
    return response.data;
  },

  importExams: async (file: File): Promise<any> => {
    const response = await upload('/exams/import', file);
    return response.data;
  },

  // Exam statistics
  getExamStats: async (params?: { class_id?: number; status?: string }): Promise<any> => {
    const url = buildUrl('/exams/stats', params);
    const response = await api.get(url);
    return response.data;
  },

  // Generate exam report
  generateExamReport: async (id: number, params?: { report_type?: string }): Promise<Blob> => {
    const url = buildUrl(`/exams/${id}/report`, params);
    const response = await api.get(url, { responseType: 'blob' });
    return response.data;
  },

  // Generate question paper
  generateQuestionPaper: async (id: number, params?: { format?: string }): Promise<Blob> => {
    const url = buildUrl(`/exams/${id}/question-paper`, params);
    const response = await api.get(url, { responseType: 'blob' });
    return response.data;
  },

  // Get date sheet for a class and term
  getDateSheet: async (classId: number, termId: number): Promise<any> => {
    const response = await api.get(`/date-sheets?class_id=${classId}&term_id=${termId}`);
    return response.data;
  },

  // Create date sheet
  createDateSheet: async (data: any): Promise<any> => {
    const response = await api.post('/date-sheets', data);
    return response.data;
  },

  // Update date sheet
  updateDateSheet: async (id: number, data: any): Promise<any> => {
    const response = await api.put(`/date-sheets/${id}`, data);
    return response.data;
  },

  // Publish date sheet
  publishDateSheet: async (id: number): Promise<any> => {
    const response = await api.post(`/date-sheets/${id}/publish`);
    return response.data;
  },

  // Get exam terms
  getTerms: async (): Promise<any> => {
    const response = await api.get('/exam-terms');
    return response.data;
  },

  // Create exam term
  createTerm: async (data: any): Promise<any> => {
    const response = await api.post('/exam-terms', data);
    return response.data;
  },
};
import api from './api';
import { Exam } from '../types/exams';
import { PaginatedResponse } from '../types/api';

export const examsService = {
  getExams: async (params: { page: number; per_page: number; search?: string }): Promise<PaginatedResponse<Exam>> => {
    const response = await api.get<PaginatedResponse<Exam>>('/exams', { params });
    return response.data;
  },
  deleteExam: async (id: number) => {
    const response = await api.delete(`/exams/${id}`);
    return response.data;
  },
  getTerms: async () => {
    const response = await api.get('/exams/terms');
    return response.data;
  },
  createTerm: async (data: { name: string; academic_year: string }) => {
    const response = await api.post('/exams/terms', data);
    return response.data;
  },
  
  createDateSheet: async (data: any) => {
    const response = await api.post('/datesheets', data);
    return response.data;
  },
  getDateSheet: async (classId: number, termId: number) => {
    const response = await api.get(`/datesheets/${classId}/${termId}`);
    return response.data;
  },
  updateDateSheet: async (id: number, data: any) => {
    const response = await api.put(`/datesheets/${id}`, data);
    return response.data;
  },
  publishDateSheet: async (id: number) => {
    const response = await api.post(`/datesheets/${id}/publish`);
    return response.data;
  },
};
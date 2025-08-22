import api from './api';

export interface Subject {
  id: number;
  name: string;
  code: string;
  description: string;
}

interface SubjectsResponse {
  data: Subject[];
  total: number;
}

export const subjectsService = {
  getSubjects: async (params: { per_page: number }) => {
    const response = await api.get<SubjectsResponse>('/subjects', { params });
    return response.data;
  }
};
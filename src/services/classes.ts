/**
 * Class management service
 */

import api, { buildUrl, upload } from './api';
import { PaginatedResponse, QueryParams } from '../types/api';

// Class types
export interface Class {
  id: number;
  name: string;
  section?: string;
  stream?: string;
  grade_level: number;
  academic_year: string;
  max_students?: number;
  class_teacher_id?: number;
  room_number?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  
  // Relationships
  class_teacher?: {
    id: number;
    employee_id: string;
    user: {
      id: number;
      first_name: string;
      last_name: string;
      email: string;
    };
  };
  subjects?: Array<{
    id: number;
    name: string;
    code: string;
    description?: string;
    credits?: number;
    teacher?: {
      id: number;
      employee_id: string;
      user: {
        first_name: string;
        last_name: string;
      };
    };
  }>;
  students?: Array<{
    id: number;
    student_id: string;
    roll_number?: string;
    user: {
      first_name: string;
      last_name: string;
      email: string;
    };
  }>;
  timetable?: Array<{
    id: number;
    day_of_week: number;
    start_time: string;
    end_time: string;
    subject: {
      id: number;
      name: string;
      code: string;
    };
    teacher: {
      id: number;
      user: {
        first_name: string;
        last_name: string;
      };
    };
    room_number?: string;
  }>;
}

export interface Subject {
  id: number;
  name: string;
  code: string;
  description?: string;
  department?: string;
  category?: string;
  credits?: number;
  theory_hours?: number;
  practical_hours?: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface TimetableSlot {
  id: number;
  class_id: number;
  subject_id: number;
  teacher_id: number;
  day_of_week: number;
  start_time: string;
  end_time: string;
  room_number?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface ClassCreateRequest {
  name: string;
  section?: string;
  stream?: string;
  grade_level: number;
  academic_year: string;
  max_students?: number;
  class_teacher_id?: number;
  room_number?: string;
}

export interface ClassUpdateRequest {
  name?: string;
  section?: string;
  stream?: string;
  grade_level?: number;
  academic_year?: string;
  max_students?: number;
  class_teacher_id?: number;
  room_number?: string;
  is_active?: boolean;
}

export interface SubjectCreateRequest {
  name: string;
  code: string;
  description?: string;
  department?: string;
  category?: string;
  credits?: number;
  theory_hours?: number;
  practical_hours?: number;
}

export interface SubjectUpdateRequest {
  name?: string;
  code?: string;
  description?: string;
  department?: string;
  category?: string;
  credits?: number;
  theory_hours?: number;
  practical_hours?: number;
  is_active?: boolean;
}

export interface TimetableSlotCreateRequest {
  class_id: number;
  subject_id: number;
  teacher_id: number;
  day_of_week: number;
  start_time: string;
  end_time: string;
  room_number?: string;
}

export interface ClassFilters extends QueryParams {
  session?: string;
  medium?: string;
  class_teacher_id?: number;
  capacity_min?: number;
  capacity_max?: number;
}

export interface SubjectFilters extends QueryParams {
  department?: string;
  category?: string;
  is_active?: boolean;
}

export const classesService = {
  // Class CRUD operations
  getClasses: async (params?: ClassFilters): Promise<PaginatedResponse<Class>> => {
    const url = buildUrl('/classes', params);
    const response = await api.get<PaginatedResponse<Class>>(url);
    return response.data;
  },

  getClass: async (id: number): Promise<Class> => {
    const response = await api.get<Class>(`/classes/${id}`);
    return response.data;
  },

  createClass: async (data: ClassCreateRequest): Promise<Class> => {
    const response = await api.post<Class>('/classes', data);
    return response.data;
  },

  updateClass: async (id: number, data: ClassUpdateRequest): Promise<Class> => {
    const response = await api.put<Class>(`/classes/${id}`, data);
    return response.data;
  },

  deleteClass: async (id: number): Promise<void> => {
    const response = await api.delete(`/classes/${id}`);
    return response.data;
  },

  // Class subjects
  getClassSubjects: async (id: number): Promise<any> => {
    const response = await api.get(`/classes/${id}/subjects`);
    return response.data;
  },

  addSubjectToClass: async (id: number, data: SubjectCreateRequest): Promise<any> => {
    const response = await api.post(`/classes/${id}/subjects`, data);
    return response.data;
  },

  removeSubjectFromClass: async (id: number, subjectId: number): Promise<void> => {
    const response = await api.delete(`/classes/${id}/subjects/${subjectId}`);
    return response.data;
  },

  // Class students
  getClassStudents: async (id: number): Promise<any> => {
    const response = await api.get(`/classes/${id}/students`);
    return response.data;
  },

  assignStudentsToClass: async (id: number, student_ids: number[]): Promise<any> => {
    const response = await api.post(`/classes/${id}/assign-students`, { student_ids });
    return response.data;
  },

  removeStudentFromClass: async (id: number, studentId: number): Promise<void> => {
    const response = await api.delete(`/classes/${id}/students/${studentId}`);
    return response.data;
  },

  // Class timetable
  getClassTimetable: async (id: number): Promise<any> => {
    const response = await api.get(`/classes/${id}/timetable`);
    return response.data;
  },

  addTimetableSlot: async (id: number, data: TimetableSlotCreateRequest): Promise<any> => {
    const response = await api.post(`/classes/${id}/timetable`, data);
    return response.data;
  },

  updateTimetableSlot: async (id: number, slotId: number, data: Partial<TimetableSlotCreateRequest>): Promise<any> => {
    const response = await api.put(`/classes/${id}/timetable/${slotId}`, data);
    return response.data;
  },

  deleteTimetableSlot: async (id: number, slotId: number): Promise<void> => {
    const response = await api.delete(`/classes/${id}/timetable/${slotId}`);
    return response.data;
  },

  // Class assignments
  getClassAssignments: async (id: number, params?: { subject_id?: number; status?: string }): Promise<any[]> => {
    const url = buildUrl(`/classes/${id}/assignments`, params);
    const response = await api.get<any[]>(url);
    return response.data;
  },

  // Class exams
  getClassExams: async (id: number, params?: { subject_id?: number; status?: string }): Promise<any[]> => {
    const url = buildUrl(`/classes/${id}/exams`, params);
    const response = await api.get<any[]>(url);
    return response.data;
  },

  // Class attendance
  getClassAttendance: async (id: number, params?: { date?: string; subject_id?: number }): Promise<any[]> => {
    const url = buildUrl(`/classes/${id}/attendance`, params);
    const response = await api.get<any[]>(url);
    return response.data;
  },

  markClassAttendance: async (id: number, data: any): Promise<any> => {
    const response = await api.post(`/classes/${id}/attendance`, data);
    return response.data;
  },

  // Class statistics
  getClassStats: async (id: number): Promise<any> => {
    const response = await api.get(`/classes/${id}/stats`);
    return response.data;
  },

  getStudentsByClass: async (): Promise<any[]> => {
    const response = await api.get('/classes/stats/students-by-class');
    return response.data;
  },

  // Subject CRUD operations
  getSubjects: async (params?: SubjectFilters): Promise<PaginatedResponse<Subject>> => {
    const url = buildUrl('/subjects', params);
    const response = await api.get<PaginatedResponse<Subject>>(url);
    return response.data;
  },

  getSubject: async (id: number): Promise<Subject> => {
    const response = await api.get<Subject>(`/subjects/${id}`);
    return response.data;
  },

  createSubject: async (data: SubjectCreateRequest): Promise<Subject> => {
    const response = await api.post<Subject>('/subjects', data);
    return response.data;
  },

  updateSubject: async (id: number, data: SubjectUpdateRequest): Promise<Subject> => {
    const response = await api.put<Subject>(`/subjects/${id}`, data);
    return response.data;
  },

  deleteSubject: async (id: number): Promise<void> => {
    const response = await api.delete(`/subjects/${id}`);
    return response.data;
  },

  // Subject classes
  getSubjectClasses: async (id: number): Promise<any[]> => {
    const response = await api.get<any[]>(`/subjects/${id}/classes`);
    return response.data;
  },

  // Subject teachers
  getSubjectTeachers: async (id: number): Promise<any[]> => {
    const response = await api.get<any[]>(`/subjects/${id}/teachers`);
    return response.data;
  },

  assignTeacherToSubject: async (id: number, teacher_id: number): Promise<any> => {
    const response = await api.post(`/subjects/${id}/assign-teacher`, { teacher_id });
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

  bulkUpdateSubjects: async (subject_ids: number[], data: Partial<SubjectUpdateRequest>): Promise<any> => {
    const response = await api.post('/subjects/bulk-update', { subject_ids, data });
    return response.data;
  },

  bulkDeleteSubjects: async (subject_ids: number[]): Promise<any> => {
    const response = await api.post('/subjects/bulk-delete', { subject_ids });
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

  exportSubjects: async (params?: SubjectFilters): Promise<Blob> => {
    const url = buildUrl('/subjects/export', params);
    const response = await api.get(url, { responseType: 'blob' });
    return response.data;
  },

  importSubjects: async (file: File): Promise<any> => {
    const response = await upload('/subjects/import', file);
    return response.data;
  },

  // Academic year operations
  promoteClass: async (id: number, data: { target_academic_year: string; target_grade_level?: number }): Promise<any> => {
    const response = await api.post(`/classes/${id}/promote`, data);
    return response.data;
  },

  // Class reports
  generateClassReport: async (id: number, report_type: string, params?: any): Promise<Blob> => {
    const url = buildUrl(`/classes/${id}/reports/${report_type}`, params);
    const response = await api.get(url, { responseType: 'blob' });
    return response.data;
  },

  // Timetable management
  generateTimetable: async (id: number, data: any): Promise<any> => {
    const response = await api.post(`/classes/${id}/generate-timetable`, data);
    return response.data;
  },

  validateTimetable: async (id: number): Promise<any> => {
    const response = await api.get(`/classes/${id}/validate-timetable`);
    return response.data;
  },

  copyTimetable: async (source_class_id: number, target_class_id: number): Promise<any> => {
    const response = await api.post('/classes/copy-timetable', { source_class_id, target_class_id });
    return response.data;
  },
};

/**
 * Class management service
 */

import { api, buildUrl } from './api';
import { PaginatedResponse, QueryParams } from '../types/api';

// Class types
export interface Class {
  id: number;
  name: string;
  section?: string;
  grade_level: number;
  academic_year: string;
  capacity?: number;
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
  grade_level: number;
  academic_year: string;
  capacity?: number;
  class_teacher_id?: number;
  room_number?: string;
}

export interface ClassUpdateRequest {
  name?: string;
  section?: string;
  grade_level?: number;
  academic_year?: string;
  capacity?: number;
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
  academic_year?: string;
  grade_level?: number;
  is_active?: boolean;
  class_teacher_id?: number;
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
    return api.get<PaginatedResponse<Class>>(url);
  },

  getClass: async (id: number): Promise<Class> => {
    return api.get<Class>(`/classes/${id}`);
  },

  createClass: async (data: ClassCreateRequest): Promise<Class> => {
    return api.post<Class>('/classes', data);
  },

  updateClass: async (id: number, data: ClassUpdateRequest): Promise<Class> => {
    return api.put<Class>(`/classes/${id}`, data);
  },

  deleteClass: async (id: number): Promise<void> => {
    return api.delete(`/classes/${id}`);
  },

  // Class subjects
  getClassSubjects: async (id: number): Promise<any> => {
    return api.get(`/classes/${id}/subjects`);
  },

  addSubjectToClass: async (id: number, data: SubjectCreateRequest): Promise<any> => {
    return api.post(`/classes/${id}/subjects`, data);
  },

  removeSubjectFromClass: async (id: number, subjectId: number): Promise<void> => {
    return api.delete(`/classes/${id}/subjects/${subjectId}`);
  },

  // Class students
  getClassStudents: async (id: number): Promise<any> => {
    return api.get(`/classes/${id}/students`);
  },

  assignStudentsToClass: async (id: number, student_ids: number[]): Promise<any> => {
    return api.post(`/classes/${id}/assign-students`, { student_ids });
  },

  removeStudentFromClass: async (id: number, studentId: number): Promise<void> => {
    return api.delete(`/classes/${id}/students/${studentId}`);
  },

  // Class timetable
  getClassTimetable: async (id: number): Promise<any> => {
    return api.get(`/classes/${id}/timetable`);
  },

  addTimetableSlot: async (id: number, data: TimetableSlotCreateRequest): Promise<any> => {
    return api.post(`/classes/${id}/timetable`, data);
  },

  updateTimetableSlot: async (id: number, slotId: number, data: Partial<TimetableSlotCreateRequest>): Promise<any> => {
    return api.put(`/classes/${id}/timetable/${slotId}`, data);
  },

  deleteTimetableSlot: async (id: number, slotId: number): Promise<void> => {
    return api.delete(`/classes/${id}/timetable/${slotId}`);
  },

  // Class assignments
  getClassAssignments: async (id: number, params?: { subject_id?: number; status?: string }): Promise<any[]> => {
    const url = buildUrl(`/classes/${id}/assignments`, params);
    return api.get<any[]>(url);
  },

  // Class exams
  getClassExams: async (id: number, params?: { subject_id?: number; status?: string }): Promise<any[]> => {
    const url = buildUrl(`/classes/${id}/exams`, params);
    return api.get<any[]>(url);
  },

  // Class attendance
  getClassAttendance: async (id: number, params?: { date?: string; subject_id?: number }): Promise<any[]> => {
    const url = buildUrl(`/classes/${id}/attendance`, params);
    return api.get<any[]>(url);
  },

  markClassAttendance: async (id: number, data: any): Promise<any> => {
    return api.post(`/classes/${id}/attendance`, data);
  },

  // Class statistics
  getClassStats: async (id: number): Promise<any> => {
    return api.get(`/classes/${id}/stats`);
  },

  // Subject CRUD operations
  getSubjects: async (params?: SubjectFilters): Promise<PaginatedResponse<Subject>> => {
    const url = buildUrl('/subjects', params);
    return api.get<PaginatedResponse<Subject>>(url);
  },

  getSubject: async (id: number): Promise<Subject> => {
    return api.get<Subject>(`/subjects/${id}`);
  },

  createSubject: async (data: SubjectCreateRequest): Promise<Subject> => {
    return api.post<Subject>('/subjects', data);
  },

  updateSubject: async (id: number, data: SubjectUpdateRequest): Promise<Subject> => {
    return api.put<Subject>(`/subjects/${id}`, data);
  },

  deleteSubject: async (id: number): Promise<void> => {
    return api.delete(`/subjects/${id}`);
  },

  // Subject classes
  getSubjectClasses: async (id: number): Promise<any[]> => {
    return api.get<any[]>(`/subjects/${id}/classes`);
  },

  // Subject teachers
  getSubjectTeachers: async (id: number): Promise<any[]> => {
    return api.get<any[]>(`/subjects/${id}/teachers`);
  },

  assignTeacherToSubject: async (id: number, teacher_id: number): Promise<any> => {
    return api.post(`/subjects/${id}/assign-teacher`, { teacher_id });
  },

  // Bulk operations
  bulkUpdateClasses: async (class_ids: number[], data: Partial<ClassUpdateRequest>): Promise<any> => {
    return api.post('/classes/bulk-update', { class_ids, data });
  },

  bulkDeleteClasses: async (class_ids: number[]): Promise<any> => {
    return api.post('/classes/bulk-delete', { class_ids });
  },

  bulkUpdateSubjects: async (subject_ids: number[], data: Partial<SubjectUpdateRequest>): Promise<any> => {
    return api.post('/subjects/bulk-update', { subject_ids, data });
  },

  bulkDeleteSubjects: async (subject_ids: number[]): Promise<any> => {
    return api.post('/subjects/bulk-delete', { subject_ids });
  },

  // Import/Export
  exportClasses: async (params?: ClassFilters): Promise<Blob> => {
    const url = buildUrl('/classes/export', params);
    return api.get(url, { responseType: 'blob' });
  },

  importClasses: async (file: File): Promise<any> => {
    return api.upload('/classes/import', file);
  },

  exportSubjects: async (params?: SubjectFilters): Promise<Blob> => {
    const url = buildUrl('/subjects/export', params);
    return api.get(url, { responseType: 'blob' });
  },

  importSubjects: async (file: File): Promise<any> => {
    return api.upload('/subjects/import', file);
  },

  // Academic year operations
  promoteClass: async (id: number, data: { target_academic_year: string; target_grade_level?: number }): Promise<any> => {
    return api.post(`/classes/${id}/promote`, data);
  },

  // Class reports
  generateClassReport: async (id: number, report_type: string, params?: any): Promise<Blob> => {
    const url = buildUrl(`/classes/${id}/reports/${report_type}`, params);
    return api.get(url, { responseType: 'blob' });
  },

  // Timetable management
  generateTimetable: async (id: number, data: any): Promise<any> => {
    return api.post(`/classes/${id}/generate-timetable`, data);
  },

  validateTimetable: async (id: number): Promise<any> => {
    return api.get(`/classes/${id}/validate-timetable`);
  },

  copyTimetable: async (source_class_id: number, target_class_id: number): Promise<any> => {
    return api.post('/classes/copy-timetable', { source_class_id, target_class_id });
  },
};

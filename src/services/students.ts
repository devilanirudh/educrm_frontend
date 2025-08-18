/**
 * Student management service
 */

import { api, buildUrl } from './api';
import { PaginatedResponse, QueryParams } from '../types/api';

// Student types
export interface Student {
  id: number;
  student_id: string;
  roll_number?: string;
  admission_number: string;
  admission_date: string;
  current_class_id?: number;
  section?: string;
  academic_year: string;
  admission_type: string;
  previous_school?: string;
  medical_conditions?: string;
  allergies?: string;
  emergency_contact_name?: string;
  emergency_contact_phone?: string;
  emergency_contact_relationship?: string;
  transport_required: boolean;
  hostel_required: boolean;
  library_card_number?: string;
  blood_group?: string;
  height?: number;
  weight?: number;
  nationality?: string;
  religion?: string;
  caste?: string;
  mother_tongue?: string;
  is_active: boolean;
  graduation_date?: string;
  reason_for_leaving?: string;
  created_at: string;
  updated_at: string;
  
  // Relationships
  user: {
    id: number;
    email: string;
    first_name: string;
    last_name: string;
    phone?: string;
    profile_picture?: string;
    date_of_birth?: string;
    gender?: string;
    address?: string;
    city?: string;
    state?: string;
    country?: string;
    postal_code?: string;
  };
  current_class?: {
    id: number;
    name: string;
    section?: string;
    academic_year: string;
  };
  parent?: {
    id: number;
    father_name?: string;
    mother_name?: string;
    father_occupation?: string;
    mother_occupation?: string;
    annual_income?: number;
    father_phone?: string;
    mother_phone?: string;
    father_email?: string;
    mother_email?: string;
  };
}

export interface StudentCreateRequest {
  user_data: {
    email: string;
    first_name: string;
    last_name: string;
    password: string;
    phone?: string;
    date_of_birth?: string;
    gender?: string;
    address?: string;
    city?: string;
    state?: string;
    country?: string;
    postal_code?: string;
  };
  admission_number: string;
  admission_date: string;
  current_class_id?: number;
  section?: string;
  academic_year: string;
  admission_type: string;
  previous_school?: string;
  medical_conditions?: string;
  allergies?: string;
  emergency_contact_name?: string;
  emergency_contact_phone?: string;
  emergency_contact_relationship?: string;
  transport_required?: boolean;
  hostel_required?: boolean;
  blood_group?: string;
  height?: number;
  weight?: number;
  nationality?: string;
  religion?: string;
  caste?: string;
  mother_tongue?: string;
  parent_data?: {
    father_name?: string;
    mother_name?: string;
    father_occupation?: string;
    mother_occupation?: string;
    annual_income?: number;
    father_phone?: string;
    mother_phone?: string;
    father_email?: string;
    mother_email?: string;
  };
}

export interface StudentUpdateRequest {
  user_data?: {
    first_name?: string;
    last_name?: string;
    phone?: string;
    date_of_birth?: string;
    gender?: string;
    address?: string;
    city?: string;
    state?: string;
    country?: string;
    postal_code?: string;
  };
  current_class_id?: number;
  section?: string;
  academic_year?: string;
  medical_conditions?: string;
  allergies?: string;
  emergency_contact_name?: string;
  emergency_contact_phone?: string;
  emergency_contact_relationship?: string;
  transport_required?: boolean;
  hostel_required?: boolean;
  blood_group?: string;
  height?: number;
  weight?: number;
  nationality?: string;
  religion?: string;
  caste?: string;
  mother_tongue?: string;
  is_active?: boolean;
  reason_for_leaving?: string;
}

export interface StudentFilters extends QueryParams {
  academic_year?: string;
  class_id?: number;
  section?: string;
  admission_type?: string;
  transport_required?: boolean;
  hostel_required?: boolean;
  is_active?: boolean;
  blood_group?: string;
  gender?: string;
}

export const studentsService = {
  // Get all students with pagination and filters
  getStudents: async (params?: StudentFilters): Promise<PaginatedResponse<Student>> => {
    const url = buildUrl('/students', params);
    return api.get<PaginatedResponse<Student>>(url);
  },

  // Get student by ID
  getStudent: async (id: number): Promise<Student> => {
    return api.get<Student>(`/students/${id}`);
  },

  // Create new student
  createStudent: async (data: StudentCreateRequest): Promise<Student> => {
    return api.post<Student>('/students', data);
  },

  // Update student
  updateStudent: async (id: number, data: StudentUpdateRequest): Promise<Student> => {
    return api.put<Student>(`/students/${id}`, data);
  },

  // Delete student
  deleteStudent: async (id: number): Promise<void> => {
    return api.delete(`/students/${id}`);
  },

  // Get student grades
  getStudentGrades: async (id: number, params?: { subject_id?: number; academic_year?: string }): Promise<any[]> => {
    const url = buildUrl(`/students/${id}/grades`, params);
    return api.get<any[]>(url);
  },

  // Get student attendance
  getStudentAttendance: async (id: number, params?: { start_date?: string; end_date?: string }): Promise<any[]> => {
    const url = buildUrl(`/students/${id}/attendance`, params);
    return api.get<any[]>(url);
  },

  // Get student assignments
  getStudentAssignments: async (id: number, params?: { status?: string; subject_id?: number }): Promise<any[]> => {
    const url = buildUrl(`/students/${id}/assignments`, params);
    return api.get<any[]>(url);
  },

  // Get student exams
  getStudentExams: async (id: number, params?: { status?: string; subject_id?: number }): Promise<any[]> => {
    const url = buildUrl(`/students/${id}/exams`, params);
    return api.get<any[]>(url);
  },

  // Get student fees
  getStudentFees: async (id: number, params?: { academic_year?: string; status?: string }): Promise<any[]> => {
    const url = buildUrl(`/students/${id}/fees`, params);
    return api.get<any[]>(url);
  },

  // Bulk operations
  bulkUpdateStudents: async (student_ids: number[], data: Partial<StudentUpdateRequest>): Promise<any> => {
    return api.post('/students/bulk-update', { student_ids, data });
  },

  bulkDeleteStudents: async (student_ids: number[]): Promise<any> => {
    return api.post('/students/bulk-delete', { student_ids });
  },

  // Import/Export
  exportStudents: async (params?: StudentFilters): Promise<Blob> => {
    const url = buildUrl('/students/export', params);
    return api.get(url, { responseType: 'blob' });
  },

  importStudents: async (file: File): Promise<any> => {
    return api.upload('/students/import', file);
  },

  // Student statistics
  getStudentStats: async (params?: { academic_year?: string; class_id?: number }): Promise<any> => {
    const url = buildUrl('/students/stats', params);
    return api.get(url);
  },

  // Promote students to next class
  promoteStudents: async (data: { student_ids: number[]; target_class_id: number; academic_year: string }): Promise<any> => {
    return api.post('/students/promote', data);
  },

  // Generate student ID card
  generateStudentCard: async (id: number): Promise<Blob> => {
    return api.get(`/students/${id}/id-card`, { responseType: 'blob' });
  },

  // Upload student photo
  uploadStudentPhoto: async (id: number, file: File): Promise<any> => {
    return api.upload(`/students/${id}/photo`, file);
  },

  // Get student timetable
  getStudentTimetable: async (id: number): Promise<any> => {
    return api.get(`/students/${id}/timetable`);
  },

  // Get student dashboard data
  getStudentDashboard: async (id: number): Promise<any> => {
    return api.get(`/students/${id}/dashboard`);
  },
};

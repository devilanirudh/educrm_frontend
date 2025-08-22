/**
 * Student management service
 */

import api, { buildUrl, upload } from './api';
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
  
  dynamic_data?: Record<string, any>;
  
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
    const response = await api.get<PaginatedResponse<Student>>(url);
    return response.data;
  },

  // Get student by ID
  getStudent: async (id: number): Promise<Student> => {
    const response = await api.get<Student>(`/students/${id}`);
    return response.data;
  },

  // Create new student
  createStudent: async (data: StudentCreateRequest): Promise<Student> => {
    const response = await api.post<Student>('/students', data);
    return response.data;
  },

  // Create student from dynamic form
  createStudentFromDynamicForm: async (dynamicData: Record<string, any>): Promise<any> => {
    const response = await api.post('/students/dynamic', { dynamic_data: dynamicData });
    return response.data;
  },

  // Update student
  updateStudent: async (id: number, data: StudentUpdateRequest): Promise<Student> => {
    const response = await api.put<Student>(`/students/${id}`, data);
    return response.data;
  },

  // Delete student
  deleteStudent: async (id: number): Promise<void> => {
    const response = await api.delete(`/students/${id}`);
    return response.data;
  },

  // Get student grades
  getStudentGrades: async (id: number, params?: { subject_id?: number; academic_year?: string }): Promise<any[]> => {
    const url = buildUrl(`/students/${id}/grades`, params);
    const response = await api.get<any[]>(url);
    return response.data;
  },

  // Get student attendance
  getStudentAttendance: async (id: number, params?: { start_date?: string; end_date?: string }): Promise<any[]> => {
    const url = buildUrl(`/students/${id}/attendance`, params);
    const response = await api.get<any[]>(url);
    return response.data;
  },

  // Get student assignments
  getStudentAssignments: async (id: number, params?: { status?: string; subject_id?: number }): Promise<any[]> => {
    const url = buildUrl(`/students/${id}/assignments`, params);
    const response = await api.get<any[]>(url);
    return response.data;
  },

  // Get student exams
  getStudentExams: async (id: number, params?: { status?: string; subject_id?: number }): Promise<any[]> => {
    const url = buildUrl(`/students/${id}/exams`, params);
    const response = await api.get<any[]>(url);
    return response.data;
  },

  // Get student fees
  getStudentFees: async (id: number, params?: { academic_year?: string; status?: string }): Promise<any[]> => {
    const url = buildUrl(`/students/${id}/fees`, params);
    const response = await api.get<any[]>(url);
    return response.data;
  },

  // Bulk operations
  bulkUpdateStudents: async (student_ids: number[], data: Partial<StudentUpdateRequest>): Promise<any> => {
    const response = await api.post('/students/bulk-update', { student_ids, data });
    return response.data;
  },

  bulkDeleteStudents: async (student_ids: number[]): Promise<any> => {
    const response = await api.post('/students/bulk-delete', { student_ids });
    return response.data;
  },

  // Import/Export
  exportStudents: async (params?: StudentFilters): Promise<Blob> => {
    const url = buildUrl('/students/export', params);
    const response = await api.get(url, { responseType: 'blob' });
    return response.data;
  },

  importStudents: async (file: File): Promise<any> => {
    const response = await upload('/students/import', file);
    return response.data;
  },

  // Student statistics
  getStudentStats: async (params?: { academic_year?: string; class_id?: number }): Promise<any> => {
    const url = buildUrl('/students/stats', params);
    const response = await api.get(url);
    return response.data;
  },

  // Promote students to next class
  promoteStudents: async (data: { student_ids: number[]; target_class_id: number; academic_year: string }): Promise<any> => {
    const response = await api.post('/students/promote', data);
    return response.data;
  },

  // Generate student ID card
  generateStudentCard: async (id: number): Promise<Blob> => {
    const response = await api.get(`/students/${id}/id-card`, { responseType: 'blob' });
    return response.data;
  },

  // Upload student photo
  uploadStudentPhoto: async (id: number, file: File): Promise<any> => {
    const response = await upload(`/students/${id}/photo`, file);
    return response.data;
  },

  // Get student timetable
  getStudentTimetable: async (id: number): Promise<any> => {
    const response = await api.get(`/students/${id}/timetable`);
    return response.data;
  },

  // Get student dashboard data
  getStudentDashboard: async (id: number): Promise<any> => {
    const response = await api.get(`/students/${id}/dashboard`);
    return response.data;
  },
  
  // Placeholder functions for row actions
  generatePdf: async (id: number): Promise<void> => {
    console.log(`Generating PDF for student ${id}`);
    // This would typically trigger a download
  },
  getFeesReceipt: async (id: number): Promise<void> => {
    console.log(`Getting fees receipt for student ${id}`);
  },
  createIdCard: async (id: number): Promise<void> => {
    console.log(`Creating ID card for student ${id}`);
  },
  createAdmitCard: async (id: number): Promise<void> => {
    console.log(`Creating admit card for student ${id}`);
  },
  resetPassword: async (id: number): Promise<void> => {
    console.log(`Resetting password for student ${id}`);
  }
};

import { useQuery, useMutation, useQueryClient } from 'react-query';
import { studentsService, Student, StudentCreateRequest, StudentUpdateRequest, StudentFilters } from '../services/students';
import { PaginatedResponse } from '../types/api';

export const useStudents = (params?: StudentFilters) => {
  const queryClient = useQueryClient();

  // Add is_active: true by default unless explicitly set to false or undefined (to show all)
  const defaultParams = { is_active: true, ...params };

  const { data: students, isLoading: isStudentsLoading, error: studentsError, refetch: refetchStudents } = useQuery<PaginatedResponse<Student>>(
    ['students', JSON.stringify(defaultParams)],
    () => studentsService.getStudents(defaultParams),
    {
      onError: (error) => {
        console.error('Error fetching students:', error);
      },
      onSuccess: (data) => {
        console.log('Successfully fetched students:', data);
      },
      refetchOnMount: false, // Don't refetch on mount if data is fresh
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000, // Data is fresh for 5 minutes
      cacheTime: 30 * 60 * 1000, // Keep in cache for 30 minutes
      retry: 1,
      retryDelay: 1000,
    }
  );

  const { mutate: createStudent, isLoading: isCreatingStudent } = useMutation(
    (data: StudentCreateRequest) => studentsService.createStudent(data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('students');
      },
    }
  );

  const { mutate: updateStudent, isLoading: isUpdatingStudent } = useMutation(
    ({ id, data }: { id: number; data: StudentUpdateRequest }) => studentsService.updateStudent(id, data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('students');
      },
    }
  );

  const { mutate: deleteStudent, isLoading: isDeletingStudent } = useMutation(
    (id: number) => studentsService.deleteStudent(id),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('students');
      },
    }
  );

  return {
    students,
    isStudentsLoading,
    studentsError,
    refetchStudents,
    createStudent,
    isCreatingStudent,
    updateStudent,
    isUpdatingStudent,
    deleteStudent,
    isDeletingStudent,
  };
};

export const useStudent = (id: number) => {
  const { data: student, isLoading: isStudentLoading } = useQuery<Student>(
    ['student', id],
    () => studentsService.getStudent(id)
  );

  return {
    student,
    isStudentLoading,
  };
};
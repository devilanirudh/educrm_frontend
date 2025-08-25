import { useQuery, useMutation, useQueryClient } from 'react-query';
import { assignmentsService, Assignment, AssignmentCreateRequest, AssignmentUpdateRequest, AssignmentFilters } from '../services/assignments';
import { PaginatedResponse } from '../types/api';

export const useAssignments = (params?: AssignmentFilters) => {
  const queryClient = useQueryClient();

  const {
    data: assignments,
    isLoading: isAssignmentsLoading,
    error: assignmentsError,
    refetch: refetchAssignments
  } = useQuery<PaginatedResponse<Assignment>>(
    ['assignments', params],
    () => assignmentsService.getAssignments(params)
  );

  const { mutate: createAssignment, isLoading: isCreatingAssignment } = useMutation(
    (data: AssignmentCreateRequest) => assignmentsService.createAssignment(data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('assignments');
      },
    }
  );

  const { mutate: updateAssignment, isLoading: isUpdatingAssignment } = useMutation(
    ({ id, data }: { id: number; data: AssignmentUpdateRequest }) => assignmentsService.updateAssignment(id, data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('assignments');
      },
    }
  );

  const { mutate: deleteAssignment, isLoading: isDeletingAssignment } = useMutation(
    (id: number) => assignmentsService.deleteAssignment(id),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('assignments');
      },
    }
  );

  return {
    assignments,
    isAssignmentsLoading,
    assignmentsError,
    refetchAssignments,
    createAssignment,
    isCreatingAssignment,
    updateAssignment,
    isUpdatingAssignment,
    deleteAssignment,
    isDeletingAssignment,
  };
};

// Hook for teachers to view their created assignments
export const useTeacherAssignments = (params?: AssignmentFilters) => {
  const queryClient = useQueryClient();

  const {
    data: assignments,
    isLoading: isAssignmentsLoading,
    error: assignmentsError,
    refetch: refetchAssignments
  } = useQuery<PaginatedResponse<Assignment>>(
    ['teacher-assignments', params],
    () => assignmentsService.getMyCreatedAssignments(params)
  );

  return {
    assignments,
    isAssignmentsLoading,
    assignmentsError,
    refetchAssignments,
  };
};

// Hook for students to view their assignments
export const useStudentAssignments = (params?: { 
  skip?: number; 
  limit?: number; 
  search?: string; 
  subject_id?: number; 
  status?: string; 
}) => {
  const queryClient = useQueryClient();

  const {
    data: assignments,
    isLoading: isAssignmentsLoading,
    error: assignmentsError,
    refetch: refetchAssignments
  } = useQuery<{
    assignments: Assignment[];
    total: number;
    page: number;
    pages: number;
    has_next: boolean;
    has_prev: boolean;
  }>(
    ['student-assignments', params],
    () => assignmentsService.getMyAssignments(params)
  );

  return {
    assignments,
    isAssignmentsLoading,
    assignmentsError,
    refetchAssignments,
  };
};

export const useAssignment = (id: number) => {
  const { data: assignment, isLoading: isAssignmentLoading } = useQuery<Assignment>(
    ['assignment', id],
    () => assignmentsService.getAssignment(id)
  );

  return {
    assignment,
    isAssignmentLoading,
  };
};

// Hook for assignment dropdown data
export const useAssignmentDropdowns = () => {
  // Get available teachers
  const {
    data: teachers,
    isLoading: isTeachersLoading,
    error: teachersError,
    refetch: refetchTeachers
  } = useQuery({
    queryKey: ['assignment-teachers'],
    queryFn: assignmentsService.getAvailableTeachers,
    enabled: true,
  });

  return {
    teachers: teachers || [],
    isTeachersLoading,
    teachersError,
    refetchTeachers
  };
};

// Hook for getting classes for a specific teacher
export const useTeacherClasses = (teacherId: number | null) => {
  const {
    data: classes,
    isLoading: isClassesLoading,
    error: classesError,
    refetch: refetchClasses
  } = useQuery({
    queryKey: ['teacher-classes', teacherId],
    queryFn: () => assignmentsService.getAvailableClasses(teacherId!),
    enabled: !!teacherId,
  });

  return {
    classes: classes || [],
    isClassesLoading,
    classesError,
    refetchClasses
  };
};

// Hook for getting subjects for a teacher-class combination
export const useTeacherClassSubjects = (teacherId: number | null, classId: number | null) => {
  const {
    data: subjects,
    isLoading: isSubjectsLoading,
    error: subjectsError,
    refetch: refetchSubjects
  } = useQuery({
    queryKey: ['teacher-class-subjects', teacherId, classId],
    queryFn: () => assignmentsService.getAvailableSubjects(teacherId!, classId!),
    enabled: !!(teacherId && classId),
  });

  return {
    subjects: subjects || [],
    isSubjectsLoading,
    subjectsError,
    refetchSubjects
  };
};
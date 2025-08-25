import { useQuery, useMutation, useQueryClient } from 'react-query';
import { examsService, Exam, ExamCreateRequest, ExamUpdateRequest, ExamFilters } from '../services/exams';
import { PaginatedResponse } from '../types/api';

export const useExams = (params?: ExamFilters) => {
  const queryClient = useQueryClient();

  const {
    data: exams,
    isLoading: isExamsLoading,
    error: examsError,
    refetch: refetchExams
  } = useQuery<PaginatedResponse<Exam>>(
    ['exams', params],
    () => examsService.getExams(params)
  );

  const { mutate: createExam, isLoading: isCreatingExam } = useMutation(
    (data: ExamCreateRequest) => examsService.createExam(data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('exams');
      },
    }
  );

  const { mutate: updateExam, isLoading: isUpdatingExam } = useMutation(
    ({ id, data }: { id: number; data: ExamUpdateRequest }) => examsService.updateExam(id, data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('exams');
      },
    }
  );

  const { mutate: deleteExam, isLoading: isDeletingExam } = useMutation(
    (id: number) => examsService.deleteExam(id),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('exams');
      },
    }
  );

  return {
    exams,
    isExamsLoading,
    examsError,
    refetchExams,
    createExam,
    isCreatingExam,
    updateExam,
    isUpdatingExam,
    deleteExam,
    isDeletingExam,
  };
};

export const useExam = (id: number) => {
  const { data: exam, isLoading: isExamLoading } = useQuery<Exam>(
    ['exam', id],
    () => examsService.getExam(id)
  );

  return {
    exam,
    isExamLoading,
  };
};

// Hook for getting available teachers
export const useExamTeachers = () => {
  return useQuery(
    ['exam-teachers'],
    () => examsService.getAvailableTeachers(),
    {
      staleTime: 5 * 60 * 1000, // 5 minutes
    }
  );
};

// Hook for getting available classes for a teacher
export const useExamTeacherClasses = (teacherId: number | null) => {
  return useQuery(
    ['exam-teacher-classes', teacherId],
    () => teacherId ? examsService.getAvailableClasses(teacherId) : Promise.resolve({ classes: [] }),
    {
      enabled: !!teacherId,
      staleTime: 5 * 60 * 1000, // 5 minutes
    }
  );
};

// Hook for getting available subjects for a teacher and class
export const useExamTeacherClassSubjects = (teacherId: number | null, classId: number | null) => {
  return useQuery(
    ['exam-teacher-class-subjects', teacherId, classId],
    () => (teacherId && classId) ? examsService.getAvailableSubjects(teacherId, classId) : Promise.resolve({ subjects: [] }),
    {
      enabled: !!(teacherId && classId),
      staleTime: 5 * 60 * 1000, // 5 minutes
    }
  );
};
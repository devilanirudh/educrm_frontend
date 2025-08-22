import { useQuery, useMutation, useQueryClient } from 'react-query';
import { teachersService, Teacher, TeacherCreateRequest, TeacherUpdateRequest, TeacherFilters } from '../services/teachers';
import { PaginatedResponse } from '../types/api';

export const useTeachers = (params?: TeacherFilters) => {
  const queryClient = useQueryClient();

  const {
    data: teachers,
    isLoading: isTeachersLoading,
    error: teachersError,
    refetch: refetchTeachers
  } = useQuery<PaginatedResponse<Teacher>>(
    ['teachers', params],
    () => teachersService.getTeachers(params)
  );

  const { data: teacherHeadcountTrend, isLoading: isTeacherTrendLoading } = useQuery(
    'teacherHeadcountTrend',
    teachersService.getTeacherHeadcountTrend
  );

  const { mutate: createTeacher, isLoading: isCreatingTeacher } = useMutation(
    (data: TeacherCreateRequest) => teachersService.createTeacher(data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('teachers');
      },
    }
  );

  const { mutate: updateTeacher, isLoading: isUpdatingTeacher } = useMutation(
    ({ id, data }: { id: number; data: TeacherUpdateRequest }) => teachersService.updateTeacher(id, data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('teachers');
      },
    }
  );

  const { mutate: deleteTeacher, isLoading: isDeletingTeacher } = useMutation(
    (id: number) => teachersService.deleteTeacher(id),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('teachers');
      },
    }
  );

  return {
    teachers,
    isTeachersLoading,
    teachersError,
    refetchTeachers,
    teacherHeadcountTrend,
    isTeacherTrendLoading,
    createTeacher,
    isCreatingTeacher,
    updateTeacher,
    isUpdatingTeacher,
    deleteTeacher,
    isDeletingTeacher,
  };
};

export const useTeacher = (id: number) => {
  const { data: teacher, isLoading: isTeacherLoading } = useQuery<Teacher>(
    ['teacher', id],
    () => teachersService.getTeacher(id)
  );

  return {
    teacher,
    isTeacherLoading,
  };
};
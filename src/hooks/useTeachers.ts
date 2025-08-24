import { useQuery, useMutation, useQueryClient } from 'react-query';
import { teachersService, Teacher, TeacherCreateRequest, TeacherUpdateRequest, TeacherFilters } from '../services/teachers';
import { PaginatedResponse } from '../types/api';
import api from '../services/api';

interface TeacherOption {
  value: string;
  label: string;
}

interface TeachersResponse {
  teachers: TeacherOption[];
}

export const useTeachers = (params?: TeacherFilters) => {
  const queryClient = useQueryClient();

  const {
    data: teachers,
    isLoading: isTeachersLoading,
    error: teachersError,
    refetch: refetchTeachers
  } = useQuery<PaginatedResponse<Teacher>>(
    ['teachers', params],
    () => teachersService.getTeachers(params),
    {
      refetchOnMount: false, // Don't refetch if data is fresh
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000, // Data is fresh for 5 minutes
      cacheTime: 30 * 60 * 1000, // Keep in cache for 30 minutes
    }
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

// Separate hook for dropdown data
export const useTeachersDropdown = () => {
  const {
    data: teachersData,
    isLoading: isTeachersLoading,
    error: teachersError,
    refetch: refetchTeachers
  } = useQuery<TeachersResponse>({
    queryKey: ['teachers-dropdown'],
    queryFn: async () => {
      const response = await api.get('/teachers/active');
      return response.data;
    },
    enabled: true,
  });

  return {
    teachers: teachersData?.teachers || [],
    isTeachersLoading,
    teachersError,
    refetchTeachers
  };
};

export const useTeacher = (id: number) => {
  const { data: teacher, isLoading: isTeacherLoading } = useQuery<Teacher>(
    ['teacher', id],
    () => teachersService.getTeacher(id)
  );

  return {
    teacher,
    isTeacherLoading
  };
};
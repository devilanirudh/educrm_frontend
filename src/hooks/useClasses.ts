import { useQuery, useMutation, useQueryClient } from 'react-query';
import { classesService, Class, ClassCreateRequest, ClassUpdateRequest, ClassFilters } from '../services/classes';
import { PaginatedResponse } from '../types/api';

export const useClasses = (params?: ClassFilters) => {
  const queryClient = useQueryClient();

  const { data: classes, isLoading: isClassesLoading } = useQuery<PaginatedResponse<Class>>(
    ['classes', params],
    () => classesService.getClasses(params)
  );

  const { data: studentsByClass, isLoading: isStudentsByClassLoading } = useQuery(
    'studentsByClass',
    classesService.getStudentsByClass
  );

  const { mutate: createClass, isLoading: isCreatingClass } = useMutation(
    (data: ClassCreateRequest) => classesService.createClass(data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('classes');
      },
    }
  );

  const { mutate: updateClass, isLoading: isUpdatingClass } = useMutation(
    ({ id, data }: { id: number; data: ClassUpdateRequest }) => classesService.updateClass(id, data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('classes');
      },
    }
  );

  const { mutate: deleteClass, isLoading: isDeletingClass } = useMutation(
    (id: number) => classesService.deleteClass(id),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('classes');
      },
    }
  );

  return {
    classes,
    isClassesLoading,
    studentsByClass,
    isStudentsByClassLoading,
    createClass,
    isCreatingClass,
    updateClass,
    isUpdatingClass,
    deleteClass,
    isDeletingClass,
  };
};

export const useClass = (id: number) => {
  const { data: classData, isLoading: isClassLoading } = useQuery<Class>(
    ['class', id],
    () => classesService.getClass(id)
  );

  return {
    classData,
    isClassLoading,
  };
};
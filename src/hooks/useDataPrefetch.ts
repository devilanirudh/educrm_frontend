import { useEffect } from 'react';
import { useQueryClient } from 'react-query';
import { studentsService } from '../services/students';
import { teachersService } from '../services/teachers';
import { classesService } from '../services/classes';
import { formService } from '../services/formService';

/**
 * Hook to prefetch commonly used data in the background
 * This helps ensure data is available when users navigate between pages
 */
export const useDataPrefetch = () => {
  const queryClient = useQueryClient();

  useEffect(() => {
    // Prefetch core data with default params (first page)
    const prefetchCoreData = async () => {
      try {
        // Prefetch first page of students (most commonly accessed)
        queryClient.prefetchQuery(
          ['students', JSON.stringify({ is_active: true, page: 0, per_page: 10 })],
          () => studentsService.getStudents({ is_active: true, page: 0, per_page: 10 }),
          {
            staleTime: 5 * 60 * 1000, // 5 minutes
          }
        );

        // Prefetch first page of teachers
        queryClient.prefetchQuery(
          ['teachers', { page: 0, per_page: 10 }],
          () => teachersService.getTeachers({ page: 0, per_page: 10 }),
          {
            staleTime: 5 * 60 * 1000,
          }
        );

        // Prefetch first page of classes
        queryClient.prefetchQuery(
          ['classes', { page: 0, per_page: 10 }],
          () => classesService.getClasses({ page: 0, per_page: 10 }),
          {
            staleTime: 5 * 60 * 1000,
          }
        );

        // Prefetch student form schema (commonly used)
        queryClient.prefetchQuery(
          ['form', 'student_form'],
          () => formService.getDefaultForm('student'),
          {
            staleTime: 30 * 60 * 1000, // Form schema changes less frequently
          }
        );
      } catch (error) {
        // Silently fail prefetching - it's not critical
        console.log('Prefetch failed:', error);
      }
    };

    // Delay prefetching to not interfere with initial page load
    const timer = setTimeout(prefetchCoreData, 3000);

    return () => clearTimeout(timer);
  }, [queryClient]);
};

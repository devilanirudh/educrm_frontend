import { useQuery, useMutation, useQueryClient } from 'react-query';
import { examsService } from '../services/exams';
import { Exam } from '../types/exams';
import { PaginatedResponse } from '../types/api';

export const useExams = () => {
  const queryClient = useQueryClient();

  const { data: terms, isLoading: isTermsLoading } = useQuery(
    'terms',
    examsService.getTerms
  );

  const { mutate: createTerm, isLoading: isCreatingTerm } = useMutation(
    (data: { name: string; academic_year: string }) => examsService.createTerm(data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('terms');
      },
    }
  );

  const { mutate: createDateSheet, isLoading: isCreatingDateSheet } = useMutation(
    (data: any) => examsService.createDateSheet(data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('dateSheets');
      },
    }
  );

  const { mutate: updateDateSheet, isLoading: isUpdatingDateSheet } = useMutation(
    ({ id, data }: { id: number; data: any }) => examsService.updateDateSheet(id, data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('dateSheets');
      },
    }
  );

  const { mutate: publishDateSheet, isLoading: isPublishingDateSheet } = useMutation(
    (id: number) => examsService.publishDateSheet(id),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('dateSheets');
      },
    }
  );

  return {
    terms,
    isTermsLoading,
    createTerm,
    isCreatingTerm,
    createDateSheet,
    isCreatingDateSheet,
    updateDateSheet,
    isUpdatingDateSheet,
    publishDateSheet,
    isPublishingDateSheet,
  };
};

export const useDateSheet = (classId: number, termId: number) => {
  const { data: dateSheet, isLoading: isDateSheetLoading } = useQuery(
    ['dateSheet', classId, termId],
    () => examsService.getDateSheet(classId, termId)
  );

  return {
    dateSheet,
    isDateSheetLoading,
  };
};

export const useExamsList = (params: { page: number; per_page: number; search?: string }) => {
  const queryClient = useQueryClient();

  const { data: exams, isLoading: isExamsLoading } = useQuery<PaginatedResponse<Exam>>(
    ['exams', params],
    () => examsService.getExams(params)
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
    deleteExam,
    isDeletingExam,
  };
};
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { assignmentsService, Assignment, AssignmentCreateRequest, AssignmentUpdateRequest } from '../services/assignments';
import { PaginatedResponse } from '../types/api';

export const useAssignments = (params: { page: number; per_page: number; search?: string, class_id?: number }) => {
  const queryClient = useQueryClient();

  const { data: assignments, isLoading: isAssignmentsLoading } = useQuery<PaginatedResponse<Assignment>>(
    ['assignments', params],
    () => assignmentsService.getAssignments(params),
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

  const { mutate: submitAssignment, isLoading: isSubmittingAssignment } = useMutation(
    ({ id, data }: { id: number; data: { submission_text: string, attachment_paths: string[] } }) => assignmentsService.submitAssignment(id, data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('assignments');
      },
    }
  );

  return {
    assignments,
    isAssignmentsLoading,
    createAssignment,
    isCreatingAssignment,
    updateAssignment,
    isUpdatingAssignment,
    deleteAssignment,
    isDeletingAssignment,
    submitAssignment,
    isSubmittingAssignment,
  };
};
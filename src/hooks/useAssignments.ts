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
import { useIsFetching, useIsMutating } from 'react-query';

/**
 * Hook to manage global app loading state
 * Shows loading only for critical mutations, not data fetching
 */
export const useAppLoading = () => {
  const isFetching = useIsFetching();
  const isMutating = useIsMutating();

  // Only show loading for mutations (create/update/delete operations)
  // Don't show for data fetching as it's handled by skeleton loaders
  const isLoading = isMutating > 0;

  return {
    isLoading,
    isFetching: isFetching > 0,
    isMutating: isMutating > 0,
  };
};

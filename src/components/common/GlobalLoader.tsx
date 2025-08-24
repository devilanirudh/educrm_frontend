import React from 'react';
import { useAppLoading } from '../../hooks/useAppLoading';

const GlobalLoader: React.FC = () => {
  const { isLoading, isMutating } = useAppLoading();

  // Only show for critical mutations, not for data fetching
  if (!isLoading || !isMutating) return null;

  return (
    <>
      {/* Non-blocking toast-style loader for mutations only */}
      <div className="fixed top-4 right-4 z-50">
        <div className="bg-white rounded-xl p-4 shadow-lg border border-surface-200">
          <div className="flex items-center space-x-3">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-brand-600"></div>
            <span className="text-surface-700 font-medium text-sm">
              Saving changes...
            </span>
          </div>
        </div>
      </div>
    </>
  );
};

export default GlobalLoader;

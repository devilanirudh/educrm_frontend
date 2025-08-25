import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { RootState } from '../../store';
import { logout } from '../../store/authSlice';
import { authService } from '../../services/auth';
import { tokenUtils } from '../../services/auth';
import { 
  ExclamationTriangleIcon, 
  ArrowLeftIcon,
  UserIcon
} from '@heroicons/react/24/outline';

const ImpersonationBanner: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, isImpersonating } = useSelector((state: RootState) => state.auth);

  if (!isImpersonating) {
    return null;
  }

  const handleStopImpersonation = async () => {
    try {
      const response = await authService.stopImpersonation();
      
      // Clear the impersonation session token and localStorage
      tokenUtils.clearTokens();
      localStorage.removeItem('originalUser');
      localStorage.removeItem('isImpersonating');
      
      // Update Redux store
      dispatch(logout());
      
      // Navigate back to login to get fresh Firebase token
      navigate('/login');
      
      // Reload page to reset all state
      window.location.reload();
    } catch (error) {
      console.error('Failed to stop impersonation:', error);
      // If stopping impersonation fails, just logout
      dispatch(logout());
      navigate('/login');
    }
  };

  return (
    <div className="bg-amber-50 border-b border-amber-200 px-4 py-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <ExclamationTriangleIcon className="h-5 w-5 text-amber-600" />
          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium text-amber-800">
              You are currently impersonating:
            </span>
            <div className="flex items-center space-x-1 bg-amber-100 px-2 py-1 rounded-md">
              <UserIcon className="h-4 w-4 text-amber-700" />
              <span className="text-sm font-medium text-amber-800">
                {user?.first_name} {user?.last_name} ({user?.role})
              </span>
            </div>
          </div>
        </div>
        <button
          onClick={handleStopImpersonation}
          className="flex items-center space-x-2 bg-amber-600 hover:bg-amber-700 text-white px-3 py-1.5 rounded-md text-sm font-medium transition-colors duration-200"
        >
          <ArrowLeftIcon className="h-4 w-4" />
          <span>Stop Impersonation</span>
        </button>
      </div>
    </div>
  );
};

export default ImpersonationBanner;

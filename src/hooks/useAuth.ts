import { useSelector } from 'react-redux';
import { RootState } from '../store';

export const useAuth = () => {
  const user = useSelector((state: RootState) => state.auth.user);
  const token = useSelector((state: RootState) => state.auth.token);
  const isAuthenticated = !!token && !!user;

  return {
    user,
    isAuthenticated,
    token,
    isLoading: false,
    error: null
  };
};

import React from 'react';
import { useNavigate } from 'react-router-dom';
import FirebaseLogin from '../../components/auth/FirebaseLogin';

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  
  const handleLoginSuccess = () => {
    console.log('🚀 LoginPage: Login success, navigating to dashboard...');
    // Simple navigation - let React Router handle it
    navigate('/dashboard', { replace: true });
  };

  return <FirebaseLogin onSuccess={handleLoginSuccess} />;
};

export default LoginPage;

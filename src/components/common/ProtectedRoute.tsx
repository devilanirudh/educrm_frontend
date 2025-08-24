/**
 * Protected route component for authentication
 */

import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAppSelector } from '../../store';
import { Permission } from '../../types/api';
import { UserRole } from '../../types/auth';
import LoadingSpinner from './LoadingSpinner';
import { Box, Typography, Paper } from '@mui/material';
import { Lock } from '@mui/icons-material';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredPermissions?: Permission[];
  requiredRoles?: UserRole[];
  fallback?: React.ReactNode;
}

// Role-permission mapping (simplified version)
const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  super_admin: ['user:create', 'user:read', 'user:update', 'user:delete'], // All permissions
  admin: ['user:read', 'student:create', 'teacher:create', 'class:create'],
  teacher: ['student:read', 'class:read', 'assignment:create', 'exam:create'],
  student: ['assignment:read', 'exam:read', 'live_class:read'],
  parent: ['student:read', 'fee:read', 'communication:read'],
  staff: ['student:read', 'teacher:read', 'class:read'],
  guest: ['cms:read'],
};

const ProtectedRoute = ({
  children,
  requiredPermissions = [],
  requiredRoles = [],
  fallback,
}: ProtectedRouteProps): React.ReactElement => {
  const location = useLocation();
  const { token, isAuthenticated } = useAppSelector((state) => state.auth);


  // Debug authentication state
  console.log('🔍 ProtectedRoute - Auth state:', { isAuthenticated, hasToken: !!token, pathname: location.pathname });
  
  // Redirect to login if not authenticated
  if (!isAuthenticated || !token) {
    console.log('🚫 ProtectedRoute - Not authenticated, redirecting to login');
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  
  console.log('✅ ProtectedRoute - Authenticated, allowing access');





  return <>{children}</>;
};

// Unauthorized access component
const UnauthorizedAccess: React.FC = () => (
  <Box
    display="flex"
    flexDirection="column"
    alignItems="center"
    justifyContent="center"
    minHeight="60vh"
    px={3}
  >
    <Paper
      elevation={1}
      sx={{
        p: 4,
        textAlign: 'center',
        maxWidth: 400,
        borderRadius: 2,
      }}
    >
      <Lock sx={{ fontSize: 60, color: 'error.main', mb: 2 }} />
      <Typography variant="h5" gutterBottom color="error">
        Access Denied
      </Typography>
      <Typography variant="body1" color="text.secondary" paragraph>
        You don't have permission to access this page. Please contact your administrator if you believe this is an error.
      </Typography>
    </Paper>
  </Box>
);

// Unverified account component
const UnverifiedAccount: React.FC = () => (
  <Box
    display="flex"
    flexDirection="column"
    alignItems="center"
    justifyContent="center"
    minHeight="60vh"
    px={3}
  >
    <Paper
      elevation={1}
      sx={{
        p: 4,
        textAlign: 'center',
        maxWidth: 400,
        borderRadius: 2,
      }}
    >
      <Typography variant="h5" gutterBottom color="warning.main">
        Account Verification Required
      </Typography>
      <Typography variant="body1" color="text.secondary" paragraph>
        Please verify your email address to access this feature. Check your email for a verification link.
      </Typography>
    </Paper>
  </Box>
);

// Inactive account component
const InactiveAccount: React.FC = () => (
  <Box
    display="flex"
    flexDirection="column"
    alignItems="center"
    justifyContent="center"
    minHeight="60vh"
    px={3}
  >
    <Paper
      elevation={1}
      sx={{
        p: 4,
        textAlign: 'center',
        maxWidth: 400,
        borderRadius: 2,
      }}
    >
      <Typography variant="h5" gutterBottom color="error">
        Account Suspended
      </Typography>
      <Typography variant="body1" color="text.secondary" paragraph>
        Your account has been suspended. Please contact the administrator for assistance.
      </Typography>
    </Paper>
  </Box>
);

export default ProtectedRoute;

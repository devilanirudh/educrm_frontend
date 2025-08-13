/**
 * Login page component
 */

import React, { useState } from 'react';
import { useNavigate, useLocation, Link as RouterLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import {
  Box,
  TextField,
  Button,
  Typography,
  Link,
  FormControlLabel,
  Checkbox,
  Alert,
  InputAdornment,
  IconButton,
} from '@mui/material';
import { Visibility, VisibilityOff, Email, Lock } from '@mui/icons-material';
import { useFormik } from 'formik';
import * as Yup from 'yup';

import { RootState, useAppDispatch } from '../../store';
import { login } from '../../store/authSlice';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const validationSchema = Yup.object({
  username: Yup.string().required('Email or username is required'),
  password: Yup.string()
    .min(6, 'Password must be at least 6 characters')
    .required('Password is required'),
});

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useAppDispatch();
  
  const { isLoading, error } = useSelector((state: RootState) => state.auth);
  const [showPassword, setShowPassword] = useState(false);

  const formik = useFormik({
    initialValues: {
      username: '',
      password: '',
      remember_me: false,
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        await dispatch(login(values));
        
        // Redirect to intended page or dashboard
        const from = location.state?.from?.pathname || '/dashboard';
        navigate(from, { replace: true });
      } catch (error) {
        // Error is handled by the Redux slice
      }
    },
  });

  const handleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <Box component="form" onSubmit={formik.handleSubmit} noValidate>
      <Typography variant="h4" component="h1" gutterBottom textAlign="center" fontWeight={600}>
        Welcome Back
      </Typography>
      
      <Typography variant="body2" color="text.secondary" textAlign="center" sx={{ mb: 3 }}>
        Sign in to your account to continue
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <TextField
        fullWidth
        id="username"
        name="username"
        label="Email or Username"
        value={formik.values.username}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        error={formik.touched.username && Boolean(formik.errors.username)}
        helperText={formik.touched.username && formik.errors.username}
        margin="normal"
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Email color="action" />
            </InputAdornment>
          ),
        }}
        disabled={isLoading}
      />

      <TextField
        fullWidth
        id="password"
        name="password"
        label="Password"
        type={showPassword ? 'text' : 'password'}
        value={formik.values.password}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        error={formik.touched.password && Boolean(formik.errors.password)}
        helperText={formik.touched.password && formik.errors.password}
        margin="normal"
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Lock color="action" />
            </InputAdornment>
          ),
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                aria-label="toggle password visibility"
                onClick={handleShowPassword}
                edge="end"
              >
                {showPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          ),
        }}
        disabled={isLoading}
      />

      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2, mb: 3 }}>
        <FormControlLabel
          control={
            <Checkbox
              name="remember_me"
              checked={formik.values.remember_me}
              onChange={formik.handleChange}
              disabled={isLoading}
            />
          }
          label="Remember me"
        />
        
        <Link
          component={RouterLink}
          to="/auth/forgot-password"
          variant="body2"
          color="primary"
          underline="hover"
        >
          Forgot password?
        </Link>
      </Box>

      <Button
        type="submit"
        fullWidth
        variant="contained"
        size="large"
        disabled={isLoading || !formik.isValid}
        sx={{ mb: 2, py: 1.5 }}
      >
        {isLoading ? <LoadingSpinner size={24} /> : 'Sign In'}
      </Button>

      <Box sx={{ textAlign: 'center' }}>
        <Typography variant="body2" color="text.secondary">
          Don't have an account?{' '}
          <Link
            component={RouterLink}
            to="/auth/register"
            color="primary"
            underline="hover"
            fontWeight={500}
          >
            Sign up here
          </Link>
        </Typography>
      </Box>

      {/* Demo credentials */}
      <Box sx={{ mt: 3, p: 2, backgroundColor: 'grey.50', borderRadius: 1 }}>
        <Typography variant="caption" color="text.secondary" display="block" gutterBottom>
          Demo Credentials:
        </Typography>
        <Typography variant="caption" display="block">
          Admin: admin@school.edu / admin123
        </Typography>
        <Typography variant="caption" display="block">
          Teacher: teacher@school.edu / teacher123
        </Typography>
        <Typography variant="caption" display="block">
          Student: student@school.edu / student123
        </Typography>
        <Typography variant="caption" display="block">
          Parent: parent@school.edu / parent123
        </Typography>
      </Box>
    </Box>
  );
};

export default LoginPage;

import React from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { TextField, Button, Typography, Box, CircularProgress } from '@mui/material';
import { useMutation } from 'react-query';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import api from '../../services/api';

import { loginSuccess } from '../../store/authSlice';
import { authService, tokenUtils } from '../../services/auth';

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const mutation = useMutation(async (credentials: any) => {
    // Use the authService instead of direct API call
    return await authService.login({
      username: credentials.email,
      password: credentials.password
    });
  }, {
    onSuccess: async (loginResponse) => {
      console.log('✅ Login successful:', loginResponse);

      // The login response already includes user data, so we don't need to fetch it separately
      const userData = loginResponse.user;
      
      console.log('🔍 User data from login response:', userData);
      
      // Set user and token in Redux store
      dispatch(loginSuccess({ 
        user: userData, 
        token: loginResponse.access_token 
      }));
      
      console.log('✅ User data set in stores, navigating to dashboard...');
      navigate('/dashboard');
    },
    onError: (error) => {
      console.error('❌ Login failed:', error);
    }
  });

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    validationSchema: Yup.object({
      email: Yup.string().email('Invalid email address').required('Required'),
      password: Yup.string().required('Required'),
    }),
    onSubmit: (values) => {
      mutation.mutate(values);
    },
  });

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Login
      </Typography>
      <form onSubmit={formik.handleSubmit}>
        <TextField
          fullWidth
          id="email"
          name="email"
          label="Email"
          value={formik.values.email}
          onChange={formik.handleChange}
          error={formik.touched.email && Boolean(formik.errors.email)}
          helperText={formik.touched.email && formik.errors.email}
          margin="normal"
        />
        <TextField
          fullWidth
          id="password"
          name="password"
          label="Password"
          type="password"
          value={formik.values.password}
          onChange={formik.handleChange}
          error={formik.touched.password && Boolean(formik.errors.password)}
          helperText={formik.touched.password && formik.errors.password}
          margin="normal"
        />
        <Button
          color="primary"
          variant="contained"
          fullWidth
          type="submit"
          disabled={mutation.isLoading}
        >
          {mutation.isLoading ? <CircularProgress size={24} /> : 'Login'}
        </Button>
      </form>
    </Box>
  );
};

export default LoginPage;

import React from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { TextField, Button, Typography, Box, CircularProgress } from '@mui/material';
import { useMutation } from 'react-query';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';

const RegisterPage: React.FC = () => {
  const navigate = useNavigate();

  const mutation = useMutation((newUser: any) => api.post('/auth/register', newUser), {
    onSuccess: () => {
      navigate('/login');
    },
  });

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
      first_name: '',
      last_name: '',
    },
    validationSchema: Yup.object({
      email: Yup.string().email('Invalid email address').required('Required'),
      password: Yup.string().min(6, 'Password must be at least 6 characters').required('Required'),
      first_name: Yup.string().required('Required'),
      last_name: Yup.string().required('Required'),
    }),
    onSubmit: (values) => {
      mutation.mutate(values);
    },
  });

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Register
      </Typography>
      <form onSubmit={formik.handleSubmit}>
        <TextField
          fullWidth
          id="first_name"
          name="first_name"
          label="First Name"
          value={formik.values.first_name}
          onChange={formik.handleChange}
          error={formik.touched.first_name && Boolean(formik.errors.first_name)}
          helperText={formik.touched.first_name && formik.errors.first_name}
          margin="normal"
        />
        <TextField
          fullWidth
          id="last_name"
          name="last_name"
          label="Last Name"
          value={formik.values.last_name}
          onChange={formik.handleChange}
          error={formik.touched.last_name && Boolean(formik.errors.last_name)}
          helperText={formik.touched.last_name && formik.errors.last_name}
          margin="normal"
        />
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
          {mutation.isLoading ? <CircularProgress size={24} /> : 'Register'}
        </Button>
      </form>
    </Box>
  );
};

export default RegisterPage;

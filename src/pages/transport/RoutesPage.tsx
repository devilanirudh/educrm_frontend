import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from '@mui/material';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { getRoutes, createRoute } from '../../services/transport';
import { Route } from '../../types/transport';

const RouteSchema = Yup.object().shape({
  name: Yup.string().required('Required'),
  description: Yup.string(),
});

const RoutesPage = () => {
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);

  const { data: routes, isLoading } = useQuery<Route[]>('routes', getRoutes);

  const mutation = useMutation(createRoute, {
    onSuccess: () => {
      queryClient.invalidateQueries('routes');
      setOpen(false);
    },
  });

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div>
      <Button variant="contained" color="primary" onClick={handleClickOpen}>
        Add Route
      </Button>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Description</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {routes?.map((route: Route) => (
              <TableRow key={route.id}>
                <TableCell>{route.name}</TableCell>
                <TableCell>{route.description}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Add New Route</DialogTitle>
        <Formik
          initialValues={{
            name: '',
            description: '',
          }}
          validationSchema={RouteSchema}
          onSubmit={(values) => {
            mutation.mutate(values);
          }}
        >
          {({ errors, touched }) => (
            <Form>
              <DialogContent>
                <Field
                  as={TextField}
                  name="name"
                  label="Name"
                  fullWidth
                  error={errors.name && touched.name}
                  helperText={errors.name && touched.name && errors.name}
                />
                <Field as={TextField} name="description" label="Description" fullWidth />
              </DialogContent>
              <DialogActions>
                <Button onClick={handleClose}>Cancel</Button>
                <Button type="submit" color="primary">
                  Add
                </Button>
              </DialogActions>
            </Form>
          )}
        </Formik>
      </Dialog>
    </div>
  );
};

export default RoutesPage;
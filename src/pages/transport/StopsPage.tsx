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
import { getStops, createStop } from '../../services/transport';
import { Stop } from '../../types/transport';

const StopSchema = Yup.object().shape({
  name: Yup.string().required('Required'),
  latitude: Yup.number(),
  longitude: Yup.number(),
  arrival_time_am: Yup.string(),
  departure_time_am: Yup.string(),
  arrival_time_pm: Yup.string(),
  departure_time_pm: Yup.string(),
  route_id: Yup.number().required('Required').integer(),
});

const StopsPage = () => {
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);

  const { data: stops, isLoading } = useQuery<Stop[]>('stops', getStops);

  const mutation = useMutation(createStop, {
    onSuccess: () => {
      queryClient.invalidateQueries('stops');
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
        Add Stop
      </Button>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Latitude</TableCell>
              <TableCell>Longitude</TableCell>
              <TableCell>Arrival AM</TableCell>
              <TableCell>Departure AM</TableCell>
              <TableCell>Arrival PM</TableCell>
              <TableCell>Departure PM</TableCell>
              <TableCell>Route ID</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {stops?.map((stop: Stop) => (
              <TableRow key={stop.id}>
                <TableCell>{stop.name}</TableCell>
                <TableCell>{stop.latitude}</TableCell>
                <TableCell>{stop.longitude}</TableCell>
                <TableCell>{stop.arrival_time_am}</TableCell>
                <TableCell>{stop.departure_time_am}</TableCell>
                <TableCell>{stop.arrival_time_pm}</TableCell>
                <TableCell>{stop.departure_time_pm}</TableCell>
                <TableCell>{stop.route_id}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Add New Stop</DialogTitle>
        <Formik
          initialValues={{
            name: '',
            latitude: '' as any,
            longitude: '' as any,
            arrival_time_am: '',
            departure_time_am: '',
            arrival_time_pm: '',
            departure_time_pm: '',
            route_id: '' as any,
          }}
          validationSchema={StopSchema}
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
                <Field as={TextField} name="latitude" label="Latitude" type="number" fullWidth />
                <Field as={TextField} name="longitude" label="Longitude" type="number" fullWidth />
                <Field
                  as={TextField}
                  name="arrival_time_am"
                  label="Arrival AM"
                  type="time"
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                />
                <Field
                  as={TextField}
                  name="departure_time_am"
                  label="Departure AM"
                  type="time"
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                />
                <Field
                  as={TextField}
                  name="arrival_time_pm"
                  label="Arrival PM"
                  type="time"
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                />
                <Field
                  as={TextField}
                  name="departure_time_pm"
                  label="Departure PM"
                  type="time"
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                />
                <Field
                  as={TextField}
                  name="route_id"
                  label="Route ID"
                  type="number"
                  fullWidth
                  error={errors.route_id && touched.route_id}
                  helperText={errors.route_id && touched.route_id && errors.route_id}
                />
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

export default StopsPage;
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
  Checkbox,
  FormControlLabel,
} from '@mui/material';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { getVehicles, createVehicle } from '../../services/transport';
import { Vehicle } from '../../types/transport';

const VehicleSchema = Yup.object().shape({
  registration_number: Yup.string().required('Required'),
  capacity: Yup.number().required('Required').positive('Must be positive').integer('Must be an integer'),
  driver_name: Yup.string(),
  driver_phone: Yup.string(),
  insurance_expiry: Yup.date(),
  is_active: Yup.boolean(),
  route_id: Yup.number().integer(),
});

const VehiclesPage = () => {
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);

  const { data: vehicles, isLoading } = useQuery<Vehicle[]>('vehicles', getVehicles);

  const mutation = useMutation(createVehicle, {
    onSuccess: () => {
      queryClient.invalidateQueries('vehicles');
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
        Add Vehicle
      </Button>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Registration Number</TableCell>
              <TableCell>Capacity</TableCell>
              <TableCell>Driver Name</TableCell>
              <TableCell>Driver Phone</TableCell>
              <TableCell>Insurance Expiry</TableCell>
              <TableCell>Active</TableCell>
              <TableCell>Route ID</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {vehicles?.map((vehicle: Vehicle) => (
              <TableRow key={vehicle.id}>
                <TableCell>{vehicle.registration_number}</TableCell>
                <TableCell>{vehicle.capacity}</TableCell>
                <TableCell>{vehicle.driver_name}</TableCell>
                <TableCell>{vehicle.driver_phone}</TableCell>
                <TableCell>{vehicle.insurance_expiry}</TableCell>
                <TableCell>{vehicle.is_active ? 'Yes' : 'No'}</TableCell>
                <TableCell>{vehicle.route_id}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Add New Vehicle</DialogTitle>
        <Formik
          initialValues={{
            registration_number: '',
            capacity: '' as any,
            driver_name: '',
            driver_phone: '',
            insurance_expiry: '' as any,
            is_active: true,
            route_id: '' as any,
          }}
          validationSchema={VehicleSchema}
          onSubmit={(values) => {
            mutation.mutate(values);
          }}
        >
          {({ errors, touched }) => (
            <Form>
              <DialogContent>
                <Field
                  as={TextField}
                  name="registration_number"
                  label="Registration Number"
                  fullWidth
                  error={errors.registration_number && touched.registration_number}
                  helperText={errors.registration_number && touched.registration_number && errors.registration_number}
                />
                <Field
                  as={TextField}
                  name="capacity"
                  label="Capacity"
                  type="number"
                  fullWidth
                  error={errors.capacity && touched.capacity}
                  helperText={errors.capacity && touched.capacity && errors.capacity}
                />
                <Field as={TextField} name="driver_name" label="Driver Name" fullWidth />
                <Field as={TextField} name="driver_phone" label="Driver Phone" fullWidth />
                <Field
                  as={TextField}
                  name="insurance_expiry"
                  label="Insurance Expiry"
                  type="date"
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                />
                <Field
                  as={FormControlLabel}
                  control={<Checkbox defaultChecked />}
                  label="Active"
                  name="is_active"
                />
                <Field as={TextField} name="route_id" label="Route ID" type="number" fullWidth />
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

export default VehiclesPage;
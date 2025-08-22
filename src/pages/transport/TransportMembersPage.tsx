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
import { getTransportMembers, createTransportMember } from '../../services/transport';
import { TransportMember } from '../../types/transport';

const TransportMemberSchema = Yup.object().shape({
  user_id: Yup.number().required('Required').integer(),
  route_id: Yup.number().required('Required').integer(),
  stop_id: Yup.number().required('Required').integer(),
});

const TransportMembersPage = () => {
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);

  const { data: transportMembers, isLoading } = useQuery<TransportMember[]>('transportMembers', getTransportMembers);

  const mutation = useMutation(createTransportMember, {
    onSuccess: () => {
      queryClient.invalidateQueries('transportMembers');
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
        Add Transport Member
      </Button>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>User ID</TableCell>
              <TableCell>Route ID</TableCell>
              <TableCell>Stop ID</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {transportMembers?.map((transportMember: TransportMember) => (
              <TableRow key={transportMember.id}>
                <TableCell>{transportMember.user_id}</TableCell>
                <TableCell>{transportMember.route_id}</TableCell>
                <TableCell>{transportMember.stop_id}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Add New Transport Member</DialogTitle>
        <Formik
          initialValues={{
            user_id: '' as any,
            route_id: '' as any,
            stop_id: '' as any,
          }}
          validationSchema={TransportMemberSchema}
          onSubmit={(values) => {
            mutation.mutate(values);
          }}
        >
          {({ errors, touched }) => (
            <Form>
              <DialogContent>
                <Field
                  as={TextField}
                  name="user_id"
                  label="User ID"
                  type="number"
                  fullWidth
                  error={errors.user_id && touched.user_id}
                  helperText={errors.user_id && touched.user_id && errors.user_id}
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
                <Field
                  as={TextField}
                  name="stop_id"
                  label="Stop ID"
                  type="number"
                  fullWidth
                  error={errors.stop_id && touched.stop_id}
                  helperText={errors.stop_id && touched.stop_id && errors.stop_id}
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

export default TransportMembersPage;
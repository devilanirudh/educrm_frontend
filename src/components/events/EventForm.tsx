import React from 'react';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { TextField, Button, Dialog, DialogActions, DialogContent, DialogTitle, MenuItem } from '@mui/material';
import { Event } from '../../types/events';

interface EventFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (values: Omit<Event, 'id'>) => void;
  initialValues?: Omit<Event, 'id'>;
}

const EventSchema = Yup.object().shape({
  title: Yup.string().required('Title is required'),
  description: Yup.string(),
  start: Yup.date().required('Start date is required'),
  end: Yup.date().required('End date is required').min(Yup.ref('start'), 'End date must be after start date'),
  audience: Yup.string().oneOf(['all', 'students', 'teachers']).required('Audience is required'),
});

const EventForm: React.FC<EventFormProps> = ({ open, onClose, onSubmit, initialValues }) => {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>{initialValues ? 'Edit Event' : 'Create Event'}</DialogTitle>
      <Formik
        initialValues={initialValues || { title: '', description: '', start: '', end: '', audience: 'all' }}
        validationSchema={EventSchema}
        onSubmit={(values, { setSubmitting }) => {
          onSubmit(values as Omit<Event, 'id'>);
          setSubmitting(false);
          onClose();
        }}
      >
        {({ errors, touched, isSubmitting }) => (
          <Form>
            <DialogContent>
              <Field
                as={TextField}
                name="title"
                label="Title"
                fullWidth
                margin="dense"
                error={touched.title && !!errors.title}
                helperText={touched.title && errors.title}
              />
              <Field
                as={TextField}
                name="description"
                label="Description"
                fullWidth
                margin="dense"
                multiline
                rows={4}
              />
              <Field
                as={TextField}
                name="start"
                label="Start Date"
                type="datetime-local"
                fullWidth
                margin="dense"
                InputLabelProps={{ shrink: true }}
                error={touched.start && !!errors.start}
                helperText={touched.start && errors.start}
              />
              <Field
                as={TextField}
                name="end"
                label="End Date"
                type="datetime-local"
                fullWidth
                margin="dense"
                InputLabelProps={{ shrink: true }}
                error={touched.end && !!errors.end}
                helperText={touched.end && errors.end}
              />
              <Field
                as={TextField}
                name="audience"
                label="Audience"
                select
                fullWidth
                margin="dense"
                error={touched.audience && !!errors.audience}
                helperText={touched.audience && errors.audience}
              >
                <MenuItem value="all">All</MenuItem>
                <MenuItem value="students">Students</MenuItem>
                <MenuItem value="teachers">Teachers</MenuItem>
              </Field>
            </DialogContent>
            <DialogActions>
              <Button onClick={onClose}>Cancel</Button>
              <Button type="submit" variant="contained" disabled={isSubmitting}>
                {initialValues ? 'Save' : 'Create'}
              </Button>
            </DialogActions>
          </Form>
        )}
      </Formik>
    </Dialog>
  );
};

export default EventForm;
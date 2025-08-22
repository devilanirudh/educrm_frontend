import React from 'react';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { TextField, Button, Box } from '@mui/material';

interface BookCategoryFormProps {
  onSubmit: (values: any) => void;
  initialValues?: any;
}

const BookCategorySchema = Yup.object().shape({
  name: Yup.string().required('Required'),
});

const BookCategoryForm: React.FC<BookCategoryFormProps> = ({ onSubmit, initialValues }) => {
  return (
    <Formik
      initialValues={initialValues || { name: '', description: '' }}
      validationSchema={BookCategorySchema}
      onSubmit={onSubmit}
    >
      {({ errors, touched }) => (
        <Form>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Field
              name="name"
              as={TextField}
              label="Name"
              error={touched.name && !!errors.name}
              helperText={touched.name && errors.name}
            />
            <Field
              name="description"
              as={TextField}
              label="Description"
              multiline
              rows={4}
            />
            <Button type="submit" variant="contained">
              Submit
            </Button>
          </Box>
        </Form>
      )}
    </Formik>
  );
};

export default BookCategoryForm;
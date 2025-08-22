import React from 'react';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { TextField, Button, Box } from '@mui/material';

interface BookFormProps {
  onSubmit: (values: any) => void;
  initialValues?: any;
}

const BookSchema = Yup.object().shape({
  title: Yup.string().required('Required'),
  author: Yup.string().required('Required'),
  category_id: Yup.number().required('Required'),
  total_copies: Yup.number().min(1).required('Required'),
});

const BookForm: React.FC<BookFormProps> = ({ onSubmit, initialValues }) => {
  return (
    <Formik
      initialValues={initialValues || { title: '', author: '', category_id: '', total_copies: 1 }}
      validationSchema={BookSchema}
      onSubmit={onSubmit}
    >
      {({ errors, touched }) => (
        <Form>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Field
              name="title"
              as={TextField}
              label="Title"
              error={touched.title && !!errors.title}
              helperText={touched.title && errors.title}
            />
            <Field
              name="author"
              as={TextField}
              label="Author"
              error={touched.author && !!errors.author}
              helperText={touched.author && errors.author}
            />
            <Field
              name="category_id"
              as={TextField}
              label="Category ID"
              type="number"
              error={touched.category_id && !!errors.category_id}
              helperText={touched.category_id && errors.category_id}
            />
            <Field
              name="total_copies"
              as={TextField}
              label="Total Copies"
              type="number"
              error={touched.total_copies && !!errors.total_copies}
              helperText={touched.total_copies && errors.total_copies}
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

export default BookForm;
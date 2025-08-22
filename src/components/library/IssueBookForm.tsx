import React from 'react';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { TextField, Button, Box } from '@mui/material';

interface IssueBookFormProps {
  onSubmit: (values: any) => void;
  initialValues?: any;
}

const IssueBookSchema = Yup.object().shape({
  book_id: Yup.number().required('Required'),
  member_id: Yup.number().required('Required'),
  due_date: Yup.date().required('Required'),
});

const IssueBookForm: React.FC<IssueBookFormProps> = ({ onSubmit, initialValues }) => {
  return (
    <Formik
      initialValues={initialValues || { book_id: '', member_id: '', due_date: '' }}
      validationSchema={IssueBookSchema}
      onSubmit={onSubmit}
    >
      {({ errors, touched }) => (
        <Form>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Field
              name="book_id"
              as={TextField}
              label="Book ID"
              type="number"
              error={touched.book_id && !!errors.book_id}
              helperText={touched.book_id && errors.book_id}
            />
            <Field
              name="member_id"
              as={TextField}
              label="Member ID"
              type="number"
              error={touched.member_id && !!errors.member_id}
              helperText={touched.member_id && errors.member_id}
            />
            <Field
              name="due_date"
              as={TextField}
              label="Due Date"
              type="date"
              InputLabelProps={{ shrink: true }}
              error={touched.due_date && !!errors.due_date}
              helperText={touched.due_date && errors.due_date}
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

export default IssueBookForm;
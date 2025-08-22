import React from 'react';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { TextField, Button, Box } from '@mui/material';

interface IssueInventoryItemFormProps {
  onSubmit: (values: any) => void;
  initialValues?: any;
}

const IssueInventoryItemSchema = Yup.object().shape({
  item_id: Yup.number().required('Required'),
  user_id: Yup.number().required('Required'),
});

const IssueInventoryItemForm: React.FC<IssueInventoryItemFormProps> = ({ onSubmit, initialValues }) => {
  return (
    <Formik
      initialValues={initialValues || { item_id: '', user_id: '' }}
      validationSchema={IssueInventoryItemSchema}
      onSubmit={onSubmit}
    >
      {({ errors, touched }) => (
        <Form>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Field
              name="item_id"
              as={TextField}
              label="Item ID"
              type="number"
              error={touched.item_id && !!errors.item_id}
              helperText={touched.item_id && errors.item_id}
            />
            <Field
              name="user_id"
              as={TextField}
              label="User ID"
              type="number"
              error={touched.user_id && !!errors.user_id}
              helperText={touched.user_id && errors.user_id}
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

export default IssueInventoryItemForm;
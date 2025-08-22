import React from 'react';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { TextField, Button, Box } from '@mui/material';

interface InventoryItemFormProps {
  onSubmit: (values: any) => void;
  initialValues?: any;
}

const InventoryItemSchema = Yup.object().shape({
  name: Yup.string().required('Required'),
  category_id: Yup.number().required('Required'),
  quantity: Yup.number().min(0).required('Required'),
});

const InventoryItemForm: React.FC<InventoryItemFormProps> = ({ onSubmit, initialValues }) => {
  return (
    <Formik
      initialValues={initialValues || { name: '', category_id: '', quantity: 0, location: '' }}
      validationSchema={InventoryItemSchema}
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
              name="category_id"
              as={TextField}
              label="Category ID"
              type="number"
              error={touched.category_id && !!errors.category_id}
              helperText={touched.category_id && errors.category_id}
            />
            <Field
              name="quantity"
              as={TextField}
              label="Quantity"
              type="number"
              error={touched.quantity && !!errors.quantity}
              helperText={touched.quantity && errors.quantity}
            />
            <Field
              name="location"
              as={TextField}
              label="Location"
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

export default InventoryItemForm;
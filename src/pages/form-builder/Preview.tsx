import React, { useState, useEffect } from 'react';
import { Box, CircularProgress, Alert } from '@mui/material';
import FormRenderer from '../../components/form-builder/FormRenderer';
import { formService } from '../../services/formService';
import type { FormSchema } from '../../types/schema';
import { useAppDispatch } from '../../store';
import { setNotification } from '../../store/uiSlice';

export default function Preview() {
  const [schema, setSchema] = useState<FormSchema | null>(null);
  const [loading, setLoading] = useState(true);
  const dispatch = useAppDispatch();

  useEffect(() => {
    const loadedSchema = formService.loadSchemaFromLocalStorage();
    setSchema(loadedSchema);
    setLoading(false);
  }, []);

  const handleSubmit = (data: Record<string, any>) => {
    console.log('Form Submitted:', data);
    dispatch(setNotification({
      type: 'success',
      message: 'Form submitted! Check the console for data.',
    }));
  };

  if (loading) {
    return <CircularProgress sx={{ m: 4 }} />;
  }

  if (!schema) {
    return (
      <Alert severity="warning" sx={{ m: 3 }}>
        No saved form schema found. Please go to the Builder tab, create a form, and save it.
      </Alert>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <FormRenderer schema={schema} onSubmit={handleSubmit} />
    </Box>
  );
}
import React, { useState, useEffect } from 'react';
import { Box, CircularProgress, Alert, Paper, Typography, Collapse } from '@mui/material';
import FormRenderer from '../../components/form-builder/FormRenderer';
import { formService } from '../../services/formService';
import type { FormSchema } from '../../types/schema';
import { useAppDispatch } from '../../store';
import { setNotification } from '../../store/uiSlice';

export default function Preview() {
  const [schema, setSchema] = useState<FormSchema | null>(null);
  const [loading, setLoading] = useState(true);
  const [submittedData, setSubmittedData] = useState<Record<string, any> | null>(null);
  const dispatch = useAppDispatch();

  useEffect(() => {
    const loadedSchema = formService.loadSchemaFromLocalStorage();
    setSchema(loadedSchema);
    setLoading(false);
  }, []);

  const handleSubmit = (data: Record<string, any>) => {
    // Convert file/blob objects to a more readable format for display
    const displayData: Record<string, any> = {};
    for (const key in data) {
      if (data[key] instanceof Blob) {
        displayData[key] = {
          fileName: `cropped_image.jpg`,
          size: data[key].size,
          type: data[key].type,
        };
      } else if (data[key] instanceof File) {
        displayData[key] = {
          fileName: data[key].name,
          size: data[key].size,
          type: data[key].type,
        };
      } else {
        displayData[key] = data[key];
      }
    }
    setSubmittedData(displayData);
    dispatch(setNotification({
      type: 'success',
      message: 'Form submitted successfully!',
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
      <Collapse in={!!submittedData}>
        <Paper sx={{ mt: 4, p: 2, backgroundColor: 'grey.100' }}>
          <Typography variant="h6" gutterBottom>Mock API Request</Typography>
          <Box component="pre" sx={{ whiteSpace: 'pre-wrap', wordBreak: 'break-all', maxHeight: 400, overflowY: 'auto' }}>
            {JSON.stringify(submittedData, null, 2)}
          </Box>
        </Paper>
      </Collapse>
    </Box>
  );
}
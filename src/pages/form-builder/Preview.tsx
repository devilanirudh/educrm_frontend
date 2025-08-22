// import React, { useState, useEffect } from 'react';
// import { Box, CircularProgress, Alert, Paper, Typography, Collapse } from '@mui/material';
// import FormRenderer from '../../components/form-builder/FormRenderer';
// import { formService } from '../../services/formService';
// import type { FormSchema } from '../../types/schema';
// import { useAppDispatch } from '../../store';
// import { setNotification } from '../../store/uiSlice';

// export default function Preview() {
//   const [schema, setSchema] = useState<FormSchema | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [submittedData, setSubmittedData] = useState<Record<string, any> | null>(null);
//   const dispatch = useAppDispatch();

//   useEffect(() => {
//     const loadedSchema = formService.loadSchemaFromLocalStorage();
//     setSchema(loadedSchema);
//     setLoading(false);
//   }, []);

//   const handleSubmit = (data: Record<string, any>) => {
//     // Convert file/blob objects to a more readable format for display
//     const displayData: Record<string, any> = {};
//     for (const key in data) {
//       if (data[key] instanceof Blob) {
//         displayData[key] = {
//           fileName: `cropped_image.jpg`,
//           size: data[key].size,
//           type: data[key].type,
//         };
//       } else if (data[key] instanceof File) {
//         displayData[key] = {
//           fileName: data[key].name,
//           size: data[key].size,
//           type: data[key].type,
//         };
//       } else {
//         displayData[key] = data[key];
//       }
//     }
//     setSubmittedData(displayData);
//     dispatch(setNotification({
//       type: 'success',
//       message: 'Form submitted successfully!',
//     }));
//   };

//   if (loading) {
//     return <CircularProgress sx={{ m: 4 }} />;
//   }

//   if (!schema) {
//     return (
//       <Alert severity="warning" sx={{ m: 3 }}>
//         No saved form schema found. Please go to the Builder tab, create a form, and save it.
//       </Alert>
//     );
//   }

//   return (
//     <Box sx={{ p: 3 }}>
//       <FormRenderer schema={schema} onSubmit={handleSubmit} />
//       <Collapse in={!!submittedData}>
//         <Paper sx={{ mt: 4, p: 2, backgroundColor: 'grey.100' }}>
//           <Typography variant="h6" gutterBottom>Mock API Request</Typography>
//           <Box component="pre" sx={{ whiteSpace: 'pre-wrap', wordBreak: 'break-all', maxHeight: 400, overflowY: 'auto' }}>
//             {JSON.stringify(submittedData, null, 2)}
//           </Box>
//         </Paper>
//       </Collapse>
//     </Box>
//   );
// }

import React, { useState, useEffect } from 'react';
import { Box, CircularProgress, Alert, Paper, Typography, Collapse, Button } from '@mui/material'; // 🆕 NEW: Added Button
import FormRenderer from '../../components/form-builder/FormRenderer';
import { formService } from '../../services/formService';
import type { FormSchema } from '../../types/form';
import { useAppDispatch } from '../../store';
import { setNotification } from '../../store/uiSlice';
import { useFormBuilderStore } from '../../store/useFormBuilderStore'; // 🆕 NEW: Import store

export default function Preview() {
  const schemaFromStore = useFormBuilderStore(s => s.schema); // Get schema from store
  const schema = useFormBuilderStore(s => s.schema);
  const [loading, setLoading] = useState(true);
  const [submittedDataResponse, setSubmittedDataResponse] = useState<any | null>(null); // 🆕 MODIFIED: To store full API response
  const [allSubmittedData, setAllSubmittedData] = useState<any[]>([]); // 🆕 NEW: To store all submitted data for the entity
  const dispatch = useAppDispatch();

  useEffect(() => {
    // Always use the latest schema from the store
  if (schema) {
    setLoading(false);
    // 🆕 NEW: Load all submitted data for the current entity type
    formService.getSubmissions(schema.id)
      .then(data => setAllSubmittedData(data))
      .catch(err => {
        console.error("Failed to load all submitted data:", err);
        dispatch(setNotification({ type: 'error', message: 'Failed to load submitted data.' }));
      });
  } else {
    setLoading(false);
  }
  }, [schemaFromStore, dispatch]); // Depend on schemaFromStore

  const handleSubmit = async (data: Record<string, any>) => {
    // Convert file/blob objects to a more readable format for display
    const dataToSend: Record<string, any> = {};
    for (const key in data) {
      if (data[key] instanceof Blob) {
        // For simplicity in mock, convert Blob to a descriptive object
        dataToSend[key] = {
          fileName: `cropped_image.jpg`,
          size: data[key].size,
          type: data[key].type,
          // In a real app, you'd upload the blob and store its URL
        };
      } else if (data[key] instanceof File) {
        dataToSend[key] = {
          fileName: data[key].name,
          size: data[key].size,
          type: data[key].type,
          // In a real app, you'd upload the file and store its URL
        };
      } else {
        dataToSend[key] = data[key];
      }
    }

    if (!schema) {
      dispatch(setNotification({ type: 'error', message: 'Form schema not loaded.' }));
      return;
    }

    try {
      // 🆕 NEW: Call mock backend to submit data
      const response = await formService.submitForm(schema.id, dataToSend);
      setSubmittedDataResponse(response);
      dispatch(setNotification({
        type: 'success',
        message: response.message || 'Form submitted successfully!',
      }));
      // Refresh the list of all submitted data
      const updatedAllData = await formService.getSubmissions(schema.id);
      setAllSubmittedData(updatedAllData);

    } catch (error: any) {
      setSubmittedDataResponse({ status: 'error', message: error.message || 'Submission failed.' });
      dispatch(setNotification({
        type: 'error',
        message: error.message || 'Failed to submit form.',
      }));
    }
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
      
      {/* 🆕 NEW: Display last submitted data response */}
      <Collapse in={!!submittedDataResponse}>
        <Paper sx={{ mt: 4, p: 2, backgroundColor: 'grey.100' }}>
          <Typography variant="h6" gutterBottom>Last Mock API Submission Response</Typography>
          <Box component="pre" sx={{ whiteSpace: 'pre-wrap', wordBreak: 'break-all', maxHeight: 400, overflowY: 'auto' }}>
            {JSON.stringify(submittedDataResponse, null, 2)}
          </Box>
        </Paper>
      </Collapse>

      {/* 🆕 NEW: Display all submitted data for the current entity type */}
      <Paper sx={{ mt: 4, p: 2, backgroundColor: 'grey.50' }}>
        <Typography variant="h6" gutterBottom>All Submitted Data for "{schema.entityType}"</Typography>
        {allSubmittedData.length > 0 ? (
          <Box component="pre" sx={{ whiteSpace: 'pre-wrap', wordBreak: 'break-all', maxHeight: 400, overflowY: 'auto' }}>
            {JSON.stringify(allSubmittedData, null, 2)}
          </Box>
        ) : (
          <Typography variant="body2" color="text.secondary">No data submitted for "{schema.entityType}" yet.</Typography>
        )}
        <Button 
          variant="outlined" 
          color="error" 
          size="small" 
          sx={{ mt: 2 }}
          onClick={() => {
            // This should be handled by a backend endpoint in a real app
            setAllSubmittedData([]);
            dispatch(setNotification({ type: 'info', message: `Cleared all submitted data for ${schema.entityType}.` }));
          }}
        >
          Clear All Data for {schema.entityType}
        </Button>
      </Paper>
    </Box>
  );
}

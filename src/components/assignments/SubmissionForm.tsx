import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  Chip,
  CircularProgress,
  Alert,
} from '@mui/material';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { assignmentsService } from '../../services/assignments';

interface SubmissionFormProps {
  open: boolean;
  onClose: () => void;
  assignmentId: number;
}

const validationSchema = Yup.object({
  submission_text: Yup.string(),
  attachment_paths: Yup.array().of(
    Yup.mixed().test('is-file-or-string', 'Must be a file or string', (value) => {
      return value instanceof File || (typeof value === 'string' && value.startsWith('/uploads/'));
    })
  ),
});

const SubmissionForm: React.FC<SubmissionFormProps> = ({ open, onClose, assignmentId }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<{[key: string]: number}>({});
  const [error, setError] = useState<string | null>(null);

  const formik = useFormik({
    initialValues: {
      submission_text: '',
      attachment_paths: [] as (string | File)[],
    },
    validationSchema,
    onSubmit: async (values) => {
      setIsSubmitting(true);
      setError(null);
      
      try {
        // Upload files first
        const uploadedFiles: string[] = [];
        
        for (const file of values.attachment_paths) {
          if (typeof file === 'string' && file.startsWith('/uploads/')) {
            // Already uploaded file
            uploadedFiles.push(file);
          } else if (typeof file === 'object' && file instanceof File) {
            // Need to upload file
            setUploadProgress(prev => ({ ...prev, [file.name]: 0 }));
            
            try {
              const response = await assignmentsService.uploadFile(file);
              uploadedFiles.push(response.file_url);
              setUploadProgress(prev => ({ ...prev, [file.name]: 100 }));
            } catch (uploadError) {
              console.error('Failed to upload file:', uploadError);
              setError(`Failed to upload ${file.name}`);
              setIsSubmitting(false);
              return;
            }
          }
        }
        
        // Submit assignment with uploaded file URLs
        await assignmentsService.submitAssignment(assignmentId, {
          submission_text: values.submission_text,
          attachment_paths: uploadedFiles,
        });
        
        onClose();
      } catch (error: any) {
        console.error('Failed to submit assignment:', error);
        setError(error.response?.data?.detail || 'Failed to submit assignment');
      } finally {
        setIsSubmitting(false);
      }
    },
  });

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      const fileArray = Array.from(files);
      formik.setFieldValue('attachment_paths', [
        ...formik.values.attachment_paths,
        ...fileArray
      ]);
    }
  };

  const removeFile = (index: number) => {
    const newFiles = formik.values.attachment_paths.filter((_, i) => i !== index);
    formik.setFieldValue('attachment_paths', newFiles);
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Submit Assignment</DialogTitle>
      <form onSubmit={formik.handleSubmit}>
        <DialogContent>
          <Box display="flex" flexDirection="column" gap={3} sx={{ pt: 1 }}>
            {error && (
              <Alert severity="error" onClose={() => setError(null)}>
                {error}
              </Alert>
            )}
            
            <TextField
              name="submission_text"
              label="Submission Text"
              multiline
              rows={4}
              value={formik.values.submission_text}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              fullWidth
              placeholder="Enter your submission text here..."
            />
            
            <Box>
              <Button variant="outlined" component="label" disabled={isSubmitting}>
                Upload Files
                <input 
                  type="file" 
                  hidden 
                  multiple 
                  onChange={handleFileChange}
                  disabled={isSubmitting}
                />
              </Button>
              
              <Box sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 1 }}>
                {formik.values.attachment_paths.map((file: string | File, index: number) => (
                  <Box key={index} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Chip 
                      label={file instanceof File ? file.name : (typeof file === 'string' ? file.split('/').pop() : 'Unknown file')} 
                      onDelete={() => removeFile(index)}
                      disabled={isSubmitting}
                    />
                    {file instanceof File && uploadProgress[file.name] !== undefined && (
                      <CircularProgress size={16} variant="determinate" value={uploadProgress[file.name]} />
                    )}
                  </Box>
                ))}
              </Box>
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button 
            type="submit" 
            variant="contained" 
            disabled={isSubmitting}
            startIcon={isSubmitting ? <CircularProgress size={16} /> : null}
          >
            {isSubmitting ? 'Submitting...' : 'Submit'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default SubmissionForm;
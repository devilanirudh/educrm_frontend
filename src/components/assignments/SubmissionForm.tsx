import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  Chip,
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
  attachment_paths: Yup.array(),
});

const SubmissionForm: React.FC<SubmissionFormProps> = ({ open, onClose, assignmentId }) => {
  const formik = useFormik({
    initialValues: {
      submission_text: '',
      attachment_paths: [],
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        await assignmentsService.submitAssignment(assignmentId, values);
        onClose();
      } catch (error) {
        console.error('Failed to submit assignment:', error);
      }
    },
  });

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Submit Assignment</DialogTitle>
      <form onSubmit={formik.handleSubmit}>
        <DialogContent>
          <Box display="flex" flexDirection="column" gap={3} sx={{ pt: 1 }}>
            <TextField
              name="submission_text"
              label="Submission Text"
              multiline
              rows={4}
              value={formik.values.submission_text}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              fullWidth
            />
            <Button variant="outlined" component="label">
              Upload Files
              <input type="file" hidden multiple onChange={(e) => {
                if (e.currentTarget.files) {
                  formik.setFieldValue('attachment_paths', Array.from(e.currentTarget.files).map(f => f.name))
                }
              }} />
            </Button>
            {formik.values.attachment_paths.map((file: any) => (
              <Chip key={file} label={file} onDelete={() => formik.setFieldValue('attachment_paths', formik.values.attachment_paths.filter(f => f !== file))} />
            ))}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button type="submit" variant="contained">Submit</Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default SubmissionForm;
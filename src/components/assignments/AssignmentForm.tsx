import React, { useEffect, useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  MenuItem,
  CircularProgress,
  Box,
  Chip,
} from '@mui/material';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { Assignment, AssignmentCreateRequest, AssignmentUpdateRequest } from '../../services/assignments';
import { classesService, Class } from '../../services/classes';
import { teachersService } from '../../services/teachers'; // Assuming subjects are related to teachers or classes

interface AssignmentFormProps {
  open: boolean;
  onClose: () => void;
  onSave: (data: AssignmentCreateRequest | AssignmentUpdateRequest) => void;
  initialData?: Assignment | null;
  isSaving: boolean;
}

const validationSchema = Yup.object({
  title: Yup.string().required('Title is required'),
  class_id: Yup.number().required('Class is required'),
  subject_id: Yup.number().required('Subject is required'),
  due_date: Yup.date().required('Due date is required').nullable(),
  description: Yup.string(),
});

const AssignmentForm: React.FC<AssignmentFormProps> = ({ open, onClose, onSave, initialData, isSaving }) => {
  const [classes, setClasses] = useState<Class[]>([]);
  // Mock subjects for now
  const [subjects, setSubjects] = useState([
    { id: 1, name: 'Mathematics' },
    { id: 2, name: 'Science' },
    { id: 3, name: 'History' },
    { id: 4, name: 'English' },
  ]);

  useEffect(() => {
    if (open) {
      classesService.getClasses({ per_page: 100 }).then(response => {
        setClasses(response.data);
      });
    }
  }, [open]);

  const formik = useFormik<AssignmentCreateRequest | AssignmentUpdateRequest>({
    initialValues: {
      title: initialData?.title || undefined,
      class_id: initialData?.class_id || undefined,
      subject_id: initialData?.subject_id || undefined,
      due_date: initialData?.due_date || undefined,
      description: initialData?.description || undefined,
    },
    validationSchema,
    enableReinitialize: true,
    onSubmit: (values) => {
      onSave(values);
    },
  });

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>{initialData ? 'Edit Assignment' : 'Add New Assignment'}</DialogTitle>
      <form onSubmit={formik.handleSubmit}>
        <DialogContent>
          <Box display="flex" flexDirection="column" gap={3} sx={{ pt: 1 }}>
            <TextField
              name="title"
              label="Assignment Title"
              value={formik.values.title}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.title && Boolean(formik.errors.title)}
              helperText={formik.touched.title && formik.errors.title}
              fullWidth
            />
            <TextField
              select
              name="class_id"
              label="Class"
              value={formik.values.class_id}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.class_id && Boolean(formik.errors.class_id)}
              helperText={formik.touched.class_id && formik.errors.class_id}
            >
              {classes.map(c => (
                <MenuItem key={c.id} value={c.id}>{c.name}</MenuItem>
              ))}
            </TextField>
            <TextField
              select
              name="subject_id"
              label="Subject"
              value={formik.values.subject_id}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.subject_id && Boolean(formik.errors.subject_id)}
              helperText={formik.touched.subject_id && formik.errors.subject_id}
            >
              {subjects.map(s => (
                <MenuItem key={s.id} value={s.id}>{s.name}</MenuItem>
              ))}
            </TextField>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                label="Due Date"
                value={formik.values.due_date ? new Date(formik.values.due_date) : null}
                onChange={(date) => formik.setFieldValue('due_date', date)}
                slotProps={{
                  textField: {
                    onBlur: formik.handleBlur,
                    error: formik.touched.due_date && Boolean(formik.errors.due_date),
                    helperText: formik.touched.due_date && formik.errors.due_date,
                  },
                }}
              />
            </LocalizationProvider>
            <TextField
              name="description"
              label="Description"
              multiline
              rows={4}
              value={formik.values.description}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.description && Boolean(formik.errors.description)}
              helperText={formik.touched.description && formik.errors.description}
              fullWidth
            />
            <Button variant="outlined" component="label">
              Upload Attachment
              <input type="file" hidden onChange={(e) => formik.setFieldValue('attachment', e.currentTarget.files?.[0])} />
            </Button>
            {formik.values.attachment && (
              <Chip label={(formik.values.attachment as File).name} onDelete={() => formik.setFieldValue('attachment', null)} />
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button type="submit" variant="contained" disabled={isSaving}>
            {isSaving ? <CircularProgress size={24} /> : 'Save'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default AssignmentForm;
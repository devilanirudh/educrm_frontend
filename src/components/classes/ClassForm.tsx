import React from 'react';
import { Dialog, DialogContent, DialogTitle, CircularProgress, Alert } from '@mui/material';
import FormRenderer from '../form-builder/FormRenderer';
import { useForm } from '../../hooks/useForm';

interface ClassFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
  classId?: number;
}

const ClassForm: React.FC<ClassFormProps> = ({ open, onClose, onSubmit, classId }) => {
  const { formSchema: schema, isFormSchemaLoading: isLoading } = useForm('class_form');

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{classId ? 'Edit Class' : 'Create Class'}</DialogTitle>
      <DialogContent>
        {isLoading && <CircularProgress />}
        {schema && (
          <FormRenderer
            schema={schema}
            onSubmit={onSubmit}
            onCancel={onClose}
          />
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ClassForm;
import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  Alert,
} from '@mui/material';

interface DeleteConfirmationDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  studentName: string;
  isLoading?: boolean;
}

const DeleteConfirmationDialog: React.FC<DeleteConfirmationDialogProps> = ({
  open,
  onClose,
  onConfirm,
  studentName,
  isLoading = false,
}) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle>
        Confirm Student Deletion
      </DialogTitle>
      <DialogContent>
        <Alert severity="warning" sx={{ mb: 2 }}>
          This action will deactivate the student account. The student will no longer be able to access the system, but their data will be preserved for record-keeping purposes.
        </Alert>
        <DialogContentText>
          Are you sure you want to delete the student <strong>{studentName}</strong>?
          This action cannot be undone.
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={onClose}
          disabled={isLoading}
          color="inherit"
        >
          Cancel
        </Button>
        <Button
          onClick={onConfirm}
          disabled={isLoading}
          color="error"
          variant="contained"
          autoFocus
        >
          {isLoading ? 'Deleting...' : 'Delete Student'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteConfirmationDialog;



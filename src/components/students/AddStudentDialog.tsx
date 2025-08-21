import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button, Box } from '@mui/material';

interface AddStudentDialogProps {
  open: boolean;
  onClose: () => void;
  onSelectExisting: () => void;
  onSelectDynamic: () => void;
}

const AddStudentDialog: React.FC<AddStudentDialogProps> = ({
  open,
  onClose,
  onSelectExisting,
  onSelectDynamic,
}) => {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Add Student</DialogTitle>
      <DialogContent>
        <DialogContentText>
          How would you like to add a new student?
        </DialogContentText>
        <Box display="flex" flexDirection="column" gap={2} mt={3}>
          <Button variant="outlined" size="large" onClick={onSelectExisting}>
            Use Existing Form
          </Button>
          <Button variant="contained" size="large" onClick={onSelectDynamic}>
            Create Dynamic Form
          </Button>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddStudentDialog;
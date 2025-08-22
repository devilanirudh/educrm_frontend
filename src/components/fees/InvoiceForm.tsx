import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { TextField, Button, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import { Invoice } from '../../services/fees';

interface InvoiceFormProps {
  onSubmit: (data: Omit<Invoice, 'id'>) => void;
  initialValues?: Invoice;
}

const InvoiceForm: React.FC<InvoiceFormProps> = ({ onSubmit, initialValues }) => {
  const { handleSubmit, control } = useForm<Omit<Invoice, 'id'>>({
    defaultValues: initialValues || {
      student_id: 0,
      fee_structure_id: 0,
      amount_due: 0,
      due_date: '',
      status: 'pending',
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Controller
        name="student_id"
        control={control}
        render={({ field }) => <TextField {...field} label="Student ID" type="number" fullWidth margin="normal" />}
      />
      <Controller
        name="fee_structure_id"
        control={control}
        render={({ field }) => <TextField {...field} label="Fee Structure ID" type="number" fullWidth margin="normal" />}
      />
      <Controller
        name="amount_due"
        control={control}
        render={({ field }) => <TextField {...field} label="Amount Due" type="number" fullWidth margin="normal" />}
      />
      <Controller
        name="due_date"
        control={control}
        render={({ field }) => <TextField {...field} label="Due Date" type="date" fullWidth margin="normal" InputLabelProps={{ shrink: true }} />}
      />
      <Controller
        name="status"
        control={control}
        render={({ field }) => (
          <FormControl fullWidth margin="normal">
            <InputLabel>Status</InputLabel>
            <Select {...field} label="Status">
              <MenuItem value="pending">Pending</MenuItem>
              <MenuItem value="paid">Paid</MenuItem>
              <MenuItem value="failed">Failed</MenuItem>
              <MenuItem value="refunded">Refunded</MenuItem>
            </Select>
          </FormControl>
        )}
      />
      <Button type="submit" variant="contained" color="primary">
        Submit
      </Button>
    </form>
  );
};

export default InvoiceForm;
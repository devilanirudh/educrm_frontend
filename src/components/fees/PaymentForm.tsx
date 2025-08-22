import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { TextField, Button, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import { Transaction } from '../../services/fees';

interface PaymentFormProps {
  onSubmit: (data: Omit<Transaction, 'id' | 'payment_date'>) => void;
  initialValues?: Omit<Transaction, 'id' | 'payment_date'>;
}

const PaymentForm: React.FC<PaymentFormProps> = ({ onSubmit, initialValues }) => {
  const { handleSubmit, control } = useForm<Omit<Transaction, 'id' | 'payment_date'>>({
    defaultValues: initialValues || {
      invoice_id: 0,
      amount_paid: 0,
      payment_method: 'cash',
      status: 'paid',
      receipt_number: '',
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Controller
        name="invoice_id"
        control={control}
        render={({ field }) => <TextField {...field} label="Invoice ID" type="number" fullWidth margin="normal" />}
      />
      <Controller
        name="amount_paid"
        control={control}
        render={({ field }) => <TextField {...field} label="Amount Paid" type="number" fullWidth margin="normal" />}
      />
      <Controller
        name="payment_method"
        control={control}
        render={({ field }) => (
          <FormControl fullWidth margin="normal">
            <InputLabel>Payment Method</InputLabel>
            <Select {...field} label="Payment Method">
              <MenuItem value="cash">Cash</MenuItem>
              <MenuItem value="card">Card</MenuItem>
              <MenuItem value="upi">UPI</MenuItem>
              <MenuItem value="netbanking">Netbanking</MenuItem>
              <MenuItem value="wallet">Wallet</MenuItem>
            </Select>
          </FormControl>
        )}
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
      <Controller
        name="receipt_number"
        control={control}
        render={({ field }) => <TextField {...field} label="Receipt Number" fullWidth margin="normal" />}
      />
      <Button type="submit" variant="contained" color="primary">
        Submit
      </Button>
    </form>
  );
};

export default PaymentForm;
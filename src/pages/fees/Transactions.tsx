import React, { useState } from 'react';
import { Button, Dialog, DialogTitle, DialogContent, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import PaymentForm from '../../components/fees/PaymentForm';
import { useTransactions, useCreatePayment } from '../../hooks/useFees';
import { Transaction } from '../../services/fees';

const Transactions: React.FC = () => {
  const [open, setOpen] = useState(false);
  const { data: transactions, isLoading: isTransactionsLoading } = useTransactions();
  const { mutate: createPayment } = useCreatePayment();

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSubmit = (data: Omit<Transaction, 'id' | 'payment_date'>) => {
    createPayment(data);
    handleClose();
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Transactions</h1>
        <Button variant="contained" color="primary" onClick={handleOpen}>
          Process Payment
        </Button>
      </div>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Process Payment</DialogTitle>
        <DialogContent>
          <PaymentForm onSubmit={handleSubmit} />
        </DialogContent>
      </Dialog>
      {isTransactionsLoading ? (
        <p>Loading...</p>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Invoice ID</TableCell>
                <TableCell>Amount Paid</TableCell>
                <TableCell>Payment Date</TableCell>
                <TableCell>Payment Method</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Receipt Number</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {transactions?.map((transaction: Transaction) => (
                <TableRow key={transaction.id}>
                  <TableCell>{transaction.invoice_id}</TableCell>
                  <TableCell>{transaction.amount_paid}</TableCell>
                  <TableCell>{transaction.payment_date}</TableCell>
                  <TableCell>{transaction.payment_method}</TableCell>
                  <TableCell>{transaction.status}</TableCell>
                  <TableCell>{transaction.receipt_number}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </div>
  );
};

export default Transactions;
import React, { useState } from 'react';
import { Button, Dialog, DialogTitle, DialogContent, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import InvoiceForm from '../../components/fees/InvoiceForm';
import { useInvoices, useCreateInvoice } from '../../hooks/useFees';
import { Invoice } from '../../services/fees';

const Invoices: React.FC = () => {
  const [open, setOpen] = useState(false);
  const { data: invoices, isLoading: isInvoicesLoading } = useInvoices();
  const { mutate: createInvoice } = useCreateInvoice();

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSubmit = (data: Omit<Invoice, 'id'>) => {
    createInvoice(data);
    handleClose();
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Invoices</h1>
        <Button variant="contained" color="primary" onClick={handleOpen}>
          Create Invoice
        </Button>
      </div>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Create Invoice</DialogTitle>
        <DialogContent>
          <InvoiceForm onSubmit={handleSubmit} />
        </DialogContent>
      </Dialog>
      {isInvoicesLoading ? (
        <p>Loading...</p>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Student ID</TableCell>
                <TableCell>Fee Structure ID</TableCell>
                <TableCell>Amount Due</TableCell>
                <TableCell>Due Date</TableCell>
                <TableCell>Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {invoices?.map((invoice: Invoice) => (
                <TableRow key={invoice.id}>
                  <TableCell>{invoice.student_id}</TableCell>
                  <TableCell>{invoice.fee_structure_id}</TableCell>
                  <TableCell>{invoice.amount_due}</TableCell>
                  <TableCell>{invoice.due_date}</TableCell>
                  <TableCell>{invoice.status}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </div>
  );
};

export default Invoices;
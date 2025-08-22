import React from 'react';
import { Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import { useInvoices, useTransactions } from '../../hooks/useFees';
import { Invoice, Transaction } from '../../services/fees';

const StudentFees: React.FC = () => {
  const { data: invoices, isLoading: invoicesLoading } = useInvoices();
  const { data: transactions, isLoading: transactionsLoading } = useTransactions();

  const handlePay = (invoiceId: number) => {
    // Logic to integrate with a payment gateway will be implemented here
  };

  return (
    <div>
      <h1 className="text-2xl font-bold">My Fees</h1>
      <h2 className="text-xl font-bold mt-8">Invoices</h2>
      {invoicesLoading ? (
        <p>Loading...</p>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Amount Due</TableCell>
                <TableCell>Due Date</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {invoices?.map((invoice: Invoice) => (
                <TableRow key={invoice.id}>
                  <TableCell>{invoice.amount_due}</TableCell>
                  <TableCell>{invoice.due_date}</TableCell>
                  <TableCell>{invoice.status}</TableCell>
                  <TableCell>
                    {invoice.status === 'pending' && (
                      <Button variant="contained" color="primary" onClick={() => handlePay(invoice.id)}>
                        Pay Now
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
      <h2 className="text-xl font-bold mt-8">Transactions</h2>
      {transactionsLoading ? (
        <p>Loading...</p>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
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

export default StudentFees;
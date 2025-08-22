import React from 'react';
import { Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import { useInvoices } from '../../hooks/useFees';
import { Invoice } from '../../services/fees';

const TeacherFeesSummary: React.FC = () => {
  const { data: invoices, isLoading } = useInvoices();

  const handleExport = () => {
    // Logic to export data as CSV will be implemented here
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Fees Summary</h1>
        <Button variant="contained" color="primary" onClick={handleExport}>
          Export CSV
        </Button>
      </div>
      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Student ID</TableCell>
                <TableCell>Amount Due</TableCell>
                <TableCell>Due Date</TableCell>
                <TableCell>Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {invoices?.map((invoice: Invoice) => (
                <TableRow key={invoice.id}>
                  <TableCell>{invoice.student_id}</TableCell>
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

export default TeacherFeesSummary;
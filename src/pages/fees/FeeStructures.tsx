import React, { useState } from 'react';
import { Button, Dialog, DialogTitle, DialogContent, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import FeeStructureForm from '../../components/fees/FeeStructureForm';
import { useFees } from '../../hooks/useFees';
import { FeeStructure } from '../../services/fees';

const FeeStructures: React.FC = () => {
  const [open, setOpen] = useState(false);
  const { feeStructures, isFeeStructuresLoading, createFeeStructure } = useFees();

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSubmit = (data: Omit<FeeStructure, 'id'>) => {
    createFeeStructure(data);
    handleClose();
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Fee Structures</h1>
        <Button variant="contained" color="primary" onClick={handleOpen}>
          Create Fee Structure
        </Button>
      </div>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Create Fee Structure</DialogTitle>
        <DialogContent>
          <FeeStructureForm onSubmit={handleSubmit} />
        </DialogContent>
      </Dialog>
      {isFeeStructuresLoading ? (
        <p>Loading...</p>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Category</TableCell>
                <TableCell>Amount</TableCell>
                <TableCell>Due Date</TableCell>
                <TableCell>Academic Year</TableCell>
                <TableCell>Class ID</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {feeStructures?.map((structure: FeeStructure) => (
                <TableRow key={structure.id}>
                  <TableCell>{structure.name}</TableCell>
                  <TableCell>{structure.category}</TableCell>
                  <TableCell>{structure.amount}</TableCell>
                  <TableCell>{structure.due_date}</TableCell>
                  <TableCell>{structure.academic_year}</TableCell>
                  <TableCell>{structure.class_id}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </div>
  );
};

export default FeeStructures;
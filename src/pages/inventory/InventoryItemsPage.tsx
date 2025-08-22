import React, { useState } from 'react';
import {
  Box, Typography, CircularProgress, Alert, Button, Modal,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton
} from '@mui/material';
import { Edit, Delete } from '@mui/icons-material';
import { useInventory } from '../../hooks/useInventory';
import InventoryItemForm from '../../components/inventory/InventoryItemForm';

const style = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

interface InventoryItem {
  id: number;
  name: string;
  category_id: number;
  quantity: number;
  location: string;
}

const InventoryItemsPage: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<InventoryItem | null>(null);

  const { items, isItemsLoading, createItem, updateItem, deleteItem } = useInventory();

  const handleOpen = (item: InventoryItem | null = null) => {
    setEditingItem(item);
    setOpen(true);
  };

  const handleClose = () => {
    setEditingItem(null);
    setOpen(false);
  };

  const handleSubmit = (values: any) => {
    if (editingItem) {
      updateItem({ id: editingItem.id, item: values });
    } else {
      createItem(values);
    }
    handleClose();
  };

  if (isItemsLoading) return <CircularProgress />;

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Inventory Items
      </Typography>
      <Button variant="contained" onClick={() => handleOpen()}>Add Item</Button>
      <Modal open={open} onClose={handleClose}>
        <Box sx={style}>
          <Typography variant="h6" component="h2">
            {editingItem ? 'Edit Item' : 'Add Item'}
          </Typography>
          <InventoryItemForm onSubmit={handleSubmit} initialValues={editingItem} />
        </Box>
      </Modal>
      <TableContainer component={Paper} sx={{ mt: 2 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Category ID</TableCell>
              <TableCell>Quantity</TableCell>
              <TableCell>Location</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {items?.map((item: InventoryItem) => (
              <TableRow key={item.id}>
                <TableCell>{item.name}</TableCell>
                <TableCell>{item.category_id}</TableCell>
                <TableCell>{item.quantity}</TableCell>
                <TableCell>{item.location}</TableCell>
                <TableCell>
                  <IconButton onClick={() => handleOpen(item)}><Edit /></IconButton>
                  <IconButton onClick={() => deleteItem(item.id)}><Delete /></IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default InventoryItemsPage;
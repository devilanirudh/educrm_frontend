import React, { useState } from 'react';
import {
  Box, Typography, CircularProgress, Alert, Button, Modal,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton
} from '@mui/material';
import { Edit, Delete } from '@mui/icons-material';
import { useLibrary } from '../../hooks/useLibrary';
import BookCategoryForm from '../../components/library/BookCategoryForm';

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

interface BookCategory {
  id: number;
  name: string;
  description: string;
}

const BookCategoriesPage: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<BookCategory | null>(null);

  const { categories, isCategoriesLoading, createCategory, updateCategory, deleteCategory } = useLibrary();

  const handleOpen = (category: BookCategory | null = null) => {
    setEditingCategory(category);
    setOpen(true);
  };

  const handleClose = () => {
    setEditingCategory(null);
    setOpen(false);
  };

  const handleSubmit = (values: any) => {
    if (editingCategory) {
      updateCategory({ id: editingCategory.id, category: values });
    } else {
      createCategory(values);
    }
    handleClose();
  };

  if (isCategoriesLoading) return <CircularProgress />;

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Book Categories
      </Typography>
      <Button variant="contained" onClick={() => handleOpen()}>Add Category</Button>
      <Modal open={open} onClose={handleClose}>
        <Box sx={style}>
          <Typography variant="h6" component="h2">
            {editingCategory ? 'Edit Category' : 'Add Category'}
          </Typography>
          <BookCategoryForm onSubmit={handleSubmit} initialValues={editingCategory} />
        </Box>
      </Modal>
      <TableContainer component={Paper} sx={{ mt: 2 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {categories?.map((category: BookCategory) => (
              <TableRow key={category.id}>
                <TableCell>{category.name}</TableCell>
                <TableCell>{category.description}</TableCell>
                <TableCell>
                  <IconButton onClick={() => handleOpen(category)}><Edit /></IconButton>
                  <IconButton onClick={() => deleteCategory(category.id)}><Delete /></IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default BookCategoriesPage;
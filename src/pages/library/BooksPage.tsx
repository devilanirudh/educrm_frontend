import React, { useState } from 'react';
import {
  Box, Typography, CircularProgress, Alert, Button, Modal,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton
} from '@mui/material';
import { Edit, Delete } from '@mui/icons-material';
import { useLibrary } from '../../hooks/useLibrary';
import BookForm from '../../components/library/BookForm';

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

interface Book {
  id: number;
  title: string;
  author: string;
  category_id: number;
  total_copies: number;
}

const BooksPage: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [editingBook, setEditingBook] = useState<Book | null>(null);

  const { books, isBooksLoading, createBook, updateBook, deleteBook } = useLibrary();

  const handleOpen = (book: Book | null = null) => {
    setEditingBook(book);
    setOpen(true);
  };

  const handleClose = () => {
    setEditingBook(null);
    setOpen(false);
  };

  const handleSubmit = (values: any) => {
    if (editingBook) {
      updateBook({ id: editingBook.id, book: values });
    } else {
      createBook(values);
    }
    handleClose();
  };

  if (isBooksLoading) return <CircularProgress />;

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Books
      </Typography>
      <Button variant="contained" onClick={() => handleOpen()}>Add Book</Button>
      <Modal open={open} onClose={handleClose}>
        <Box sx={style}>
          <Typography variant="h6" component="h2">
            {editingBook ? 'Edit Book' : 'Add Book'}
          </Typography>
          <BookForm onSubmit={handleSubmit} initialValues={editingBook} />
        </Box>
      </Modal>
      <TableContainer component={Paper} sx={{ mt: 2 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Title</TableCell>
              <TableCell>Author</TableCell>
              <TableCell>Category ID</TableCell>
              <TableCell>Total Copies</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {books?.map((book: Book) => (
              <TableRow key={book.id}>
                <TableCell>{book.title}</TableCell>
                <TableCell>{book.author}</TableCell>
                <TableCell>{book.category_id}</TableCell>
                <TableCell>{book.total_copies}</TableCell>
                <TableCell>
                  <IconButton onClick={() => handleOpen(book)}><Edit /></IconButton>
                  <IconButton onClick={() => deleteBook(book.id)}><Delete /></IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default BooksPage;
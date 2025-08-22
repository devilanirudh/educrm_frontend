import React from 'react';
import { Box, Typography, Button, Container, Paper } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

const LibraryPage: React.FC = () => {
  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Library Management
        </Typography>
        <Box>
          <Button component={RouterLink} to="/library/book-categories" variant="contained" sx={{ mr: 2 }}>
            Manage Book Categories
          </Button>
          <Button component={RouterLink} to="/library/books" variant="contained" sx={{ mr: 2 }}>
            Manage Books
          </Button>
          <Button component={RouterLink} to="/library/issue-book" variant="contained" sx={{ mr: 2 }}>
            Issue Book
          </Button>
          <Button component={RouterLink} to="/library/my-issued-books" variant="contained">
            My Issued Books
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default LibraryPage;

import React from 'react';
import { Box, Typography, Button, Container, Paper } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

const InventoryPage: React.FC = () => {
  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Inventory Management
        </Typography>
        <Box>
          <Button component={RouterLink} to="/inventory/categories" variant="contained" sx={{ mr: 2 }}>
            Manage Categories
          </Button>
          <Button component={RouterLink} to="/inventory/items" variant="contained" sx={{ mr: 2 }}>
            Manage Items
          </Button>
          <Button component={RouterLink} to="/inventory/issue-item" variant="contained">
            Issue Item
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default InventoryPage;
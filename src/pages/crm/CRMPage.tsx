import React from 'react';
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  Box,
} from '@mui/material';

const CRMPage: React.FC = () => {
  // Placeholder data for CRM items
  const crmItems = [
    { id: 1, name: 'John Doe', type: 'Lead', status: 'Contacted' },
    { id: 2, name: 'Jane Smith', type: 'Inquiry', status: 'Pending' },
    { id: 3, name: 'Peter Jones', type: 'Lead', status: 'Converted' },
  ];

  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Customer Relationship Management
        </Typography>
        <Button variant="contained" color="primary">
          Add New Lead
        </Button>
      </Box>
      <Grid container spacing={3}>
        {crmItems.map((item) => (
          <Grid item xs={12} sm={6} md={4} key={item.id}>
            <Card>
              <CardContent>
                <Typography variant="h6">{item.name}</Typography>
                <Typography color="textSecondary">Type: {item.type}</Typography>
                <Typography color="textSecondary">Status: {item.status}</Typography>
                <Box sx={{ mt: 2 }}>
                  <Button size="small" sx={{ mr: 1 }}>
                    View
                  </Button>
                  <Button size="small" color="error">
                    Delete
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default CRMPage;

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

const CMSPage: React.FC = () => {
  // Placeholder data for content items
  const contentItems = [
    { id: 1, title: 'Welcome Announcement', type: 'Announcement', status: 'Published' },
    { id: 2, title: 'About Us', type: 'Page', status: 'Draft' },
    { id: 3, title: 'Admission Policy', type: 'Document', status: 'Published' },
  ];

  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Content Management System
        </Typography>
        <Button variant="contained" color="primary">
          Add New Content
        </Button>
      </Box>
      <Grid container spacing={3}>
        {contentItems.map((item) => (
          <Grid item xs={12} sm={6} md={4} key={item.id}>
            <Card>
              <CardContent>
                <Typography variant="h6">{item.title}</Typography>
                <Typography color="textSecondary">Type: {item.type}</Typography>
                <Typography color="textSecondary">Status: {item.status}</Typography>
                <Box sx={{ mt: 2 }}>
                  <Button size="small" sx={{ mr: 1 }}>
                    Edit
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

export default CMSPage;

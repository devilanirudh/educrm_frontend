import React from 'react';
import { Typography, Box, Grid, Paper, Card, CardContent, Button } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

const StudentDashboard: React.FC = () => (
  <Box>
    <Typography variant="h4" gutterBottom>
      Student Dashboard
    </Typography>
    <Typography>
      Welcome to the student dashboard.
    </Typography>
    <Grid container spacing={3} sx={{ mt: 2 }}>
      <Grid item xs={12} sm={6} md={4}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              My Assignments
            </Typography>
            <Typography variant="body2" color="textSecondary">
              View and submit your assignments
            </Typography>
            <Button
              variant="contained"
              color="primary"
              fullWidth
              sx={{ mt: 2 }}
              component={RouterLink}
              to="/student-assignments"
            >
              View Assignments
            </Button>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12} sm={6} md={4}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              My Exams
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Take exams and view results
            </Typography>
            <Button
              variant="contained"
              color="primary"
              fullWidth
              sx={{ mt: 2 }}
              component={RouterLink}
              to="/student-exams"
            >
              View Exams
            </Button>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12} md={6}>
        <Paper sx={{ p: 2 }}>
          <Typography variant="h6" gutterBottom>
            My Fees
          </Typography>
          <Button
            variant="outlined"
            component={RouterLink}
            to="/my-fees"
          >
            View Fees
          </Button>
        </Paper>
      </Grid>
    </Grid>
  </Box>
);

export default StudentDashboard;

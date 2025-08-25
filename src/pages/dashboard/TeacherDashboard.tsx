import React from 'react';
import { Typography, Box, Grid, Paper, Link } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

const TeacherDashboard: React.FC = () => (
  <Box>
    <Typography variant="h4" gutterBottom>
      Teacher Dashboard
    </Typography>
    <Typography>
      Welcome to the teacher dashboard.
    </Typography>
    <Grid container spacing={3} sx={{ mt: 2 }}>
      <Grid item xs={12} md={6}>
        <Paper sx={{ p: 2 }}>
          <Typography variant="h6" gutterBottom>
            My Assignments
          </Typography>
          <Link component={RouterLink} to="/assignments">
            View Assignments
          </Link>
        </Paper>
      </Grid>
      <Grid item xs={12} md={6}>
        <Paper sx={{ p: 2 }}>
          <Typography variant="h6" gutterBottom>
            Fees Summary
          </Typography>
          <Link component={RouterLink} to="/fees/summary">
            View Fees Summary
          </Link>
        </Paper>
      </Grid>
    </Grid>
  </Box>
);

export default TeacherDashboard;

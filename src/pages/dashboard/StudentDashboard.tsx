import React from 'react';
import { Typography, Box, Grid, Paper, Link } from '@mui/material';
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
      <Grid item xs={12}>
        <Paper sx={{ p: 2 }}>
          <Typography variant="h6" gutterBottom>
            My Fees
          </Typography>
          <Link component={RouterLink} to="/my-fees">
            View Fees
          </Link>
        </Paper>
      </Grid>
    </Grid>
  </Box>
);

export default StudentDashboard;

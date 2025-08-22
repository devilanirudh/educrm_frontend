import React from 'react';
import { Box, Typography } from '@mui/material';
import LiveClassForm from '../../components/live-classes/LiveClassForm';
import LiveClassList from '../../components/live-classes/LiveClassList';

const upcomingClasses = [
  { id: 1, topic: 'Introduction to Algebra', start_time: '2025-09-01T10:00:00Z', duration: 60, status: 'scheduled' },
  { id: 2, topic: 'World War II History', start_time: '2025-09-02T14:00:00Z', duration: 90, status: 'scheduled' },
];

const pastClasses = [
  { id: 3, topic: 'Introduction to Python', start_time: '2025-08-20T10:00:00Z', duration: 60, status: 'completed' },
  { id: 4, topic: 'The Solar System', start_time: '2025-08-21T14:00:00Z', duration: 90, status: 'completed' },
];

const LiveClassesPage: React.FC = () => {
  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Live Classes
      </Typography>
      <LiveClassForm />
      <LiveClassList title="Upcoming Classes" classes={upcomingClasses} />
      <LiveClassList title="Past Classes" classes={pastClasses} />
    </Box>
  );
};

export default LiveClassesPage;

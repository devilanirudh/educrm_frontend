import React from 'react';
import { Box, Typography, Button, CircularProgress } from '@mui/material';
import { Stop } from '../../types/transport';

interface StopsTabProps {
  stops: Stop[] | undefined;
  isLoading: boolean;
  createStop: (stop: Omit<Stop, 'id'>) => void;
  updateStop: (args: { id: number; stop: Omit<Stop, 'id'> }) => void;
  deleteStop: (id: number) => void;
}

const StopsTab: React.FC<StopsTabProps> = ({ stops, isLoading, createStop, updateStop, deleteStop }) => {
  if (isLoading) {
    return <CircularProgress />;
  }

  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        Stops
      </Typography>
      <Button variant="contained" onClick={() => createStop({ name: 'New Stop', route_id: 1 })}>
        Add Stop
      </Button>
      <ul>
        {stops?.map(stop => (
          <li key={stop.id}>
            {stop.name}
            <Button onClick={() => updateStop({ id: stop.id, stop: { name: 'Updated Stop', route_id: 1 } })}>
              Update
            </Button>
            <Button onClick={() => deleteStop(stop.id)}>
              Delete
            </Button>
          </li>
        ))}
      </ul>
    </Box>
  );
};

export default StopsTab;
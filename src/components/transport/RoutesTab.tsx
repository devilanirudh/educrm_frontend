import React from 'react';
import { Box, Typography, Button, CircularProgress } from '@mui/material';
import { Route } from '../../types/transport';

interface RoutesTabProps {
  routes: Route[] | undefined;
  isLoading: boolean;
  createRoute: (route: Omit<Route, 'id' | 'stops'>) => void;
  updateRoute: (args: { id: number; route: Omit<Route, 'id' | 'stops'> }) => void;
  deleteRoute: (id: number) => void;
}

const RoutesTab: React.FC<RoutesTabProps> = ({ routes, isLoading, createRoute, updateRoute, deleteRoute }) => {
  if (isLoading) {
    return <CircularProgress />;
  }

  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        Routes
      </Typography>
      <Button variant="contained" onClick={() => createRoute({ name: 'New Route' })}>
        Add Route
      </Button>
      <ul>
        {routes?.map(route => (
          <li key={route.id}>
            {route.name}
            <Button onClick={() => updateRoute({ id: route.id, route: { name: 'Updated Route' } })}>
              Update
            </Button>
            <Button onClick={() => deleteRoute(route.id)}>
              Delete
            </Button>
          </li>
        ))}
      </ul>
    </Box>
  );
};

export default RoutesTab;
import React from 'react';
import { Box, Typography, Button, CircularProgress } from '@mui/material';
import { Vehicle } from '../../types/transport';

interface VehiclesTabProps {
  vehicles: Vehicle[] | undefined;
  isLoading: boolean;
  createVehicle: (vehicle: Omit<Vehicle, 'id'>) => void;
  updateVehicle: (args: { id: number; vehicle: Omit<Vehicle, 'id'> }) => void;
  deleteVehicle: (id: number) => void;
}

const VehiclesTab: React.FC<VehiclesTabProps> = ({ vehicles, isLoading, createVehicle, updateVehicle, deleteVehicle }) => {
  if (isLoading) {
    return <CircularProgress />;
  }

  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        Vehicles
      </Typography>
      <Button variant="contained" onClick={() => createVehicle({ registration_number: 'New Vehicle', capacity: 0, is_active: true })}>
        Add Vehicle
      </Button>
      <ul>
        {vehicles?.map(vehicle => (
          <li key={vehicle.id}>
            {vehicle.registration_number}
            <Button onClick={() => updateVehicle({ id: vehicle.id, vehicle: { registration_number: 'Updated Vehicle', capacity: 0, is_active: true } })}>
              Update
            </Button>
            <Button onClick={() => deleteVehicle(vehicle.id)}>
              Delete
            </Button>
          </li>
        ))}
      </ul>
    </Box>
  );
};

export default VehiclesTab;
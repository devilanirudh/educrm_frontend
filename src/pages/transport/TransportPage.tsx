import React from 'react';
import { Box, Typography, CircularProgress, Alert, Tabs, Tab } from '@mui/material';
import { useTransport } from '../../hooks/useTransport';
import VehiclesTab from '../../components/transport/VehiclesTab';
import RoutesTab from '../../components/transport/RoutesTab';
import StopsTab from '../../components/transport/StopsTab';
import MembersTab from '../../components/transport/MembersTab';

const TransportPage: React.FC = () => {
  const [selectedTab, setSelectedTab] = React.useState(0);
  const {
    vehicles, isVehiclesLoading, createVehicle, updateVehicle, deleteVehicle,
    routes, isRoutesLoading, createRoute, updateRoute, deleteRoute,
    stops, isStopsLoading, createStop, updateStop, deleteStop,
    transportMembers, isTransportMembersLoading, createTransportMember, updateTransportMember, deleteTransportMember,
  } = useTransport();

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setSelectedTab(newValue);
  };

  return (
        <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Transport Management
      </Typography>
      <Tabs value={selectedTab} onChange={handleChange} aria-label="transport tabs">
        <Tab label="Vehicles" />
        <Tab label="Routes" />
        <Tab label="Stops" />
        <Tab label="Members" />
      </Tabs>
      {selectedTab === 0 && (
        <VehiclesTab
          vehicles={vehicles}
          isLoading={isVehiclesLoading}
          createVehicle={createVehicle}
          updateVehicle={updateVehicle}
          deleteVehicle={deleteVehicle}
        />
      )}
      {selectedTab === 1 && (
        <RoutesTab
          routes={routes}
          isLoading={isRoutesLoading}
          createRoute={createRoute}
          updateRoute={updateRoute}
          deleteRoute={deleteRoute}
        />
      )}
      {selectedTab === 2 && (
        <StopsTab
          stops={stops}
          isLoading={isStopsLoading}
          createStop={createStop}
          updateStop={updateStop}
          deleteStop={deleteStop}
        />
      )}
      {selectedTab === 3 && (
        <MembersTab
          members={transportMembers}
          isLoading={isTransportMembersLoading}
          createMember={createTransportMember}
          updateMember={updateTransportMember}
          deleteMember={deleteTransportMember}
        />
      )}
    </Box>
  );
};

export default TransportPage;

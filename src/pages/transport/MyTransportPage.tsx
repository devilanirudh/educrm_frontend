import React from 'react';
import { useQuery } from 'react-query';
import { Paper, Typography, CircularProgress } from '@mui/material';
import { getTransportMembers, getRoute, getStop } from '../../services/transport';
import { TransportMember, Route, Stop } from '../../types/transport';

const MyTransportPage = () => {
  // This should be replaced with the actual user ID from the auth context
  const userId = 1;

  const { data: transportMembers, isLoading: isLoadingMember } = useQuery<TransportMember[]>(
    ['myTransport', userId],
    () => getTransportMembers().then((data: TransportMember[]) => data.filter((member: TransportMember) => member.user_id === userId))
  );

  const transportMember = transportMembers?.[0];

  const { data: route, isLoading: isLoadingRoute } = useQuery<Route>(
    ['route', transportMember?.route_id],
    () => getRoute(transportMember!.route_id),
    {
      enabled: !!transportMember,
    }
  );

  const { data: stop, isLoading: isLoadingStop } = useQuery<Stop>(
    ['stop', transportMember?.stop_id],
    () => getStop(transportMember!.stop_id),
    {
      enabled: !!transportMember,
    }
  );

  if (isLoadingMember || isLoadingRoute || isLoadingStop) {
    return <CircularProgress />;
  }

  if (!transportMember) {
    return <Typography>You are not assigned to any transport route.</Typography>;
  }

  return (
    <Paper style={{ padding: '20px' }}>
      <Typography variant="h4">My Transport Details</Typography>
      {route && (
        <div>
          <Typography variant="h6">Route Details</Typography>
          <Typography>Name: {route.name}</Typography>
          <Typography>Description: {route.description}</Typography>
        </div>
      )}
      {stop && (
        <div style={{ marginTop: '20px' }}>
          <Typography variant="h6">Stop Details</Typography>
          <Typography>Name: {stop.name}</Typography>
          <Typography>Arrival AM: {stop.arrival_time_am}</Typography>
          <Typography>Departure AM: {stop.departure_time_am}</Typography>
          <Typography>Arrival PM: {stop.arrival_time_pm}</Typography>
          <Typography>Departure PM: {stop.departure_time_pm}</Typography>
        </div>
      )}
    </Paper>
  );
};

export default MyTransportPage;
import { useQuery, useMutation, useQueryClient } from 'react-query';
import {
  getVehicles,
  createVehicle,
  updateVehicle,
  deleteVehicle,
  getRoutes,
  createRoute,
  updateRoute,
  deleteRoute,
  getStops,
  createStop,
  updateStop,
  deleteStop,
  getTransportMembers,
  createTransportMember,
  updateTransportMember,
  deleteTransportMember,
} from '../services/transport';
import { Vehicle, Route, Stop, TransportMember } from '../types/transport';

export const useTransport = () => {
  const queryClient = useQueryClient();

  // Vehicles
  const { data: vehicles, isLoading: isVehiclesLoading } = useQuery('vehicles', getVehicles);

  const { mutate: createVehicleMutation, isLoading: isCreatingVehicle } = useMutation(
    (vehicle: Omit<Vehicle, 'id'>) => createVehicle(vehicle),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('vehicles');
      },
    }
  );

  const { mutate: updateVehicleMutation, isLoading: isUpdatingVehicle } = useMutation(
    ({ id, vehicle }: { id: number; vehicle: Omit<Vehicle, 'id'> }) => updateVehicle(id, vehicle),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('vehicles');
      },
    }
  );

  const { mutate: deleteVehicleMutation, isLoading: isDeletingVehicle } = useMutation(
    (id: number) => deleteVehicle(id),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('vehicles');
      },
    }
  );

  // Routes
  const { data: routes, isLoading: isRoutesLoading } = useQuery('routes', getRoutes);

  const { mutate: createRouteMutation, isLoading: isCreatingRoute } = useMutation(
    (route: Omit<Route, 'id' | 'stops'>) => createRoute(route),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('routes');
      },
    }
  );

  const { mutate: updateRouteMutation, isLoading: isUpdatingRoute } = useMutation(
    ({ id, route }: { id: number; route: Omit<Route, 'id' | 'stops'> }) => updateRoute(id, route),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('routes');
      },
    }
  );

  const { mutate: deleteRouteMutation, isLoading: isDeletingRoute } = useMutation(
    (id: number) => deleteRoute(id),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('routes');
      },
    }
  );

  // Stops
  const { data: stops, isLoading: isStopsLoading } = useQuery('stops', getStops);

  const { mutate: createStopMutation, isLoading: isCreatingStop } = useMutation(
    (stop: Omit<Stop, 'id'>) => createStop(stop),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('stops');
      },
    }
  );

  const { mutate: updateStopMutation, isLoading: isUpdatingStop } = useMutation(
    ({ id, stop }: { id: number; stop: Omit<Stop, 'id'> }) => updateStop(id, stop),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('stops');
      },
    }
  );

  const { mutate: deleteStopMutation, isLoading: isDeletingStop } = useMutation(
    (id: number) => deleteStop(id),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('stops');
      },
    }
  );

  // Transport Members
  const { data: transportMembers, isLoading: isTransportMembersLoading } = useQuery('transportMembers', getTransportMembers);

  const { mutate: createTransportMemberMutation, isLoading: isCreatingTransportMember } = useMutation(
    (transportMember: Omit<TransportMember, 'id'>) => createTransportMember(transportMember),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('transportMembers');
      },
    }
  );

  const { mutate: updateTransportMemberMutation, isLoading: isUpdatingTransportMember } = useMutation(
    ({ id, transportMember }: { id: number; transportMember: Omit<TransportMember, 'id'> }) => updateTransportMember(id, transportMember),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('transportMembers');
      },
    }
  );

  const { mutate: deleteTransportMemberMutation, isLoading: isDeletingTransportMember } = useMutation(
    (id: number) => deleteTransportMember(id),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('transportMembers');
      },
    }
  );

  return {
    vehicles,
    isVehiclesLoading,
    createVehicle: createVehicleMutation,
    isCreatingVehicle,
    updateVehicle: updateVehicleMutation,
    isUpdatingVehicle,
    deleteVehicle: deleteVehicleMutation,
    isDeletingVehicle,
    routes,
    isRoutesLoading,
    createRoute: createRouteMutation,
    isCreatingRoute,
    updateRoute: updateRouteMutation,
    isUpdatingRoute,
    deleteRoute: deleteRouteMutation,
    isDeletingRoute,
    stops,
    isStopsLoading,
    createStop: createStopMutation,
    isCreatingStop,
    updateStop: updateStopMutation,
    isUpdatingStop,
    deleteStop: deleteStopMutation,
    isDeletingStop,
    transportMembers,
    isTransportMembersLoading,
    createTransportMember: createTransportMemberMutation,
    isCreatingTransportMember,
    updateTransportMember: updateTransportMemberMutation,
    isUpdatingTransportMember,
    deleteTransportMember: deleteTransportMemberMutation,
    isDeletingTransportMember,
  };
};
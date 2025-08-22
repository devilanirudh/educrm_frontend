import api from './api';
import { Vehicle, Route, Stop, TransportMember } from '../types/transport';

// Vehicle services
export const getVehicles = async () => {
  const response = await api.get<Vehicle[]>('/transport/vehicles/');
  return response.data;
};
export const getVehicle = async (id: number) => {
  const response = await api.get<Vehicle>(`/transport/vehicles/${id}`);
  return response.data;
};
export const createVehicle = async (vehicle: Omit<Vehicle, 'id'>) => {
  const response = await api.post<Vehicle>('/transport/vehicles/', vehicle);
  return response.data;
};
export const updateVehicle = async (id: number, vehicle: Omit<Vehicle, 'id'>) => {
  const response = await api.put<Vehicle>(`/transport/vehicles/${id}`, vehicle);
  return response.data;
};
export const deleteVehicle = async (id: number) => {
  const response = await api.delete(`/transport/vehicles/${id}`);
  return response.data;
};

// Route services
export const getRoutes = async () => {
  const response = await api.get<Route[]>('/transport/routes/');
  return response.data;
};
export const getRoute = async (id: number) => {
  const response = await api.get<Route>(`/transport/routes/${id}`);
  return response.data;
};
export const createRoute = async (route: Omit<Route, 'id' | 'stops'>) => {
  const response = await api.post<Route>('/transport/routes/', route);
  return response.data;
};
export const updateRoute = async (id: number, route: Omit<Route, 'id' | 'stops'>) => {
  const response = await api.put<Route>(`/transport/routes/${id}`, route);
  return response.data;
};
export const deleteRoute = async (id: number) => {
  const response = await api.delete(`/transport/routes/${id}`);
  return response.data;
};

// Stop services
export const getStops = async () => {
  const response = await api.get<Stop[]>('/transport/stops/');
  return response.data;
};
export const getStop = async (id: number) => {
  const response = await api.get<Stop>(`/transport/stops/${id}`);
  return response.data;
};
export const createStop = async (stop: Omit<Stop, 'id'>) => {
  const response = await api.post<Stop>('/transport/stops/', stop);
  return response.data;
};
export const updateStop = async (id: number, stop: Omit<Stop, 'id'>) => {
  const response = await api.put<Stop>(`/transport/stops/${id}`, stop);
  return response.data;
};
export const deleteStop = async (id: number) => {
  const response = await api.delete(`/transport/stops/${id}`);
  return response.data;
};

// TransportMember services
export const getTransportMembers = async () => {
  const response = await api.get<TransportMember[]>('/transport/transport_members/');
  return response.data;
};
export const getTransportMember = async (id: number) => {
  const response = await api.get<TransportMember>(`/transport/transport_members/${id}`);
  return response.data;
};
export const createTransportMember = async (transportMember: Omit<TransportMember, 'id'>) => {
  const response = await api.post<TransportMember>('/transport/transport_members/', transportMember);
  return response.data;
};
export const updateTransportMember = async (id: number, transportMember: Omit<TransportMember, 'id'>) => {
  const response = await api.put<TransportMember>(`/transport/transport_members/${id}`, transportMember);
  return response.data;
};
export const deleteTransportMember = async (id: number) => {
  const response = await api.delete(`/transport/transport_members/${id}`);
  return response.data;
};
export interface Vehicle {
  id: number;
  registration_number: string;
  capacity: number;
  driver_name?: string;
  driver_phone?: string;
  insurance_expiry?: string;
  is_active: boolean;
  route_id?: number;
}

export interface Route {
  id: number;
  name: string;
  description?: string;
  stops: Stop[];
}

export interface Stop {
  id: number;
  name: string;
  latitude?: number;
  longitude?: number;
  arrival_time_am?: string;
  departure_time_am?: string;
  arrival_time_pm?: string;
  departure_time_pm?: string;
  route_id: number;
}

export interface TransportMember {
  id: number;
  user_id: number;
  route_id: number;
  stop_id: number;
}
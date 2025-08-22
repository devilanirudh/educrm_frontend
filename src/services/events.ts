import api from './api';
import { Event } from '../types/events';

export const eventsService = {
  getEvents: async (): Promise<Event[]> => {
    const response = await api.get('/events');
    return response.data;
  },
  createEvent: async (eventData: Omit<Event, 'id'>): Promise<Event> => {
    const response = await api.post('/events', eventData);
    return response.data;
  },
  updateEvent: async (eventId: number, eventData: Partial<Omit<Event, 'id'>>): Promise<Event> => {
    const response = await api.put(`/events/${eventId}`, eventData);
    return response.data;
  },
  deleteEvent: async (eventId: number): Promise<void> => {
    await api.delete(`/events/${eventId}`);
  },
};
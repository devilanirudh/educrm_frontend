import { useQuery, useMutation, useQueryClient } from 'react-query';
import { eventsService } from '../services/events';
import { Event } from '../types/events';

export const useEvents = () => {
  const queryClient = useQueryClient();

  const { data: events, isLoading: isEventsLoading } = useQuery<Event[]>(
    'events',
    eventsService.getEvents
  );

  const { mutate: createEvent, isLoading: isCreatingEvent } = useMutation(
    (data: Omit<Event, 'id'>) => eventsService.createEvent(data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('events');
      },
    }
  );

  const { mutate: updateEvent, isLoading: isUpdatingEvent } = useMutation(
    ({ id, data }: { id: number; data: Partial<Omit<Event, 'id'>> }) => eventsService.updateEvent(id, data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('events');
      },
    }
  );

  const { mutate: deleteEvent, isLoading: isDeletingEvent } = useMutation(
    (id: number) => eventsService.deleteEvent(id),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('events');
      },
    }
  );

  return {
    events,
    isEventsLoading,
    createEvent,
    isCreatingEvent,
    updateEvent,
    isUpdatingEvent,
    deleteEvent,
    isDeletingEvent,
  };
};
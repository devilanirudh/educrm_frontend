import { useQuery, useMutation, useQueryClient } from 'react-query';
import { eventsService, Event, EventCreateRequest } from '../services/events';

export const useEvents = () => {
  const queryClient = useQueryClient();

  const { data: events, isLoading: isEventsLoading } = useQuery<Event[]>(
    'events',
    () => eventsService.getEvents()
  );

  const { mutate: createEvent, isLoading: isCreatingEvent } = useMutation(
    (data: EventCreateRequest) => eventsService.createEvent(data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('events');
      },
    }
  );

  const { mutate: updateEvent, isLoading: isUpdatingEvent } = useMutation(
    ({ id, data }: { id: number; data: EventCreateRequest }) => eventsService.updateEvent(id, data),
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
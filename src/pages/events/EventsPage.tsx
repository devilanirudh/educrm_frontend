import React, { useState } from 'react';
import { Typography, Box, Button, Paper, Dialog, DialogActions, DialogContent, DialogTitle, DialogContentText } from '@mui/material';
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import EventForm from '../../components/events/EventForm';
import { Event } from '../../types/events';
import { useEvents } from '../../hooks/useEvents';

const localizer = momentLocalizer(moment);

const EventsPage: React.FC = () => {
  const { events = [], isEventsLoading, createEvent, updateEvent, deleteEvent } = useEvents();

  const [formOpen, setFormOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);

  const handleCreateEvent = () => {
    setSelectedEvent(null);
    setFormOpen(true);
  };

  const handleEditEvent = (event: Event) => {
    setSelectedEvent(event);
    setFormOpen(true);
  };

  const handleDeleteEvent = (eventId: number) => {
    deleteEvent(eventId);
    setDetailsOpen(false);
  };

  const handleFormSubmit = (values: Omit<Event, 'id'>) => {
    if (selectedEvent) {
      updateEvent({ id: selectedEvent.id, data: values });
    } else {
      createEvent(values);
    }
  };

  const handleSelectEvent = (event: Event) => {
    setSelectedEvent(event);
    setDetailsOpen(true);
  };

  const calendarEvents = events.map(event => ({
    ...event,
    start: new Date(event.start),
    end: new Date(event.end),
  }));

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">Events Calendar</Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={handleCreateEvent}>
          Create Event
        </Button>
      </Box>

      <Paper sx={{ p: 2 }}>
        {isEventsLoading && <Typography>Loading...</Typography>}
        {!isEventsLoading && (
          <Calendar
            localizer={localizer}
            events={calendarEvents as any}
            startAccessor="start"
            endAccessor="end"
            style={{ height: 600 }}
            onSelectEvent={handleSelectEvent}
          />
        )}
      </Paper>

      <EventForm
        open={formOpen}
        onClose={() => setFormOpen(false)}
        onSubmit={handleFormSubmit}
        initialValues={selectedEvent ? {
          title: selectedEvent.title,
          description: selectedEvent.description,
          start: selectedEvent.start,
          end: selectedEvent.end,
          audience: selectedEvent.audience,
        } : undefined}
      />

      {selectedEvent && (
        <Dialog open={detailsOpen} onClose={() => setDetailsOpen(false)}>
          <DialogTitle>{selectedEvent.title}</DialogTitle>
          <DialogContent>
            <DialogContentText>{selectedEvent.description}</DialogContentText>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
              <strong>Starts:</strong> {new Date(selectedEvent.start).toLocaleString()}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              <strong>Ends:</strong> {new Date(selectedEvent.end).toLocaleString()}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              <strong>Audience:</strong> {selectedEvent.audience}
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDetailsOpen(false)}>Close</Button>
            <Button startIcon={<EditIcon />} onClick={() => handleEditEvent(selectedEvent)}>Edit</Button>
            <Button startIcon={<DeleteIcon />} color="error" onClick={() => handleDeleteEvent(selectedEvent.id)}>Delete</Button>
          </DialogActions>
        </Dialog>
      )}
    </Box>
  );
};

export default EventsPage;

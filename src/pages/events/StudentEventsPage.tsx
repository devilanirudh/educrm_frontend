import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  Box,
  Button,
  Typography,
  Paper,
} from '@mui/material';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import {
  CalendarToday as CalendarIcon,
  LocationOn as LocationIcon,
  AccessTime as TimeIcon,
  Person as PersonIcon,
  Visibility as ViewIcon,
  ViewList as ListIcon,
  ViewModule as CalendarViewIcon
} from '@mui/icons-material';
import { useQuery } from 'react-query';
import { eventsService, Event } from '../../services/events';
import 'react-big-calendar/lib/css/react-big-calendar.css';

const localizer = momentLocalizer(moment);

const StudentEventsPage: React.FC = () => {
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [viewMode, setViewMode] = useState<'list' | 'calendar'>('calendar');

  // Fetch student's events
  const { data: events = [], isLoading, error } = useQuery(
    'my-events',
    () => eventsService.getMyEvents(),
    {
      staleTime: 2 * 60 * 1000, // 2 minutes
    }
  );

  const handleViewEvent = (event: any) => {
    // Find the original event data from our events array
    const originalEvent = events.find(e => e.id === event.id);
    if (originalEvent) {
      setSelectedEvent(originalEvent);
      setOpenDialog(true);
    }
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedEvent(null);
  };

  // Convert events to calendar format with proper date handling
  const calendarEvents = events.map((event) => {
    const startDate = moment(event.date);
    const endDate = moment(event.date);
    
    // Add time if available
    if (event.start_time) {
      const [hours, minutes] = event.start_time.split(':');
      startDate.hours(parseInt(hours)).minutes(parseInt(minutes)).seconds(0);
    }
    
    if (event.end_time) {
      const [hours, minutes] = event.end_time.split(':');
      endDate.hours(parseInt(hours)).minutes(parseInt(minutes)).seconds(0);
    } else {
      // If no end time, set to end of day
      endDate.hours(23).minutes(59).seconds(59);
    }

    return {
      id: event.id,
      title: event.title,
      start: startDate.toDate(),
      end: endDate.toDate(),
      resource: event // Store the original event data
    };
  });

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="flex justify-center items-center min-h-96">
          <CircularProgress />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">
                Failed to load events: {(error as any).message || 'Unknown error'}
              </h3>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            My Events
          </h1>
          <p className="text-gray-600">
            View all events assigned to you
          </p>
        </div>
        <div className="flex space-x-2">
          <Button
            variant={viewMode === 'list' ? 'contained' : 'outlined'}
            startIcon={<ListIcon />}
            onClick={() => setViewMode('list')}
            size="small"
          >
            List
          </Button>
          <Button
            variant={viewMode === 'calendar' ? 'contained' : 'outlined'}
            startIcon={<CalendarViewIcon />}
            onClick={() => setViewMode('calendar')}
            size="small"
          >
            Calendar
          </Button>
        </div>
      </div>

      {viewMode === 'calendar' ? (
        <Paper sx={{ p: 2 }}>
          <Calendar
            localizer={localizer}
            events={calendarEvents}
            startAccessor="start"
            endAccessor="end"
            style={{ height: 600 }}
            onSelectEvent={handleViewEvent}
            views={['month', 'week', 'day']}
            defaultView="month"
            selectable
            popup
            eventPropGetter={(event) => ({
              style: {
                backgroundColor: '#3b82f6',
                color: 'white',
                borderRadius: '4px',
                border: 'none',
                padding: '2px 4px',
                fontSize: '12px'
              }
            })}
          />
        </Paper>
      ) : (
        <>
          {events.length === 0 ? (
            <div className="bg-white shadow rounded-lg p-6">
              <div className="text-center">
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No events assigned to you yet
                </h3>
                <p className="text-gray-500">
                  Events will appear here once they are created and assigned to your class
                </p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {events.map((event) => (
                <div key={event.id} className="bg-white shadow rounded-lg overflow-hidden">
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {event.title}
                      </h3>
                      <button
                        onClick={() => handleViewEvent(event)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        <ViewIcon />
                      </button>
                    </div>
                    
                    {event.description && (
                      <p className="text-gray-600 mb-4 line-clamp-3">
                        {event.description}
                      </p>
                    )}
                    
                    <div className="space-y-2">
                      <div className="flex items-center text-sm text-gray-500">
                        <CalendarIcon className="h-4 w-4 mr-2" />
                        {new Date(event.date).toLocaleDateString()}
                      </div>
                      
                      {event.start_time && event.end_time && (
                        <div className="flex items-center text-sm text-gray-500">
                          <TimeIcon className="h-4 w-4 mr-2" />
                          {event.start_time} - {event.end_time}
                        </div>
                      )}
                      
                      {event.location && (
                        <div className="flex items-center text-sm text-gray-500">
                          <LocationIcon className="h-4 w-4 mr-2" />
                          {event.location}
                        </div>
                      )}
                      
                      <div className="flex items-center text-sm text-gray-500">
                        <PersonIcon className="h-4 w-4 mr-2" />
                        {event.creator_name || 'Unknown'}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {selectedEvent && (
        <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
          <DialogTitle>{selectedEvent.title}</DialogTitle>
          <DialogContent>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              {selectedEvent.description}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              <strong>Date:</strong> {new Date(selectedEvent.date).toLocaleDateString()}
            </Typography>
            {selectedEvent.start_time && selectedEvent.end_time && (
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                <strong>Time:</strong> {selectedEvent.start_time} - {selectedEvent.end_time}
              </Typography>
            )}
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              <strong>Type:</strong> {selectedEvent.event_type}
            </Typography>
            {selectedEvent.location && (
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                <strong>Location:</strong> {selectedEvent.location}
              </Typography>
            )}
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              <strong>Status:</strong> {selectedEvent.status}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              <strong>Created by:</strong> {selectedEvent.creator_name || 'Unknown'}
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog}>Close</Button>
          </DialogActions>
        </Dialog>
      )}
    </div>
  );
};

export default StudentEventsPage;

import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
  Grid,
  Tooltip,
  Box,
  Button,
  Typography,
  Paper,
} from '@mui/material';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as ViewIcon,
  CalendarToday as CalendarIcon,
  LocationOn as LocationIcon,
  People as PeopleIcon,
  ViewList as ListIcon,
  ViewModule as CalendarViewIcon
} from '@mui/icons-material';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { eventsService, Event, EventCreateRequest } from '../../services/events';
import { classesService } from '../../services/classes';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import 'react-big-calendar/lib/css/react-big-calendar.css';

const localizer = momentLocalizer(moment);

interface EventFormData {
  title: string;
  description: string;
  event_type: string;
  start: string;
  end: string;
  location: string;
  audience: string;
  target_class_id?: number;
}

const EventsManagementPage: React.FC = () => {
  const [openDialog, setOpenDialog] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [viewMode, setViewMode] = useState<'table' | 'calendar'>('calendar');
  const [formData, setFormData] = useState<EventFormData>({
    title: '',
    description: '',
    event_type: 'General',
    start: '',
    end: '',
    location: '',
    audience: 'all'
  });

  const user = useSelector((state: RootState) => state.auth.user);
  const queryClient = useQueryClient();

  // Fetch events
  const { data: events = [], isLoading, error } = useQuery(
    'events',
    () => eventsService.getEvents(),
    {
      staleTime: 2 * 60 * 1000, // 2 minutes
    }
  );

  // Fetch classes for dropdown
  const { data: classesData } = useQuery(
    'classes',
    () => classesService.getClasses(),
    {
      staleTime: 5 * 60 * 1000, // 5 minutes
    }
  );

  // Create event mutation
  const createEventMutation = useMutation(
    (data: EventCreateRequest) => eventsService.createEvent(data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('events');
        handleCloseDialog();
      },
    }
  );

  // Update event mutation
  const updateEventMutation = useMutation(
    ({ id, data }: { id: number; data: EventCreateRequest }) =>
      eventsService.updateEvent(id, data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('events');
        handleCloseDialog();
      },
    }
  );

  // Delete event mutation
  const deleteEventMutation = useMutation(
    (id: number) => eventsService.deleteEvent(id),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('events');
      },
    }
  );

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

  const handleViewEvent = (event: any) => {
    // Find the original event data from our events array
    const originalEvent = events.find(e => e.id === event.id);
    if (originalEvent) {
      setEditingEvent(originalEvent);
      setFormData({
        title: originalEvent.title,
        description: originalEvent.description || '',
        event_type: originalEvent.event_type,
        start: originalEvent.start_time ? `${originalEvent.date}T${originalEvent.start_time}` : originalEvent.date,
        end: originalEvent.end_time ? `${originalEvent.date}T${originalEvent.end_time}` : originalEvent.date,
        location: originalEvent.location || '',
        audience: originalEvent.target_type === 'school_wide' ? 'all' : 
                 originalEvent.target_type === 'teachers' ? 'teachers' : 'class',
        target_class_id: originalEvent.target_class_id
      });
      setOpenDialog(true);
    }
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingEvent(null);
    setFormData({
      title: '',
      description: '',
      event_type: 'General',
      start: '',
      end: '',
      location: '',
      audience: 'all'
    });
  };

  const handleSubmit = () => {
    const eventData: EventCreateRequest = {
      title: formData.title,
      description: formData.description,
      start: formData.start,
      end: formData.end,
      location: formData.location,
      audience: formData.audience,
      target_class_id: formData.target_class_id
    };

    if (editingEvent) {
      updateEventMutation.mutate({ id: editingEvent.id, data: eventData });
    } else {
      createEventMutation.mutate(eventData);
    }
  };

  const handleDelete = (id: number) => {
    if (window.confirm('Are you sure you want to delete this event?')) {
      deleteEventMutation.mutate(id);
    }
  };

  const canEditEvent = (event: Event) => {
    if (user?.role === 'admin' || user?.role === 'super_admin') return true;
    if (user?.role === 'teacher' && event.created_by === user.id) return true;
    return false;
  };

  const canDeleteEvent = (event: Event) => {
    return canEditEvent(event);
  };

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
            Events Management
          </h1>
          <p className="text-gray-600">
            Create and manage events for your classes
          </p>
        </div>
        <div className="flex space-x-2">
          <Button
            variant={viewMode === 'table' ? 'contained' : 'outlined'}
            startIcon={<ListIcon />}
            onClick={() => setViewMode('table')}
            size="small"
          >
            Table
          </Button>
          <Button
            variant={viewMode === 'calendar' ? 'contained' : 'outlined'}
            startIcon={<CalendarViewIcon />}
            onClick={() => setViewMode('calendar')}
            size="small"
          >
            Calendar
          </Button>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setOpenDialog(true)}
            size="small"
          >
            Create Event
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
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Event
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date & Time
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Location
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Target
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {events.map((event) => (
                  <tr key={event.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {event.title}
                        </div>
                        <div className="text-sm text-gray-500">
                          {event.description}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {new Date(event.date).toLocaleDateString()}
                      </div>
                      {event.start_time && event.end_time && (
                        <div className="text-sm text-gray-500">
                          {event.start_time} - {event.end_time}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {event.location || 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {event.target_type === 'school_wide' ? 'All School' : 
                         event.target_type === 'teachers' ? 'Teachers' : 'Class'}
                      </span>
                      {event.target_class_name && (
                        <div className="text-sm text-gray-500 mt-1">
                          {event.target_class_name}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        event.status === 'active' ? 'bg-green-100 text-green-800' :
                        event.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {event.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => {
                            setEditingEvent(event);
                            setFormData({
                              title: event.title,
                              description: event.description || '',
                              event_type: event.event_type,
                              start: event.start_time ? `${event.date}T${event.start_time}` : event.date,
                              end: event.end_time ? `${event.date}T${event.end_time}` : event.date,
                              location: event.location || '',
                              audience: event.target_type === 'school_wide' ? 'all' : 
                                       event.target_type === 'teachers' ? 'teachers' : 'class',
                              target_class_id: event.target_class_id
                            });
                            setOpenDialog(true);
                          }}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          <EditIcon className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(event.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          <DeleteIcon className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Event Form Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>
          {editingEvent ? 'Edit Event' : 'Create New Event'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Event Title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Description"
                multiline
                rows={3}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Event Type"
                value={formData.event_type}
                onChange={(e) => setFormData({ ...formData, event_type: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Location"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Start Date & Time"
                type="datetime-local"
                value={formData.start}
                onChange={(e) => setFormData({ ...formData, start: e.target.value })}
                required
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="End Date & Time"
                type="datetime-local"
                value={formData.end}
                onChange={(e) => setFormData({ ...formData, end: e.target.value })}
                required
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Target Audience</InputLabel>
                <Select
                  value={formData.audience}
                  onChange={(e) => setFormData({ ...formData, audience: e.target.value })}
                  label="Target Audience"
                >
                  <MenuItem value="all">All School</MenuItem>
                  <MenuItem value="teachers">Teachers Only</MenuItem>
                  <MenuItem value="class">Specific Class</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            {formData.audience === 'class' && (
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Select Class</InputLabel>
                  <Select
                    value={formData.target_class_id || ''}
                    onChange={(e) => setFormData({ ...formData, target_class_id: e.target.value as number })}
                    label="Select Class"
                  >
                    {classesData?.data?.map((cls: any) => (
                      <MenuItem key={cls.id} value={cls.id}>
                        {cls.name} {cls.section}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            )}
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button
            onClick={handleSubmit}
            variant="contained"
            disabled={createEventMutation.isLoading || updateEventMutation.isLoading}
          >
            {editingEvent ? 'Update Event' : 'Create Event'}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default EventsManagementPage;

import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
} from '@mui/material';
import {
  CalendarToday as CalendarIcon,
  LocationOn as LocationIcon,
  AccessTime as TimeIcon,
  Person as PersonIcon,
  Visibility as ViewIcon,
  School as SchoolIcon
} from '@mui/icons-material';
import { useQuery } from 'react-query';
import { eventsService, Event } from '../../services/events';

const ParentEventsPage: React.FC = () => {
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [openDialog, setOpenDialog] = useState(false);

  // Fetch parent's child events
  const { data: events = [], isLoading, error } = useQuery(
    'child-events',
    () => eventsService.getChildEvents(),
    {
      staleTime: 2 * 60 * 1000, // 2 minutes
    }
  );

  const handleViewEvent = (event: Event) => {
    setSelectedEvent(event);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedEvent(null);
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
      <h1 className="text-2xl font-bold text-gray-900 mb-2">
        My Children's Events
      </h1>
      <p className="text-gray-600 mb-6">
        View all events assigned to your children
      </p>

      {events.length === 0 ? (
        <div className="bg-white shadow rounded-lg p-6">
          <div className="text-center">
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No events assigned to your children yet
            </h3>
            <p className="text-gray-500">
              Events will appear here once they are created and assigned to your children's classes
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
                    className="text-blue-600 hover:text-blue-900"
                    onClick={() => handleViewEvent(event)}
                  >
                    <ViewIcon className="w-4 h-4" />
                  </button>
                </div>

                {event.description && (
                  <p className="text-gray-600 mb-4">
                    {event.description}
                  </p>
                )}

                <div className="space-y-2">
                  <div className="flex items-center text-sm text-gray-600">
                    <CalendarIcon className="w-4 h-4 mr-2" />
                    {eventsService.formatEventDate(event.date)}
                  </div>

                  {event.start_time && event.end_time && (
                    <div className="flex items-center text-sm text-gray-600">
                      <TimeIcon className="w-4 h-4 mr-2" />
                      {eventsService.formatEventTime(event.start_time)} - {eventsService.formatEventTime(event.end_time)}
                    </div>
                  )}

                  {event.location && (
                    <div className="flex items-center text-sm text-gray-600">
                      <LocationIcon className="w-4 h-4 mr-2" />
                      {event.location}
                    </div>
                  )}

                  {event.target_class_name && (
                    <div className="flex items-center text-sm text-gray-600">
                      <SchoolIcon className="w-4 h-4 mr-2" />
                      Class: {event.target_class_name}
                    </div>
                  )}

                  <div className="flex items-center text-sm text-gray-600">
                    <PersonIcon className="w-4 h-4 mr-2" />
                    Created by: {event.creator_name || 'Unknown'}
                  </div>
                </div>

                <div className="flex gap-2 mt-4">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    {event.event_type}
                  </span>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    eventsService.getStatusColor(event.status) === 'success' ? 'bg-green-100 text-green-800' :
                    eventsService.getStatusColor(event.status) === 'error' ? 'bg-red-100 text-red-800' :
                    eventsService.getStatusColor(event.status) === 'info' ? 'bg-blue-100 text-blue-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {event.status}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Event Details Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          {selectedEvent?.title}
        </DialogTitle>
        <DialogContent>
          {selectedEvent && (
            <div>
              {selectedEvent.description && (
                <p className="mb-4">
                  {selectedEvent.description}
                </p>
              )}

              <div className="border-t border-gray-200 my-4"></div>

              <div className="space-y-3">
                <div className="flex items-center">
                  <CalendarIcon className="w-4 h-4 mr-2" />
                  <span className="font-medium">Date:</span>
                  <span className="ml-2">{eventsService.formatEventDate(selectedEvent.date)}</span>
                </div>

                {selectedEvent.start_time && selectedEvent.end_time && (
                  <div className="flex items-center">
                    <TimeIcon className="w-4 h-4 mr-2" />
                    <span className="font-medium">Time:</span>
                    <span className="ml-2">{eventsService.formatEventTime(selectedEvent.start_time)} - {eventsService.formatEventTime(selectedEvent.end_time)}</span>
                  </div>
                )}

                {selectedEvent.location && (
                  <div className="flex items-center">
                    <LocationIcon className="w-4 h-4 mr-2" />
                    <span className="font-medium">Location:</span>
                    <span className="ml-2">{selectedEvent.location}</span>
                  </div>
                )}

                {selectedEvent.target_class_name && (
                  <div className="flex items-center">
                    <SchoolIcon className="w-4 h-4 mr-2" />
                    <span className="font-medium">Target Class:</span>
                    <span className="ml-2">{selectedEvent.target_class_name}</span>
                  </div>
                )}

                <div className="flex items-center">
                  <PersonIcon className="w-4 h-4 mr-2" />
                  <span className="font-medium">Created by:</span>
                  <span className="ml-2">{selectedEvent.creator_name || 'Unknown'}</span>
                </div>
              </div>

              <div className="border-t border-gray-200 my-4"></div>

              <div className="flex gap-2 mb-4">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  {selectedEvent.event_type}
                </span>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  eventsService.getStatusColor(selectedEvent.status) === 'success' ? 'bg-green-100 text-green-800' :
                  eventsService.getStatusColor(selectedEvent.status) === 'error' ? 'bg-red-100 text-red-800' :
                  eventsService.getStatusColor(selectedEvent.status) === 'info' ? 'bg-blue-100 text-blue-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {selectedEvent.status}
                </span>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                  {eventsService.getTargetTypeLabel(selectedEvent.target_type)}
                </span>
              </div>

              <div className="text-sm text-gray-600">
                <span className="font-medium">Event ID:</span> {selectedEvent.id}
              </div>
            </div>
          )}
        </DialogContent>
        <DialogActions>
          <button 
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
            onClick={handleCloseDialog}
          >
            Close
          </button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default ParentEventsPage;

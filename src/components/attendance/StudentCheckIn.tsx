import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Alert,
  CircularProgress,
  Grid,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField
} from '@mui/material';
import {
  LocationOn,
  CheckCircle,
  Cancel,
  MyLocation,
  History,
  Info
} from '@mui/icons-material';
import { format } from 'date-fns';
import api from '../../services/api';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';

interface CheckInStatus {
  isCheckedIn: boolean;
  checkInTime?: string;
  checkOutTime?: string;
  location?: {
    lat: number;
    lng: number;
    address?: string;
  };
  totalHours?: number;
}

interface ClassSchedule {
  id: number;
  name: string;
  start_time: string;
  end_time: string;
  is_active: boolean;
}

const StudentCheckIn: React.FC = () => {
  const user = useSelector((state: RootState) => state.auth.user);
  const [checkInStatus, setCheckInStatus] = useState<CheckInStatus>({ isCheckedIn: false });
  const [classes, setClasses] = useState<ClassSchedule[]>([]);
  const [selectedClass, setSelectedClass] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [showLocationDialog, setShowLocationDialog] = useState(false);
  const [manualLocation, setManualLocation] = useState({ lat: '', lng: '' });

  useEffect(() => {
    fetchClasses();
    getCurrentLocation();
  }, []);

  const fetchClasses = async () => {
    try {
      const response = await api.get('/classes');
      setClasses(response.data.classes || []);
    } catch (error) {
      console.error('Error fetching classes:', error);
      setError('Failed to fetch classes');
    }
  };

  const fetchCheckInStatus = useCallback(async () => {
    if (!selectedClass) return;

    try {
      setLoading(true);
      const today = format(new Date(), 'yyyy-MM-dd');
      const response = await api.get(`/attendance/reports`, {
        params: {
          student_id: user?.id,
          class_id: selectedClass,
          start_date: today,
          end_date: today,
          include_details: true
        }
      });

      const records = response.data.detailed_records || [];
      if (records.length > 0) {
        const record = records[0];
        setCheckInStatus({
          isCheckedIn: record.check_in_time && !record.check_out_time,
          checkInTime: record.check_in_time,
          checkOutTime: record.check_out_time,
          totalHours: record.total_hours
        });
      } else {
        setCheckInStatus({ isCheckedIn: false });
      }
    } catch (error) {
      console.error('Error fetching check-in status:', error);
    } finally {
      setLoading(false);
    }
  }, [selectedClass, user?.id]);

  useEffect(() => {
    if (selectedClass) {
      fetchCheckInStatus();
    }
  }, [selectedClass, fetchCheckInStatus]);

  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      setLocationError('Geolocation is not supported by this browser');
      return;
    }

    setLoading(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude
        });
        setLocationError(null);
        setLoading(false);
      },
      (error) => {
        console.error('Error getting location:', error);
        setLocationError('Unable to get your location. Please enable location services.');
        setLoading(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000 // 5 minutes
      }
    );
  };

  const handleCheckIn = async () => {
    if (!selectedClass) {
      setError('Please select a class first');
      return;
    }

    if (!location) {
      setShowLocationDialog(true);
      return;
    }

    try {
      setLoading(true);
      const response = await api.post('/attendance/check-in', {
        class_id: selectedClass,
        location: location
      });

      setSuccess('Check-in successful!');
      setCheckInStatus({
        isCheckedIn: true,
        checkInTime: response.data.check_in_time,
        location: location
      });

      setTimeout(() => setSuccess(null), 3000);
    } catch (error: any) {
      console.error('Error checking in:', error);
      setError(error.response?.data?.detail || 'Failed to check in');
      setTimeout(() => setError(null), 3000);
    } finally {
      setLoading(false);
    }
  };

  const handleCheckOut = async () => {
    if (!selectedClass) {
      setError('Please select a class first');
      return;
    }

    try {
      setLoading(true);
      const response = await api.post('/attendance/check-out', {
        class_id: selectedClass,
        location: location
      });

      setSuccess('Check-out successful!');
      setCheckInStatus({
        isCheckedIn: false,
        checkInTime: checkInStatus.checkInTime,
        checkOutTime: response.data.check_out_time,
        totalHours: response.data.total_hours
      });

      setTimeout(() => setSuccess(null), 3000);
    } catch (error: any) {
      console.error('Error checking out:', error);
      setError(error.response?.data?.detail || 'Failed to check out');
      setTimeout(() => setError(null), 3000);
    } finally {
      setLoading(false);
    }
  };

  const handleManualLocationSubmit = () => {
    const lat = parseFloat(manualLocation.lat);
    const lng = parseFloat(manualLocation.lng);

    if (isNaN(lat) || isNaN(lng)) {
      setError('Please enter valid coordinates');
      return;
    }

    setLocation({ lat, lng });
    setShowLocationDialog(false);
    setManualLocation({ lat: '', lng: '' });
  };

  const getCurrentTime = () => {
    return format(new Date(), 'HH:mm:ss');
  };

  const getCurrentDate = () => {
    return format(new Date(), 'EEEE, MMMM d, yyyy');
  };

  const isWithinSchoolHours = () => {
    if (!selectedClass) return false;
    
    const classInfo = classes.find(c => c.id === selectedClass);
    if (!classInfo) return false;

    const now = new Date();
    const currentTime = format(now, 'HH:mm');
    
    return currentTime >= classInfo.start_time && currentTime <= classInfo.end_time;
  };

  return (
    <Box sx={{ p: 3, maxWidth: 600, mx: 'auto' }}>
      <Typography variant="h4" gutterBottom align="center">
        Student Check-In
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {success && (
        <Alert severity="success" sx={{ mb: 2 }} onClose={() => setSuccess(null)}>
          {success}
        </Alert>
      )}

      {/* Current Time and Date */}
      <Paper sx={{ p: 2, mb: 3, textAlign: 'center' }}>
        <Typography variant="h3" color="primary">
          {getCurrentTime()}
        </Typography>
        <Typography variant="body1" color="textSecondary">
          {getCurrentDate()}
        </Typography>
      </Paper>

      {/* Class Selection */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Select Your Class
          </Typography>
          <Grid container spacing={2}>
            {classes.map((cls) => (
              <Grid item xs={12} sm={6} key={cls.id}>
                <Button
                  variant={selectedClass === cls.id ? 'contained' : 'outlined'}
                  fullWidth
                  onClick={() => setSelectedClass(cls.id)}
                  disabled={!cls.is_active}
                  sx={{ height: 60 }}
                >
                  <Box>
                    <Typography variant="body1">{cls.name}</Typography>
                    <Typography variant="caption" display="block">
                      {cls.start_time} - {cls.end_time}
                    </Typography>
                  </Box>
                </Button>
              </Grid>
            ))}
          </Grid>
        </CardContent>
      </Card>

      {/* Location Status */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Location Status
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <LocationOn color={location ? 'success' : 'error'} sx={{ mr: 1 }} />
            <Typography variant="body1">
              {location ? 'Location detected' : 'Location not available'}
            </Typography>
          </Box>
          
          {location && (
            <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
              Lat: {location.lat.toFixed(6)}, Lng: {location.lng.toFixed(6)}
            </Typography>
          )}

          {locationError && (
            <Alert severity="warning" sx={{ mb: 2 }}>
              {locationError}
            </Alert>
          )}

          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button
              variant="outlined"
              startIcon={<MyLocation />}
              onClick={getCurrentLocation}
              disabled={loading}
            >
              Refresh Location
            </Button>
            <Button
              variant="outlined"
              onClick={() => setShowLocationDialog(true)}
            >
              Enter Manually
            </Button>
          </Box>
        </CardContent>
      </Card>

      {/* Check-in/Check-out Status */}
      {selectedClass && (
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Attendance Status
            </Typography>
            
            {loading ? (
              <Box display="flex" justifyContent="center" p={2}>
                <CircularProgress />
              </Box>
            ) : (
              <Box>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  {checkInStatus.isCheckedIn ? (
                    <CheckCircle color="success" sx={{ mr: 1 }} />
                  ) : (
                    <Cancel color="error" sx={{ mr: 1 }} />
                  )}
                  <Typography variant="body1">
                    {checkInStatus.isCheckedIn ? 'Currently Checked In' : 'Not Checked In'}
                  </Typography>
                </Box>

                {checkInStatus.checkInTime && (
                  <Typography variant="body2" color="textSecondary" sx={{ mb: 1 }}>
                    Check-in: {format(new Date(checkInStatus.checkInTime), 'HH:mm:ss')}
                  </Typography>
                )}

                {checkInStatus.checkOutTime && (
                  <Typography variant="body2" color="textSecondary" sx={{ mb: 1 }}>
                    Check-out: {format(new Date(checkInStatus.checkOutTime), 'HH:mm:ss')}
                  </Typography>
                )}

                {checkInStatus.totalHours && (
                  <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
                    Total hours: {checkInStatus.totalHours.toFixed(2)} hours
                  </Typography>
                )}

                <Box sx={{ display: 'flex', gap: 2 }}>
                  {!checkInStatus.isCheckedIn ? (
                    <Button
                      variant="contained"
                      color="success"
                      startIcon={<CheckCircle />}
                      onClick={handleCheckIn}
                      disabled={loading || !location || !isWithinSchoolHours()}
                      fullWidth
                    >
                      Check In
                    </Button>
                  ) : (
                    <Button
                      variant="contained"
                      color="error"
                      startIcon={<Cancel />}
                      onClick={handleCheckOut}
                      disabled={loading}
                      fullWidth
                    >
                      Check Out
                    </Button>
                  )}
                </Box>

                {!isWithinSchoolHours() && (
                  <Alert severity="warning" sx={{ mt: 2 }}>
                    <Typography variant="body2">
                      You can only check in during school hours
                    </Typography>
                  </Alert>
                )}
              </Box>
            )}
          </CardContent>
        </Card>
      )}

      {/* Recent Activity */}
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Recent Activity
          </Typography>
          <List>
            <ListItem>
              <ListItemIcon>
                <History />
              </ListItemIcon>
              <ListItemText
                primary="Last check-in"
                secondary={checkInStatus.checkInTime 
                  ? format(new Date(checkInStatus.checkInTime), 'MMM d, yyyy HH:mm')
                  : 'No recent check-ins'
                }
              />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <Info />
              </ListItemIcon>
              <ListItemText
                primary="Location accuracy"
                secondary={location ? 'High accuracy GPS' : 'Location not available'}
              />
            </ListItem>
          </List>
        </CardContent>
      </Card>

      {/* Manual Location Dialog */}
      <Dialog open={showLocationDialog} onClose={() => setShowLocationDialog(false)}>
        <DialogTitle>Enter Location Manually</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
            Please enter your current coordinates
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Latitude"
                value={manualLocation.lat}
                onChange={(e) => setManualLocation({ ...manualLocation, lat: e.target.value })}
                placeholder="e.g., 40.7128"
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Longitude"
                value={manualLocation.lng}
                onChange={(e) => setManualLocation({ ...manualLocation, lng: e.target.value })}
                placeholder="e.g., -74.0060"
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowLocationDialog(false)}>Cancel</Button>
          <Button onClick={handleManualLocationSubmit} variant="contained">
            Submit
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default StudentCheckIn;

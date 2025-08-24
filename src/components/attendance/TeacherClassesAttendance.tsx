import React, { useState, useEffect, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
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
  Chip,
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import {
  CheckCircle,
  Cancel,
  Schedule,
  Info,
  Refresh,
  School,
  Group,
  CalendarToday,
  Assignment
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import TeacherAttendanceMarking from './TeacherAttendanceMarking';

interface TeacherClass {
  id: number;
  name: string;
  section: string;
  grade_level: number;
  academic_year: string;
  is_active: boolean;
  role: string;
  subjects: Array<{
    id: number;
    name: string;
    weekly_hours: number;
    is_optional: boolean;
  }>;
}

interface TeacherProfile {
  id: number;
  employee_id: string;
  user_id: number;
  qualifications: string;
  specialization: string;
  experience: number;
  is_active: boolean;
  assigned_classes: TeacherClass[];
  total_classes: number;
}

const TeacherClassesAttendance: React.FC = () => {
  const user = useSelector((state: RootState) => state.auth.user);
  const navigate = useNavigate();
  const [teacherProfile, setTeacherProfile] = useState<TeacherProfile | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedClass, setSelectedClass] = useState<TeacherClass | null>(null);
  const [attendanceDialogOpen, setAttendanceDialogOpen] = useState(false);

  // Fetch teacher profile and assigned classes
  const fetchTeacherProfile = useCallback(async () => {
    try {
      setLoading(true);
      const response = await api.get('/teachers/me/profile');
      setTeacherProfile(response.data);
    } catch (error) {
      console.error('Error fetching teacher profile:', error);
      setError('Failed to fetch teacher profile');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTeacherProfile();
  }, [fetchTeacherProfile]);

  const handleAttendanceClick = (classData: TeacherClass) => {
    setSelectedClass(classData);
    setAttendanceDialogOpen(true);
  };

  const handleCloseAttendance = () => {
    setAttendanceDialogOpen(false);
    setSelectedClass(null);
  };

  const handleClassDashboardClick = (classData: TeacherClass) => {
    navigate(`/classes/${classData.id}`);
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ m: 2 }}>
        {error}
      </Alert>
    );
  }

  if (!teacherProfile) {
    return (
      <Alert severity="info" sx={{ m: 2 }}>
        Teacher profile not found
      </Alert>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" gutterBottom>
          My Classes & Attendance
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Manage attendance for your assigned classes
        </Typography>
      </Box>

      {/* Teacher Info Card */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} sm={6}>
              <Typography variant="h6" gutterBottom>
                {user?.first_name} {user?.last_name}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Employee ID: {teacherProfile.employee_id}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Qualifications: {teacherProfile.qualifications || 'Not specified'}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Specialization: {teacherProfile.specialization || 'Not specified'}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Experience: {teacherProfile.experience || 0} years
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Box sx={{ textAlign: 'right' }}>
                <Typography variant="h4" color="primary.main">
                  {teacherProfile.total_classes}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Assigned Classes
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Classes Grid */}
      {teacherProfile.assigned_classes.length === 0 ? (
        <Card>
          <CardContent sx={{ textAlign: 'center', py: 4 }}>
            <School sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
            <Typography variant="h6" gutterBottom>
              No Classes Assigned
            </Typography>
            <Typography variant="body2" color="text.secondary">
              You haven't been assigned to any classes yet. Please contact the administrator.
            </Typography>
          </CardContent>
        </Card>
      ) : (
        <Grid container spacing={3}>
          {teacherProfile.assigned_classes.map((classData) => (
            <Grid item xs={12} sm={6} md={4} key={classData.id}>
              <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <CardContent sx={{ flexGrow: 1 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <School sx={{ mr: 1, color: 'primary.main' }} />
                    <Typography variant="h6" component="div">
                      {classData.name} - {classData.section}
                    </Typography>
                  </Box>
                  
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Grade Level: {classData.grade_level}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Academic Year: {classData.academic_year}
                  </Typography>
                  
                  {/* Subjects Section */}
                  <Box sx={{ mt: 2, mb: 2 }}>
                    <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                      Subjects I Teach:
                    </Typography>
                    {classData.subjects && classData.subjects.length > 0 ? (
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                        {classData.subjects.map((subject) => (
                          <Chip
                            key={subject.id}
                            label={`${subject.name} (${subject.weekly_hours}h)`}
                            size="small"
                            color="primary"
                            variant="outlined"
                          />
                        ))}
                      </Box>
                    ) : (
                      <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic' }}>
                        No subjects assigned
                      </Typography>
                    )}
                  </Box>
                  
                  <Box sx={{ mt: 2, mb: 2 }}>
                    <Chip
                      label={classData.is_active ? 'Active' : 'Inactive'}
                      color={classData.is_active ? 'success' : 'default'}
                      size="small"
                    />
                  </Box>

                  <Box sx={{ display: 'flex', gap: 1, mt: 'auto' }}>
                    <Button
                      variant="contained"
                      size="small"
                      startIcon={<CalendarToday />}
                      onClick={() => handleAttendanceClick(classData)}
                      fullWidth
                    >
                      Mark Attendance
                    </Button>
                    <Button
                      variant="outlined"
                      size="small"
                      startIcon={<Assignment />}
                      onClick={() => handleClassDashboardClick(classData)}
                    >
                      Dashboard
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Attendance Marking Dialog */}
      <Dialog
        open={attendanceDialogOpen}
        onClose={handleCloseAttendance}
        maxWidth="lg"
        fullWidth
      >
        <DialogTitle>
          Mark Attendance - {selectedClass?.name} {selectedClass?.section}
        </DialogTitle>
        <DialogContent>
          {selectedClass && (
            <TeacherAttendanceMarking classId={selectedClass.id} />
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseAttendance}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default TeacherClassesAttendance;

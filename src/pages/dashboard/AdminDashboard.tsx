import React, { useState, useEffect } from 'react';
import {
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  CardHeader,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Chip,
  CircularProgress,
  Alert,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
} from '@mui/material';
import {
  School,
  People,
  Assignment,
  TrendingUp,
  Person,
  Class,
  Event,
  Notifications,
} from '@mui/icons-material';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import { studentsService } from '../../services/students';
import { teachersService } from '../../services/teachers';
import { classesService } from '../../services/classes';

interface DashboardStats {
  totalStudents: number;
  totalTeachers: number;
  totalClasses: number;
  attendanceRate: number;
  activeStudents: number;
  activeTeachers: number;
}

interface RecentActivity {
  id: number;
  type: 'student_enrollment' | 'teacher_assignment' | 'class_creation' | 'exam_scheduled';
  message: string;
  timestamp: string;
  user?: string;
}

const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats>({
    totalStudents: 0,
    totalTeachers: 0,
    totalClasses: 0,
    attendanceRate: 0,
    activeStudents: 0,
    activeTeachers: 0,
  });
  const [recentStudents, setRecentStudents] = useState<any[]>([]);
  const [recentActivities, setRecentActivities] = useState<RecentActivity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { user } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Load statistics
      const [studentsResponse, teachersResponse, classesResponse] = await Promise.all([
        studentsService.getStudents({ per_page: 5 }),
        teachersService.getTeachers({ per_page: 5 }),
        classesService.getClasses({ per_page: 5 }),
      ]);

      // Calculate stats
      const totalStudents = studentsResponse.total;
      const totalTeachers = teachersResponse.total;
      const totalClasses = classesResponse.total;
      const activeStudents = studentsResponse.data.filter(s => s.is_active).length;
      const activeTeachers = teachersResponse.data.filter(t => t.is_active).length;

      setStats({
        totalStudents,
        totalTeachers,
        totalClasses,
        attendanceRate: 95, // This would come from attendance service
        activeStudents,
        activeTeachers,
      });

      // Set recent students
      setRecentStudents(studentsResponse.data.slice(0, 5));

      // Mock recent activities
      setRecentActivities([
        {
          id: 1,
          type: 'student_enrollment',
          message: 'New student John Doe enrolled in Grade 10-A',
          timestamp: new Date().toISOString(),
          user: 'Admin',
        },
        {
          id: 2,
          type: 'teacher_assignment',
          message: 'Teacher Jane Smith assigned to Mathematics',
          timestamp: new Date(Date.now() - 3600000).toISOString(),
          user: 'Admin',
        },
        {
          id: 3,
          type: 'class_creation',
          message: 'New class Grade 11-B created',
          timestamp: new Date(Date.now() - 7200000).toISOString(),
          user: 'Admin',
        },
      ]);

    } catch (err: any) {
      setError(err.message || 'Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'student_enrollment':
        return <Person color="primary" />;
      case 'teacher_assignment':
        return <People color="secondary" />;
      case 'class_creation':
        return <Class color="success" />;
      case 'exam_scheduled':
        return <Assignment color="warning" />;
      default:
        return <Event />;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Admin Dashboard
      </Typography>
      <Typography variant="body1" color="text.secondary" paragraph>
        Welcome back, {user?.first_name}! Here's what's happening in your school today.
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {/* Statistics Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Box display="flex" alignItems="center" gap={2}>
                <School color="primary" sx={{ fontSize: 40 }} />
                <Box>
                  <Typography variant="h6" color="text.secondary">
                    Total Students
                  </Typography>
                  <Typography variant="h4" color="primary">
                    {stats.totalStudents}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {stats.activeStudents} active
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Box display="flex" alignItems="center" gap={2}>
                <People color="secondary" sx={{ fontSize: 40 }} />
                <Box>
                  <Typography variant="h6" color="text.secondary">
                    Total Teachers
                  </Typography>
                  <Typography variant="h4" color="secondary">
                    {stats.totalTeachers}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {stats.activeTeachers} active
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Box display="flex" alignItems="center" gap={2}>
                <Assignment color="success" sx={{ fontSize: 40 }} />
                <Box>
                  <Typography variant="h6" color="text.secondary">
                    Active Classes
                  </Typography>
                  <Typography variant="h4" color="success.main">
                    {stats.totalClasses}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    This academic year
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Box display="flex" alignItems="center" gap={2}>
                <TrendingUp color="warning" sx={{ fontSize: 40 }} />
                <Box>
                  <Typography variant="h6" color="text.secondary">
                    Attendance Rate
                  </Typography>
                  <Typography variant="h4" color="warning.main">
                    {stats.attendanceRate}%
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    This month
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Content Grid */}
      <Grid container spacing={3}>
        {/* Recent Students */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardHeader
              title="Recent Students"
              action={
                <Button size="small" href="/students">
                  View All
                </Button>
              }
            />
            <CardContent>
              {recentStudents.length > 0 ? (
                <List>
                  {recentStudents.map((student) => (
                    <ListItem key={student.id}>
                      <ListItemAvatar>
                        <Avatar src={student.user.profile_picture}>
                          {student.user.first_name[0]}{student.user.last_name[0]}
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={`${student.user.first_name} ${student.user.last_name}`}
                        secondary={
                          <Box>
                            <Typography variant="body2" component="span">
                              {student.student_id} • {student.current_class?.name || 'No class assigned'}
                            </Typography>
                            <br />
                            <Typography variant="caption" color="text.secondary">
                              Enrolled: {formatDate(student.admission_date)}
                            </Typography>
                          </Box>
                        }
                      />
                      <Chip
                        label={student.is_active ? 'Active' : 'Inactive'}
                        color={student.is_active ? 'success' : 'error'}
                        size="small"
                      />
                    </ListItem>
                  ))}
                </List>
              ) : (
                <Typography variant="body2" color="text.secondary" textAlign="center">
                  No students found
                </Typography>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Recent Activities */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardHeader
              title="Recent Activities"
              avatar={<Notifications color="primary" />}
            />
            <CardContent>
              {recentActivities.length > 0 ? (
                <List>
                  {recentActivities.map((activity) => (
                    <ListItem key={activity.id}>
                      <ListItemAvatar>
                        {getActivityIcon(activity.type)}
                      </ListItemAvatar>
                      <ListItemText
                        primary={activity.message}
                        secondary={
                          <Box>
                            <Typography variant="caption" color="text.secondary">
                              {formatDate(activity.timestamp)} at {formatTime(activity.timestamp)}
                            </Typography>
                            {activity.user && (
                              <>
                                <br />
                                <Typography variant="caption" color="text.secondary">
                                  by {activity.user}
                                </Typography>
                              </>
                            )}
                          </Box>
                        }
                      />
                    </ListItem>
                  ))}
                </List>
              ) : (
                <Typography variant="body2" color="text.secondary" textAlign="center">
                  No recent activities
                </Typography>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Quick Actions */}
        <Grid item xs={12}>
          <Card>
            <CardHeader title="Quick Actions" />
            <CardContent>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6} md={3}>
                  <Button
                    variant="outlined"
                    fullWidth
                    startIcon={<Person />}
                    href="/students"
                    sx={{ py: 2 }}
                  >
                    Manage Students
                  </Button>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Button
                    variant="outlined"
                    fullWidth
                    startIcon={<People />}
                    href="/teachers"
                    sx={{ py: 2 }}
                  >
                    Manage Teachers
                  </Button>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Button
                    variant="outlined"
                    fullWidth
                    startIcon={<Class />}
                    href="/classes"
                    sx={{ py: 2 }}
                  >
                    Manage Classes
                  </Button>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Button
                    variant="outlined"
                    fullWidth
                    startIcon={<Assignment />}
                    href="/assignments"
                    sx={{ py: 2 }}
                  >
                    Assignments
                  </Button>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default AdminDashboard;

import React from 'react';
import {
  Typography,
  Box,
  Grid,
  CardContent,
  CardHeader,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Chip,
  CircularProgress,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line, AreaChart, Area } from 'recharts';
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
import { useDashboard } from '../../hooks/useDashboard';
import { useStudents } from '../../hooks/useStudents';
import { useTeachers } from '../../hooks/useTeachers';
import { useClasses } from '../../hooks/useClasses';
import StyledCard from '../../components/common/StyledCard';

interface RecentActivity {
  id: number;
  action: string;
  details: string;
  timestamp: string;
  user?: any;
}

const AdminDashboard: React.FC = () => {
  const { user } = useSelector((state: RootState) => state.auth);

  const {
    recentTransactions,
    isTransactionsLoading,
    recentActivities,
    isActivitiesLoading,
  } = useDashboard();

  const { students, isStudentsLoading } = useStudents({ per_page: 5 });
  const { teachers, isTeachersLoading, teacherHeadcountTrend, isTeacherTrendLoading } = useTeachers({ per_page: 5 });
  const { classes, isClassesLoading } = useClasses({ per_page: 5 });

  const loading =
    isTransactionsLoading ||
    isActivitiesLoading ||
    isStudentsLoading ||
    isTeachersLoading ||
    isTeacherTrendLoading ||
    isClassesLoading;

  const stats = {
    totalStudents: students?.total || 0,
    totalTeachers: teachers?.total || 0,
    totalClasses: classes?.total || 0,
    attendanceRate: 95, // This would come from attendance service
    activeStudents: students?.data?.filter((s: any) => s.is_active)?.length || 0,
    activeTeachers: teachers?.data?.filter((t: any) => t.is_active)?.length || 0,
  };

  const getActivityIcon = (action: string) => {
    switch (action) {
      case 'LOGIN':
        return <Person color="primary" />;
      case 'ROLE_SWITCH':
        return <People color="secondary" />;
      case 'CREATE':
        return <Class color="success" />;
      case 'UPDATE':
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

      {/* Statistics Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
                <Grid item xs={12} sm={6} md={3}>
                  <StyledCard>
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
                  </StyledCard>
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                  <StyledCard>
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
                  </StyledCard>
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                  <StyledCard>
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
                  </StyledCard>
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                  <StyledCard>
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
                  </StyledCard>
                </Grid>
      </Grid>

      {/* Content Grid */}
      <Grid container spacing={3}>
        {/* Charts & Graphs */}
                <Grid item xs={12} md={6}>
                  <StyledCard>
                    <CardHeader title="Students by Class" />
                    <CardContent>
                      <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={[]}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="name" />
                          <YAxis />
                          <Tooltip />
                          <Legend />
                          <Bar dataKey="students" fill="#8884d8" stackId="a" />
                          <Bar dataKey="teachers" fill="#82ca9d" stackId="a" />
                        </BarChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </StyledCard>
                </Grid>
                        <Grid item xs={12} md={6}>
                          <StyledCard>
                            <CardHeader title="Teacher Headcount Trend" />
                            <CardContent>
                              <ResponsiveContainer width="100%" height={300}>
                                <AreaChart data={teacherHeadcountTrend?.trend}>
                                  <CartesianGrid strokeDasharray="3 3" />
                                  <XAxis dataKey="month" />
                                  <YAxis />
                                  <Tooltip />
                                  <Legend />
                                  <Area type="monotone" dataKey="count" stroke="#82ca9d" fill="#82ca9d" />
                                </AreaChart>
                              </ResponsiveContainer>
                            </CardContent>
                          </StyledCard>
                        </Grid>

        {/* Recent Payments */}
                <Grid item xs={12}>
                  <StyledCard>
                    <CardHeader
                      title="Recent Payments"
                      action={
                        <Button size="small" component={RouterLink} to="/fees-payments?tab=transactions">
                          View all payments
                        </Button>
                      }
                    />
                    <CardContent>
                      <TableContainer>
                        <Table>
                          <TableHead>
                            <TableRow>
                              <TableCell>Date</TableCell>
                              <TableCell>Receipt #</TableCell>
                              <TableCell>Payer</TableCell>
                              <TableCell>Class</TableCell>
                              <TableCell>Method</TableCell>
                              <TableCell>Amount</TableCell>
                              <TableCell>Status</TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {recentTransactions?.data?.slice(0, 10).map((payment: any) => (
                              <TableRow key={payment.id}>
                                <TableCell>{formatDate(payment.payment_date)}</TableCell>
                                <TableCell>{payment.receipt_number}</TableCell>
                                <TableCell>{payment.student?.user.first_name} {payment.student?.user.last_name}</TableCell>
                                <TableCell>{payment.student?.class.name}</TableCell>
                                <TableCell>{payment.payment_method}</TableCell>
                                <TableCell>${payment.amount_paid.toFixed(2)}</TableCell>
                                <TableCell>
                                  <Chip label={payment.status} color={payment.status === 'PAID' ? 'success' : 'warning'} size="small" />
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </TableContainer>
                    </CardContent>
                  </StyledCard>
                </Grid>

        {/* Recent Activities */}
                        <Grid item xs={12} md={6}>
                          <StyledCard>
                            <CardHeader
                              title="Alerts & Activities"
                              avatar={<Notifications color="primary" />}
                            />
                            <CardContent>
                              <Alert severity="warning" sx={{ mb: 2 }}>
                                Payment gateway issues reported. Please check settings.
                              </Alert>
                              {recentActivities?.data?.length > 0 ? (
                                <List>
                                  {recentActivities.data.slice(0, 5).map((activity: RecentActivity) => (
                                    <ListItem key={activity.id}>
                                      <ListItemAvatar>
                                        {getActivityIcon(activity.action)}
                                      </ListItemAvatar>
                                      <ListItemText
                                        primary={activity.details}
                                        secondary={`${formatDate(activity.timestamp)} by ${activity.user?.email || 'System'}`}
                                      />
                                    </ListItem>
                                  ))}
                                </List>
                              ) : (
                                <Typography variant="body2" color="text.secondary" textAlign="center">
                                  No recent activities to display.
                                </Typography>
                              )}
                            </CardContent>
                          </StyledCard>
                        </Grid>

      </Grid>
    </Box>
  );
};

export default AdminDashboard;

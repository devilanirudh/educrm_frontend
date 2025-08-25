import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Tabs,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Button,
  Alert,
  CircularProgress,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  IconButton,
  Tooltip
} from '@mui/material';
import {
  ExpandMore as ExpandMoreIcon,
  CalendarToday as CalendarIcon,
  TrendingUp as TrendingUpIcon,
  People as PeopleIcon,
  School as SchoolIcon,
  Visibility as VisibilityIcon,
  Download as DownloadIcon
} from '@mui/icons-material';
import { useQuery } from 'react-query';
import { attendanceService } from '../../services/attendance';
import { classesService } from '../../services/classes';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`attendance-tabpanel-${index}`}
      aria-labelledby={`attendance-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

const AdminAttendancePage: React.FC = () => {
  const [tabValue, setTabValue] = useState(0);
  const [selectedClass, setSelectedClass] = useState<number | ''>('');
  const [selectedDate, setSelectedDate] = useState<string>(
    new Date().toISOString().split('T')[0]
  );
  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState<number>(new Date().getMonth() + 1);

  // Fetch classes for dropdown
  const { data: classesData, isLoading: classesLoading } = useQuery(
    'classes',
    () => classesService.getClasses(),
    {
      staleTime: 5 * 60 * 1000, // 5 minutes
    }
  );

  // Fetch daily attendance data
  const { data: dailyData, isLoading: dailyLoading, error: dailyError } = useQuery(
    ['admin-daily-attendance', selectedClass, selectedDate],
    () => attendanceService.getAdminAttendanceByClassDaily({
      class_id: selectedClass || undefined,
      date: selectedDate
    }),
    {
      enabled: tabValue === 0,
      staleTime: 2 * 60 * 1000, // 2 minutes
    }
  );

  // Fetch monthly attendance data
  const { data: monthlyData, isLoading: monthlyLoading, error: monthlyError } = useQuery(
    ['admin-monthly-attendance', selectedClass, selectedYear, selectedMonth],
    () => attendanceService.getAdminAttendanceByClassMonthly({
      class_id: selectedClass || undefined,
      year: selectedYear,
      month: selectedMonth
    }),
    {
      enabled: tabValue === 1,
      staleTime: 5 * 60 * 1000, // 5 minutes
    }
  );

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'present': return 'success';
      case 'absent': return 'error';
      case 'late': return 'warning';
      case 'excused': return 'info';
      case 'not_marked': return 'default';
      default: return 'default';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'present': return 'Present';
      case 'absent': return 'Absent';
      case 'late': return 'Late';
      case 'excused': return 'Excused';
      case 'not_marked': return 'Not Marked';
      default: return status;
    }
  };

  const formatTime = (timeString?: string) => {
    if (!timeString) return '-';
    const date = new Date(timeString);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    });
  };

  const getMonthName = (month: number) => {
    const months = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    return months[month - 1];
  };

  if (classesLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Admin Attendance Dashboard
      </Typography>
      <Typography variant="body1" color="text.secondary" gutterBottom>
        View attendance by class for daily and monthly reports
      </Typography>

      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs value={tabValue} onChange={handleTabChange}>
              <Tab label="Daily View" icon={<CalendarIcon />} iconPosition="start" />
              <Tab label="Monthly View" icon={<TrendingUpIcon />} iconPosition="start" />
            </Tabs>
          </Box>

          {/* Filters */}
          <Box sx={{ mt: 3, mb: 2 }}>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} sm={6} md={3}>
                <FormControl fullWidth size="small">
                  <InputLabel>Class</InputLabel>
                  <Select
                    value={selectedClass}
                    label="Class"
                    onChange={(e) => setSelectedClass(e.target.value as number | '')}
                  >
                    <MenuItem value="">All Classes</MenuItem>
                    {classesData?.data?.map((cls: any) => (
                      <MenuItem key={cls.id} value={cls.id}>
                        {cls.name} {cls.section}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              {tabValue === 0 && (
                <Grid item xs={12} sm={6} md={3}>
                  <TextField
                    fullWidth
                    size="small"
                    type="date"
                    label="Date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>
              )}

              {tabValue === 1 && (
                <>
                  <Grid item xs={12} sm={6} md={2}>
                    <FormControl fullWidth size="small">
                      <InputLabel>Year</InputLabel>
                      <Select
                        value={selectedYear}
                        label="Year"
                        onChange={(e) => setSelectedYear(e.target.value as number)}
                      >
                        {Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - 2 + i).map((year) => (
                          <MenuItem key={year} value={year}>{year}</MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} sm={6} md={2}>
                    <FormControl fullWidth size="small">
                      <InputLabel>Month</InputLabel>
                      <Select
                        value={selectedMonth}
                        label="Month"
                        onChange={(e) => setSelectedMonth(e.target.value as number)}
                      >
                        {Array.from({ length: 12 }, (_, i) => i + 1).map((month) => (
                          <MenuItem key={month} value={month}>
                            {getMonthName(month)}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                </>
              )}
            </Grid>
          </Box>

          {/* Daily View Tab */}
          <TabPanel value={tabValue} index={0}>
            <>
              {dailyError && (
                <Alert severity="error" sx={{ mb: 2 }}>
                  Failed to load daily attendance data
                </Alert>
              )}

              {dailyLoading ? (
                <Box display="flex" justifyContent="center" p={3}>
                  <CircularProgress />
                </Box>
              ) : dailyData ? (
                <Box>
                  {/* Summary Cards */}
                  <Grid container spacing={2} sx={{ mb: 3 }}>
                    <Grid item xs={12} sm={6} md={3}>
                      <Card>
                        <CardContent>
                          <Typography color="textSecondary" gutterBottom>
                            Total Classes
                          </Typography>
                          <Typography variant="h4">
                            {dailyData.summary.total_classes}
                          </Typography>
                        </CardContent>
                      </Card>
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                      <Card>
                        <CardContent>
                          <Typography color="textSecondary" gutterBottom>
                            Total Students
                          </Typography>
                          <Typography variant="h4">
                            {dailyData.summary.total_students}
                          </Typography>
                        </CardContent>
                      </Card>
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                      <Card>
                        <CardContent>
                          <Typography color="textSecondary" gutterBottom>
                            Present Today
                          </Typography>
                          <Typography variant="h4" color="success.main">
                            {dailyData.summary.total_present}
                          </Typography>
                        </CardContent>
                      </Card>
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                      <Card>
                        <CardContent>
                          <Typography color="textSecondary" gutterBottom>
                            Overall Attendance
                          </Typography>
                          <Typography variant="h4" color="primary.main">
                            {dailyData.summary.overall_percentage}%
                          </Typography>
                        </CardContent>
                      </Card>
                    </Grid>
                  </Grid>

                  {/* Class Details */}
                  {dailyData.classes.map((classData: any) => (
                    <Accordion key={classData.class_id} sx={{ mb: 2 }}>
                      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                        <Box display="flex" alignItems="center" justifyContent="space-between" width="100%">
                          <Box display="flex" alignItems="center">
                            <SchoolIcon sx={{ mr: 1 }} />
                            <Typography variant="h6">
                              {classData.class_name}
                            </Typography>
                          </Box>
                          <Box display="flex" alignItems="center" gap={2}>
                            <Chip
                              label={`${classData.attendance_percentage}%`}
                              color={classData.attendance_percentage >= 90 ? 'success' : 
                                     classData.attendance_percentage >= 75 ? 'warning' : 'error'}
                              size="small"
                            />
                            <Typography variant="body2" color="text.secondary">
                              {classData.present}/{classData.total_students} present
                            </Typography>
                          </Box>
                        </Box>
                      </AccordionSummary>
                      <AccordionDetails>
                        <TableContainer component={Paper}>
                          <Table size="small">
                            <TableHead>
                              <TableRow>
                                <TableCell>Student Name</TableCell>
                                <TableCell>Roll Number</TableCell>
                                <TableCell>Status</TableCell>
                                <TableCell>Check In</TableCell>
                                <TableCell>Check Out</TableCell>
                                <TableCell>Notes</TableCell>
                              </TableRow>
                            </TableHead>
                            <TableBody>
                              {classData.students.map((student: any) => (
                                <TableRow key={student.student_id}>
                                  <TableCell>{student.student_name}</TableCell>
                                  <TableCell>{student.roll_number}</TableCell>
                                  <TableCell>
                                    <Chip
                                      label={getStatusLabel(student.status)}
                                      color={getStatusColor(student.status) as any}
                                      size="small"
                                    />
                                  </TableCell>
                                  <TableCell>{formatTime(student.check_in_time)}</TableCell>
                                  <TableCell>{formatTime(student.check_out_time)}</TableCell>
                                  <TableCell>{student.notes || '-'}</TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </TableContainer>
                      </AccordionDetails>
                    </Accordion>
                  ))}
                </Box>
              ) : null}
            </>
          </TabPanel>

          {/* Monthly View Tab */}
          <TabPanel value={tabValue} index={1}>
            <>
              {monthlyError && (
                <Alert severity="error" sx={{ mb: 2 }}>
                  Failed to load monthly attendance data
                </Alert>
              )}

              {monthlyLoading ? (
                <Box display="flex" justifyContent="center" p={3}>
                  <CircularProgress />
                </Box>
              ) : monthlyData ? (
                <Box>
                  {/* Summary Cards */}
                  <Grid container spacing={2} sx={{ mb: 3 }}>
                    <Grid item xs={12} sm={6} md={3}>
                      <Card>
                        <CardContent>
                          <Typography color="textSecondary" gutterBottom>
                            Total Classes
                          </Typography>
                          <Typography variant="h4">
                            {monthlyData.summary.total_classes}
                          </Typography>
                        </CardContent>
                      </Card>
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                      <Card>
                        <CardContent>
                          <Typography color="textSecondary" gutterBottom>
                            Total Students
                          </Typography>
                          <Typography variant="h4">
                            {monthlyData.summary.total_students}
                          </Typography>
                        </CardContent>
                      </Card>
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                      <Card>
                        <CardContent>
                          <Typography color="textSecondary" gutterBottom>
                            Total Days
                          </Typography>
                          <Typography variant="h4">
                            {monthlyData.summary.total_days}
                          </Typography>
                        </CardContent>
                      </Card>
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                      <Card>
                        <CardContent>
                          <Typography color="textSecondary" gutterBottom>
                            Monthly Average
                          </Typography>
                          <Typography variant="h4" color="primary.main">
                            {monthlyData.summary.overall_monthly_percentage}%
                          </Typography>
                        </CardContent>
                      </Card>
                    </Grid>
                  </Grid>

                  {/* Class Details */}
                  {monthlyData.classes.map((classData: any) => (
                    <Accordion key={classData.class_id} sx={{ mb: 2 }}>
                      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                        <Box display="flex" alignItems="center" justifyContent="space-between" width="100%">
                          <Box display="flex" alignItems="center">
                            <SchoolIcon sx={{ mr: 1 }} />
                            <Typography variant="h6">
                              {classData.class_name}
                            </Typography>
                          </Box>
                          <Box display="flex" alignItems="center" gap={2}>
                            <Chip
                              label={`${classData.monthly_percentage}%`}
                              color={classData.monthly_percentage >= 90 ? 'success' : 
                                     classData.monthly_percentage >= 75 ? 'warning' : 'error'}
                              size="small"
                            />
                            <Typography variant="body2" color="text.secondary">
                              {classData.total_present} present out of {classData.total_students * classData.total_days}
                            </Typography>
                          </Box>
                        </Box>
                      </AccordionSummary>
                      <AccordionDetails>
                        <TableContainer component={Paper}>
                          <Table size="small">
                            <TableHead>
                              <TableRow>
                                <TableCell>Date</TableCell>
                                <TableCell>Day</TableCell>
                                <TableCell>Present</TableCell>
                                <TableCell>Absent</TableCell>
                                <TableCell>Late</TableCell>
                                <TableCell>Total</TableCell>
                                <TableCell>Percentage</TableCell>
                              </TableRow>
                            </TableHead>
                            <TableBody>
                              {classData.daily_breakdown.map((day: any, index: number) => (
                                <TableRow key={index}>
                                  <TableCell>{formatDate(day.date)}</TableCell>
                                  <TableCell>{day.day_name}</TableCell>
                                  <TableCell>
                                    <Chip label={day.present} color="success" size="small" />
                                  </TableCell>
                                  <TableCell>
                                    <Chip label={day.absent} color="error" size="small" />
                                  </TableCell>
                                  <TableCell>
                                    <Chip label={day.late} color="warning" size="small" />
                                  </TableCell>
                                  <TableCell>{day.total}</TableCell>
                                  <TableCell>
                                    <Chip
                                      label={`${day.percentage}%`}
                                      color={day.percentage >= 90 ? 'success' : 
                                             day.percentage >= 75 ? 'warning' : 'error'}
                                      size="small"
                                    />
                                  </TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </TableContainer>
                      </AccordionDetails>
                    </Accordion>
                  ))}
                </Box>
              ) : null}
            </>
          </TabPanel>
        </CardContent>
      </Card>
    </Box>
  );
};

export default AdminAttendancePage;

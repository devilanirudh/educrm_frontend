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
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Tabs,
  Tab
} from '@mui/material';
import {
  CheckCircle,
  Cancel,
  Schedule,
  Info,
  Refresh
} from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { format, isToday, isYesterday, startOfWeek, endOfWeek, eachDayOfInterval } from 'date-fns';
import api from '../../services/api';

interface AttendanceRecord {
  id: number;
  student_id: number;
  student_name: string;
  class_id: number;
  class_name: string;
  date: string;
  status: string;
  check_in_time?: string;
  check_out_time?: string;
  reason?: string;
  notes?: string;
}

interface AttendanceReport {
  report_summary: {
    total_records: number;
    present_count: number;
    absent_count: number;
    late_count: number;
    excused_count: number;
    overall_attendance_percentage: number;
    date_range: {
      start_date: string;
      end_date: string;
    };
  };
  student_statistics?: Array<{
    student_id: number;
    student_name: string;
    class_name: string;
    total_days: number;
    present_days: number;
    absent_days: number;
    late_days: number;
    excused_days: number;
    attendance_percentage: number;
    details?: AttendanceRecord[];
  }>;
  detailed_records?: AttendanceRecord[];
}

interface Subject {
  id: number;
  name: string;
  teacher: string;
  schedule: string;
}

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

const StudentAttendancePage: React.FC = () => {
  const user = useSelector((state: RootState) => state.auth.user);
  const [tabValue, setTabValue] = useState(0);
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  const [selectedSubject, setSelectedSubject] = useState<number | null>(null);
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>([]);
  const [attendanceReport, setAttendanceReport] = useState<AttendanceReport | null>(null);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);


  // Fetch student's subjects
  const fetchSubjects = useCallback(async () => {
    try {
      setLoading(true);
      // Get the current user's student profile
      const studentResponse = await api.get('/students/me/profile');
      const student = studentResponse.data;

      if (student) {
        const response = await api.get(`/students/${student.id}/subjects`);
        setSubjects(response.data.subjects || []);
      } else {
        setError('Student profile not found');
      }
    } catch (error) {
      console.error('Error fetching subjects:', error);
      setError('Failed to fetch subjects');
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch attendance records
  const fetchAttendanceRecords = useCallback(async () => {
    try {
      setLoading(true);
      
      // Get the current user's student profile
      const studentResponse = await api.get('/students/me/profile');
      const student = studentResponse.data;

      if (!student) {
        setError('Student profile not found');
        return;
      }

      const params: any = {
        student_id: student.id, // Use student ID, not user ID
        include_details: true
      };

      if (selectedDate) {
        if (tabValue === 1) { // Weekly view
          const start = startOfWeek(selectedDate, { weekStartsOn: 1 });
          const end = endOfWeek(selectedDate, { weekStartsOn: 1 });
          params.start_date = format(start, 'yyyy-MM-dd');
          params.end_date = format(end, 'yyyy-MM-dd');
        } else { // Daily view
          params.start_date = format(selectedDate, 'yyyy-MM-dd');
          params.end_date = format(selectedDate, 'yyyy-MM-dd');
        }
      }

      if (selectedSubject) {
        params.subject_id = selectedSubject;
      }

      const response = await api.get('/attendance/reports', { params });
      setAttendanceReport(response.data);
      setAttendanceRecords(response.data.detailed_records || []);
    } catch (error) {
      console.error('Error fetching attendance records:', error);
      setError('Failed to fetch attendance records');
    } finally {
      setLoading(false);
    }
  }, [selectedDate, selectedSubject, tabValue]);



  // Get status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'present': return 'success';
      case 'absent': return 'error';
      case 'late': return 'warning';
      case 'excused': return 'info';
      default: return 'default';
    }
  };

  // Get status icon
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'present': return <CheckCircle />;
      case 'absent': return <Cancel />;
      case 'late': return <Schedule />;
      default: return <Info />;
    }
  };

  // Calculate attendance statistics
  const getAttendanceStats = () => {
    if (attendanceReport?.report_summary) {
      return {
        total: attendanceReport.report_summary.total_records,
        present: attendanceReport.report_summary.present_count,
        absent: attendanceReport.report_summary.absent_count,
        late: attendanceReport.report_summary.late_count,
        percentage: Math.round(attendanceReport.report_summary.overall_attendance_percentage)
      };
    }
    
    // Fallback to calculated stats from records
    const total = attendanceRecords.length;
    const present = attendanceRecords.filter(r => r.status === 'present').length;
    const absent = attendanceRecords.filter(r => r.status === 'absent').length;
    const late = attendanceRecords.filter(r => r.status === 'late').length;
    const percentage = total > 0 ? Math.round((present / total) * 100) : 0;

    return { total, present, absent, late, percentage };
  };

  // Get week dates for weekly view
  const getWeekDates = () => {
    if (!selectedDate) return [];
    const start = startOfWeek(selectedDate, { weekStartsOn: 1 }); // Monday
    const end = endOfWeek(selectedDate, { weekStartsOn: 1 });
    return eachDayOfInterval({ start, end });
  };

  useEffect(() => {
    fetchSubjects();
  }, [fetchSubjects]);

  useEffect(() => {
    fetchAttendanceRecords();
  }, [fetchAttendanceRecords]);

  const stats = getAttendanceStats();

  if (loading && attendanceRecords.length === 0) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      {/* Page Header */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" gutterBottom>
          My Attendance
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Track your attendance across all subjects
        </Typography>
      </Box>

      {/* Success/Error Messages */}
      {success && (
        <Alert severity="success" sx={{ mb: 2 }}>
          {success}
        </Alert>
      )}
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {/* Attendance Information */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Box>
              <Typography variant="h6" gutterBottom>
                Attendance Information
              </Typography>
              <Typography variant="body2" color="text.secondary">
                View your attendance records and statistics
              </Typography>
            </Box>
            <Button
              variant="outlined"
              startIcon={<Refresh />}
              onClick={fetchAttendanceRecords}
              disabled={loading}
            >
              Refresh
            </Button>
          </Box>
        </CardContent>
      </Card>

      {/* Attendance Statistics */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="text.secondary" gutterBottom>
                Total Classes
              </Typography>
              <Typography variant="h4">{stats.total}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="text.secondary" gutterBottom>
                Present
              </Typography>
              <Typography variant="h4" color="success.main">{stats.present}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="text.secondary" gutterBottom>
                Absent
              </Typography>
              <Typography variant="h4" color="error.main">{stats.absent}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="text.secondary" gutterBottom>
                Attendance %
              </Typography>
              <Typography variant="h4" color="primary.main">{stats.percentage}%</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Tabs for different views */}
      <Paper sx={{ width: '100%' }}>
        <Tabs value={tabValue} onChange={(e, newValue) => setTabValue(newValue)}>
          <Tab label="Daily View" />
          <Tab label="Weekly View" />
          <Tab label="Subject View" />
        </Tabs>

        <TabPanel value={tabValue} index={0}>
          {/* Daily View */}
          <Box sx={{ mb: 2 }}>
            <DatePicker
              label="Select Date"
              value={selectedDate}
              onChange={(newValue) => setSelectedDate(newValue)}
              slotProps={{ textField: { fullWidth: true } }}
            />
          </Box>

          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Date</TableCell>
                  <TableCell>Class</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Check In</TableCell>
                  <TableCell>Check Out</TableCell>
                  <TableCell>Reason</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {attendanceRecords.map((record) => (
                  <TableRow key={record.id}>
                    <TableCell>{format(new Date(record.date), 'MMM dd, yyyy')}</TableCell>
                    <TableCell>{record.class_name}</TableCell>
                    <TableCell>
                      <Chip
                        label={record.status}
                        color={getStatusColor(record.status) as any}
                        icon={getStatusIcon(record.status)}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>{record.check_in_time ? format(new Date(record.check_in_time), 'HH:mm') : '-'}</TableCell>
                    <TableCell>{record.check_out_time ? format(new Date(record.check_out_time), 'HH:mm') : '-'}</TableCell>
                    <TableCell>{record.reason || '-'}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </TabPanel>

        <TabPanel value={tabValue} index={1}>
          {/* Weekly View */}
          <Typography variant="h6" gutterBottom>
            Week of {selectedDate ? format(selectedDate, 'MMM dd, yyyy') : ''}
          </Typography>
          <Grid container spacing={2}>
            {getWeekDates().map((date) => {
              const dayRecords = attendanceRecords.filter(record => 
                format(new Date(record.date), 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd')
              );
              const dayStats = {
                total: dayRecords.length,
                present: dayRecords.filter(r => r.status === 'present').length,
                absent: dayRecords.filter(r => r.status === 'absent').length,
                late: dayRecords.filter(r => r.status === 'late').length,
                percentage: dayRecords.length > 0 ? Math.round((dayRecords.filter(r => r.status === 'present').length / dayRecords.length) * 100) : 0
              };
              
              return (
                <Grid item xs={12} sm={6} md={4} key={date.toISOString()}>
                  <Card>
                    <CardContent>
                      <Typography variant="h6" gutterBottom>
                        {format(date, 'EEEE, MMM dd')}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                        {isToday(date) ? 'Today' : isYesterday(date) ? 'Yesterday' : ''}
                      </Typography>
                      
                      {dayRecords.length > 0 ? (
                        <Box>
                          <Typography variant="body2" color="text.secondary">
                            Classes: {dayStats.total}
                          </Typography>
                          <Typography variant="body2" color="success.main">
                            Present: {dayStats.present}
                          </Typography>
                          <Typography variant="body2" color="error.main">
                            Absent: {dayStats.absent}
                          </Typography>
                          <Typography variant="body2" color="warning.main">
                            Late: {dayStats.late}
                          </Typography>
                          <Typography variant="h6" color="primary.main" sx={{ mt: 1 }}>
                            {dayStats.percentage}%
                          </Typography>
                        </Box>
                      ) : (
                        <Typography variant="body2" color="text.secondary">
                          No attendance records
                        </Typography>
                      )}
                    </CardContent>
                  </Card>
                </Grid>
              );
            })}
          </Grid>
        </TabPanel>

        <TabPanel value={tabValue} index={2}>
          {/* Subject View */}
          <Box sx={{ mb: 2 }}>
            <FormControl fullWidth>
              <InputLabel>Select Subject</InputLabel>
              <Select
                value={selectedSubject || ''}
                onChange={(e) => setSelectedSubject(e.target.value as number)}
                label="Select Subject"
              >
                <MenuItem value="">
                  <em>All Subjects</em>
                </MenuItem>
                {subjects.map((subject) => (
                  <MenuItem key={subject.id} value={subject.id}>
                    {subject.name} - {subject.teacher}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>

          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Date</TableCell>
                  <TableCell>Class</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Check In</TableCell>
                  <TableCell>Check Out</TableCell>
                  <TableCell>Reason</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {attendanceRecords.map((record) => (
                  <TableRow key={record.id}>
                    <TableCell>{format(new Date(record.date), 'MMM dd, yyyy')}</TableCell>
                    <TableCell>{record.class_name}</TableCell>
                    <TableCell>
                      <Chip
                        label={record.status}
                        color={getStatusColor(record.status) as any}
                        icon={getStatusIcon(record.status)}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>{record.check_in_time ? format(new Date(record.check_in_time), 'HH:mm') : '-'}</TableCell>
                    <TableCell>{record.check_out_time ? format(new Date(record.check_out_time), 'HH:mm') : '-'}</TableCell>
                    <TableCell>{record.reason || '-'}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </TabPanel>
      </Paper>


    </Box>
  );
};

export default StudentAttendancePage;

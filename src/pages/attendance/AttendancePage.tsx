import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Typography,
  Paper,
  Tabs,
  Tab,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Card,
  CardContent,
  Alert,
  CircularProgress,
  Switch,
  FormControlLabel,
  Divider
} from '@mui/material';
import {
  CheckCircle,
  Cancel,
  Schedule,
  Edit,
  Delete,
  Add,
  Download,
  Refresh
} from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { format, isToday, isYesterday } from 'date-fns';
import api from '../../services/api';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';

interface Student {
  id: number;
  student_id: string;
  user: {
    first_name: string;
    last_name: string;
    email: string;
  };
  current_class: {
    id: number;
    name: string;
  };
}

interface Subject {
  id: number;
  name: string;
  teacher_id: number;
  class_id: number;
  schedule: string;
  is_active: boolean;
}

interface AttendanceRecord {
  id: number;
  student_id: number;
  date: string;
  status: 'present' | 'absent' | 'late' | 'excused' | 'half_day' | 'sick_leave' | 'personal_leave' | 'emergency_leave';
  check_in_time?: string;
  check_out_time?: string;
  reason?: string;
  notes?: string;
}

interface AttendancePolicy {
  id: number;
  name: string;
  description?: string;
  class_id?: number;
  academic_year: string;
  school_start_time: string;
  school_end_time: string;
  minimum_attendance_percentage: number;
  is_active: boolean;
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

const AttendancePage: React.FC = () => {
  const user = useSelector((state: RootState) => state.auth.user);
  const [tabValue, setTabValue] = useState(0);
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  const [selectedClass, setSelectedClass] = useState<number | ''>('');
  const [selectedSubject, setSelectedSubject] = useState<number | ''>('');
  const [classes, setClasses] = useState<any[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>([]);
  const [policies, setPolicies] = useState<AttendancePolicy[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  
  // Dialog states
  const [policyDialogOpen, setPolicyDialogOpen] = useState(false);
  const [reportDialogOpen, setReportDialogOpen] = useState(false);
  const [bulkAttendanceDialogOpen, setBulkAttendanceDialogOpen] = useState(false);
  
  // Form states
  const [newPolicy, setNewPolicy] = useState({
    name: '',
    description: '',
    class_id: '',
    academic_year: new Date().getFullYear().toString(),
    school_start_time: '08:00',
    school_end_time: '15:00',
    minimum_attendance_percentage: 75,
    late_threshold_minutes: 15,
    notify_parents_on_absence: true,
    allow_self_check_in: false
  });

  useEffect(() => {
    fetchClasses();
    fetchPolicies();
  }, []);

  const fetchClasses = async () => {
    try {
      setLoading(true);
      const response = await api.get('/classes');
      setClasses(response.data.classes || []);
    } catch (error) {
      console.error('Error fetching classes:', error);
      setError('Failed to fetch classes');
    } finally {
      setLoading(false);
    }
  };

  const fetchStudents = useCallback(async () => {
    if (!selectedClass) return;
    
    try {
      setLoading(true);
      const response = await api.get(`/students?class_id=${selectedClass}`);
      setStudents(response.data.students || []);
    } catch (error) {
      console.error('Error fetching students:', error);
      setError('Failed to fetch students');
    } finally {
      setLoading(false);
    }
  }, [selectedClass]);

  const fetchAttendanceRecords = useCallback(async () => {
    if (!selectedClass || !selectedDate) return;
    
    try {
      setLoading(true);
      const dateStr = format(selectedDate, 'yyyy-MM-dd');
      const response = await api.get(`/attendance/reports`, {
        params: {
          class_id: selectedClass,
          start_date: dateStr,
          end_date: dateStr,
          include_details: true
        }
      });
      setAttendanceRecords(response.data.detailed_records || []);
    } catch (error) {
      console.error('Error fetching attendance records:', error);
      setError('Failed to fetch attendance records');
    } finally {
      setLoading(false);
    }
  }, [selectedClass, selectedDate]);

  useEffect(() => {
    if (selectedClass) {
      fetchStudents();
      fetchSubjects();
      fetchAttendanceRecords();
    }
  }, [selectedClass, selectedDate, fetchStudents, fetchAttendanceRecords]);

  const fetchPolicies = async () => {
    try {
      const response = await api.get('/attendance/policies');
      setPolicies(response.data.policies || []);
    } catch (error) {
      console.error('Error fetching policies:', error);
    }
  };

  const fetchSubjects = async () => {
    if (!selectedClass) return;
    
    try {
      setLoading(true);
      const response = await api.get(`/classes/${selectedClass}/subjects`);
      setSubjects(response.data.subjects || []);
    } catch (error) {
      console.error('Error fetching subjects:', error);
      setError('Failed to fetch subjects');
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleAttendanceChange = async (studentId: number, status: string) => {
    if (!selectedClass || !selectedDate) return;

    try {
      const dateStr = format(selectedDate, 'yyyy-MM-dd');
      const attendanceData = {
        student_id: studentId,
        class_id: selectedClass,
        date: dateStr,
        status: status
      };

      await api.post(`/students/${studentId}/attendance`, attendanceData);
      
      // Update local state
      setAttendanceRecords(prev => {
        const existing = prev.find(r => r.student_id === studentId);
        if (existing) {
          return prev.map(r => 
            r.student_id === studentId 
              ? { ...r, status: status as any }
              : r
          );
        } else {
          return [...prev, { ...attendanceData, id: Date.now() } as AttendanceRecord];
        }
      });

      setSuccess('Attendance updated successfully');
      setTimeout(() => setSuccess(null), 3000);
    } catch (error) {
      console.error('Error updating attendance:', error);
      setError('Failed to update attendance');
      setTimeout(() => setError(null), 3000);
    }
  };

  // const handleBulkAttendance = async (records: any[]) => {
  //   if (!selectedClass || !selectedDate) return;

  //   try {
  //     setLoading(true);
  //     const dateStr = format(selectedDate, 'yyyy-MM-dd');
  //     const bulkData = {
  //       class_id: selectedClass,
  //       date: dateStr,
  //       records: records
  //     };

  //     await api.post('/attendance/bulk', bulkData);
  //     await fetchAttendanceRecords();
  //     setBulkAttendanceDialogOpen(false);
  //     setSuccess('Bulk attendance marked successfully');
  //     setTimeout(() => setSuccess(null), 3000);
  //   } catch (error) {
  //     console.error('Error marking bulk attendance:', error);
  //     setError('Failed to mark bulk attendance');
  //     setTimeout(() => setError(null), 3000);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const handleCreatePolicy = async () => {
    try {
      setLoading(true);
      await api.post('/attendance/policies', newPolicy);
      setPolicyDialogOpen(false);
      setNewPolicy({
        name: '',
        description: '',
        class_id: '',
        academic_year: new Date().getFullYear().toString(),
        school_start_time: '08:00',
        school_end_time: '15:00',
        minimum_attendance_percentage: 75,
        late_threshold_minutes: 15,
        notify_parents_on_absence: true,
        allow_self_check_in: false
      });
      await fetchPolicies();
      setSuccess('Attendance policy created successfully');
      setTimeout(() => setSuccess(null), 3000);
    } catch (error) {
      console.error('Error creating policy:', error);
      setError('Failed to create attendance policy');
      setTimeout(() => setError(null), 3000);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'present': return 'success';
      case 'absent': return 'error';
      case 'late': return 'warning';
      case 'excused': return 'info';
      case 'half_day': return 'warning';
      default: return 'default';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'present': return <CheckCircle />;
      case 'absent': return <Cancel />;
      case 'late': return <Schedule />;
      default: return undefined;
    }
  };

  const getDateDisplay = (date: Date) => {
    if (isToday(date)) return 'Today';
    if (isYesterday(date)) return 'Yesterday';
    return format(date, 'EEEE, MMMM d, yyyy');
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Box sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom>
          Attendance Management
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

        <Paper sx={{ width: '100%' }}>
          <Tabs value={tabValue} onChange={handleTabChange} aria-label="attendance tabs">
            <Tab label="Mark Attendance" />
            <Tab label="Attendance Reports" />
            <Tab label="Policies" />
            <Tab label="Analytics" />
          </Tabs>

          <TabPanel value={tabValue} index={0}>
            <Grid container spacing={3} sx={{ mb: 3 }}>
              <Grid item xs={12} md={4}>
                <FormControl fullWidth>
                  <InputLabel>Select Class</InputLabel>
                  <Select
                    value={selectedClass}
                    onChange={(e) => setSelectedClass(e.target.value as number)}
                    label="Select Class"
                  >
                    {classes.map((cls) => (
                      <MenuItem key={cls.id} value={cls.id}>
                        {cls.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={4}>
                <FormControl fullWidth>
                  <InputLabel>Select Subject</InputLabel>
                  <Select
                    value={selectedSubject}
                    onChange={(e) => setSelectedSubject(e.target.value as number)}
                    label="Select Subject"
                    disabled={!selectedClass || subjects.length === 0}
                  >
                    <MenuItem value="">
                      <em>All Subjects</em>
                    </MenuItem>
                    {subjects.map((subject) => (
                      <MenuItem key={subject.id} value={subject.id}>
                        {subject.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={4}>
                <DatePicker
                  label="Select Date"
                  value={selectedDate}
                  onChange={(newValue) => setSelectedDate(newValue)}
                  slotProps={{ textField: { fullWidth: true } }}
                />
              </Grid>
            </Grid>

            {selectedClass && (
              <Box sx={{ mb: 2 }}>
                <Typography variant="h6" gutterBottom>
                  {getDateDisplay(selectedDate!)}
                </Typography>
                <Button
                  variant="contained"
                  startIcon={<Add />}
                  onClick={() => setBulkAttendanceDialogOpen(true)}
                  sx={{ mr: 2 }}
                >
                  Bulk Mark Attendance
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<Refresh />}
                  onClick={fetchAttendanceRecords}
                >
                  Refresh
                </Button>
              </Box>
            )}

            {loading ? (
              <Box display="flex" justifyContent="center" p={3}>
                <CircularProgress />
              </Box>
            ) : selectedClass && students.length > 0 ? (
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Student</TableCell>
                      <TableCell>Roll Number</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell>Check-in Time</TableCell>
                      <TableCell>Check-out Time</TableCell>
                      <TableCell>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {students.map((student) => {
                      const attendance = attendanceRecords.find(
                        r => r.student_id === student.id
                      );
                      
                      return (
                        <TableRow key={student.id}>
                          <TableCell>
                            <Typography variant="body2">
                              {student.user.first_name} {student.user.last_name}
                            </Typography>
                            <Typography variant="caption" color="textSecondary">
                              {student.user.email}
                            </Typography>
                          </TableCell>
                          <TableCell>{student.student_id}</TableCell>
                          <TableCell>
                            {attendance ? (
                              <Chip
                                label={attendance.status}
                                color={getStatusColor(attendance.status) as any}
                                icon={getStatusIcon(attendance.status)}
                                size="small"
                              />
                            ) : (
                              <Chip label="Not Marked" color="default" size="small" />
                            )}
                          </TableCell>
                          <TableCell>
                            {attendance?.check_in_time 
                              ? format(new Date(attendance.check_in_time), 'HH:mm')
                              : '-'
                            }
                          </TableCell>
                          <TableCell>
                            {attendance?.check_out_time 
                              ? format(new Date(attendance.check_out_time), 'HH:mm')
                              : '-'
                            }
                          </TableCell>
                          <TableCell>
                            <Box sx={{ display: 'flex', gap: 1 }}>
                              <Button
                                size="small"
                                variant={attendance?.status === 'present' ? 'contained' : 'outlined'}
                                color="success"
                                onClick={() => handleAttendanceChange(student.id, 'present')}
                              >
                                Present
                              </Button>
                              <Button
                                size="small"
                                variant={attendance?.status === 'absent' ? 'contained' : 'outlined'}
                                color="error"
                                onClick={() => handleAttendanceChange(student.id, 'absent')}
                              >
                                Absent
                              </Button>
                              <Button
                                size="small"
                                variant={attendance?.status === 'late' ? 'contained' : 'outlined'}
                                color="warning"
                                onClick={() => handleAttendanceChange(student.id, 'late')}
                              >
                                Late
                              </Button>
                            </Box>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </TableContainer>
            ) : selectedClass ? (
              <Typography variant="body1" color="textSecondary" align="center" sx={{ py: 4 }}>
                No students found in this class
              </Typography>
            ) : (
              <Typography variant="body1" color="textSecondary" align="center" sx={{ py: 4 }}>
                Please select a class to mark attendance
              </Typography>
            )}
          </TabPanel>

          <TabPanel value={tabValue} index={1}>
            <Typography variant="h6" gutterBottom>
              Attendance Reports
            </Typography>
            <Button
              variant="contained"
              startIcon={<Download />}
              onClick={() => setReportDialogOpen(true)}
            >
              Generate Report
            </Button>
            {/* Report content will be implemented here */}
          </TabPanel>

          <TabPanel value={tabValue} index={2}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h6">
                Attendance Policies
              </Typography>
              <Button
                variant="contained"
                startIcon={<Add />}
                onClick={() => setPolicyDialogOpen(true)}
              >
                Create Policy
              </Button>
            </Box>

            <Grid container spacing={3}>
              {policies.map((policy) => (
                <Grid item xs={12} md={6} key={policy.id}>
                  <Card>
                    <CardContent>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <Box>
                          <Typography variant="h6" gutterBottom>
                            {policy.name}
                          </Typography>
                          <Typography variant="body2" color="textSecondary" gutterBottom>
                            {policy.description}
                          </Typography>
                          <Typography variant="body2">
                            <strong>Class:</strong> {policy.class_id ? 'Specific Class' : 'Global'}
                          </Typography>
                          <Typography variant="body2">
                            <strong>Academic Year:</strong> {policy.academic_year}
                          </Typography>
                          <Typography variant="body2">
                            <strong>School Hours:</strong> {policy.school_start_time} - {policy.school_end_time}
                          </Typography>
                          <Typography variant="body2">
                            <strong>Minimum Attendance:</strong> {policy.minimum_attendance_percentage}%
                          </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', gap: 1 }}>
                          <IconButton size="small">
                            <Edit />
                          </IconButton>
                          <IconButton size="small" color="error">
                            <Delete />
                          </IconButton>
                        </Box>
                      </Box>
                      <Chip
                        label={policy.is_active ? 'Active' : 'Inactive'}
                        color={policy.is_active ? 'success' : 'default'}
                        size="small"
                        sx={{ mt: 1 }}
                      />
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </TabPanel>

          <TabPanel value={tabValue} index={3}>
            <Typography variant="h6" gutterBottom>
              Attendance Analytics
            </Typography>
            {/* Analytics content will be implemented here */}
          </TabPanel>
        </Paper>

        {/* Create Policy Dialog */}
        <Dialog open={policyDialogOpen} onClose={() => setPolicyDialogOpen(false)} maxWidth="md" fullWidth>
          <DialogTitle>Create Attendance Policy</DialogTitle>
          <DialogContent>
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Policy Name"
                  value={newPolicy.name}
                  onChange={(e) => setNewPolicy({ ...newPolicy, name: e.target.value })}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>Class (Optional)</InputLabel>
                  <Select
                    value={newPolicy.class_id}
                    onChange={(e) => setNewPolicy({ ...newPolicy, class_id: e.target.value })}
                    label="Class (Optional)"
                  >
                    <MenuItem value="">Global Policy</MenuItem>
                    {classes.map((cls) => (
                      <MenuItem key={cls.id} value={cls.id}>
                        {cls.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  multiline
                  rows={3}
                  label="Description"
                  value={newPolicy.description}
                  onChange={(e) => setNewPolicy({ ...newPolicy, description: e.target.value })}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="School Start Time"
                  type="time"
                  value={newPolicy.school_start_time}
                  onChange={(e) => setNewPolicy({ ...newPolicy, school_start_time: e.target.value })}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="School End Time"
                  type="time"
                  value={newPolicy.school_end_time}
                  onChange={(e) => setNewPolicy({ ...newPolicy, school_end_time: e.target.value })}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Minimum Attendance Percentage"
                  type="number"
                  value={newPolicy.minimum_attendance_percentage}
                  onChange={(e) => setNewPolicy({ ...newPolicy, minimum_attendance_percentage: Number(e.target.value) })}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Late Threshold (minutes)"
                  type="number"
                  value={newPolicy.late_threshold_minutes}
                  onChange={(e) => setNewPolicy({ ...newPolicy, late_threshold_minutes: Number(e.target.value) })}
                />
              </Grid>
              <Grid item xs={12}>
                <Divider sx={{ my: 2 }} />
                <FormControlLabel
                  control={
                    <Switch
                      checked={newPolicy.notify_parents_on_absence}
                      onChange={(e) => setNewPolicy({ ...newPolicy, notify_parents_on_absence: e.target.checked })}
                    />
                  }
                  label="Notify parents on absence"
                />
              </Grid>
              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={newPolicy.allow_self_check_in}
                      onChange={(e) => setNewPolicy({ ...newPolicy, allow_self_check_in: e.target.checked })}
                    />
                  }
                  label="Allow student self check-in"
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setPolicyDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleCreatePolicy} variant="contained" disabled={loading}>
              {loading ? <CircularProgress size={20} /> : 'Create Policy'}
            </Button>
          </DialogActions>
        </Dialog>

        {/* Bulk Attendance Dialog */}
        <Dialog open={bulkAttendanceDialogOpen} onClose={() => setBulkAttendanceDialogOpen(false)} maxWidth="md" fullWidth>
          <DialogTitle>Bulk Mark Attendance</DialogTitle>
          <DialogContent>
            <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
              Mark attendance for all students at once
            </Typography>
            {/* Bulk attendance form will be implemented here */}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setBulkAttendanceDialogOpen(false)}>Cancel</Button>
            <Button variant="contained">Mark Attendance</Button>
          </DialogActions>
        </Dialog>
      </Box>
    </LocalizationProvider>
  );
};

export default AttendancePage;

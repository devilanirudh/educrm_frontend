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
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField
} from '@mui/material';
import {
  CheckCircle,
  Cancel,
  Schedule,
  Info,
  Refresh,
  Save,
  Download,
  FilterList,
  Add,
  Edit
} from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { format, isToday, isYesterday } from 'date-fns';
import api from '../../services/api';

interface Student {
  id: number;
  student_id: string;
  user: {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
  };
  roll_number?: string;
  section?: string;
}

interface AttendanceRecord {
  id: number;
  student_id: number;
  date: string;
  status: string;
  check_in_time?: string;
  check_out_time?: string;
  reason?: string;
  notes?: string;
}

interface AttendancePolicy {
  id: number;
  name: string;
  description: string;
  minimum_attendance_percentage: number;
  late_threshold_minutes: number;
  notify_parents_on_absence: boolean;
}

const TeacherAttendanceMarking: React.FC<{ classId: number }> = ({ classId }) => {
  const user = useSelector((state: RootState) => state.auth.user);
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  const [students, setStudents] = useState<Student[]>([]);
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>([]);
  const [policies, setPolicies] = useState<AttendancePolicy[]>([]);
  const [selectedPolicy, setSelectedPolicy] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [bulkDialogOpen, setBulkDialogOpen] = useState(false);
  const [bulkStatus, setBulkStatus] = useState('present');
  const [bulkReason, setBulkReason] = useState('');
  const [policyWarningDialogOpen, setPolicyWarningDialogOpen] = useState(false);
  const [pendingAttendanceChange, setPendingAttendanceChange] = useState<{studentId: number, status: string} | null>(null);


  // Fetch students for the class
  const fetchStudents = useCallback(async () => {
    if (!classId) return;

    try {
      setLoading(true);
      const response = await api.get(`/classes/${classId}/students`);
      setStudents(response.data.students || []);
    } catch (error) {
      console.error('Error fetching students:', error);
      setError('Failed to fetch students');
    } finally {
      setLoading(false);
    }
  }, [classId]);

  // Fetch attendance policies
  const fetchPolicies = useCallback(async () => {
    try {
      const response = await api.get('/attendance/policies', {
        params: { class_id: classId }
      });
      setPolicies(response.data.policies || []);
    } catch (error) {
      console.error('Error fetching policies:', error);
    }
  }, [classId]);

  // Fetch existing attendance records
  const fetchAttendanceRecords = useCallback(async () => {
    if (!classId || !selectedDate) return;

    try {
      setLoading(true);
      const dateStr = format(selectedDate, 'yyyy-MM-dd');
      const response = await api.get('/attendance/reports', {
        params: {
          class_id: classId,
          date: dateStr,
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
  }, [classId, selectedDate]);

  // Mark individual attendance
  const handleAttendanceChange = async (studentId: number, status: string) => {
    if (!classId || !selectedDate) return;

    // Check if attendance is already marked for this student
    const existingRecord = attendanceRecords.find(r => r.student_id === studentId);
    if (existingRecord) {
      // Show warning dialog for existing attendance
      setPendingAttendanceChange({ studentId, status });
      setPolicyWarningDialogOpen(true);
      return;
    }

    // Proceed with marking new attendance
    await performAttendanceChange(studentId, status);
  };

  // Perform the actual attendance change
  const performAttendanceChange = async (studentId: number, status: string) => {
    if (!selectedDate) return;
    
    try {
      const dateStr = format(selectedDate, 'yyyy-MM-dd');
      const attendanceData = {
        student_id: studentId,
        class_id: classId,
        date: dateStr,
        status: status,
        policy_id: selectedPolicy ? parseInt(selectedPolicy) : undefined
      };

      const response = await api.post(`/students/${studentId}/attendance`, attendanceData);
      
      // Update local state
      setAttendanceRecords(prev => {
        const existing = prev.find(r => r.student_id === studentId);
        if (existing) {
          return prev.map(r => 
            r.student_id === studentId 
              ? { ...r, status: status }
              : r
          );
        } else {
          return [...prev, { ...attendanceData, id: Date.now() } as AttendanceRecord];
        }
      });

      setSuccess(response.data.message || 'Attendance updated successfully');
      setTimeout(() => setSuccess(null), 3000);
    } catch (error: any) {
      console.error('Error updating attendance:', error);
      setError('Failed to update attendance');
      setTimeout(() => setError(null), 3000);
    }
  };

  // Handle confirmation from warning dialog
  const handleConfirmAttendanceChange = async () => {
    if (pendingAttendanceChange) {
      await performAttendanceChange(pendingAttendanceChange.studentId, pendingAttendanceChange.status);
      setPolicyWarningDialogOpen(false);
      setPendingAttendanceChange(null);
    }
  };

  // Mark bulk attendance
  const handleBulkAttendance = async () => {
    if (!classId || !selectedDate || !bulkStatus) return;

    try {
      const dateStr = format(selectedDate, 'yyyy-MM-dd');
      const records = students.map(student => ({
        student_id: student.id,
        status: bulkStatus,
        reason: bulkReason || undefined
      }));

      const bulkData = {
        class_id: classId,
        date: dateStr,
        policy_id: selectedPolicy ? parseInt(selectedPolicy) : undefined,
        records: records
      };

      const response = await api.post('/attendance/bulk', bulkData);
      
      // Update local state
      setAttendanceRecords(prev => {
        const newRecords = students.map(student => ({
          id: Date.now() + student.id,
          student_id: student.id,
          date: dateStr,
          status: bulkStatus,
          reason: bulkReason || undefined
        }));
        return newRecords;
      });

      setSuccess(`Bulk attendance marked: ${response.data.success_count} students`);
      setBulkDialogOpen(false);
      setTimeout(() => setSuccess(null), 3000);
    } catch (error) {
      console.error('Error marking bulk attendance:', error);
      setError('Failed to mark bulk attendance');
      setTimeout(() => setError(null), 3000);
    }
  };

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

  // Get current attendance status for a student
  const getStudentAttendanceStatus = (studentId: number) => {
    const record = attendanceRecords.find(r => r.student_id === studentId);
    return record?.status || 'not_marked';
  };

  // Calculate attendance statistics
  const getAttendanceStats = () => {
    const total = students.length;
    const present = attendanceRecords.filter(r => r.status === 'present').length;
    const absent = attendanceRecords.filter(r => r.status === 'absent').length;
    const late = attendanceRecords.filter(r => r.status === 'late').length;
    const notMarked = total - present - absent - late;
    const percentage = total > 0 ? Math.round((present / total) * 100) : 0;

    return { total, present, absent, late, notMarked, percentage };
  };

  useEffect(() => {
    fetchStudents();
    fetchPolicies();
  }, [fetchStudents, fetchPolicies]);

  useEffect(() => {
    fetchAttendanceRecords();
  }, [fetchAttendanceRecords]);

  const stats = getAttendanceStats();

  if (loading && students.length === 0) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h5" gutterBottom>
          Mark Attendance
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Mark attendance for your class students
        </Typography>
      </Box>

      {/* Alerts */}
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

      {/* Controls */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Grid container spacing={3} alignItems="center">
            <Grid item xs={12} sm={6} md={3}>
              <DatePicker
                label="Date"
                value={selectedDate}
                onChange={(newValue) => setSelectedDate(newValue)}
                slotProps={{ textField: { fullWidth: true } }}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <FormControl fullWidth>
                <InputLabel>Attendance Policy</InputLabel>
                <Select
                  value={selectedPolicy}
                  onChange={(e) => setSelectedPolicy(e.target.value)}
                  label="Attendance Policy"
                >
                  <MenuItem value="">No Policy</MenuItem>
                  {policies.map((policy) => (
                    <MenuItem key={policy.id} value={policy.id}>
                      {policy.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Button
                variant="contained"
                startIcon={<Add />}
                onClick={() => setBulkDialogOpen(true)}
                fullWidth
              >
                Bulk Mark
              </Button>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Button
                variant="outlined"
                startIcon={<Refresh />}
                onClick={fetchAttendanceRecords}
                fullWidth
              >
                Refresh
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Statistics */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={6} sm={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h4" color="success.main">
                {stats.present}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Present
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={6} sm={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h4" color="error.main">
                {stats.absent}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Absent
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={6} sm={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h4" color="warning.main">
                {stats.late}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Late
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={6} sm={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h4" color="primary.main">
                {stats.percentage}%
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Attendance
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Students Table */}
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Students ({students.length})
          </Typography>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Roll No</TableCell>
                  <TableCell>Name</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Current Status</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {students.map((student) => {
                  const currentStatus = getStudentAttendanceStatus(student.id);
                  return (
                    <TableRow key={student.id}>
                      <TableCell>{student.roll_number || '-'}</TableCell>
                      <TableCell>
                        {student.user.first_name} {student.user.last_name}
                      </TableCell>
                      <TableCell>{student.user.email}</TableCell>
                      <TableCell>
                        {currentStatus !== 'not_marked' ? (
                          <Chip
                            label={currentStatus}
                            color={getStatusColor(currentStatus) as any}
                            icon={getStatusIcon(currentStatus)}
                            size="small"
                          />
                        ) : (
                          <Chip label="Not Marked" color="default" size="small" />
                        )}
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', gap: 1 }}>
                          <Tooltip title="Mark Present">
                            <IconButton
                              size="small"
                              color="success"
                              onClick={() => handleAttendanceChange(student.id, 'present')}
                            >
                              <CheckCircle />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Mark Absent">
                            <IconButton
                              size="small"
                              color="error"
                              onClick={() => handleAttendanceChange(student.id, 'absent')}
                            >
                              <Cancel />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Mark Late">
                            <IconButton
                              size="small"
                              color="warning"
                              onClick={() => handleAttendanceChange(student.id, 'late')}
                            >
                              <Schedule />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Mark Excused">
                            <IconButton
                              size="small"
                              color="info"
                              onClick={() => handleAttendanceChange(student.id, 'excused')}
                            >
                              <Info />
                            </IconButton>
                          </Tooltip>
                        </Box>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      {/* Bulk Attendance Dialog */}
      <Dialog open={bulkDialogOpen} onClose={() => setBulkDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Mark Bulk Attendance</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select
                  value={bulkStatus}
                  onChange={(e) => setBulkStatus(e.target.value)}
                  label="Status"
                >
                  <MenuItem value="present">Present</MenuItem>
                  <MenuItem value="absent">Absent</MenuItem>
                  <MenuItem value="late">Late</MenuItem>
                  <MenuItem value="excused">Excused</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Reason (Optional)"
                value={bulkReason}
                onChange={(e) => setBulkReason(e.target.value)}
                multiline
                rows={3}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setBulkDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleBulkAttendance} variant="contained">
            Mark for All Students
          </Button>
        </DialogActions>
      </Dialog>

      {/* Policy Warning Dialog */}
      <Dialog open={policyWarningDialogOpen} onClose={() => setPolicyWarningDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ color: 'warning.main' }}>
          ⚠️ Attendance Modification Warning
        </DialogTitle>
        <DialogContent>
          <Typography variant="body1" sx={{ mb: 2 }}>
            Attendance has already been marked for this student on the selected date. 
            You are about to modify an existing attendance record.
          </Typography>
          <Typography variant="body2" color="text.secondary">
            <strong>Note:</strong> Modifying attendance records should be done carefully 
            and only when necessary to correct genuine errors.
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            Are you sure you want to proceed with this modification?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setPolicyWarningDialogOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleConfirmAttendanceChange} variant="contained" color="warning">
            Yes, Modify Attendance
          </Button>
        </DialogActions>
      </Dialog>

    </Box>
  );
};

export default TeacherAttendanceMarking;

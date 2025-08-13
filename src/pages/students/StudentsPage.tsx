import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  TextField,
  InputAdornment,
  IconButton,
  Chip,
  Avatar,
  CircularProgress,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
} from '@mui/material';
import {
  Search as SearchIcon,
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Clear as ClearIcon,
} from '@mui/icons-material';
import { studentsService, Student } from '../../services/students';

const StudentsPage: React.FC = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [formData, setFormData] = useState({
    user_data: {
      first_name: '',
      last_name: '',
      email: '',
      password: '',
      phone: '',
      date_of_birth: '',
      gender: '',
    },
    admission_number: '',
    admission_date: new Date().toISOString().split('T')[0],
    academic_year: '2024-2025',
    admission_type: 'regular',
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const loadStudents = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await studentsService.getStudents({
        page: page + 1,
        per_page: rowsPerPage,
        search: searchTerm || undefined,
      });
      
      setStudents(response.data);
      setTotal(response.total);
    } catch (err: any) {
      setError(err.message || 'Failed to load students');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStudents();
  }, [page, rowsPerPage, searchTerm]);

  const handlePageChange = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleRowsPerPageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
    setPage(0);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const handleAddStudent = () => {
    setFormData({
      user_data: {
        first_name: '',
        last_name: '',
        email: '',
        password: '',
        phone: '',
        date_of_birth: '',
        gender: '',
      },
      admission_number: '',
      admission_date: new Date().toISOString().split('T')[0],
      academic_year: '2024-2025',
      admission_type: 'regular',
    });
    setFormErrors({});
    setOpenAddDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenAddDialog(false);
    setFormData({
      user_data: {
        first_name: '',
        last_name: '',
        email: '',
        password: '',
        phone: '',
        date_of_birth: '',
        gender: '',
      },
      admission_number: '',
      admission_date: new Date().toISOString().split('T')[0],
      academic_year: '2024-2025',
      admission_type: 'regular',
    });
    setFormErrors({});
  };

  const handleSubmit = async () => {
    try {
      setFormErrors({});
      await studentsService.createStudent(formData as any);
      setOpenAddDialog(false);
      loadStudents();
      // Reset form
      setFormData({
        user_data: {
          first_name: '',
          last_name: '',
          email: '',
          password: '',
          phone: '',
          date_of_birth: '',
          gender: '',
        },
        admission_number: '',
        admission_date: new Date().toISOString().split('T')[0],
        academic_year: '2024-2025',
        admission_type: 'regular',
      });
    } catch (err: any) {
      if (err.errors) {
        setFormErrors(err.errors);
      } else {
        setError(err.message || 'Failed to create student');
      }
    }
  };

  if (loading && students.length === 0) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" gutterBottom>
          Students Management
        </Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={handleAddStudent}>
          Add Student
        </Button>
      </Box>

      <Box mb={3}>
        <TextField
          fullWidth
          placeholder="Search students..."
          value={searchTerm}
          onChange={handleSearchChange}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
            endAdornment: searchTerm && (
              <InputAdornment position="end">
                <IconButton onClick={() => setSearchTerm('')} size="small">
                  <ClearIcon />
                </IconButton>
              </InputAdornment>
            ),
          }}
          sx={{ maxWidth: 500 }}
        />
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      <Paper>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Student</TableCell>
                <TableCell>Student ID</TableCell>
                <TableCell>Class</TableCell>
                <TableCell>Admission Date</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {students.map((student) => (
                <TableRow key={student.id} hover>
                  <TableCell>
                    <Box display="flex" alignItems="center" gap={2}>
                      <Avatar src={student.user.profile_picture}>
                        {student.user.first_name[0]}{student.user.last_name[0]}
                      </Avatar>
                      <Box>
                        <Typography variant="subtitle2">
                          {student.user.first_name} {student.user.last_name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {student.user.email}
                        </Typography>
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell>{student.student_id}</TableCell>
                  <TableCell>
                    {student.current_class ? (
                      <Box>
                        <Typography variant="body2">
                          {student.current_class.name}
                          {student.section && ` - ${student.section}`}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {student.academic_year}
                        </Typography>
                      </Box>
                    ) : (
                      <Typography color="text.secondary">-</Typography>
                    )}
                  </TableCell>
                  <TableCell>{formatDate(student.admission_date)}</TableCell>
                  <TableCell>
                    <Chip
                      label={student.is_active ? 'Active' : 'Inactive'}
                      color={student.is_active ? 'success' : 'error'}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <IconButton size="small">
                      <EditIcon />
                    </IconButton>
                    <IconButton size="small">
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
              {students.length === 0 && !loading && (
                <TableRow>
                  <TableCell colSpan={6} align="center">
                    <Typography variant="body2" color="text.secondary">
                      No students found
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        
        <TablePagination
          rowsPerPageOptions={[5, 10, 25, 50]}
          component="div"
          count={total}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handlePageChange}
          onRowsPerPageChange={handleRowsPerPageChange}
        />
      </Paper>

      {/* Add Student Dialog */}
      <Dialog
        open={openAddDialog}
        onClose={handleCloseDialog}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Add New Student</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            {/* Basic Information */}
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Basic Information
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="First Name"
                value={formData.user_data.first_name}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  user_data: { ...prev.user_data, first_name: e.target.value }
                }))}
                error={!!formErrors['user_data.first_name']}
                helperText={formErrors['user_data.first_name']}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Last Name"
                value={formData.user_data.last_name}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  user_data: { ...prev.user_data, last_name: e.target.value }
                }))}
                error={!!formErrors['user_data.last_name']}
                helperText={formErrors['user_data.last_name']}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Email"
                type="email"
                value={formData.user_data.email}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  user_data: { ...prev.user_data, email: e.target.value }
                }))}
                error={!!formErrors['user_data.email']}
                helperText={formErrors['user_data.email']}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Password"
                type="password"
                value={formData.user_data.password}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  user_data: { ...prev.user_data, password: e.target.value }
                }))}
                error={!!formErrors['user_data.password']}
                helperText={formErrors['user_data.password']}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Phone"
                value={formData.user_data.phone}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  user_data: { ...prev.user_data, phone: e.target.value }
                }))}
                error={!!formErrors['user_data.phone']}
                helperText={formErrors['user_data.phone']}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Date of Birth"
                type="date"
                value={formData.user_data.date_of_birth}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  user_data: { ...prev.user_data, date_of_birth: e.target.value }
                }))}
                InputLabelProps={{ shrink: true }}
                error={!!formErrors['user_data.date_of_birth']}
                helperText={formErrors['user_data.date_of_birth']}
              />
            </Grid>

            {/* Academic Information */}
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
                Academic Information
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Admission Number"
                value={formData.admission_number}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  admission_number: e.target.value
                }))}
                error={!!formErrors.admission_number}
                helperText={formErrors.admission_number}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Admission Date"
                type="date"
                value={formData.admission_date}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  admission_date: e.target.value
                }))}
                InputLabelProps={{ shrink: true }}
                error={!!formErrors.admission_date}
                helperText={formErrors.admission_date}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Academic Year"
                value={formData.academic_year}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  academic_year: e.target.value
                }))}
                error={!!formErrors.academic_year}
                helperText={formErrors.academic_year}
                required
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} variant="contained">
            Create Student
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default StudentsPage;

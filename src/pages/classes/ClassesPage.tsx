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
  CircularProgress,
  Alert,
} from '@mui/material';
import {
  Search as SearchIcon,
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Clear as ClearIcon,
  Schedule as ScheduleIcon,
} from '@mui/icons-material';
import { classesService, Class } from '../../services/classes';

const ClassesPage: React.FC = () => {
  const [classes, setClasses] = useState<Class[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');

  const loadClasses = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await classesService.getClasses({
        page: page + 1,
        per_page: rowsPerPage,
        search: searchTerm || undefined,
      });
      
      setClasses(response.data);
      setTotal(response.total);
    } catch (err: any) {
      setError(err.message || 'Failed to load classes');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadClasses();
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

  if (loading && classes.length === 0) {
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
          Classes Management
        </Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={() => alert('Add Class functionality coming soon!')}>
          Add Class
        </Button>
      </Box>

      <Box mb={3}>
        <TextField
          fullWidth
          placeholder="Search classes..."
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
                <TableCell>Class Name</TableCell>
                <TableCell>Grade Level</TableCell>
                <TableCell>Academic Year</TableCell>
                <TableCell>Class Teacher</TableCell>
                <TableCell>Students</TableCell>
                <TableCell>Room</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {classes.map((classItem) => (
                <TableRow key={classItem.id} hover>
                  <TableCell>
                    <Box>
                      <Typography variant="subtitle2">
                        {classItem.name}
                        {classItem.section && ` - ${classItem.section}`}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>{classItem.grade_level}</TableCell>
                  <TableCell>{classItem.academic_year}</TableCell>
                  <TableCell>
                    {classItem.class_teacher ? (
                      <Typography variant="body2">
                        {classItem.class_teacher.user.first_name} {classItem.class_teacher.user.last_name}
                      </Typography>
                    ) : (
                      <Typography color="text.secondary">-</Typography>
                    )}
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      {classItem.students?.length || 0}
                      {classItem.capacity && ` / ${classItem.capacity}`}
                    </Typography>
                  </TableCell>
                  <TableCell>{classItem.room_number || '-'}</TableCell>
                  <TableCell>
                    <Chip
                      label={classItem.is_active ? 'Active' : 'Inactive'}
                      color={classItem.is_active ? 'success' : 'error'}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <IconButton size="small" title="View Timetable">
                      <ScheduleIcon />
                    </IconButton>
                    <IconButton size="small" title="Edit">
                      <EditIcon />
                    </IconButton>
                    <IconButton size="small" title="Delete">
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
              {classes.length === 0 && !loading && (
                <TableRow>
                  <TableCell colSpan={8} align="center">
                    <Typography variant="body2" color="text.secondary">
                      No classes found
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
    </Box>
  );
};

export default ClassesPage;

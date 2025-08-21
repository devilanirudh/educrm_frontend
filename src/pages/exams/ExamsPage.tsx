import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
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
  Tooltip,
} from '@mui/material';
import {
  Search as SearchIcon,
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Clear as ClearIcon,
  Visibility as ViewIcon,
} from '@mui/icons-material';
import { useDebounce } from '../../hooks/useDebounce';
import { examsService, Exam } from '../../services/exams';
import { useAppDispatch } from '../../store';
import { setNotification } from '../../store/uiSlice';
import DeleteConfirmationDialog from '../../components/exams/DeleteConfirmationDialog';

const statusColors: { [key: string]: 'default' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning' } = {
  Upcoming: 'info',
  Ongoing: 'primary',
  Completed: 'success',
  Cancelled: 'error',
};

const ExamsPage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [exams, setExams] = useState<Exam[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  const [isDeleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [examToDelete, setExamToDelete] = useState<Exam | null>(null);

  const loadExams = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await examsService.getExams({
        page: page + 1,
        per_page: rowsPerPage,
        search: debouncedSearchTerm || undefined,
      });
      setExams(response.data);
      setTotal(response.total);
    } catch (err: any) {
      setError(err.message || 'Failed to load exams');
    } finally {
      setLoading(false);
    }
  }, [page, rowsPerPage, debouncedSearchTerm]);

  useEffect(() => {
    loadExams();
  }, [loadExams]);

  const handlePageChange = (event: unknown, newPage: number) => setPage(newPage);
  const handleRowsPerPageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(event.target.value);

  const handleAddExam = () => {
    navigate('/form-builder');
  };

  const handleOpenDeleteDialog = (exam: Exam) => {
    setExamToDelete(exam);
    setDeleteDialogOpen(true);
  };
  const handleCloseDeleteDialog = () => {
    setExamToDelete(null);
    setDeleteDialogOpen(false);
  };

  const handleDeleteExam = async () => {
    if (!examToDelete) return;
    try {
      await examsService.deleteExam(examToDelete.id);
      dispatch(setNotification({ type: 'success', message: 'Exam deleted successfully!' }));
      handleCloseDeleteDialog();
      loadExams();
    } catch (err: any) {
      dispatch(setNotification({ type: 'error', message: err.message || 'Failed to delete exam' }));
    }
  };

  const formatDate = (dateString: string) => new Date(dateString).toLocaleDateString();

  return (
    <Box sx={{ p: 3 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4">Exams Management</Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={handleAddExam}>
          Add Exam
        </Button>
      </Box>

      <Box mb={3}>
        <TextField
          fullWidth
          placeholder="Search exams by name, class, or subject..."
          value={searchTerm}
          onChange={handleSearchChange}
          InputProps={{
            startAdornment: <InputAdornment position="start"><SearchIcon /></InputAdornment>,
            endAdornment: searchTerm && (
              <InputAdornment position="end">
                <IconButton onClick={() => setSearchTerm('')} size="small"><ClearIcon /></IconButton>
              </InputAdornment>
            ),
          }}
          sx={{ maxWidth: 500 }}
        />
      </Box>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      <Paper>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Exam Name</TableCell>
                <TableCell>Exam ID</TableCell>
                <TableCell>Class</TableCell>
                <TableCell>Subject(s)</TableCell>
                <TableCell>Exam Date</TableCell>
                <TableCell>Status</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow><TableCell colSpan={7} align="center"><CircularProgress /></TableCell></TableRow>
              ) : exams.length > 0 ? (
                exams.map((exam) => (
                  <TableRow key={exam.id} hover>
                    <TableCell>
                      <Typography variant="subtitle2">{exam.name}</Typography>
                    </TableCell>
                    <TableCell>{exam.exam_id}</TableCell>
                    <TableCell>{exam.class.name}</TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                        {exam.subjects.slice(0, 2).map((subject) => (
                          <Chip key={subject.id} label={subject.name} size="small" />
                        ))}
                        {exam.subjects.length > 2 && (
                          <Chip label={`+${exam.subjects.length - 2}`} size="small" />
                        )}
                      </Box>
                    </TableCell>
                    <TableCell>{formatDate(exam.exam_date)}</TableCell>
                    <TableCell>
                      <Chip
                        label={exam.status}
                        color={statusColors[exam.status]}
                        size="small"
                      />
                    </TableCell>
                    <TableCell align="right">
                      <Tooltip title="View"><IconButton size="small"><ViewIcon /></IconButton></Tooltip>
                      <Tooltip title="Edit"><IconButton size="small"><EditIcon /></IconButton></Tooltip>
                      <Tooltip title="Delete"><IconButton size="small" onClick={() => handleOpenDeleteDialog(exam)}><DeleteIcon /></IconButton></Tooltip>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow><TableCell colSpan={7} align="center">No exams found.</TableCell></TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={total}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handlePageChange}
          onRowsPerPageChange={handleRowsPerPageChange}
        />
      </Paper>

      {examToDelete && (
        <DeleteConfirmationDialog
          open={isDeleteDialogOpen}
          onClose={handleCloseDeleteDialog}
          onConfirm={handleDeleteExam}
          title="Delete Exam"
          message={`Are you sure you want to delete the exam "${examToDelete.name}"? This action cannot be undone.`}
        />
      )}
    </Box>
  );
};

export default ExamsPage;
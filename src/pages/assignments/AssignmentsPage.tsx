import React, { useState, useEffect, useCallback } from 'react';
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
import { assignmentsService, Assignment, AssignmentCreateRequest, AssignmentUpdateRequest } from '../../services/assignments';
import { useAppDispatch } from '../../store';
import { setNotification } from '../../store/uiSlice';
import AssignmentForm from '../../components/assignments/AssignmentForm';
import DeleteConfirmationDialog from '../../components/assignments/DeleteConfirmationDialog';

const statusColors: { [key: string]: 'default' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning' } = {
  draft: 'default',
  published: 'success',
  closed: 'error',
};

const AssignmentsPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  const [isFormOpen, setFormOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [selectedAssignment, setSelectedAssignment] = useState<Assignment | null>(null);

  const [isDeleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [assignmentToDelete, setAssignmentToDelete] = useState<Assignment | null>(null);

  const loadAssignments = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await assignmentsService.getAssignments({
        page: page + 1,
        per_page: rowsPerPage,
        search: debouncedSearchTerm || undefined,
      });
      setAssignments(response.data);
      setTotal(response.total);
    } catch (err: any) {
      setError(err.message || 'Failed to load assignments');
    } finally {
      setLoading(false);
    }
  }, [page, rowsPerPage, debouncedSearchTerm]);

  useEffect(() => {
    loadAssignments();
  }, [loadAssignments]);

  const handlePageChange = (event: unknown, newPage: number) => setPage(newPage);
  const handleRowsPerPageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(event.target.value);

  const handleOpenForm = (assignment: Assignment | null = null) => {
    setSelectedAssignment(assignment);
    setFormOpen(true);
  };
  const handleCloseForm = () => {
    setFormOpen(false);
    setSelectedAssignment(null);
  };

  const handleSaveAssignment = async (data: AssignmentCreateRequest | AssignmentUpdateRequest) => {
    setIsSaving(true);
    try {
      if (selectedAssignment) {
        await assignmentsService.updateAssignment(selectedAssignment.id, data);
        dispatch(setNotification({ type: 'success', message: 'Assignment updated successfully!' }));
      } else {
        await assignmentsService.createAssignment(data as AssignmentCreateRequest);
        dispatch(setNotification({ type: 'success', message: 'Assignment created successfully!' }));
      }
      handleCloseForm();
      loadAssignments();
    } catch (err: any) {
      dispatch(setNotification({ type: 'error', message: err.message || 'Failed to save assignment' }));
    } finally {
      setIsSaving(false);
    }
  };

  const handleOpenDeleteDialog = (assignment: Assignment) => {
    setAssignmentToDelete(assignment);
    setDeleteDialogOpen(true);
  };
  const handleCloseDeleteDialog = () => {
    setAssignmentToDelete(null);
    setDeleteDialogOpen(false);
  };

  const handleDeleteAssignment = async () => {
    if (!assignmentToDelete) return;
    try {
      await assignmentsService.deleteAssignment(assignmentToDelete.id);
      dispatch(setNotification({ type: 'success', message: 'Assignment deleted successfully!' }));
      handleCloseDeleteDialog();
      loadAssignments();
    } catch (err: any) {
      dispatch(setNotification({ type: 'error', message: err.message || 'Failed to delete assignment' }));
    }
  };

  const formatDate = (dateString: string) => new Date(dateString).toLocaleDateString();

  return (
    <Box sx={{ p: 3 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4">Assignments Management</Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={() => handleOpenForm()}>
          Add Assignment
        </Button>
      </Box>

      <Box mb={3}>
        <TextField
          fullWidth
          placeholder="Search assignments by title, class, or subject..."
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
                <TableCell>Assignment Title</TableCell>
                <TableCell>Class</TableCell>
                <TableCell>Subject</TableCell>
                <TableCell>Due Date</TableCell>
                <TableCell>Status</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow><TableCell colSpan={6} align="center"><CircularProgress /></TableCell></TableRow>
              ) : assignments.length > 0 ? (
                assignments.map((assignment) => (
                  <TableRow key={assignment.id} hover>
                    <TableCell>
                      <Typography variant="subtitle2">{assignment.title}</Typography>
                      <Typography variant="caption" color="text.secondary">ID: {assignment.id}</Typography>
                    </TableCell>
                    <TableCell>{assignment.class.name}</TableCell>
                    <TableCell>{assignment.subject.name}</TableCell>
                    <TableCell>{formatDate(assignment.due_date)}</TableCell>
                    <TableCell>
                      <Chip
                        label={assignment.status.charAt(0).toUpperCase() + assignment.status.slice(1)}
                        color={statusColors[assignment.status]}
                        size="small"
                      />
                    </TableCell>
                    <TableCell align="right">
                      <Tooltip title="View"><IconButton size="small"><ViewIcon /></IconButton></Tooltip>
                      <Tooltip title="Edit"><IconButton size="small" onClick={() => handleOpenForm(assignment)}><EditIcon /></IconButton></Tooltip>
                      <Tooltip title="Delete"><IconButton size="small" onClick={() => handleOpenDeleteDialog(assignment)}><DeleteIcon /></IconButton></Tooltip>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow><TableCell colSpan={6} align="center">No assignments found.</TableCell></TableRow>
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

      <AssignmentForm
        open={isFormOpen}
        onClose={handleCloseForm}
        onSave={handleSaveAssignment}
        initialData={selectedAssignment}
        isSaving={isSaving}
      />

      {assignmentToDelete && (
        <DeleteConfirmationDialog
          open={isDeleteDialogOpen}
          onClose={handleCloseDeleteDialog}
          onConfirm={handleDeleteAssignment}
          title="Delete Assignment"
          message={`Are you sure you want to delete the assignment "${assignmentToDelete.title}"? This action cannot be undone.`}
        />
      )}
    </Box>
  );
};

export default AssignmentsPage;
import React, { useState, useMemo } from 'react';
import {
  Box,
  Typography,
  Button,
  TextField,
  InputAdornment,
  IconButton,
  Chip,
  CircularProgress,
  Alert,
  Tooltip,
  Grid,
  TableRow,
  TableCell,
} from '@mui/material';
import {
  Search as SearchIcon,
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as ViewIcon,
  FilterList as FilterListIcon,
} from '@mui/icons-material';
import { useDebounce } from '../../hooks/useDebounce';
import { Assignment, AssignmentCreateRequest, AssignmentUpdateRequest } from '../../services/assignments';
import { useAppDispatch } from '../../store';
import { setNotification } from '../../store/uiSlice';
import AssignmentForm from '../../components/assignments/AssignmentForm';
import DeleteConfirmationDialog from '../../components/assignments/DeleteConfirmationDialog';
import { useAssignments } from '../../hooks/useAssignments';
import StyledCard from '../../components/common/StyledCard';
import StyledTable from '../../components/common/StyledTable';
import AssignmentFilterDrawer from '../../components/assignments/AssignmentFilterDrawer';

const AssignmentsPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearchTerm = useDebounce(searchTerm, 500);
  const [filters, setFilters] = useState<Record<string, any>>({});
  const [isFilterDrawerOpen, setFilterDrawerOpen] = useState(false);
  const [isFilterPinned, setFilterPinned] = useState(false);

  const [isFormOpen, setFormOpen] = useState(false);
  const [selectedAssignment, setSelectedAssignment] = useState<Assignment | null>(null);

  const [isDeleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [assignmentToDelete, setAssignmentToDelete] = useState<Assignment | null>(null);

  const { assignments, isAssignmentsLoading, createAssignment, isCreatingAssignment, updateAssignment, isUpdatingAssignment, deleteAssignment } = useAssignments({
    page,
    per_page: rowsPerPage,
    search: debouncedSearchTerm || undefined,
    ...filters,
  });

  const columns = useMemo(() => [
    { id: 'title', label: 'Assignment Title', minWidth: 250 },
    { id: 'class', label: 'Class', minWidth: 150 },
    { id: 'subject', label: 'Subject', minWidth: 150 },
    { id: 'due_date', label: 'Due Date', minWidth: 150 },
    { id: 'status', label: 'Status', minWidth: 100 },
    { id: 'actions', label: 'Actions', align: 'right' as const, minWidth: 150 },
  ], []);

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
    try {
      if (selectedAssignment) {
        await updateAssignment({ id: selectedAssignment.id, data });
        dispatch(setNotification({ type: 'success', message: 'Assignment updated successfully!' }));
      } else {
        await createAssignment(data as AssignmentCreateRequest);
        dispatch(setNotification({ type: 'success', message: 'Assignment created successfully!' }));
      }
      handleCloseForm();
    } catch (err: any) {
      dispatch(setNotification({ type: 'error', message: err.message || 'Failed to save assignment' }));
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
      await deleteAssignment(assignmentToDelete.id);
      dispatch(setNotification({ type: 'success', message: 'Assignment deleted successfully!' }));
      handleCloseDeleteDialog();
    } catch (err: any) {
      dispatch(setNotification({ type: 'error', message: err.message || 'Failed to delete assignment' }));
    }
  };

  const formatDate = (dateString: string) => new Date(dateString).toLocaleDateString();

  const renderRow = (row: Assignment) => (
    <TableRow hover role="checkbox" tabIndex={-1} key={row.id}>
      <TableCell>
        <Typography variant="subtitle2">{row.title}</Typography>
        <Typography variant="caption" color="text.secondary">ID: {row.id}</Typography>
      </TableCell>
      <TableCell>{row.class.name}</TableCell>
      <TableCell>{row.subject.name}</TableCell>
      <TableCell>{formatDate(row.due_date)}</TableCell>
      <TableCell>
        <Chip
          label={row.status}
          color={row.status === 'Published' ? "success" : "default"}
          size="small"
        />
      </TableCell>
      <TableCell align="right">
        <Tooltip title="View"><IconButton size="small"><ViewIcon /></IconButton></Tooltip>
        <Tooltip title="Edit"><IconButton size="small" onClick={() => handleOpenForm(row)}><EditIcon /></IconButton></Tooltip>
        <Tooltip title="Delete"><IconButton size="small" onClick={() => handleOpenDeleteDialog(row)}><DeleteIcon /></IconButton></Tooltip>
      </TableCell>
    </TableRow>
  );

  return (
    <Box sx={{ p: 3 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4">Assignments Management</Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={() => handleOpenForm()}>
          Add Assignment
        </Button>
      </Box>

      <StyledCard sx={{ p: 2, mb: 3 }}>
        <Grid container spacing={2} justifyContent="space-between" alignItems="center">
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              placeholder="Search..."
              value={searchTerm}
              onChange={handleSearchChange}
              InputProps={{
                startAdornment: <InputAdornment position="start"><SearchIcon /></InputAdornment>,
              }}
            />
          </Grid>
          <Grid item>
            <Button
              variant="outlined"
              startIcon={<FilterListIcon />}
              onClick={() => setFilterDrawerOpen(true)}
            >
              Filters
            </Button>
          </Grid>
        </Grid>
      </StyledCard>

      <StyledTable
        columns={columns}
        data={assignments?.data || []}
        total={assignments?.total || 0}
        page={page}
        rowsPerPage={rowsPerPage}
        onPageChange={handlePageChange}
        onRowsPerPageChange={handleRowsPerPageChange}
        renderRow={renderRow}
      />

      <AssignmentForm
        open={isFormOpen}
        onClose={handleCloseForm}
        onSave={handleSaveAssignment}
        initialData={selectedAssignment}
        isSaving={isCreatingAssignment || isUpdatingAssignment}
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

      <AssignmentFilterDrawer
        open={isFilterDrawerOpen}
        onClose={() => setFilterDrawerOpen(false)}
        onApply={setFilters}
        pinned={isFilterPinned}
      />
    </Box>
  );
};

export default AssignmentsPage;
import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
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
  Clear as ClearIcon,
  Visibility as ViewIcon,
  FilterList as FilterListIcon,
} from '@mui/icons-material';
import { useDebounce } from '../../hooks/useDebounce';
import { Exam } from '../../types/exams';
import { useAppDispatch } from '../../store';
import { setNotification } from '../../store/uiSlice';
import DeleteConfirmationDialog from '../../components/exams/DeleteConfirmationDialog';
import { useExamsList } from '../../hooks/useExams';
import StyledCard from '../../components/common/StyledCard';
import StyledTable from '../../components/common/StyledTable';
import ExamFilterDrawer from '../../components/exams/ExamFilterDrawer';

const statusColors: { [key: string]: 'default' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning' } = {
  Upcoming: 'info',
  Ongoing: 'primary',
  Completed: 'success',
  Cancelled: 'error',
};

const ExamsPage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearchTerm = useDebounce(searchTerm, 500);
  const [filters, setFilters] = useState<Record<string, any>>({});
  const [isFilterDrawerOpen, setFilterDrawerOpen] = useState(false);
  const [isFilterPinned, setFilterPinned] = useState(false);

  const [isDeleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [examToDelete, setExamToDelete] = useState<Exam | null>(null);

  const { exams, isExamsLoading, deleteExam } = useExamsList({
    page: page + 1,
    per_page: rowsPerPage,
    search: debouncedSearchTerm || undefined,
    ...filters,
  });

  const columns = useMemo(() => [
    { id: 'name', label: 'Exam Name', minWidth: 250 },
    { id: 'exam_id', label: 'Exam ID', minWidth: 150 },
    { id: 'class', label: 'Class', minWidth: 150 },
    { id: 'subjects', label: 'Subject(s)', minWidth: 200 },
    { id: 'exam_date', label: 'Exam Date', minWidth: 150 },
    { id: 'status', label: 'Status', minWidth: 100 },
    { id: 'actions', label: 'Actions', align: 'right' as const, minWidth: 150 },
  ], []);

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
      await deleteExam(parseInt(examToDelete.id, 10));
      dispatch(setNotification({ type: 'success', message: 'Exam deleted successfully!' }));
      handleCloseDeleteDialog();
    } catch (err: any) {
      dispatch(setNotification({ type: 'error', message: err.message || 'Failed to delete exam' }));
    }
  };

  const formatDate = (dateString: string) => new Date(dateString).toLocaleDateString();

  const renderRow = (row: Exam) => (
    <TableRow hover role="checkbox" tabIndex={-1} key={row.id}>
      <TableCell>
        <Typography variant="subtitle2">{row.name}</Typography>
      </TableCell>
      <TableCell>{row.exam_id}</TableCell>
      <TableCell>{row.class.name}</TableCell>
      <TableCell>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
          {row.subjects.slice(0, 2).map((subject) => (
            <Chip key={subject.id} label={subject.name} size="small" />
          ))}
          {row.subjects.length > 2 && (
            <Chip label={`+${row.subjects.length - 2}`} size="small" />
          )}
        </Box>
      </TableCell>
      <TableCell>{formatDate(row.exam_date)}</TableCell>
      <TableCell>
        <Chip
          label={row.status}
          color={statusColors[row.status]}
          size="small"
        />
      </TableCell>
      <TableCell align="right">
        <Tooltip title="View"><IconButton size="small"><ViewIcon /></IconButton></Tooltip>
        <Tooltip title="Edit"><IconButton size="small"><EditIcon /></IconButton></Tooltip>
        <Tooltip title="Delete"><IconButton size="small" onClick={() => handleOpenDeleteDialog(row)}><DeleteIcon /></IconButton></Tooltip>
      </TableCell>
    </TableRow>
  );

  return (
    <Box sx={{ p: 3 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4">Exams Management</Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={handleAddExam}>
          Add Exam
        </Button>
      </Box>

      <StyledCard sx={{ p: 2, mb: 3 }}>
        <Grid container spacing={2} justifyContent="space-between" alignItems="center">
          <Grid item xs={12} md={6}>
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
        data={exams?.data || []}
        total={exams?.total || 0}
        page={page}
        rowsPerPage={rowsPerPage}
        onPageChange={handlePageChange}
        onRowsPerPageChange={handleRowsPerPageChange}
        renderRow={renderRow}
      />

      {examToDelete && (
        <DeleteConfirmationDialog
          open={isDeleteDialogOpen}
          onClose={handleCloseDeleteDialog}
          onConfirm={handleDeleteExam}
          title="Delete Exam"
          message={`Are you sure you want to delete the exam "${examToDelete.name}"? This action cannot be undone.`}
        />
      )}

      <ExamFilterDrawer
        open={isFilterDrawerOpen}
        onClose={() => setFilterDrawerOpen(false)}
        onApply={setFilters}
        pinned={isFilterPinned}
      />
    </Box>
  );
};

export default ExamsPage;
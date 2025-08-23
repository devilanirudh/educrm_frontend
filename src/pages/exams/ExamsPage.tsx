import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQueryClient } from 'react-query';
import {
  Box,
  Typography,
  Button,
  TextField,
  InputAdornment,
  IconButton,
  Chip,
  Avatar,
  CircularProgress,
  Alert,
  Menu,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Grid,
  TableRow,
  TableCell,
  Card,
  CardContent,
  CardActions,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
} from '@mui/material';
import {
  Search as SearchIcon,
  Add as AddIcon,
  Clear as ClearIcon,
  FilterList as FilterListIcon,
  MoreVert as MoreVertIcon,
  PushPin as PushPinIcon,
  Description as FormIcon,
  Create as CreateIcon,
  List as ListIcon,
  Edit as EditIcon,
} from '@mui/icons-material';
import { examsService, Exam } from '../../services/exams';
import ExamFilterDrawer from '../../components/exams/ExamFilterDrawer';
import FormRenderer from '../../components/form-builder/FormRenderer';
import { useExams } from '../../hooks/useExams';
import { useForm } from '../../hooks/useForm';
import StyledCard from '../../components/common/StyledCard';
import StyledTable from '../../components/common/StyledTable';

// Generic Delete Confirmation Dialog for Exams
const ExamDeleteConfirmationDialog: React.FC<{
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  examName: string;
  isLoading?: boolean;
}> = ({ open, onClose, onConfirm, examName, isLoading = false }) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle>
        Confirm Exam Deletion
      </DialogTitle>
      <DialogContent>
        <Alert severity="warning" sx={{ mb: 2 }}>
          This action will deactivate the exam. Students will no longer be able to take this exam, but existing results will be preserved.
        </Alert>
        <DialogContentText>
          Are you sure you want to delete the exam <strong>{examName}</strong>?
          This action cannot be undone.
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={onClose}
          disabled={isLoading}
          color="inherit"
        >
          Cancel
        </Button>
        <Button
          onClick={onConfirm}
          disabled={isLoading}
          color="error"
          variant="contained"
          autoFocus
        >
          {isLoading ? 'Deleting...' : 'Delete Exam'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

const ExamsPage: React.FC = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState<Record<string, any>>({});
  const [isFilterDrawerOpen, setFilterDrawerOpen] = useState(false);
  const [isFilterPinned, setFilterPinned] = useState(false);
  const [isFormOpen, setFormOpen] = useState(false);
  const [selectedExam, setSelectedExam] = useState<Exam | null>(null);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [localExams, setLocalExams] = useState<any>(null);
  const [isDeleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [examToDelete, setExamToDelete] = useState<Exam | null>(null);

  const { exams, isExamsLoading, examsError, refetchExams, createExam, updateExam, deleteExam, isDeletingExam } = useExams({
    page,
    per_page: rowsPerPage,
    search: searchTerm || undefined,
    ...filters,
  });

  const { formSchema, isFormSchemaLoading, formSchemaError, isFormSchemaError } = useForm('exam_form');

  const [tableVisibleColumns, setTableVisibleColumns] = useState<string[]>(['exam', 'exam_date', 'start_time', 'end_time', 'max_score', 'status', 'actions']);

  const visibleColumns = useMemo(() => {
    if (formSchema?.fields) {
      return formSchema.fields.filter(field => field.is_visible_in_listing);
    }
    // Default columns if form schema is not available
    return [
      { field_name: 'exam_date', label: 'Exam Date', is_visible_in_listing: true },
      { field_name: 'start_time', label: 'Start Time', is_visible_in_listing: true },
      { field_name: 'end_time', label: 'End Time', is_visible_in_listing: true },
      { field_name: 'max_score', label: 'Max Score', is_visible_in_listing: true },
    ];
  }, [formSchema]);

  // Initialize table visible columns when form schema changes (only on first load)
  React.useEffect(() => {
    if (visibleColumns.length > 0 && tableVisibleColumns.length === 0) {
      const allColumnIds = ['exam', ...visibleColumns.map(col => col.field_name), 'status', 'actions'];
      setTableVisibleColumns(allColumnIds);
    }
  }, [visibleColumns, tableVisibleColumns.length]);

  // Set local state when React Query data is available
  React.useEffect(() => {
    if (exams && !localExams) {
      setLocalExams(exams);
      console.log('Setting local exams from React Query:', exams);
    }
  }, [exams, localExams]);

  const columns = useMemo(() => [
    { id: 'exam', label: 'Exam', minWidth: 250 },
    ...visibleColumns.map(col => ({ id: col.field_name, label: col.label, minWidth: 180 })),
    { id: 'status', label: 'Status', minWidth: 120 },
    { id: 'actions', label: 'Actions', align: 'right' as const, minWidth: 120 },
  ], [visibleColumns]);

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

  const handleAddExam = () => {
    setSelectedExam(null);
    setFormOpen(true);
  };

  const handleEditExam = (exam: Exam) => {
    console.log('🔍 handleEditExam called with exam:', exam);
    const mappedData = mapExamToFormData(exam);
    console.log('🔍 Mapped data for form:', mappedData);
    setSelectedExam(exam);
    setFormOpen(true);
    handleMenuClose();
  };

  const handleFormClose = () => {
    setFormOpen(false);
    setSelectedExam(null);
  };

  const handleFormSave = async (data: any) => {
    try {
      if (selectedExam) {
        updateExam({ id: selectedExam.id, data });
        setSuccessMessage('Exam updated successfully!');
      } else {
        // Use the dynamic form endpoint for new exams
        const result = await examsService.createExamFromDynamicForm(data);
        // Invalidate the exams query to refresh the list
        queryClient.invalidateQueries('exams');
        // Also refetch the data immediately
        queryClient.refetchQueries('exams');
        // Update local state as fallback
        if (localExams) {
          setLocalExams({
            ...localExams,
            exams: [...localExams.exams, result.exam],
            total: localExams.total + 1
          });
        }
        setSuccessMessage('Exam created successfully!');
      }
      handleFormClose();
      // Clear success message after 3 seconds
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err: any) {
      setError(err.message || 'Failed to save exam');
    }
  };

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>, exam: Exam) => {
    setAnchorEl(event.currentTarget);
    setSelectedExam(exam);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedExam(null);
  };

  const handleEditForm = () => {
    // Navigate to advanced form builder
    navigate('/form-builder/advanced?type=exam');
  };

  const handleDeleteExam = (exam: Exam) => {
    setExamToDelete(exam);
    setDeleteDialogOpen(true);
    handleMenuClose();
  };

  const handleConfirmDelete = async () => {
    if (!examToDelete) return;

    try {
      setError(null);
      await deleteExam(examToDelete.id);

      // Update local state immediately for better UX
      if (localExams?.exams) {
        const updatedExams = localExams.exams.filter((e: Exam) => e.id !== examToDelete.id);
        setLocalExams({
          ...localExams,
          exams: updatedExams,
          total: localExams.total - 1
        });
      }

              setSuccessMessage(`Exam "${examToDelete.title}" has been successfully deactivated.`);
      setDeleteDialogOpen(false);
      setExamToDelete(null);

      // Clear success message after 3 seconds
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err: any) {
      setError(err.message || 'Failed to delete exam');
      setDeleteDialogOpen(false);
      setExamToDelete(null);
    }
  };

  const handleCancelDelete = () => {
    setDeleteDialogOpen(false);
    setExamToDelete(null);
  };

  // Function to map exam data to form fields
  const mapExamToFormData = (exam: Exam): Record<string, any> => {
    if (!exam || !formSchema) return {};

    const formData: Record<string, any> = {};

    // Map form fields to exam data
    formSchema.fields.forEach(field => {
      let value: any = undefined;

      // First check dynamic_data (custom form fields)
      if (exam.dynamic_data && exam.dynamic_data[field.field_name] !== undefined) {
        value = exam.dynamic_data[field.field_name];
      }
      // Then check direct exam properties
      else if ((exam as any)[field.field_name] !== undefined) {
        value = (exam as any)[field.field_name];
      }

      // Only add the value if it's not undefined
      if (value !== undefined) {
        // Format date values for HTML date input (YYYY-MM-DD)
        if (field.field_type === 'date' && value) {
          const date = new Date(value);
          if (!isNaN(date.getTime())) {
            formData[field.field_name] = date.toISOString().split('T')[0];
          } else {
            formData[field.field_name] = value;
          }
        } else {
          formData[field.field_name] = value;
        }
      }
    });

    console.log('🔍 Mapping exam to form data:', {
      exam,
      formSchema: formSchema.fields.map(f => f.field_name),
      mappedData: formData
    });

    return formData;
  };

  // Show form not found error with option to create new form
  if (isFormSchemaError && !isFormSchemaLoading) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error" sx={{ mb: 3 }}>
          <Typography variant="h6" gutterBottom>
            Exam Form Not Found
          </Typography>
          <Typography variant="body2" gutterBottom>
            The default exam form could not be loaded. This might be because:
          </Typography>
          <Box component="ul" sx={{ pl: 2, mb: 2 }}>
            <Typography component="li" variant="body2">
              The form hasn't been created yet
            </Typography>
            <Typography component="li" variant="body2">
              There's a connection issue with the server
            </Typography>
          </Box>
        </Alert>

        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Card
              sx={{
                cursor: 'pointer',
                '&:hover': {
                  boxShadow: 3,
                  backgroundColor: 'action.hover'
                }
              }}
              onClick={handleEditForm}
            >
              <CardContent>
                <Box display="flex" alignItems="center" gap={2}>
                  <EditIcon color="primary" />
                  <Box>
                    <Typography variant="h6">Edit Form Schema</Typography>
                    <Typography variant="body2" color="text.secondary">
                      Access the advanced form builder to modify the exam form
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3, height: '100vh', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" fontWeight="bold">
          Exams
        </Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            variant="outlined"
            startIcon={<EditIcon />}
            onClick={handleEditForm}
          >
            Edit Form
          </Button>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleAddExam}
            disabled={isFormSchemaLoading}
          >
            Add Exam
          </Button>
        </Box>
      </Box>

      {/* Search and Filters */}
      <Box sx={{ display: 'flex', gap: 2, mb: 3, alignItems: 'center', flexShrink: 0 }}>
        <TextField
          placeholder="Search exams..."
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
                <IconButton size="small" onClick={() => setSearchTerm('')}>
                  <ClearIcon />
                </IconButton>
              </InputAdornment>
            ),
          }}
          sx={{ minWidth: 300 }}
        />
        <IconButton
          onClick={() => setFilterDrawerOpen(true)}
          color={isFilterPinned ? 'primary' : 'default'}
        >
          <FilterListIcon />
        </IconButton>
      </Box>

      {/* Error Alert */}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {/* Success Alert */}
      {successMessage && (
        <Alert severity="success" sx={{ mb: 3 }} onClose={() => setSuccessMessage(null)}>
          {successMessage}
        </Alert>
      )}

      {/* Exams Table */}
      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0 }}>
        {isExamsLoading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
            <CircularProgress />
          </Box>
        ) : (
        <>
          {(() => {
            const hasExamsData = exams?.data && exams.data.length > 0;
            const hasLocalExamsData = localExams?.exams && localExams.exams.length > 0;
            const hasAnyData = hasExamsData || hasLocalExamsData;

            console.log('Debug data check:', {
              hasExamsData,
              hasLocalExamsData,
              hasAnyData,
              examsDataLength: exams?.data?.length,
              localExamsDataLength: localExams?.exams?.length,
              examsData: exams?.data,
              localExamsData: localExams?.exams
            });

            return hasAnyData;
          })() ? (
            <StyledTable
              columns={columns}
              data={localExams?.exams || exams?.data || []}
              page={page}
              rowsPerPage={rowsPerPage}
              total={localExams?.total || exams?.total || 0}
              onPageChange={handlePageChange}
              onRowsPerPageChange={handleRowsPerPageChange}
              externalVisibleColumns={tableVisibleColumns}
              onVisibleColumnsChange={setTableVisibleColumns}
              maxHeight="100%"
              renderRow={(exam: Exam, visibleColumnIds: string[]) => (
                <TableRow key={exam.id} hover sx={{ height: '48px' }}>
                  <TableCell sx={{ height: '48px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', width: 250, minWidth: 250 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Avatar sx={{ width: 32, height: 32, bgcolor: 'warning.main' }}>
                        {exam.title?.[0] || 'E'}
                      </Avatar>
                      <Box sx={{ minWidth: 0, flex: 1 }}>
                        <Typography variant="body2" fontWeight={500} sx={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {exam.title}
                        </Typography>
                        <Typography variant="caption" color="text.secondary" sx={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {exam.max_score} marks
                        </Typography>
                      </Box>
                    </Box>
                  </TableCell>
                  {visibleColumns
                    .filter(col => visibleColumnIds.length === 0 || visibleColumnIds.includes(col.field_name))
                    .map(col => (
                      <TableCell key={col.field_name} sx={{ height: '48px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', width: 180, minWidth: 180 }}>
                        {(() => {
                          let value;
                          // First check dynamic_data
                          if (exam.dynamic_data && exam.dynamic_data[col.field_name] !== undefined) {
                            value = exam.dynamic_data[col.field_name];
                          }
                          // Then check direct exam properties
                          else if ((exam as any)[col.field_name] !== undefined) {
                            value = (exam as any)[col.field_name];
                          }
                          else {
                            value = '-';
                          }

                          // Convert to string to avoid React warnings
                          return String(value);
                        })()}
                      </TableCell>
                    ))}
                  <TableCell sx={{ height: '48px', width: 120, minWidth: 120 }}>
                    <Chip
                      label={exam.status}
                      color={
                        exam.status === 'completed' ? 'success' :
                        exam.status === 'ongoing' ? 'warning' :
                        exam.status === 'cancelled' ? 'error' : 'default'
                      }
                      size="small"
                    />
                  </TableCell>
                  <TableCell align="right" sx={{ height: '48px', width: 120, minWidth: 120 }}>
                    <IconButton
                      onClick={(e) => handleMenuClick(e, exam)}
                      size="small"
                    >
                      <MoreVertIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              )}
            />
          ) : (
            <Box sx={{ textAlign: 'center', p: 4 }}>
              <Typography variant="h6" color="text.secondary">
                No exams found
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                {exams?.data ? 'No exams match your search criteria.' : 'Start by adding your first exam.'}
              </Typography>
            </Box>
          )}
        </>
        )}
      </Box>

      {/* Filter Drawer */}
      <ExamFilterDrawer
        open={isFilterDrawerOpen}
        onClose={() => setFilterDrawerOpen(false)}
        schema={formSchema?.fields.filter(f => f.is_filterable) || []}
        onApply={setFilters}
        pinned={isFilterPinned}
      />

      {/* Exam Form Dialog */}
      <Dialog open={isFormOpen} onClose={handleFormClose} maxWidth="md" fullWidth>
        <DialogTitle>
          {selectedExam
            ? `Edit Exam - ${selectedExam.title}`
            : 'Add New Exam'
          }
        </DialogTitle>
        <DialogContent>
          {formSchema ? (
            <FormRenderer
              schema={formSchema}
              onSubmit={handleFormSave}
              initialData={selectedExam ? mapExamToFormData(selectedExam) : undefined}
              onCancel={handleFormClose}
            />
          ) : (
            <CircularProgress />
          )}
        </DialogContent>
      </Dialog>

      {/* Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={() => handleEditExam(selectedExam!)}>
          Edit
        </MenuItem>
        <MenuItem onClick={handleMenuClose}>
          View Details
        </MenuItem>
        <MenuItem onClick={() => handleDeleteExam(selectedExam!)}>
          Delete
        </MenuItem>
      </Menu>

      {/* Delete Confirmation Dialog */}
      <ExamDeleteConfirmationDialog
        open={isDeleteDialogOpen}
        onClose={handleCancelDelete}
        onConfirm={handleConfirmDelete}
        examName={examToDelete ? examToDelete.title : ''}
        isLoading={isDeletingExam}
      />
    </Box>
  );
};

export default ExamsPage;
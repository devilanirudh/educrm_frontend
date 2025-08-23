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
import { assignmentsService, Assignment } from '../../services/assignments';
import AssignmentFilterDrawer from '../../components/assignments/AssignmentFilterDrawer';
import FormRenderer from '../../components/form-builder/FormRenderer';
import { useAssignments } from '../../hooks/useAssignments';
import { useForm } from '../../hooks/useForm';
import StyledCard from '../../components/common/StyledCard';
import StyledTable from '../../components/common/StyledTable';

// Generic Delete Confirmation Dialog for Assignments
const AssignmentDeleteConfirmationDialog: React.FC<{
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  assignmentTitle: string;
  isLoading?: boolean;
}> = ({ open, onClose, onConfirm, assignmentTitle, isLoading = false }) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle>
        Confirm Assignment Deletion
      </DialogTitle>
      <DialogContent>
        <Alert severity="warning" sx={{ mb: 2 }}>
          This action will deactivate the assignment. Students will no longer be able to submit this assignment, but existing submissions will be preserved.
        </Alert>
        <DialogContentText>
          Are you sure you want to delete the assignment <strong>{assignmentTitle}</strong>?
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
          {isLoading ? 'Deleting...' : 'Delete Assignment'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

const AssignmentsPage: React.FC = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState<Record<string, any>>({});
  const [isFilterDrawerOpen, setFilterDrawerOpen] = useState(false);
  const [isFilterPinned, setFilterPinned] = useState(false);
  const [isFormOpen, setFormOpen] = useState(false);
  const [selectedAssignment, setSelectedAssignment] = useState<Assignment | null>(null);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [localAssignments, setLocalAssignments] = useState<any>(null);
  const [isDeleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [assignmentToDelete, setAssignmentToDelete] = useState<Assignment | null>(null);

  const { assignments, isAssignmentsLoading, assignmentsError, refetchAssignments, createAssignment, updateAssignment, deleteAssignment, isDeletingAssignment } = useAssignments({
    page,
    per_page: rowsPerPage,
    search: searchTerm || undefined,
    ...filters,
  });

  const { formSchema, isFormSchemaLoading, formSchemaError, isFormSchemaError } = useForm('assignment_form');

  const [tableVisibleColumns, setTableVisibleColumns] = useState<string[]>(['assignment', 'class', 'subject', 'due_date', 'max_score', 'is_published', 'status', 'actions']);

  const visibleColumns = useMemo(() => {
    if (formSchema?.fields) {
      return formSchema.fields.filter(field => field.is_visible_in_listing);
    }
    // Default columns if form schema is not available
    return [
      { field_name: 'due_date', label: 'Due Date', is_visible_in_listing: true },
      { field_name: 'max_score', label: 'Max Score', is_visible_in_listing: true },
      { field_name: 'is_published', label: 'Published', is_visible_in_listing: true },
    ];
  }, [formSchema]);

  // Initialize table visible columns when form schema changes (only on first load)
  React.useEffect(() => {
    if (visibleColumns.length > 0 && tableVisibleColumns.length === 0) {
      const allColumnIds = ['assignment', ...visibleColumns.map(col => col.field_name), 'status', 'actions'];
      setTableVisibleColumns(allColumnIds);
    }
  }, [visibleColumns, tableVisibleColumns.length]);

  // Set local state when React Query data is available
  React.useEffect(() => {
    if (assignments && !localAssignments) {
      setLocalAssignments(assignments);
      console.log('Setting local assignments from React Query:', assignments);
    }
  }, [assignments, localAssignments]);

  const columns = useMemo(() => [
    { id: 'assignment', label: 'Assignment', minWidth: 250 },
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

  const handleAddAssignment = () => {
    setSelectedAssignment(null);
    setFormOpen(true);
  };

  const handleEditAssignment = (assignment: Assignment) => {
    console.log('🔍 handleEditAssignment called with assignment:', assignment);
    const mappedData = mapAssignmentToFormData(assignment);
    console.log('🔍 Mapped data for form:', mappedData);
    setSelectedAssignment(assignment);
    setFormOpen(true);
    handleMenuClose();
  };

  const handleFormClose = () => {
    setFormOpen(false);
    setSelectedAssignment(null);
  };

  const handleFormSave = async (data: any) => {
    try {
      if (selectedAssignment) {
        updateAssignment({ id: selectedAssignment.id, data });
        setSuccessMessage('Assignment updated successfully!');
      } else {
        // Use the dynamic form endpoint for new assignments
        const result = await assignmentsService.createAssignmentFromDynamicForm(data);
        // Invalidate the assignments query to refresh the list
        queryClient.invalidateQueries('assignments');
        // Also refetch the data immediately
        queryClient.refetchQueries('assignments');
        // Update local state as fallback
        if (localAssignments) {
          setLocalAssignments({
            ...localAssignments,
            assignments: [...localAssignments.assignments, result.assignment],
            total: localAssignments.total + 1
          });
        }
        setSuccessMessage('Assignment created successfully!');
      }
      handleFormClose();
      // Clear success message after 3 seconds
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err: any) {
      setError(err.message || 'Failed to save assignment');
    }
  };

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>, assignment: Assignment) => {
    setAnchorEl(event.currentTarget);
    setSelectedAssignment(assignment);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedAssignment(null);
  };

  const handleEditForm = () => {
    // Navigate to advanced form builder
    navigate('/form-builder/advanced?type=assignment');
  };

  const handleDeleteAssignment = (assignment: Assignment) => {
    setAssignmentToDelete(assignment);
    setDeleteDialogOpen(true);
    handleMenuClose();
  };

  const handleConfirmDelete = async () => {
    if (!assignmentToDelete) return;

    try {
      setError(null);
      await deleteAssignment(assignmentToDelete.id);

      // Update local state immediately for better UX
      if (localAssignments?.assignments) {
        const updatedAssignments = localAssignments.assignments.filter((a: Assignment) => a.id !== assignmentToDelete.id);
        setLocalAssignments({
          ...localAssignments,
          assignments: updatedAssignments,
          total: localAssignments.total - 1
        });
      }

      setSuccessMessage(`Assignment "${assignmentToDelete.title}" has been successfully deactivated.`);
      setDeleteDialogOpen(false);
      setAssignmentToDelete(null);

      // Clear success message after 3 seconds
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err: any) {
      setError(err.message || 'Failed to delete assignment');
      setDeleteDialogOpen(false);
      setAssignmentToDelete(null);
    }
  };

  const handleCancelDelete = () => {
    setDeleteDialogOpen(false);
    setAssignmentToDelete(null);
  };

  // Function to map assignment data to form fields
  const mapAssignmentToFormData = (assignment: Assignment): Record<string, any> => {
    if (!assignment || !formSchema) return {};

    const formData: Record<string, any> = {};

    // Map form fields to assignment data
    formSchema.fields.forEach(field => {
      let value: any = undefined;

      // First check dynamic_data (custom form fields)
      if (assignment.dynamic_data && assignment.dynamic_data[field.field_name] !== undefined) {
        value = assignment.dynamic_data[field.field_name];
      }
      // Then check direct assignment properties
      else if ((assignment as any)[field.field_name] !== undefined) {
        value = (assignment as any)[field.field_name];
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

    console.log('🔍 Mapping assignment to form data:', {
      assignment,
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
            Assignment Form Not Found
          </Typography>
          <Typography variant="body2" gutterBottom>
            The default assignment form could not be loaded. This might be because:
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
                      Access the advanced form builder to modify the assignment form
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
          Assignments
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
            onClick={handleAddAssignment}
            disabled={isFormSchemaLoading}
          >
            Add Assignment
          </Button>
        </Box>
      </Box>

      {/* Search and Filters */}
      <Box sx={{ display: 'flex', gap: 2, mb: 3, alignItems: 'center', flexShrink: 0 }}>
        <TextField
          placeholder="Search assignments..."
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

      {/* Assignments Table */}
      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0 }}>
        {isAssignmentsLoading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
            <CircularProgress />
          </Box>
        ) : (
        <>
          {(() => {
            const hasAssignmentsData = assignments?.data && assignments.data.length > 0;
            const hasLocalAssignmentsData = localAssignments?.assignments && localAssignments.assignments.length > 0;
            const hasAnyData = hasAssignmentsData || hasLocalAssignmentsData;

            console.log('Debug data check:', {
              hasAssignmentsData,
              hasLocalAssignmentsData,
              hasAnyData,
              assignmentsDataLength: assignments?.data?.length,
              localAssignmentsDataLength: localAssignments?.assignments?.length,
              assignmentsData: assignments?.data,
              localAssignmentsData: localAssignments?.assignments
            });

            return hasAnyData;
          })() ? (
            <StyledTable
              columns={columns}
              data={localAssignments?.assignments || assignments?.data || []}
              page={page}
              rowsPerPage={rowsPerPage}
              total={localAssignments?.total || assignments?.total || 0}
              onPageChange={handlePageChange}
              onRowsPerPageChange={handleRowsPerPageChange}
              externalVisibleColumns={tableVisibleColumns}
              onVisibleColumnsChange={setTableVisibleColumns}
              maxHeight="100%"
              renderRow={(assignment: Assignment, visibleColumnIds: string[]) => (
                <TableRow key={assignment.id} hover sx={{ height: '48px' }}>
                  <TableCell sx={{ height: '48px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', width: 250, minWidth: 250 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Avatar sx={{ width: 32, height: 32, bgcolor: 'secondary.main' }}>
                        {assignment.title[0]}
                      </Avatar>
                      <Box sx={{ minWidth: 0, flex: 1 }}>
                        <Typography variant="body2" fontWeight={500} sx={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {assignment.title}
                        </Typography>
                        <Typography variant="caption" color="text.secondary" sx={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {assignment.description || 'No description'}
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
                          if (assignment.dynamic_data && assignment.dynamic_data[col.field_name] !== undefined) {
                            value = assignment.dynamic_data[col.field_name];
                          }
                          // Then check direct assignment properties
                          else if ((assignment as any)[col.field_name] !== undefined) {
                            value = (assignment as any)[col.field_name];
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
                      label={assignment.is_published ? 'Published' : 'Draft'}
                      color={assignment.is_published ? 'success' : 'warning'}
                      size="small"
                    />
                  </TableCell>
                  <TableCell align="right" sx={{ height: '48px', width: 120, minWidth: 120 }}>
                    <IconButton
                      onClick={(e) => handleMenuClick(e, assignment)}
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
                No assignments found
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                {assignments?.data ? 'No assignments match your search criteria.' : 'Start by adding your first assignment.'}
              </Typography>
            </Box>
          )}
        </>
        )}
      </Box>

      {/* Filter Drawer */}
      <AssignmentFilterDrawer
        open={isFilterDrawerOpen}
        onClose={() => setFilterDrawerOpen(false)}
        schema={formSchema?.fields.filter(f => f.is_filterable) || []}
        onApply={setFilters}
        pinned={isFilterPinned}
      />

      {/* Assignment Form Dialog */}
      <Dialog open={isFormOpen} onClose={handleFormClose} maxWidth="md" fullWidth>
        <DialogTitle>
          {selectedAssignment
            ? `Edit Assignment - ${selectedAssignment.title}`
            : 'Add New Assignment'
          }
        </DialogTitle>
        <DialogContent>
          {formSchema ? (
            <FormRenderer
              schema={formSchema}
              onSubmit={handleFormSave}
              initialData={selectedAssignment ? mapAssignmentToFormData(selectedAssignment) : undefined}
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
        <MenuItem onClick={() => handleEditAssignment(selectedAssignment!)}>
          Edit
        </MenuItem>
        <MenuItem onClick={handleMenuClose}>
          View Details
        </MenuItem>
        <MenuItem onClick={() => handleDeleteAssignment(selectedAssignment!)}>
          Delete
        </MenuItem>
      </Menu>

      {/* Delete Confirmation Dialog */}
      <AssignmentDeleteConfirmationDialog
        open={isDeleteDialogOpen}
        onClose={handleCancelDelete}
        onConfirm={handleConfirmDelete}
        assignmentTitle={assignmentToDelete ? assignmentToDelete.title : ''}
        isLoading={isDeletingAssignment}
      />
    </Box>
  );
};

export default AssignmentsPage;
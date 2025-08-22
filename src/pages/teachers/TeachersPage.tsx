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
import { teachersService, Teacher } from '../../services/teachers';
import TeacherFilterDrawer from '../../components/teachers/TeacherFilterDrawer';
import FormRenderer from '../../components/form-builder/FormRenderer';
import { useTeachers } from '../../hooks/useTeachers';
import { useForm } from '../../hooks/useForm';
import StyledCard from '../../components/common/StyledCard';
import StyledTable from '../../components/common/StyledTable';

// Generic Delete Confirmation Dialog for Teachers
const TeacherDeleteConfirmationDialog: React.FC<{
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  teacherName: string;
  isLoading?: boolean;
}> = ({ open, onClose, onConfirm, teacherName, isLoading = false }) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle>
        Confirm Teacher Deletion
      </DialogTitle>
      <DialogContent>
        <Alert severity="warning" sx={{ mb: 2 }}>
          This action will deactivate the teacher account. The teacher will no longer be able to access the system, but their data will be preserved for record-keeping purposes.
        </Alert>
        <DialogContentText>
          Are you sure you want to delete the teacher <strong>{teacherName}</strong>?
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
          {isLoading ? 'Deleting...' : 'Delete Teacher'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

const TeachersPage: React.FC = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState<Record<string, any>>({});
  const [isFilterDrawerOpen, setFilterDrawerOpen] = useState(false);
  const [isFilterPinned, setFilterPinned] = useState(false);
  const [isFormOpen, setFormOpen] = useState(false);
  const [selectedTeacher, setSelectedTeacher] = useState<Teacher | null>(null);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [localTeachers, setLocalTeachers] = useState<any>(null);
  const [isDeleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [teacherToDelete, setTeacherToDelete] = useState<Teacher | null>(null);

  const { teachers, isTeachersLoading, teachersError, refetchTeachers, createTeacher, updateTeacher, deleteTeacher, isDeletingTeacher } = useTeachers({
    page,
    per_page: rowsPerPage,
    search: searchTerm || undefined,
    ...filters,
  });

  const { formSchema, isFormSchemaLoading, formSchemaError, isFormSchemaError } = useForm('teacher_form');

  const [tableVisibleColumns, setTableVisibleColumns] = useState<string[]>(['teacher', 'employee_id', 'department', 'specialization', 'status', 'actions']);

  const visibleColumns = useMemo(() => {
    if (formSchema?.fields) {
      return formSchema.fields.filter(field => field.is_visible_in_listing);
    }
    // Default columns if form schema is not available
    return [
      { field_name: 'employee_id', label: 'Employee ID', is_visible_in_listing: true },
      { field_name: 'department', label: 'Department', is_visible_in_listing: true },
      { field_name: 'specialization', label: 'Specialization', is_visible_in_listing: true },
    ];
  }, [formSchema]);

  // Initialize table visible columns when form schema changes (only on first load)
  React.useEffect(() => {
    if (visibleColumns.length > 0 && tableVisibleColumns.length === 0) {
      const allColumnIds = ['teacher', ...visibleColumns.map(col => col.field_name), 'status', 'actions'];
      setTableVisibleColumns(allColumnIds);
    }
  }, [visibleColumns, tableVisibleColumns.length]);

  // Set local state when React Query data is available
  React.useEffect(() => {
    if (teachers && !localTeachers) {
      setLocalTeachers(teachers);
      console.log('Setting local teachers from React Query:', teachers);
    }
  }, [teachers, localTeachers]);

  const columns = useMemo(() => [
    { id: 'teacher', label: 'Teacher', minWidth: 250 },
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

  const handleAddTeacher = () => {
    setSelectedTeacher(null);
    setFormOpen(true);
  };

  const handleEditTeacher = (teacher: Teacher) => {
    console.log('🔍 handleEditTeacher called with teacher:', teacher);
    const mappedData = mapTeacherToFormData(teacher);
    console.log('🔍 Mapped data for form:', mappedData);
    setSelectedTeacher(teacher);
    setFormOpen(true);
    handleMenuClose();
  };

  const handleFormClose = () => {
    setFormOpen(false);
    setSelectedTeacher(null);
  };

  const handleFormSave = async (data: any) => {
    try {
      if (selectedTeacher) {
        updateTeacher({ id: selectedTeacher.id, data });
        setSuccessMessage('Teacher updated successfully!');
      } else {
        // Use the dynamic form endpoint for new teachers
        const result = await teachersService.createTeacherFromDynamicForm(data);
        // Invalidate the teachers query to refresh the list
        queryClient.invalidateQueries('teachers');
        // Also refetch the data immediately
        queryClient.refetchQueries('teachers');
        // Update local state as fallback
        if (localTeachers) {
          setLocalTeachers({
            ...localTeachers,
            teachers: [...localTeachers.teachers, result.teacher],
            total: localTeachers.total + 1
          });
        }
        setSuccessMessage('Teacher created successfully!');
      }
      handleFormClose();
      // Clear success message after 3 seconds
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err: any) {
      setError(err.message || 'Failed to save teacher');
    }
  };

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>, teacher: Teacher) => {
    setAnchorEl(event.currentTarget);
    setSelectedTeacher(teacher);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedTeacher(null);
  };

  const handleEditForm = () => {
    // Navigate to advanced form builder
    navigate('/form-builder/advanced?type=teacher');
  };

  const handleDeleteTeacher = (teacher: Teacher) => {
    setTeacherToDelete(teacher);
    setDeleteDialogOpen(true);
    handleMenuClose();
  };

  const handleConfirmDelete = async () => {
    if (!teacherToDelete) return;

    try {
      setError(null);
      await deleteTeacher(teacherToDelete.id);

      // Update local state immediately for better UX
      if (localTeachers?.teachers) {
        const updatedTeachers = localTeachers.teachers.filter((t: Teacher) => t.id !== teacherToDelete.id);
        setLocalTeachers({
          ...localTeachers,
          teachers: updatedTeachers,
          total: localTeachers.total - 1
        });
      }

      setSuccessMessage(`Teacher ${teacherToDelete.user.first_name} ${teacherToDelete.user.last_name} has been successfully deactivated.`);
      setDeleteDialogOpen(false);
      setTeacherToDelete(null);

      // Clear success message after 3 seconds
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err: any) {
      setError(err.message || 'Failed to delete teacher');
      setDeleteDialogOpen(false);
      setTeacherToDelete(null);
    }
  };

  const handleCancelDelete = () => {
    setDeleteDialogOpen(false);
    setTeacherToDelete(null);
  };

  // Function to map teacher data to form fields
  const mapTeacherToFormData = (teacher: Teacher): Record<string, any> => {
    if (!teacher || !formSchema) return {};

    const formData: Record<string, any> = {};

    // Map form fields to teacher data
    formSchema.fields.forEach(field => {
      let value: any = undefined;

      // First check dynamic_data (custom form fields)
      if (teacher.dynamic_data && teacher.dynamic_data[field.field_name] !== undefined) {
        value = teacher.dynamic_data[field.field_name];
      }
      // Then check direct teacher properties
      else if ((teacher as any)[field.field_name] !== undefined) {
        value = (teacher as any)[field.field_name];
      }
      // Finally check user properties for user-related fields
      else if (teacher.user && (teacher.user as any)[field.field_name] !== undefined) {
        value = (teacher.user as any)[field.field_name];
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

    console.log('🔍 Mapping teacher to form data:', {
      teacher,
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
            Teacher Form Not Found
          </Typography>
          <Typography variant="body2" gutterBottom>
            The default teacher form could not be loaded. This might be because:
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
                      Access the advanced form builder to modify the teacher form
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
          Teachers
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
            onClick={handleAddTeacher}
            disabled={isFormSchemaLoading}
          >
            Add Teacher
          </Button>
        </Box>
      </Box>

      {/* Search and Filters */}
      <Box sx={{ display: 'flex', gap: 2, mb: 3, alignItems: 'center', flexShrink: 0 }}>
        <TextField
          placeholder="Search teachers..."
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

      {/* Teachers Table */}
      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0 }}>
        {isTeachersLoading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
            <CircularProgress />
          </Box>
        ) : (
        <>
          {(() => {
            const hasTeachersData = teachers?.data && teachers.data.length > 0;
            const hasLocalTeachersData = localTeachers?.teachers && localTeachers.teachers.length > 0;
            const hasAnyData = hasTeachersData || hasLocalTeachersData;

            console.log('Debug data check:', {
              hasTeachersData,
              hasLocalTeachersData,
              hasAnyData,
              teachersDataLength: teachers?.data?.length,
              localTeachersDataLength: localTeachers?.teachers?.length,
              teachersData: teachers?.data,
              localTeachersData: localTeachers?.teachers
            });

            return hasAnyData;
          })() ? (
            <StyledTable
              columns={columns}
              data={localTeachers?.teachers || teachers?.data || []}
              page={page}
              rowsPerPage={rowsPerPage}
              total={localTeachers?.total || teachers?.total || 0}
              onPageChange={handlePageChange}
              onRowsPerPageChange={handleRowsPerPageChange}
              externalVisibleColumns={tableVisibleColumns}
              onVisibleColumnsChange={setTableVisibleColumns}
              maxHeight="100%"
              renderRow={(teacher: Teacher, visibleColumnIds: string[]) => (
                <TableRow key={teacher.id} hover sx={{ height: '48px' }}>
                  <TableCell sx={{ height: '48px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', width: 250, minWidth: 250 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Avatar sx={{ width: 32, height: 32 }}>{teacher.user.first_name[0]}</Avatar>
                      <Box sx={{ minWidth: 0, flex: 1 }}>
                        <Typography variant="body2" fontWeight={500} sx={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {teacher.user.first_name} {teacher.user.last_name}
                        </Typography>
                        <Typography variant="caption" color="text.secondary" sx={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {teacher.user.email}
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
                          if (teacher.dynamic_data && teacher.dynamic_data[col.field_name] !== undefined) {
                            value = teacher.dynamic_data[col.field_name];
                          }
                          // Then check direct teacher properties
                          else if ((teacher as any)[col.field_name] !== undefined) {
                            value = (teacher as any)[col.field_name];
                          }
                          // Finally check user properties for user-related fields
                          else if (teacher.user && (teacher.user as any)[col.field_name] !== undefined) {
                            value = (teacher.user as any)[col.field_name];
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
                      label={teacher.is_active ? 'Active' : 'Inactive'}
                      color={teacher.is_active ? 'success' : 'default'}
                      size="small"
                    />
                  </TableCell>
                  <TableCell align="right" sx={{ height: '48px', width: 120, minWidth: 120 }}>
                    <IconButton
                      onClick={(e) => handleMenuClick(e, teacher)}
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
                No teachers found
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                {teachers?.data ? 'No teachers match your search criteria.' : 'Start by adding your first teacher.'}
              </Typography>
            </Box>
          )}
        </>
        )}
      </Box>

      {/* Filter Drawer */}
      <TeacherFilterDrawer
        open={isFilterDrawerOpen}
        onClose={() => setFilterDrawerOpen(false)}
        schema={formSchema?.fields.filter(f => f.is_filterable) || []}
        onApply={setFilters}
        pinned={isFilterPinned}
      />

      {/* Teacher Form Dialog */}
      <Dialog open={isFormOpen} onClose={handleFormClose} maxWidth="md" fullWidth>
        <DialogTitle>
          {selectedTeacher
            ? `Edit Teacher - ${selectedTeacher.user.first_name} ${selectedTeacher.user.last_name}`
            : 'Add New Teacher'
          }
        </DialogTitle>
        <DialogContent>
          {formSchema ? (
            <FormRenderer
              schema={formSchema}
              onSubmit={handleFormSave}
              initialData={selectedTeacher ? mapTeacherToFormData(selectedTeacher) : undefined}
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
        <MenuItem onClick={() => handleEditTeacher(selectedTeacher!)}>
          Edit
        </MenuItem>
        <MenuItem onClick={handleMenuClose}>
          View Details
        </MenuItem>
        <MenuItem onClick={() => handleDeleteTeacher(selectedTeacher!)}>
          Delete
        </MenuItem>
      </Menu>

      {/* Delete Confirmation Dialog */}
      <TeacherDeleteConfirmationDialog
        open={isDeleteDialogOpen}
        onClose={handleCancelDelete}
        onConfirm={handleConfirmDelete}
        teacherName={teacherToDelete ? `${teacherToDelete.user.first_name} ${teacherToDelete.user.last_name}` : ''}
        isLoading={isDeletingTeacher}
      />
    </Box>
  );
};

export default TeachersPage;
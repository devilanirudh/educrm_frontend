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
import { classesService, Class } from '../../services/classes';
import ClassFilterDrawer from '../../components/classes/ClassFilterDrawer';
import FormRenderer from '../../components/form-builder/FormRenderer';
import { useClasses } from '../../hooks/useClasses';
import { useForm } from '../../hooks/useForm';
import StyledCard from '../../components/common/StyledCard';
import StyledTable from '../../components/common/StyledTable';

// Generic Delete Confirmation Dialog for Classes
const ClassDeleteConfirmationDialog: React.FC<{
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  className: string;
  isLoading?: boolean;
}> = ({ open, onClose, onConfirm, className, isLoading = false }) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle>
        Confirm Class Deletion
      </DialogTitle>
      <DialogContent>
        <Alert severity="warning" sx={{ mb: 2 }}>
          This action will deactivate the class. The class will no longer be available for new enrollments, but historical data will be preserved.
        </Alert>
        <DialogContentText>
          Are you sure you want to delete the class <strong>{className}</strong>?
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
          {isLoading ? 'Deleting...' : 'Delete Class'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

const ClassesPage: React.FC = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState<Record<string, any>>({});
  const [isFilterDrawerOpen, setFilterDrawerOpen] = useState(false);
  const [isFilterPinned, setFilterPinned] = useState(false);
  const [isFormOpen, setFormOpen] = useState(false);
  const [selectedClass, setSelectedClass] = useState<Class | null>(null);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [localClasses, setLocalClasses] = useState<any>(null);
  const [isDeleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [classToDelete, setClassToDelete] = useState<Class | null>(null);

  const { classes, isClassesLoading, classesError, refetchClasses, createClass, updateClass, deleteClass, isDeletingClass } = useClasses({
    page,
    per_page: rowsPerPage,
    search: searchTerm || undefined,
    ...filters,
  });

  const { formSchema, isFormSchemaLoading, formSchemaError, isFormSchemaError } = useForm('class_form');

  const [tableVisibleColumns, setTableVisibleColumns] = useState<string[]>(['class', 'grade_level', 'section', 'stream', 'academic_year', 'status', 'actions']);

  const visibleColumns = useMemo(() => {
    if (formSchema?.fields) {
      return formSchema.fields.filter(field => field.is_visible_in_listing);
    }
    // Default columns if form schema is not available
    return [
      { field_name: 'grade_level', label: 'Grade Level', is_visible_in_listing: true },
      { field_name: 'section', label: 'Section', is_visible_in_listing: true },
      { field_name: 'stream', label: 'Stream', is_visible_in_listing: true },
      { field_name: 'academic_year', label: 'Academic Year', is_visible_in_listing: true },
    ];
  }, [formSchema]);

  // Initialize table visible columns when form schema changes (only on first load)
  React.useEffect(() => {
    if (visibleColumns.length > 0 && tableVisibleColumns.length === 0) {
      const allColumnIds = ['class', ...visibleColumns.map(col => col.field_name), 'status', 'actions'];
      setTableVisibleColumns(allColumnIds);
    }
  }, [visibleColumns, tableVisibleColumns.length]);

  // Set local state when React Query data is available
  React.useEffect(() => {
    if (classes && !localClasses) {
      setLocalClasses(classes);
      console.log('Setting local classes from React Query:', classes);
    }
  }, [classes, localClasses]);

  const columns = useMemo(() => [
    { id: 'class', label: 'Class', minWidth: 250 },
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

  const handleAddClass = () => {
    setSelectedClass(null);
    setFormOpen(true);
  };

  const handleEditClass = (classItem: Class) => {
    console.log('🔍 handleEditClass called with class:', classItem);
    const mappedData = mapClassToFormData(classItem);
    console.log('🔍 Mapped data for form:', mappedData);
    setSelectedClass(classItem);
    setFormOpen(true);
    handleMenuClose();
  };

  const handleFormClose = () => {
    setFormOpen(false);
    setSelectedClass(null);
  };

  const handleFormSave = async (data: any) => {
    try {
      if (selectedClass) {
        updateClass({ id: selectedClass.id, data });
        setSuccessMessage('Class updated successfully!');
      } else {
        // Use the dynamic form endpoint for new classes
        const result = await classesService.createClassFromDynamicForm(data);
        // Invalidate the classes query to refresh the list
        queryClient.invalidateQueries('classes');
        // Also refetch the data immediately
        queryClient.refetchQueries('classes');
        // Update local state as fallback
        if (localClasses) {
          setLocalClasses({
            ...localClasses,
            classes: [...localClasses.classes, result.class],
            total: localClasses.total + 1
          });
        }
        setSuccessMessage('Class created successfully!');
      }
      handleFormClose();
      // Clear success message after 3 seconds
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err: any) {
      setError(err.message || 'Failed to save class');
    }
  };

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>, classItem: Class) => {
    setAnchorEl(event.currentTarget);
    setSelectedClass(classItem);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedClass(null);
  };

  const handleEditForm = () => {
    // Navigate to advanced form builder
    navigate('/form-builder/advanced?type=class');
  };

  const handleDeleteClass = (classItem: Class) => {
    setClassToDelete(classItem);
    setDeleteDialogOpen(true);
    handleMenuClose();
  };

  const handleConfirmDelete = async () => {
    if (!classToDelete) return;

    try {
      setError(null);
      await deleteClass(classToDelete.id);

      // Update local state immediately for better UX
      if (localClasses?.classes) {
        const updatedClasses = localClasses.classes.filter((c: Class) => c.id !== classToDelete.id);
        setLocalClasses({
          ...localClasses,
          classes: updatedClasses,
          total: localClasses.total - 1
        });
      }

      setSuccessMessage(`Class ${classToDelete.name} has been successfully deactivated.`);
      setDeleteDialogOpen(false);
      setClassToDelete(null);

      // Clear success message after 3 seconds
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err: any) {
      setError(err.message || 'Failed to delete class');
      setDeleteDialogOpen(false);
      setClassToDelete(null);
    }
  };

  const handleCancelDelete = () => {
    setDeleteDialogOpen(false);
    setClassToDelete(null);
  };

  // Function to map class data to form fields
  const mapClassToFormData = (classItem: Class): Record<string, any> => {
    if (!classItem || !formSchema) return {};

    const formData: Record<string, any> = {};

    // Map form fields to class data
    formSchema.fields.forEach(field => {
      let value: any = undefined;

      // First check dynamic_data (custom form fields)
      if (classItem.dynamic_data && classItem.dynamic_data[field.field_name] !== undefined) {
        value = classItem.dynamic_data[field.field_name];
      }
      // Then check direct class properties
      else if ((classItem as any)[field.field_name] !== undefined) {
        value = (classItem as any)[field.field_name];
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

    console.log('🔍 Mapping class to form data:', {
      class: classItem,
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
            Class Form Not Found
          </Typography>
          <Typography variant="body2" gutterBottom>
            The default class form could not be loaded. This might be because:
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
                      Access the advanced form builder to modify the class form
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
          Classes
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
            onClick={handleAddClass}
            disabled={isFormSchemaLoading}
          >
            Add Class
          </Button>
        </Box>
      </Box>

      {/* Search and Filters */}
      <Box sx={{ display: 'flex', gap: 2, mb: 3, alignItems: 'center', flexShrink: 0 }}>
        <TextField
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

      {/* Classes Table */}
      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0 }}>
        {isClassesLoading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
            <CircularProgress />
          </Box>
        ) : (
        <>
          {(() => {
            const hasClassesData = classes?.data && classes.data.length > 0;
            const hasLocalClassesData = localClasses?.classes && localClasses.classes.length > 0;
            const hasAnyData = hasClassesData || hasLocalClassesData;

            console.log('Debug data check:', {
              hasClassesData,
              hasLocalClassesData,
              hasAnyData,
              classesDataLength: classes?.data?.length,
              localClassesDataLength: localClasses?.classes?.length,
              classesData: classes?.data,
              localClassesData: localClasses?.classes
            });

            return hasAnyData;
          })() ? (
            <StyledTable
              columns={columns}
              data={localClasses?.classes || classes?.data || []}
              page={page}
              rowsPerPage={rowsPerPage}
              total={localClasses?.total || classes?.total || 0}
              onPageChange={handlePageChange}
              onRowsPerPageChange={handleRowsPerPageChange}
              externalVisibleColumns={tableVisibleColumns}
              onVisibleColumnsChange={setTableVisibleColumns}
              maxHeight="100%"
              renderRow={(classItem: Class, visibleColumnIds: string[]) => (
                <TableRow key={classItem.id} hover sx={{ height: '48px' }}>
                  <TableCell sx={{ height: '48px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', width: 250, minWidth: 250 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Avatar sx={{ width: 32, height: 32, bgcolor: 'primary.main' }}>
                        {classItem.name[0]}
                      </Avatar>
                      <Box sx={{ minWidth: 0, flex: 1 }}>
                        <Typography variant="body2" fontWeight={500} sx={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {classItem.name}
                        </Typography>
                        <Typography variant="caption" color="text.secondary" sx={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          Grade {classItem.grade_level} - {classItem.section}
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
                          if (classItem.dynamic_data && classItem.dynamic_data[col.field_name] !== undefined) {
                            value = classItem.dynamic_data[col.field_name];
                          }
                          // Then check direct class properties
                          else if ((classItem as any)[col.field_name] !== undefined) {
                            value = (classItem as any)[col.field_name];
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
                      label={classItem.is_active ? 'Active' : 'Inactive'}
                      color={classItem.is_active ? 'success' : 'default'}
                      size="small"
                    />
                  </TableCell>
                  <TableCell align="right" sx={{ height: '48px', width: 120, minWidth: 120 }}>
                    <IconButton
                      onClick={(e) => handleMenuClick(e, classItem)}
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
                No classes found
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                {classes?.data ? 'No classes match your search criteria.' : 'Start by adding your first class.'}
              </Typography>
            </Box>
          )}
        </>
        )}
      </Box>

      {/* Filter Drawer */}
      <ClassFilterDrawer
        open={isFilterDrawerOpen}
        onClose={() => setFilterDrawerOpen(false)}
        schema={formSchema?.fields.filter(f => f.is_filterable) || []}
        onApply={setFilters}
        pinned={isFilterPinned}
      />

      {/* Class Form Dialog */}
      <Dialog open={isFormOpen} onClose={handleFormClose} maxWidth="md" fullWidth>
        <DialogTitle>
          {selectedClass
            ? `Edit Class - ${selectedClass.name}`
            : 'Add New Class'
          }
        </DialogTitle>
        <DialogContent>
          {formSchema ? (
            <FormRenderer
              schema={formSchema}
              onSubmit={handleFormSave}
              initialData={selectedClass ? mapClassToFormData(selectedClass) : undefined}
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
        <MenuItem onClick={() => handleEditClass(selectedClass!)}>
          Edit
        </MenuItem>
        <MenuItem onClick={handleMenuClose}>
          View Details
        </MenuItem>
        <MenuItem onClick={() => handleDeleteClass(selectedClass!)}>
          Delete
        </MenuItem>
      </Menu>

      {/* Delete Confirmation Dialog */}
      <ClassDeleteConfirmationDialog
        open={isDeleteDialogOpen}
        onClose={handleCancelDelete}
        onConfirm={handleConfirmDelete}
        className={classToDelete ? classToDelete.name : ''}
        isLoading={isDeletingClass}
      />
    </Box>
  );
};

export default ClassesPage;
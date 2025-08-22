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
import { studentsService, Student } from '../../services/students';
import StudentFilterDrawer from '../../components/students/StudentFilterDrawer';
import DeleteConfirmationDialog from '../../components/students/DeleteConfirmationDialog';
import FormRenderer from '../../components/form-builder/FormRenderer';
import { useStudents } from '../../hooks/useStudents';
import { useForm } from '../../hooks/useForm';
import StyledCard from '../../components/common/StyledCard';
import StyledTable from '../../components/common/StyledTable';

const StudentsPage: React.FC = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState<Record<string, any>>({});
  const [isFilterDrawerOpen, setFilterDrawerOpen] = useState(false);
  const [isFilterPinned, setFilterPinned] = useState(false);
  const [isFormOpen, setFormOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [localStudents, setLocalStudents] = useState<any>(null);
  const [isDeleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [studentToDelete, setStudentToDelete] = useState<Student | null>(null);

  const { students, isStudentsLoading, studentsError, refetchStudents, createStudent, updateStudent, deleteStudent, isDeletingStudent } = useStudents({
    page,
    per_page: rowsPerPage,
    search: searchTerm || undefined,
    ...filters,
  });

  const { formSchema, isFormSchemaLoading, formSchemaError, isFormSchemaError } = useForm('student_form');

  const [tableVisibleColumns, setTableVisibleColumns] = useState<string[]>(['student', 'student_id', 'academic_year', 'roll_number', 'section', 'status', 'actions']);

  const visibleColumns = useMemo(() => {
    if (formSchema?.fields) {
      return formSchema.fields.filter(field => field.is_visible_in_listing);
    }
    // Default columns if form schema is not available
    return [
      { field_name: 'student_id', label: 'Student ID', is_visible_in_listing: true },
      { field_name: 'academic_year', label: 'Academic Year', is_visible_in_listing: true },
      { field_name: 'roll_number', label: 'Roll Number', is_visible_in_listing: true },
      { field_name: 'section', label: 'Section', is_visible_in_listing: true },
    ];
  }, [formSchema]);

  // Initialize table visible columns when form schema changes (only on first load)
  React.useEffect(() => {
    if (visibleColumns.length > 0 && tableVisibleColumns.length === 0) {
      const allColumnIds = ['student', ...visibleColumns.map(col => col.field_name), 'status', 'actions'];
      setTableVisibleColumns(allColumnIds);
    }
  }, [visibleColumns, tableVisibleColumns.length]);

  // Set local state when React Query data is available
  React.useEffect(() => {
    if (students && !localStudents) {
      setLocalStudents(students);
      console.log('Setting local students from React Query:', students);
    }
  }, [students, localStudents]);

  const columns = useMemo(() => [
    { id: 'student', label: 'Student', minWidth: 250 },
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

  const handleAddStudent = () => {
    setSelectedStudent(null);
    setFormOpen(true);
  };

  const handleEditStudent = (student: Student) => {
    console.log('🔍 handleEditStudent called with student:', student);
    const mappedData = mapStudentToFormData(student);
    console.log('🔍 Mapped data for form:', mappedData);
    setSelectedStudent(student);
    setFormOpen(true);
    handleMenuClose();
  };

  const handleFormClose = () => {
    setFormOpen(false);
    setSelectedStudent(null);
  };

  const handleFormSave = async (data: any) => {
    try {
      if (selectedStudent) {
        updateStudent({ id: selectedStudent.id, data });
        setSuccessMessage('Student updated successfully!');
      } else {
        // Use the dynamic form endpoint for new students
        const result = await studentsService.createStudentFromDynamicForm(data);
        // Invalidate the students query to refresh the list
        queryClient.invalidateQueries('students');
        // Also refetch the data immediately
        queryClient.refetchQueries('students');
        // Update local state as fallback
        if (localStudents) {
          setLocalStudents({
            ...localStudents,
            students: [...localStudents.students, result.student],
            total: localStudents.total + 1
          });
        }
        setSuccessMessage('Student created successfully!');
      }
      handleFormClose();
      // Clear success message after 3 seconds
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err: any) {
      setError(err.message || 'Failed to save student');
    }
  };

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>, student: Student) => {
    setAnchorEl(event.currentTarget);
    setSelectedStudent(student);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedStudent(null);
  };

  const handleEditForm = () => {
    // Navigate to advanced form builder
    navigate('/form-builder/advanced?type=student');
  };

  const handleDeleteStudent = (student: Student) => {
    setStudentToDelete(student);
    setDeleteDialogOpen(true);
    handleMenuClose();
  };

  const handleConfirmDelete = async () => {
    if (!studentToDelete) return;

    try {
      setError(null);
      await deleteStudent(studentToDelete.id);

      // Update local state immediately for better UX
      if (localStudents?.students) {
        const updatedStudents = localStudents.students.filter((s: Student) => s.id !== studentToDelete.id);
        setLocalStudents({
          ...localStudents,
          students: updatedStudents,
          total: localStudents.total - 1
        });
      }

      setSuccessMessage(`Student ${studentToDelete.user.first_name} ${studentToDelete.user.last_name} has been successfully deactivated.`);
      setDeleteDialogOpen(false);
      setStudentToDelete(null);

      // Clear success message after 3 seconds
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err: any) {
      setError(err.message || 'Failed to delete student');
      setDeleteDialogOpen(false);
      setStudentToDelete(null);
    }
  };

  const handleCancelDelete = () => {
    setDeleteDialogOpen(false);
    setStudentToDelete(null);
  };

  // Function to map student data to form fields
  const mapStudentToFormData = (student: Student): Record<string, any> => {
    if (!student || !formSchema) return {};

    const formData: Record<string, any> = {};

    // Map form fields to student data
    formSchema.fields.forEach(field => {
      let value: any = undefined;

      // First check dynamic_data (custom form fields)
      if (student.dynamic_data && student.dynamic_data[field.field_name] !== undefined) {
        value = student.dynamic_data[field.field_name];
      }
      // Then check direct student properties
      else if ((student as any)[field.field_name] !== undefined) {
        value = (student as any)[field.field_name];
      }
      // Finally check user properties for user-related fields
      else if (student.user && (student.user as any)[field.field_name] !== undefined) {
        value = (student.user as any)[field.field_name];
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

    console.log('🔍 Mapping student to form data:', {
      student,
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
            Student Form Not Found
          </Typography>
          <Typography variant="body2" gutterBottom>
            The default student form could not be loaded. This might be because:
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
                      Access the advanced form builder to modify the student form
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
          Students
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
            onClick={handleAddStudent}
            disabled={isFormSchemaLoading}
          >
            Add Student
          </Button>


        </Box>
      </Box>

      {/* Search and Filters */}
      <Box sx={{ display: 'flex', gap: 2, mb: 3, alignItems: 'center', flexShrink: 0 }}>
        <TextField
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



      {/* Students Table */}
      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0 }}>
        {isStudentsLoading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
            <CircularProgress />
          </Box>
        ) : (
        <>
          {(() => {
            const hasStudentsData = students?.data && students.data.length > 0;
            const hasLocalStudentsData = localStudents?.students && localStudents.students.length > 0;
            const hasAnyData = hasStudentsData || hasLocalStudentsData;
            
            console.log('Debug data check:', {
              hasStudentsData,
              hasLocalStudentsData,
              hasAnyData,
              studentsDataLength: students?.data?.length,
              localStudentsDataLength: localStudents?.students?.length,
              studentsData: students?.data,
              localStudentsData: localStudents?.students
            });
            
            return hasAnyData;
          })() ? (
            <StyledTable
              columns={columns}
              data={localStudents?.students || students?.data || []}
              page={page}
              rowsPerPage={rowsPerPage}
              total={localStudents?.total || students?.total || 0}
              onPageChange={handlePageChange}
              onRowsPerPageChange={handleRowsPerPageChange}
              externalVisibleColumns={tableVisibleColumns}
              onVisibleColumnsChange={setTableVisibleColumns}
              maxHeight="100%"
              renderRow={(student: Student, visibleColumnIds: string[]) => (
                <TableRow key={student.id} hover sx={{ height: '48px' }}>
                  <TableCell sx={{ height: '48px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', width: 250, minWidth: 250 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Avatar sx={{ width: 32, height: 32 }}>{student.user.first_name[0]}</Avatar>
                      <Box sx={{ minWidth: 0, flex: 1 }}>
                        <Typography variant="body2" fontWeight={500} sx={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {student.user.first_name} {student.user.last_name}
                        </Typography>
                        <Typography variant="caption" color="text.secondary" sx={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {student.user.email}
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
                          if (student.dynamic_data && student.dynamic_data[col.field_name] !== undefined) {
                            value = student.dynamic_data[col.field_name];
                          }
                          // Then check direct student properties
                          else if ((student as any)[col.field_name] !== undefined) {
                            value = (student as any)[col.field_name];
                          }
                          // Finally check user properties for user-related fields
                          else if (student.user && (student.user as any)[col.field_name] !== undefined) {
                            value = (student.user as any)[col.field_name];
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
                      label={student.is_active ? 'Active' : 'Inactive'}
                      color={student.is_active ? 'success' : 'default'}
                      size="small"
                    />
                  </TableCell>
                  <TableCell align="right" sx={{ height: '48px', width: 120, minWidth: 120 }}>
                    <IconButton
                      onClick={(e) => handleMenuClick(e, student)}
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
                No students found
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                {students?.data ? 'No students match your search criteria.' : 'Start by adding your first student.'}
              </Typography>
            </Box>
          )}
        </>
        )}
      </Box>

      {/* Filter Drawer */}
      <StudentFilterDrawer
        open={isFilterDrawerOpen}
        onClose={() => setFilterDrawerOpen(false)}
        schema={formSchema?.fields.filter(f => f.is_filterable) || []}
        onApply={setFilters}
        pinned={isFilterPinned}
      />

      {/* Student Form Dialog */}
      <Dialog open={isFormOpen} onClose={handleFormClose} maxWidth="md" fullWidth>
        <DialogTitle>
          {selectedStudent 
            ? `Edit Student - ${selectedStudent.user.first_name} ${selectedStudent.user.last_name}`
            : 'Add New Student'
          }
        </DialogTitle>
        <DialogContent>
          {formSchema ? (
            <FormRenderer
              schema={formSchema}
              onSubmit={handleFormSave}
              initialData={selectedStudent ? mapStudentToFormData(selectedStudent) : undefined}
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
        <MenuItem onClick={() => handleEditStudent(selectedStudent!)}>
          Edit
        </MenuItem>
        <MenuItem onClick={handleMenuClose}>
          View Details
        </MenuItem>
        <MenuItem onClick={() => handleDeleteStudent(selectedStudent!)}>
          Delete
        </MenuItem>
      </Menu>

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmationDialog
        open={isDeleteDialogOpen}
        onClose={handleCancelDelete}
        onConfirm={handleConfirmDelete}
        studentName={studentToDelete ? `${studentToDelete.user.first_name} ${studentToDelete.user.last_name}` : ''}
        isLoading={isDeletingStudent}
      />
    </Box>
  );
};

export default StudentsPage;
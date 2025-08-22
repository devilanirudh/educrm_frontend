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
  Avatar,
  CircularProgress,
  Alert,
  Menu,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  Grid,
  TableRow,
  TableCell,
} from '@mui/material';
import {
  Search as SearchIcon,
  Add as AddIcon,
  Clear as ClearIcon,
  FilterList as FilterListIcon,
  MoreVert as MoreVertIcon,
  PushPin as PushPinIcon,
  Create as CreateIcon,
} from '@mui/icons-material';
import { teachersService, Teacher } from '../../services/teachers';
import TeacherFilterDrawer from '../../components/teachers/TeacherFilterDrawer';
import FormRenderer from '../../components/form-builder/FormRenderer';
import { useTeachers } from '../../hooks/useTeachers';
import { useForm } from '../../hooks/useForm';
import StyledCard from '../../components/common/StyledCard';
import StyledTable from '../../components/common/StyledTable';

const TeachersPage: React.FC = () => {
  const navigate = useNavigate();
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

  const { teachers, isTeachersLoading, createTeacher, updateTeacher } = useTeachers({
    page,
    per_page: rowsPerPage,
    search: searchTerm || undefined,
    ...filters,
  });

  const { formSchema, isFormSchemaLoading, formSchemaError, isFormSchemaError } = useForm('teacher_form');

  const visibleColumns = useMemo(() => {
    return formSchema?.fields.filter(field => field.is_visible_in_listing) || [];
  }, [formSchema]);

  const columns = useMemo(() => [
    { id: 'teacher', label: 'Teacher', minWidth: 250 },
    ...visibleColumns.map(col => ({ id: col.field_name, label: col.label, minWidth: 150 })),
    { id: 'status', label: 'Status', minWidth: 100 },
    { id: 'actions', label: 'Actions', align: 'right' as const, minWidth: 100 },
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
      } else {
        createTeacher(data);
      }
      handleFormClose();
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

  // Show form not found error with option to create new form
  if (isFormSchemaError && !isFormSchemaLoading) {
    return (
      <Box sx={{ p: 3 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <Typography variant="h4" gutterBottom>
            Teachers Management
          </Typography>
        </Box>
        
        <StyledCard sx={{ p: 4, textAlign: 'center', maxWidth: 600, mx: 'auto' }}>
          <Alert severity="warning" sx={{ mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              Teacher Form Not Available
            </Typography>
            <Typography variant="body1" sx={{ mb: 2 }}>
              The teacher form template could not be found. To manage teachers, you need to create a form template first.
            </Typography>
            <Typography variant="body2" color="text.secondary">
              A form template defines the fields that will be used for teacher registration and data collection.
            </Typography>
          </Alert>
          
          <Box sx={{ mt: 3 }}>
            <Button
              variant="contained"
              size="large"
              startIcon={<CreateIcon />}
              onClick={() => navigate('/form-builder?type=teacher&key=teacher_form')}
              sx={{ mr: 2 }}
            >
              Create Teacher Form
            </Button>
            <Button
              variant="outlined"
              size="large"
              onClick={() => window.location.reload()}
            >
              Refresh Page
            </Button>
          </Box>
        </StyledCard>
      </Box>
    );
  }

  if ((isTeachersLoading && !teachers?.data.length) || isFormSchemaLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  const renderRow = (row: Teacher) => (
    <TableRow hover role="checkbox" tabIndex={-1} key={row.id}>
      <TableCell>
        <Box display="flex" alignItems="center" gap={2}>
          <Avatar src={row.user.profile_picture}>
            {row.user.first_name[0]}{row.user.last_name[0]}
          </Avatar>
          <Box>
            <Typography variant="subtitle2">
              {row.user.first_name} {row.user.last_name}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {row.user.email}
            </Typography>
          </Box>
        </Box>
      </TableCell>
      {visibleColumns.map(col => (
        <TableCell key={col.field_name}>
          {row.dynamic_data?.[col.field_name] || '-'}
        </TableCell>
      ))}
      <TableCell>
        <Chip
          label={row.is_active ? 'Active' : 'Inactive'}
          color={row.is_active ? 'success' : 'error'}
          size="small"
        />
      </TableCell>
      <TableCell align="right">
        <IconButton
          size="small"
          onClick={(e) => handleMenuClick(e, row)}
        >
          <MoreVertIcon />
        </IconButton>
      </TableCell>
    </TableRow>
  );

  return (
    <Box sx={{ p: 3 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" gutterBottom>
          Teachers Management
        </Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={handleAddTeacher}>
          Add Teacher
        </Button>
      </Box>

      <StyledCard sx={{ p: 2, mb: 3 }}>
        <Grid container spacing={2} justifyContent="space-between" alignItems="center">
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              placeholder="Search teachers by name, email, or ID..."
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
                        <IconButton onClick={() => setFilterPinned(!isFilterPinned)}>
                          <PushPinIcon />
                        </IconButton>
          </Grid>
        </Grid>
      </StyledCard>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      <StyledTable
        columns={columns}
        data={teachers?.data || []}
        total={teachers?.total || 0}
        page={page}
        rowsPerPage={rowsPerPage}
        onPageChange={handlePageChange}
        onRowsPerPageChange={handleRowsPerPageChange}
        renderRow={renderRow}
      />

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={() => navigate(`/teachers/${selectedTeacher?.id}`)}>Profile</MenuItem>
        <MenuItem onClick={() => handleEditTeacher(selectedTeacher!)}>Edit</MenuItem>
        <MenuItem onClick={() => teachersService.generateTeacherCard(selectedTeacher!.id)}>ID Card</MenuItem>
        <MenuItem onClick={() => navigate(`/teachers/${selectedTeacher?.id}/assign-class`)}>Assign Class</MenuItem>
        <MenuItem onClick={() => navigate(`/teachers/${selectedTeacher?.id}/schedule`)}>View Schedule</MenuItem>
        <MenuItem onClick={() => teachersService.generatePdf(selectedTeacher!.id)}>Generate PDF</MenuItem>
      </Menu>

            <TeacherFilterDrawer
              open={isFilterDrawerOpen}
              onClose={() => setFilterDrawerOpen(false)}
              schema={formSchema?.fields.filter(f => f.is_filterable) || []}
              onApply={setFilters}
              pinned={isFilterPinned}
            />

      <Dialog open={isFormOpen} onClose={handleFormClose} maxWidth="md" fullWidth>
        <DialogTitle>{selectedTeacher ? 'Edit Teacher' : 'Add New Teacher'}</DialogTitle>
        <DialogContent>
          {formSchema ? (
            <FormRenderer
              schema={formSchema}
              onSubmit={handleFormSave}
              initialData={selectedTeacher?.dynamic_data}
              onCancel={handleFormClose}
            />
          ) : (
            <CircularProgress />
          )}
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default TeachersPage;
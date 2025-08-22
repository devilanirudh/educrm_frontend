import React, { useState } from 'react';
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
    Menu,
    MenuItem,
    Grid,
  } from '@mui/material';
import {
  Search as SearchIcon,
  Add as AddIcon,
  Clear as ClearIcon,
  FilterList as FilterListIcon,
  MoreVert as MoreVertIcon,
} from '@mui/icons-material';
import { Class } from '../../services/classes';
import ClassFilterDrawer from '../../components/classes/ClassFilterDrawer';
import ClassForm from '../../components/classes/ClassForm';
import { useClasses } from '../../hooks/useClasses';

const ClassesPage: React.FC = () => {
  const navigate = useNavigate();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState<Record<string, any>>({});
  const [isFilterDrawerOpen, setFilterDrawerOpen] = useState(false);
  const [isFormOpen, setFormOpen] = useState(false);
  const [selectedClass, setSelectedClass] = useState<Class | null>(null);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [error, setError] = useState<string | null>(null);

  const { classes, isClassesLoading, createClass, updateClass, deleteClass } = useClasses({
    page,
    per_page: rowsPerPage,
    search: searchTerm || undefined,
    ...filters,
  });

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
      } else {
        createClass(data);
      }
      handleFormClose();
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

  const handleArchiveRestore = async () => {
    if (selectedClass) {
      try {
        deleteClass(selectedClass.id);
      } catch (err: any) {
        setError(err.message || 'Failed to archive/restore class');
      }
    }
    handleMenuClose();
  };

  if (isClassesLoading && !classes?.data.length) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
              <Typography variant="h4" gutterBottom>
                Classes Management
              </Typography>
              <Button variant="contained" startIcon={<AddIcon />} onClick={handleAddClass}>
                Add Class
              </Button>
            </Box>
      
            <Paper sx={{ p: 2, mb: 3 }}>
              <Grid container spacing={2} justifyContent="space-between" alignItems="center">
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    placeholder="Search classes by name or teacher..."
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
                </Grid>
              </Grid>
            </Paper>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      <Paper>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Class</TableCell>
                <TableCell>Section</TableCell>
                <TableCell>Class Teacher</TableCell>
                <TableCell>Strength</TableCell>
                <TableCell>Status</TableCell>
                                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {classes?.data.map((classItem: Class) => (
                <TableRow key={classItem.id} hover>
                  <TableCell>{classItem.name}</TableCell>
                  <TableCell>{classItem.section || '-'}</TableCell>
                  <TableCell>{classItem.class_teacher?.user.first_name} {classItem.class_teacher?.user.last_name}</TableCell>
                  <TableCell>{classItem.students?.length}/{classItem.max_students || '-'}</TableCell>
                  <TableCell>
                    <Chip
                      label={classItem.is_active ? 'Active' : 'Archived'}
                      color={classItem.is_active ? 'success' : 'error'}
                      size="small"
                    />
                  </TableCell>
                                    <TableCell align="right">
                                      <IconButton
                                        size="small"
                                        onClick={(e) => handleMenuClick(e, classItem)}
                                      >
                                        <MoreVertIcon />
                                      </IconButton>
                                    </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        
        <TablePagination
          rowsPerPageOptions={[5, 10, 25, 50]}
          component="div"
          count={classes?.total || 0}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handlePageChange}
          onRowsPerPageChange={handleRowsPerPageChange}
        />
      </Paper>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={() => navigate(`/classes/${selectedClass?.id}`)}>Open Class</MenuItem>
        <MenuItem onClick={() => handleEditClass(selectedClass!)}>Edit</MenuItem>
        <MenuItem onClick={() => navigate(`/classes/${selectedClass?.id}/assign-subjects`)}>Assign Subjects/Teachers</MenuItem>
        <MenuItem onClick={handleArchiveRestore}>
          {selectedClass?.is_active ? 'Archive' : 'Restore'}
        </MenuItem>
      </Menu>

      <ClassFilterDrawer
        open={isFilterDrawerOpen}
        onClose={() => setFilterDrawerOpen(false)}
        onApply={setFilters}
      />

      <ClassForm
        open={isFormOpen}
        onClose={handleFormClose}
        onSubmit={handleFormSave}
        classId={selectedClass?.id}
      />
    </Box>
  );
};

export default ClassesPage;
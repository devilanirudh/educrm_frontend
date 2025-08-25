import React from 'react';
import {
  Paper,
  Grid,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';

interface StudentAssignmentFiltersProps {
  searchTerm: string;
  subjectFilter: string;
  statusFilter: string;
  onSearchChange: (value: string) => void;
  onSubjectChange: (value: string) => void;
  onStatusChange: (value: string) => void;
}

const StudentAssignmentFilters: React.FC<StudentAssignmentFiltersProps> = ({
  searchTerm,
  subjectFilter,
  statusFilter,
  onSearchChange,
  onSubjectChange,
  onStatusChange,
}) => {
  return (
    <Paper sx={{ p: 2, mb: 3 }}>
      <Grid container spacing={2} alignItems="center">
        <Grid item xs={12} md={4}>
          <TextField
            fullWidth
            label="Search assignments"
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search by title or description..."
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <FormControl fullWidth>
            <InputLabel>Subject</InputLabel>
            <Select
              value={subjectFilter}
              label="Subject"
              onChange={(e) => onSubjectChange(e.target.value)}
            >
              <MenuItem value="">All Subjects</MenuItem>
              <MenuItem value="1">Mathematics</MenuItem>
              <MenuItem value="2">Science</MenuItem>
              <MenuItem value="3">English</MenuItem>
              <MenuItem value="4">History</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} md={4}>
          <FormControl fullWidth>
            <InputLabel>Status</InputLabel>
            <Select
              value={statusFilter}
              label="Status"
              onChange={(e) => onStatusChange(e.target.value)}
            >
              <MenuItem value="">All Statuses</MenuItem>
              <MenuItem value="pending">Pending</MenuItem>
              <MenuItem value="submitted">Submitted</MenuItem>
              <MenuItem value="graded">Graded</MenuItem>
              <MenuItem value="overdue">Overdue</MenuItem>
            </Select>
          </FormControl>
        </Grid>
      </Grid>
    </Paper>
  );
};

export default StudentAssignmentFilters;

import React from 'react';
import {
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  CircularProgress,
  Button,
} from '@mui/material';
import { Assignment } from '../../services/assignments';

interface StudentAssignmentListProps {
  assignments: Assignment[] | undefined;
  isLoading: boolean;
  onAssignmentSelect: (assignmentId: number) => void;
}

const StudentAssignmentList: React.FC<StudentAssignmentListProps> = ({
  assignments,
  isLoading,
  onAssignmentSelect,
}) => {
  const formatDate = (dateString: string) => new Date(dateString).toLocaleDateString();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'submitted': return 'success';
      case 'graded': return 'primary';
      case 'overdue': return 'error';
      default: return 'warning';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'pending': return 'Pending';
      case 'submitted': return 'Submitted';
      case 'graded': return 'Graded';
      case 'overdue': return 'Overdue';
      default: return 'Pending';
    }
  };

  if (isLoading) {
    return (
      <Paper>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Assignment Title</TableCell>
                <TableCell>Subject</TableCell>
                <TableCell>Teacher</TableCell>
                <TableCell>Due Date</TableCell>
                <TableCell>Max Score</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow>
                <TableCell colSpan={7} align="center">
                  <CircularProgress />
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    );
  }

  if (!assignments || assignments.length === 0) {
    return (
      <Paper>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Assignment Title</TableCell>
                <TableCell>Subject</TableCell>
                <TableCell>Teacher</TableCell>
                <TableCell>Due Date</TableCell>
                <TableCell>Max Score</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow>
                <TableCell colSpan={7} align="center">
                  No assignments found.
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    );
  }

  return (
    <Paper>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Assignment Title</TableCell>
              <TableCell>Subject</TableCell>
              <TableCell>Teacher</TableCell>
              <TableCell>Due Date</TableCell>
              <TableCell>Max Score</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {assignments.map((assignment: Assignment) => (
              <TableRow key={assignment.id} hover>
                <TableCell>
                  <Typography variant="subtitle2" fontWeight="bold">
                    {assignment.title}
                  </Typography>
                  {assignment.description && (
                    <Typography variant="body2" color="text.secondary">
                      {assignment.description}
                    </Typography>
                  )}
                </TableCell>
                <TableCell>
                  {assignment.subject?.name || `Subject ${assignment.subject_id}`}
                </TableCell>
                <TableCell>
                  {assignment.teacher ? 
                    `${assignment.teacher.first_name} ${assignment.teacher.last_name}` : 
                    'Unknown Teacher'
                  }
                </TableCell>
                <TableCell>{formatDate(assignment.due_date)}</TableCell>
                <TableCell>{assignment.max_score || 'N/A'}</TableCell>
                <TableCell>
                  <Chip 
                    label={getStatusLabel(assignment.status || 'pending')} 
                    color={getStatusColor(assignment.status || 'pending')} 
                    size="small" 
                  />
                </TableCell>
                <TableCell>
                  <Button 
                    variant="contained" 
                    size="small" 
                    onClick={() => onAssignmentSelect(assignment.id)}
                    disabled={assignment.status === 'submitted' || assignment.status === 'graded'}
                  >
                    {assignment.status === 'submitted' ? 'Submitted' : 
                     assignment.status === 'graded' ? 'Graded' : 'Submit'}
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
};

export default StudentAssignmentList;

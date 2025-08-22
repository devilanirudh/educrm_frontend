import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
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
  Alert,
  Button,
} from '@mui/material';
import { assignmentsService, Assignment } from '../../services/assignments';
import { useAppSelector } from '../../store';
import { RootState } from '../../store';
import SubmissionForm from '../../components/assignments/SubmissionForm';

const StudentAssignments: React.FC = () => {
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAppSelector((state: RootState) => state.auth);
  const [submissionFormOpen, setSubmissionFormOpen] = useState(false);
  const [selectedAssignmentId, setSelectedAssignmentId] = useState<number | null>(null);

  const loadAssignments = useCallback(async () => {
    if (!user) return;
    try {
      setLoading(true);
      setError(null);
      // Assuming the student's class_id is available in the user object
      // You might need to adjust this based on your actual data structure
      const response = await assignmentsService.getAssignments({
        page: 0,
        per_page: 100,
        class_id: (user as any).class_id,
      });
      setAssignments(response.data);
    } catch (err: any) {
      setError(err.message || 'Failed to load assignments');
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    loadAssignments();
  }, [loadAssignments]);

  const formatDate = (dateString: string) => new Date(dateString).toLocaleDateString();

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" mb={3}>My Assignments</Typography>
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      <Paper>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Assignment Title</TableCell>
                <TableCell>Subject</TableCell>
                <TableCell>Due Date</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow><TableCell colSpan={5} align="center"><CircularProgress /></TableCell></TableRow>
              ) : assignments.length > 0 ? (
                assignments.map((assignment) => (
                  <TableRow key={assignment.id} hover>
                    <TableCell>{assignment.title}</TableCell>
                    <TableCell>{assignment.subject_id}</TableCell>
                    <TableCell>{formatDate(assignment.due_date)}</TableCell>
                    <TableCell>
                      <Chip label={assignment.status || "Pending"} color={assignment.status === 'Submitted' ? 'success' : assignment.status === 'Graded' ? 'primary' : 'warning'} size="small" />
                    </TableCell>
                    <TableCell>
                      <Button variant="contained" size="small" onClick={() => {
                        setSelectedAssignmentId(assignment.id);
                        setSubmissionFormOpen(true);
                      }}>Submit</Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow><TableCell colSpan={5} align="center">No assignments found.</TableCell></TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
      {selectedAssignmentId && (
        <SubmissionForm
          open={submissionFormOpen}
          onClose={() => setSubmissionFormOpen(false)}
          assignmentId={selectedAssignmentId}
        />
      )}
    </Box>
  );
};

export default StudentAssignments;
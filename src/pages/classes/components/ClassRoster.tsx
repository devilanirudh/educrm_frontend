import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  CircularProgress,
  Alert,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from '@mui/material';
import { ExpandMore as ExpandMoreIcon } from '@mui/icons-material';
import { classesService } from '../../../services/classes';

interface Student {
  id: number;
  student_id: string;
  user: {
    id: number;
    email: string;
    first_name: string;
    last_name: string;
    phone: string;
    is_active: boolean;
  };
  roll_number: string;
  section: string;
  is_active: boolean;
  admission_date: string;
  academic_year: string;
  subjects: Array<{
    id: number;
    name: string;
    teacher: string;
    weekly_hours: number;
    is_optional: boolean;
    room_number?: string;
  }>;
}

interface ClassRosterProps {
  classId: number;
}

const ClassRoster: React.FC<ClassRosterProps> = ({ classId }) => {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        setLoading(true);
        const data = await classesService.getClassStudents(classId);
        setStudents(data.students || []);
      } catch (err: any) {
        setError(err.message || 'Failed to load students');
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, [classId]);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return <Alert severity="error">{error}</Alert>;
  }

  if (students.length === 0) {
    return <Alert severity="info">No students found in this class.</Alert>;
  }

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Class Roster ({students.length} students)
      </Typography>
      
      <TableContainer component={Paper} sx={{ mt: 2 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Student ID</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Roll Number</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Subjects</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {students.map((student) => (
              <TableRow key={student.id}>
                <TableCell>{student.student_id}</TableCell>
                <TableCell>
                  {student.user.first_name} {student.user.last_name}
                </TableCell>
                <TableCell>{student.roll_number}</TableCell>
                <TableCell>{student.user.email}</TableCell>
                <TableCell>
                  <Chip
                    label={student.is_active ? 'Active' : 'Inactive'}
                    color={student.is_active ? 'success' : 'default'}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  <Accordion>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                      <Typography variant="body2">
                        {student.subjects.length} subjects
                      </Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      <Box>
                        {student.subjects.map((subject) => (
                          <Box key={subject.id} sx={{ mb: 1, p: 1, border: '1px solid #e0e0e0', borderRadius: 1 }}>
                            <Typography variant="subtitle2" fontWeight="bold">
                              {subject.name}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              Teacher: {subject.teacher}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              Hours: {subject.weekly_hours} hours/week
                            </Typography>
                            {subject.room_number && (
                              <Typography variant="body2" color="text.secondary">
                                Room: {subject.room_number}
                              </Typography>
                            )}
                            {subject.is_optional && (
                              <Chip label="Optional" size="small" color="warning" sx={{ mt: 0.5 }} />
                            )}
                          </Box>
                        ))}
                      </Box>
                    </AccordionDetails>
                  </Accordion>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default ClassRoster;

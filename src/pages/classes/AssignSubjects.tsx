import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
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
  TextField,
  IconButton,
  CircularProgress,
  Alert,
} from '@mui/material';
import { Add as AddIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { classesService, Subject } from '../../services/classes';
import { teachersService, Teacher } from '../../services/teachers';

interface SubjectAssignment {
  subject_id: number;
  teacher_id: number | null;
}

const AssignSubjectsPage: React.FC = () => {
  const { class_id } = useParams<{ class_id: string }>();
  const navigate = useNavigate();
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [assignments, setAssignments] = useState<SubjectAssignment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (class_id) {
          const [subjectsRes, teachersRes, classSubjectsRes] = await Promise.all([
            classesService.getSubjects(),
            teachersService.getTeachers({ limit: 1000 }), // Fetch all teachers
            classesService.getClassSubjects(parseInt(class_id, 10)),
          ]);
          setSubjects(subjectsRes.data);
          setTeachers(teachersRes.data);
          setAssignments(classSubjectsRes.map((cs: any) => ({
            subject_id: cs.subject_id,
            teacher_id: cs.teacher_id,
          })));
        }
      } catch (err: any) {
        setError(err.message || 'Failed to load data');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [class_id]);

  const handleAddRow = () => {
    setAssignments([...assignments, { subject_id: 0, teacher_id: null }]);
  };

  const handleRemoveRow = (index: number) => {
    const newAssignments = [...assignments];
    newAssignments.splice(index, 1);
    setAssignments(newAssignments);
  };

  const handleChange = (index: number, field: keyof SubjectAssignment, value: any) => {
    const newAssignments = [...assignments];
    newAssignments[index][field] = value;
    setAssignments(newAssignments);
  };

  const handleSave = async () => {
    try {
      if (class_id) {
        await classesService.addSubjectToClass(parseInt(class_id, 10), assignments as any);
        navigate(`/classes/${class_id}`);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to save assignments');
    }
  };

  if (loading) {
    return <CircularProgress />;
  }

  if (error) {
    return <Alert severity="error">{error}</Alert>;
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Assign Subjects and Teachers
      </Typography>
      <Paper>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Subject</TableCell>
                <TableCell>Teacher</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {assignments.map((assignment, index) => (
                <TableRow key={index}>
                  <TableCell>
                    <TextField
                      select
                      fullWidth
                      value={assignment.subject_id}
                      onChange={(e) => handleChange(index, 'subject_id', e.target.value)}
                    >
                      {subjects.map((subject) => (
                        <option key={subject.id} value={subject.id}>
                          {subject.name}
                        </option>
                      ))}
                    </TextField>
                  </TableCell>
                  <TableCell>
                    <TextField
                      select
                      fullWidth
                      value={assignment.teacher_id}
                      onChange={(e) => handleChange(index, 'teacher_id', e.target.value)}
                    >
                      {teachers.map((teacher) => (
                        <option key={teacher.id} value={teacher.id}>
                          {teacher.user.first_name} {teacher.user.last_name}
                        </option>
                      ))}
                    </TextField>
                  </TableCell>
                  <TableCell>
                    <IconButton onClick={() => handleRemoveRow(index)}>
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
      <Box sx={{ mt: 2 }}>
        <Button startIcon={<AddIcon />} onClick={handleAddRow}>
          Add Row
        </Button>
      </Box>
      <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
        <Button onClick={() => navigate(`/classes/${class_id}`)}>Cancel</Button>
        <Button variant="contained" onClick={handleSave} sx={{ ml: 2 }}>
          Save
        </Button>
      </Box>
    </Box>
  );
};

export default AssignSubjectsPage;
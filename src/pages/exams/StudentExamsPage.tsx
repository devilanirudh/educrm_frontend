import React, { useState } from 'react';
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
  Alert,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Box,
} from '@mui/material';
import { useQuery } from 'react-query';
import { examsService } from '../../services/exams';
import ExamSubmissionForm from '../../components/exams/ExamSubmissionForm';
import ExamResultView from '../../components/exams/ExamResultView';

interface Exam {
  id: number;
  title: string;
  description?: string;
  exam_date: string;
  duration_minutes: number;
  max_score: number;
  status: string;
  subject?: {
    name: string;
  };
  teacher?: {
    first_name: string;
    last_name: string;
  };
}

const StudentExamsPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [subjectFilter, setSubjectFilter] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [submissionFormOpen, setSubmissionFormOpen] = useState(false);
  const [selectedExamId, setSelectedExamId] = useState<number | null>(null);
  const [resultViewOpen, setResultViewOpen] = useState(false);
  const [selectedExamForResult, setSelectedExamForResult] = useState<Exam | null>(null);

  const { 
    data: examsData, 
    isLoading, 
    error 
  } = useQuery(
    ['student-exams'],
    () => examsService.getStudentExams(),
    {
      refetchInterval: 30000, // Refetch every 30 seconds
    }
  );

  const formatDate = (dateString: string) => new Date(dateString).toLocaleDateString();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published': return 'success';
      case 'active': return 'primary';
      case 'completed': return 'default';
      case 'cancelled': return 'error';
      default: return 'warning';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'draft': return 'Draft';
      case 'published': return 'Published';
      case 'active': return 'Active';
      case 'completed': return 'Completed';
      case 'cancelled': return 'Cancelled';
      default: return status;
    }
  };

  const handleTakeExam = (examId: number) => {
    setSelectedExamId(examId);
    setSubmissionFormOpen(true);
  };

  const handleViewResult = (exam: Exam) => {
    setSelectedExamForResult(exam);
    setResultViewOpen(true);
  };

  const filteredExams = examsData?.exams?.filter((exam: Exam) => {
    const matchesSearch = exam.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (exam.description && exam.description.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesSubject = !subjectFilter || exam.subject?.name === subjectFilter;
    const matchesStatus = !statusFilter || exam.status === statusFilter;
    
    return matchesSearch && matchesSubject && matchesStatus;
  }) || [];

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error">
        Failed to load exams: {(error as any).message || 'Unknown error'}
      </Alert>
    );
  }

  return (
    <div style={{ padding: '24px' }}>
      <Typography variant="h4" style={{ marginBottom: '24px' }}>My Exams</Typography>
      
      {/* Filters */}
      <Paper style={{ padding: '16px', marginBottom: '24px' }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              label="Search exams"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by title or description..."
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <FormControl fullWidth>
              <InputLabel>Subject</InputLabel>
              <Select
                value={subjectFilter}
                label="Subject"
                onChange={(e) => setSubjectFilter(e.target.value)}
              >
                <MenuItem value="">All Subjects</MenuItem>
                <MenuItem value="Mathematics">Mathematics</MenuItem>
                <MenuItem value="Science">Science</MenuItem>
                <MenuItem value="English">English</MenuItem>
                <MenuItem value="History">History</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={4}>
            <FormControl fullWidth>
              <InputLabel>Status</InputLabel>
              <Select
                value={statusFilter}
                label="Status"
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <MenuItem value="">All Statuses</MenuItem>
                <MenuItem value="published">Published</MenuItem>
                <MenuItem value="active">Active</MenuItem>
                <MenuItem value="completed">Completed</MenuItem>
                <MenuItem value="cancelled">Cancelled</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Paper>

      {/* Exams Table */}
      <Paper>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Title</TableCell>
                <TableCell>Subject</TableCell>
                <TableCell>Teacher</TableCell>
                <TableCell>Exam Date</TableCell>
                <TableCell>Duration</TableCell>
                <TableCell>Max Score</TableCell>
                <TableCell>Status</TableCell>
                {/* <TableCell>Actions</TableCell> */}
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredExams.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} align="center">
                    No exams found.
                  </TableCell>
                </TableRow>
              ) : (
                filteredExams.map((exam: Exam) => (
                  <TableRow key={exam.id} hover>
                    <TableCell>
                      <Typography variant="subtitle2" fontWeight="bold">
                        {exam.title}
                      </Typography>
                      {exam.description && (
                        <Typography variant="caption" color="textSecondary">
                          {exam.description}
                        </Typography>
                      )}
                    </TableCell>
                    <TableCell>
                      {exam.subject?.name || 'N/A'}
                    </TableCell>
                    <TableCell>
                      {exam.teacher ? 
                        `${exam.teacher.first_name} ${exam.teacher.last_name}` : 
                        'Unknown Teacher'
                      }
                    </TableCell>
                    <TableCell>{formatDate(exam.exam_date)}</TableCell>
                    <TableCell>{exam.duration_minutes} min</TableCell>
                    <TableCell>{exam.max_score}</TableCell>
                    <TableCell>
                      <Chip 
                        label={getStatusLabel(exam.status)} 
                        color={getStatusColor(exam.status) as any} 
                        size="small" 
                      />
                    </TableCell>
                    {/* <TableCell>
                      <Box display="flex" gap={1}>
                        {(exam.status === 'published' || exam.status === 'active') && (
                          <Button 
                            variant="contained" 
                            size="small" 
                            onClick={() => handleTakeExam(exam.id)}
                          >
                            Take Exam
                          </Button>
                        )}
                        {(exam.status === 'completed') && (
                          <Button 
                            variant="outlined" 
                            size="small" 
                            onClick={() => handleViewResult(exam)}
                          >
                            View Result
                          </Button>
                        )}
                      </Box>
                    </TableCell> */}
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* Exam Submission Form */}
      {selectedExamId && (
        <ExamSubmissionForm
          open={submissionFormOpen}
          onClose={() => {
            setSubmissionFormOpen(false);
            setSelectedExamId(null);
          }}
          examId={selectedExamId}
          examTitle={filteredExams.find((e: Exam) => e.id === selectedExamId)?.title || ''}
        />
      )}

      {/* Exam Result View */}
      {selectedExamForResult && (
        <ExamResultView
          open={resultViewOpen}
          onClose={() => {
            setResultViewOpen(false);
            setSelectedExamForResult(null);
          }}
          examId={selectedExamForResult.id}
          examTitle={selectedExamForResult.title}
        />
      )}
    </div>
  );
};

export default StudentExamsPage;

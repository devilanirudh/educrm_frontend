import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Paper,
  Chip,
  Divider,
  Alert,
  CircularProgress,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from '@mui/material';
import { CheckCircle, Schedule, Grade, Feedback, ExpandMore } from '@mui/icons-material';
import { useQuery } from 'react-query';
import { examsService } from '../../services/exams';

interface ExamResultViewProps {
  open: boolean;
  onClose: () => void;
  examId: number;
  examTitle: string;
}

interface ExamAnswer {
  id: number;
  question_text: string;
  question_type: string;
  answer_text?: string;
  selected_option?: string;
  is_correct?: boolean;
  points_earned?: number;
  teacher_feedback?: string;
}

interface ExamResult {
  id: number;
  score: number;
  max_score: number;
  percentage: number;
  grade_letter?: string;
  rank?: number;
  start_time: string;
  end_time: string;
  time_taken_minutes?: number;
  status: string;
  is_passed?: boolean;
  teacher_comments?: string;
  created_at: string;
  answers: ExamAnswer[];
}

const ExamResultView: React.FC<ExamResultViewProps> = ({ 
  open, 
  onClose, 
  examId, 
  examTitle 
}) => {
  const { data: resultData, isLoading, error } = useQuery(
    ['my-exam-result', examId],
    () => examsService.getMyExamResult(examId),
    {
      enabled: open,
    }
  );

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'submitted': return 'warning';
      case 'graded': return 'success';
      default: return 'default';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'submitted': return <Schedule />;
      case 'graded': return <CheckCircle />;
      default: return <Schedule />;
    }
  };

  const getGradeColor = (score: number) => {
    if (score >= 90) return 'success';
    if (score >= 80) return 'primary';
    if (score >= 70) return 'warning';
    if (score >= 60) return 'info';
    return 'error';
  };

  const getQuestionTypeLabel = (type: string) => {
    switch (type) {
      case 'mcq': return 'Multiple Choice';
      case 'true_false': return 'True/False';
      case 'short_answer': return 'Short Answer';
      case 'essay': return 'Essay';
      default: return type;
    }
  };

  if (isLoading) {
    return (
      <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
        <DialogContent>
          <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
            <CircularProgress />
          </Box>
        </DialogContent>
      </Dialog>
    );
  }

  if (error) {
    return (
      <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
        <DialogContent>
          <Alert severity="error">
            Failed to load exam result: {(error as any).message || 'Unknown error'}
          </Alert>
        </DialogContent>
      </Dialog>
    );
  }

  const result = resultData?.result;
  const exam = resultData?.exam;

  if (!result) {
    return (
      <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
        <DialogTitle>Exam Result</DialogTitle>
        <DialogContent>
          <Alert severity="info">
            No result found for this exam.
          </Alert>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Close</Button>
        </DialogActions>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth>
      <DialogTitle>
        <Typography variant="h6">Exam Result</Typography>
        <Typography variant="body2" color="textSecondary">
          {examTitle}
        </Typography>
      </DialogTitle>
      
      <DialogContent>
        <Box display="flex" flexDirection="column" gap={3}>
          {/* Status and Result Info */}
          <Paper sx={{ p: 3, bgcolor: 'grey.50' }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
              <Typography variant="h6">Result Status</Typography>
              <Chip
                icon={getStatusIcon(result.status)}
                label={result.status}
                color={getStatusColor(result.status) as any}
                size="medium"
              />
            </Box>
            
            <Box display="flex" flexDirection="column" gap={1}>
              <Typography variant="body2">
                <strong>Started:</strong> {formatDate(result.start_time)}
              </Typography>
              <Typography variant="body2">
                <strong>Completed:</strong> {formatDate(result.end_time)}
              </Typography>
              {result.time_taken_minutes && (
                <Typography variant="body2">
                  <strong>Time Taken:</strong> {result.time_taken_minutes} minutes
                </Typography>
              )}
              {result.rank && (
                <Typography variant="body2">
                  <strong>Rank:</strong> {result.rank}
                </Typography>
              )}
            </Box>
          </Paper>

          {/* Grade Section */}
          {result.status === 'graded' && (
            <Paper sx={{ p: 3, bgcolor: 'primary.50' }}>
              <Box display="flex" alignItems="center" gap={2} mb={2}>
                <Grade color="primary" />
                <Typography variant="h6">Grade</Typography>
              </Box>
              
              <Box display="flex" alignItems="center" gap={3}>
                <Box>
                  <Typography variant="h3" color={getGradeColor(result.percentage)} fontWeight="bold">
                    {result.score}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    out of {result.max_score}
                  </Typography>
                </Box>
                
                <Divider orientation="vertical" flexItem />
                
                <Box>
                  <Typography variant="h4" color={getGradeColor(result.percentage)} fontWeight="bold">
                    {result.percentage.toFixed(1)}%
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Percentage
                  </Typography>
                </Box>
                
                <Divider orientation="vertical" flexItem />
                
                <Box>
                  <Typography variant="h4" color={getGradeColor(result.percentage)} fontWeight="bold">
                    {result.grade_letter}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Grade Letter
                  </Typography>
                </Box>
              </Box>
              
              {result.is_passed !== null && (
                <Chip 
                  label={result.is_passed ? 'PASSED' : 'FAILED'} 
                  color={result.is_passed ? 'success' : 'error'} 
                  sx={{ mt: 2 }}
                />
              )}
            </Paper>
          )}

          {/* Teacher Comments */}
          {result.status === 'graded' && result.teacher_comments && (
            <Paper sx={{ p: 3 }}>
              <Box display="flex" alignItems="center" gap={2} mb={2}>
                <Feedback color="primary" />
                <Typography variant="h6">Teacher Comments</Typography>
              </Box>
              
              <Paper sx={{ p: 2, bgcolor: 'grey.50' }}>
                <Typography variant="body2" whiteSpace="pre-wrap">
                  {result.teacher_comments}
                </Typography>
              </Paper>
            </Paper>
          )}

          {/* Question-by-Question Review */}
          {result.answers && result.answers.length > 0 && (
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" mb={2}>Question Review</Typography>
              
              {result.answers.map((answer: ExamAnswer, index: number) => (
                <Accordion key={answer.id} sx={{ mb: 1 }}>
                  <AccordionSummary expandIcon={<ExpandMore />}>
                    <Box display="flex" justifyContent="space-between" alignItems="center" width="100%">
                      <Typography variant="subtitle1">
                        Question {index + 1}
                      </Typography>
                      <Box display="flex" gap={1}>
                        <Chip 
                          label={getQuestionTypeLabel(answer.question_type)} 
                          size="small" 
                          variant="outlined"
                        />
                        <Chip 
                          label={`${answer.points_earned || 0} pts`} 
                          size="small" 
                          color={answer.is_correct ? 'success' : 'default'}
                        />
                      </Box>
                    </Box>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Box display="flex" flexDirection="column" gap={2}>
                      <Typography variant="body1" fontWeight="bold">
                        {answer.question_text}
                      </Typography>
                      
                      <Box>
                        <Typography variant="subtitle2" color="textSecondary">Your Answer:</Typography>
                        <Paper sx={{ p: 2, bgcolor: 'grey.50', mt: 1 }}>
                          {answer.question_type === 'mcq' || answer.question_type === 'true_false' ? (
                            <Typography variant="body2">
                              {answer.selected_option || 'No answer provided'}
                            </Typography>
                          ) : (
                            <Typography variant="body2" whiteSpace="pre-wrap">
                              {answer.answer_text || 'No answer provided'}
                            </Typography>
                          )}
                        </Paper>
                      </Box>
                      
                      {answer.teacher_feedback && (
                        <Box>
                          <Typography variant="subtitle2" color="textSecondary">Teacher Feedback:</Typography>
                          <Paper sx={{ p: 2, bgcolor: 'primary.50', mt: 1 }}>
                            <Typography variant="body2" whiteSpace="pre-wrap">
                              {answer.teacher_feedback}
                            </Typography>
                          </Paper>
                        </Box>
                      )}
                    </Box>
                  </AccordionDetails>
                </Accordion>
              ))}
            </Paper>
          )}

          {/* Not Graded Yet Message */}
          {result.status === 'submitted' && (
            <Alert severity="info">
              Your exam has been submitted and is awaiting grading by your teacher.
            </Alert>
          )}
        </Box>
      </DialogContent>
      
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
};

export default ExamResultView;

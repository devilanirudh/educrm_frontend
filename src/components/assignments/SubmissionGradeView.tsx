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
} from '@mui/material';
import { CheckCircle, Schedule, Grade, Feedback } from '@mui/icons-material';
import { useQuery } from 'react-query';
import { assignmentsService } from '../../services/assignments';
import { getUploadBaseURL } from '../../services/api';

interface SubmissionGradeViewProps {
  open: boolean;
  onClose: () => void;
  assignmentId: number;
  assignmentTitle: string;
}

const SubmissionGradeView: React.FC<SubmissionGradeViewProps> = ({ 
  open, 
  onClose, 
  assignmentId, 
  assignmentTitle 
}) => {
  const { data: submissionData, isLoading, error } = useQuery(
    ['my-submission', assignmentId],
    () => assignmentsService.getMySubmission(assignmentId),
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
            Failed to load submission: {(error as any).message || 'Unknown error'}
          </Alert>
        </DialogContent>
      </Dialog>
    );
  }

  const submission = submissionData?.submission;
  const assignment = submissionData?.assignment;

  if (!submission) {
    return (
      <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
        <DialogTitle>Submission Details</DialogTitle>
        <DialogContent>
          <Alert severity="info">
            No submission found for this assignment.
          </Alert>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Close</Button>
        </DialogActions>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Typography variant="h6">Submission Details</Typography>
        <Typography variant="body2" color="textSecondary">
          {assignmentTitle}
        </Typography>
      </DialogTitle>
      
      <DialogContent>
        <Box display="flex" flexDirection="column" gap={3}>
          {/* Status and Submission Info */}
          <Paper sx={{ p: 3, bgcolor: 'grey.50' }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
              <Typography variant="h6">Submission Status</Typography>
              <Chip
                icon={getStatusIcon(submission.status)}
                label={submission.status}
                color={getStatusColor(submission.status) as any}
                size="medium"
              />
            </Box>
            
            <Box display="flex" flexDirection="column" gap={1}>
              <Typography variant="body2">
                <strong>Submitted:</strong> {formatDate(submission.submitted_at)}
              </Typography>
              {submission.is_late && (
                <Chip label="Late Submission" color="error" size="small" sx={{ alignSelf: 'flex-start' }} />
              )}
              {submission.attempt_number > 1 && (
                <Typography variant="body2" color="textSecondary">
                  Attempt #{submission.attempt_number}
                </Typography>
              )}
            </Box>
          </Paper>

          {/* Grade Section */}
          {submission.status === 'graded' && (
            <Paper sx={{ p: 3, bgcolor: 'primary.50' }}>
              <Box display="flex" alignItems="center" gap={2} mb={2}>
                <Grade color="primary" />
                <Typography variant="h6">Grade</Typography>
              </Box>
              
              <Box display="flex" alignItems="center" gap={3}>
                <Box>
                  <Typography variant="h3" color={getGradeColor(submission.score)} fontWeight="bold">
                    {submission.score}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    out of {assignment?.max_score || 100}
                  </Typography>
                </Box>
                
                <Divider orientation="vertical" flexItem />
                
                <Box>
                  <Typography variant="h4" color={getGradeColor(submission.score)} fontWeight="bold">
                    {submission.grade_letter}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Grade Letter
                  </Typography>
                </Box>
              </Box>
              
              {submission.graded_at && (
                <Typography variant="caption" color="textSecondary" sx={{ mt: 2, display: 'block' }}>
                  Graded on: {formatDate(submission.graded_at)}
                </Typography>
              )}
            </Paper>
          )}

          {/* Feedback Section */}
          {submission.status === 'graded' && submission.feedback && (
            <Paper sx={{ p: 3 }}>
              <Box display="flex" alignItems="center" gap={2} mb={2}>
                <Feedback color="primary" />
                <Typography variant="h6">Teacher Feedback</Typography>
              </Box>
              
              <Paper sx={{ p: 2, bgcolor: 'grey.50' }}>
                <Typography variant="body2" whiteSpace="pre-wrap">
                  {submission.feedback}
                </Typography>
              </Paper>
            </Paper>
          )}

          {/* Submission Content */}
          {submission.submission_text && (
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" mb={2}>Your Submission</Typography>
              <Paper sx={{ p: 2, bgcolor: 'grey.50' }}>
                <Typography variant="body2" whiteSpace="pre-wrap">
                  {submission.submission_text}
                </Typography>
              </Paper>
            </Paper>
          )}

          {/* Attachments */}
          {submission.attachment_paths && submission.attachment_paths.length > 0 && (
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" mb={2}>Your Attachments</Typography>
              <Box display="flex" flexWrap="wrap" gap={1}>
                {submission.attachment_paths.map((fileUrl: string, index: number) => (
                  <Chip
                    key={index}
                    label={fileUrl.split('/').pop()}
                    onClick={() => window.open(`${getUploadBaseURL()}${fileUrl}`, '_blank')}
                    clickable
                    variant="outlined"
                  />
                ))}
              </Box>
            </Paper>
          )}

          {/* Not Graded Yet Message */}
          {submission.status === 'submitted' && (
            <Alert severity="info">
              Your submission has been received and is awaiting grading by your teacher.
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

export default SubmissionGradeView;

import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Chip,
  IconButton,
  Tooltip,
  TextField,
  Box,
  Alert,
  CircularProgress,
} from '@mui/material';
import { Visibility, Download, Grade, CheckCircle, Schedule } from '@mui/icons-material';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { assignmentsService } from '../../services/assignments';
import { getUploadBaseURL } from '../../services/api';

interface SubmissionsViewProps {
  open: boolean;
  onClose: () => void;
  assignmentId: number;
  assignmentTitle: string;
}

interface Submission {
  id: number;
  student_id: number;
  student_name: string;
  student_email: string;
  submission_text: string;
  attachment_paths: string[];
  submitted_at: string;
  is_late: boolean;
  status: string;
  score: number | null;
  feedback: string | null;
  graded_at: string | null;
}

const SubmissionsView: React.FC<SubmissionsViewProps> = ({ 
  open, 
  onClose, 
  assignmentId, 
  assignmentTitle 
}) => {
  const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(null);
  const [gradeData, setGradeData] = useState({ score: '', feedback: '' });
  const [isGrading, setIsGrading] = useState(false);
  const queryClient = useQueryClient();

  // Fetch submissions
  const { data: submissionsData, isLoading, error } = useQuery(
    ['assignment-submissions', assignmentId],
    () => assignmentsService.getAssignmentSubmissions(assignmentId),
    {
      enabled: open,
    }
  );

  // Grade submission mutation
  const gradeMutation = useMutation(
    ({ submissionId, data }: { submissionId: number; data: { score: number; feedback?: string } }) =>
      assignmentsService.gradeSubmission(assignmentId, submissionId, data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['assignment-submissions', assignmentId]);
        setSelectedSubmission(null);
        setGradeData({ score: '', feedback: '' });
        setIsGrading(false);
      },
    }
  );

  const handleGrade = async () => {
    if (!selectedSubmission || !gradeData.score) return;
    
    setIsGrading(true);
    try {
      await gradeMutation.mutateAsync({
        submissionId: selectedSubmission.id,
        data: {
          score: parseFloat(gradeData.score),
          feedback: gradeData.feedback || undefined,
        },
      });
    } catch (error) {
      console.error('Failed to grade submission:', error);
    } finally {
      setIsGrading(false);
    }
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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getFileInfo = (fileUrl: string) => {
    if (!fileUrl || typeof fileUrl !== 'string') {
      return { type: 'file', icon: <Download />, label: 'Download File' };
    }
    
    const extension = fileUrl.split('.').pop()?.toLowerCase();
    
    if (['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp'].includes(extension || '')) {
      return { type: 'image', icon: <Visibility />, label: 'View Image' };
    } else if (extension === 'pdf') {
      return { type: 'pdf', icon: <Visibility />, label: 'View PDF' };
    } else if (['doc', 'docx'].includes(extension || '')) {
      return { type: 'document', icon: <Visibility />, label: 'View Document' };
    } else {
      return { type: 'file', icon: <Download />, label: 'Download File' };
    }
  };

  if (isLoading) {
    return (
      <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth>
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
      <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth>
        <DialogContent>
          <Alert severity="error">
            Failed to load submissions: {(error as any).message || 'Unknown error'}
          </Alert>
        </DialogContent>
      </Dialog>
    );
  }

  // Handle both array and object response formats
  const submissions = Array.isArray(submissionsData) ? submissionsData : ((submissionsData as any)?.submissions || []);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth>
      <DialogTitle>
        <Typography variant="h6">Submissions for: {assignmentTitle}</Typography>
        <Typography variant="body2" color="textSecondary">
          {submissions.length} submission{submissions.length !== 1 ? 's' : ''}
        </Typography>
      </DialogTitle>
      
      <DialogContent>
        {submissions.length === 0 ? (
          <Alert severity="info">No submissions yet for this assignment.</Alert>
        ) : (
          <TableContainer component={Paper} sx={{ mt: 2 }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Student</TableCell>
                  <TableCell>Submitted</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Files</TableCell>
                  <TableCell>Score</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {submissions.map((submission: Submission) => (
                  <TableRow key={submission.id} hover>
                    <TableCell>
                      <Typography variant="subtitle2" fontWeight="bold">
                        {submission.student_name}
                      </Typography>
                      <Typography variant="caption" color="textSecondary">
                        {submission.student_email}
                      </Typography>
                      {submission.is_late && (
                        <Chip 
                          label="Late" 
                          size="small" 
                          color="error" 
                          sx={{ ml: 1 }}
                        />
                      )}
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {formatDate(submission.submitted_at)}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        icon={getStatusIcon(submission.status)}
                        label={submission.status}
                        color={getStatusColor(submission.status) as any}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      {submission.attachment_paths && submission.attachment_paths.length > 0 ? (
                        <Box display="flex" gap={1}>
                          {submission.attachment_paths.map((fileUrl, index) => {
                            const fileInfo = getFileInfo(fileUrl);
                            const fullUrl = `${getUploadBaseURL()}${fileUrl}`;
                            
                            return (
                              <Tooltip key={index} title={fileInfo.label}>
                                <IconButton
                                  size="small"
                                  onClick={() => window.open(fullUrl, '_blank')}
                                >
                                  {fileInfo.icon}
                                </IconButton>
                              </Tooltip>
                            );
                          })}
                        </Box>
                      ) : (
                        <Typography variant="caption" color="textSecondary">
                          No files
                        </Typography>
                      )}
                    </TableCell>
                    <TableCell>
                      {submission.score !== null ? (
                        <Typography variant="body2" fontWeight="bold">
                          {submission.score}/100
                        </Typography>
                      ) : (
                        <Typography variant="caption" color="textSecondary">
                          Not graded
                        </Typography>
                      )}
                    </TableCell>
                    <TableCell>
                      <Box display="flex" gap={1}>
                        <Tooltip title="View Details">
                          <IconButton
                            size="small"
                            onClick={() => setSelectedSubmission(submission)}
                          >
                            <Visibility />
                          </IconButton>
                        </Tooltip>
                        {submission.status !== 'graded' && (
                          <Tooltip title="Grade Submission">
                            <IconButton
                              size="small"
                              color="primary"
                              onClick={() => setSelectedSubmission(submission)}
                            >
                              <Grade />
                            </IconButton>
                          </Tooltip>
                        )}
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </DialogContent>

      {/* Submission Detail/Grade Dialog */}
      {selectedSubmission && (
        <Dialog open={!!selectedSubmission} onClose={() => setSelectedSubmission(null)} maxWidth="md" fullWidth>
          <DialogTitle>
            {selectedSubmission.status === 'graded' ? 'Submission Details' : 'Grade Submission'}
          </DialogTitle>
          <DialogContent>
            <Box display="flex" flexDirection="column" gap={3} sx={{ pt: 1 }}>
              <Box>
                <Typography variant="h6">Student: {selectedSubmission.student_name}</Typography>
                <Typography variant="body2" color="textSecondary">
                  Submitted: {formatDate(selectedSubmission.submitted_at)}
                </Typography>
                {selectedSubmission.is_late && (
                  <Chip label="Late Submission" color="error" size="small" sx={{ mt: 1 }} />
                )}
              </Box>

              {selectedSubmission.submission_text && (
                <Box>
                  <Typography variant="subtitle1" fontWeight="bold">Submission Text:</Typography>
                  <Paper sx={{ p: 2, mt: 1, bgcolor: 'grey.50' }}>
                    <Typography variant="body2" whiteSpace="pre-wrap">
                      {selectedSubmission.submission_text}
                    </Typography>
                  </Paper>
                </Box>
              )}

              {selectedSubmission.attachment_paths && selectedSubmission.attachment_paths.length > 0 && (
                <Box>
                  <Typography variant="subtitle1" fontWeight="bold">Attachments:</Typography>
                  <Box display="flex" flexWrap="wrap" gap={1} sx={{ mt: 1 }}>
                    {selectedSubmission.attachment_paths.map((fileUrl, index) => {
                      const fileInfo = getFileInfo(fileUrl);
                      const fullUrl = `${getUploadBaseURL()}${fileUrl}`;
                      
                      return (
                        <Chip
                          key={index}
                          icon={fileInfo.icon}
                          label={fileUrl.split('/').pop()}
                          onClick={() => window.open(fullUrl, '_blank')}
                          clickable
                        />
                      );
                    })}
                  </Box>
                </Box>
              )}

              {selectedSubmission.status === 'graded' ? (
                <Box>
                  <Typography variant="subtitle1" fontWeight="bold">Grade:</Typography>
                  <Typography variant="h5" color="primary" sx={{ mt: 1 }}>
                    {selectedSubmission.score}/100
                  </Typography>
                  {selectedSubmission.feedback && (
                    <Paper sx={{ p: 2, mt: 1, bgcolor: 'grey.50' }}>
                      <Typography variant="body2" whiteSpace="pre-wrap">
                        {selectedSubmission.feedback}
                      </Typography>
                    </Paper>
                  )}
                  <Typography variant="caption" color="textSecondary" sx={{ mt: 1, display: 'block' }}>
                    Graded on: {selectedSubmission.graded_at ? formatDate(selectedSubmission.graded_at) : 'Unknown'}
                  </Typography>
                </Box>
              ) : (
                <Box>
                  <Typography variant="subtitle1" fontWeight="bold">Grade Submission:</Typography>
                  <TextField
                    label="Score (0-100)"
                    type="number"
                    value={gradeData.score}
                    onChange={(e) => setGradeData(prev => ({ ...prev, score: e.target.value }))}
                    fullWidth
                    sx={{ mt: 1 }}
                    inputProps={{ min: 0, max: 100 }}
                  />
                  <TextField
                    label="Feedback (optional)"
                    multiline
                    rows={3}
                    value={gradeData.feedback}
                    onChange={(e) => setGradeData(prev => ({ ...prev, feedback: e.target.value }))}
                    fullWidth
                    sx={{ mt: 2 }}
                  />
                </Box>
              )}
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setSelectedSubmission(null)}>
              Close
            </Button>
            {selectedSubmission.status !== 'graded' && (
              <Button
                onClick={handleGrade}
                variant="contained"
                disabled={isGrading || !gradeData.score}
                startIcon={isGrading ? <CircularProgress size={16} /> : null}
              >
                {isGrading ? 'Grading...' : 'Submit Grade'}
              </Button>
            )}
          </DialogActions>
        </Dialog>
      )}

      <DialogActions>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
};

export default SubmissionsView;

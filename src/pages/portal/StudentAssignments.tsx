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
  IconButton,
  Tooltip,
  Box,
} from '@mui/material';
import { Visibility, Download, PictureAsPdf, Description, Image } from '@mui/icons-material';
import { useStudentAssignments } from '../../hooks/useAssignments';
import SubmissionForm from '../../components/assignments/SubmissionForm';
import SubmissionGradeView from '../../components/assignments/SubmissionGradeView';
import { getUploadBaseURL } from '../../services/api';

// Helper function to determine file type and get appropriate icon
const getFileInfo = (fileUrl: string) => {
  // Add type checking to prevent errors
  if (!fileUrl || typeof fileUrl !== 'string') {
    return { type: 'file', icon: <Description />, label: 'View File' };
  }
  
  const extension = fileUrl.split('.').pop()?.toLowerCase();
  
  if (['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp'].includes(extension || '')) {
    return { type: 'image', icon: <Image />, label: 'View Image' };
  } else if (extension === 'pdf') {
    return { type: 'pdf', icon: <PictureAsPdf />, label: 'View PDF' };
  } else if (['doc', 'docx'].includes(extension || '')) {
    return { type: 'document', icon: <Description />, label: 'View Document' };
  } else {
    return { type: 'file', icon: <Description />, label: 'View File' };
  }
};

const StudentAssignments: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [subjectFilter, setSubjectFilter] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [submissionFormOpen, setSubmissionFormOpen] = useState(false);
  const [selectedAssignmentId, setSelectedAssignmentId] = useState<number | null>(null);
  const [gradeViewOpen, setGradeViewOpen] = useState(false);
  const [selectedAssignmentForGrade, setSelectedAssignmentForGrade] = useState<any>(null);

  const { 
    assignments, 
    isAssignmentsLoading, 
    assignmentsError, 
    refetchAssignments 
  } = useStudentAssignments({
    search: searchTerm || undefined,
    subject_id: subjectFilter ? parseInt(subjectFilter) : undefined,
    status: statusFilter || undefined,
  });

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

  const handleAssignmentSelect = (assignmentId: number) => {
    setSelectedAssignmentId(assignmentId);
    setSubmissionFormOpen(true);
  };

  const handleViewGrade = (assignment: any) => {
    setSelectedAssignmentForGrade(assignment);
    setGradeViewOpen(true);
  };

  const renderContent = () => {
    console.log('🔍 StudentAssignments - assignments:', assignments);
    console.log('🔍 StudentAssignments - assignments?.assignments:', assignments?.assignments);
    console.log('🔍 StudentAssignments - assignments?.assignments?.length:', assignments?.assignments?.length);
    
    return (
      <div style={{ padding: '24px' }}>
        <Typography variant="h4" style={{ marginBottom: '24px' }}>My Assignments</Typography>
        
        <Paper style={{ padding: '16px', marginBottom: '24px' }}>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Search assignments"
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
                  onChange={(e) => setStatusFilter(e.target.value)}
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

        <Alert severity="error" style={{ marginBottom: '16px', display: assignmentsError ? 'flex' : 'none' }}>
          Failed to load assignments
        </Alert>

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
                {isAssignmentsLoading ? (
                  <TableRow>
                    <TableCell colSpan={7} align="center">
                      <CircularProgress />
                    </TableCell>
                  </TableRow>
                ) : assignments?.assignments && assignments.assignments.length > 0 ? (
                  assignments.assignments.map((assignment) => (
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
                                                    {/* Display uploaded file with view/download options */}
                            {assignment.dynamic_data?.field_1756088632769 && (
                              <div style={{ marginTop: '8px', display: 'flex', gap: '8px', alignItems: 'center' }}>
                                {(() => {
                                  const fileUrl = assignment.dynamic_data.field_1756088632769;
                                  
                                  // Debug log to see what we're getting
                                  console.log('File data:', {
                                    fileUrl,
                                    type: typeof fileUrl,
                                    dynamicData: assignment.dynamic_data
                                  });
                                  
                                  // Additional safety check
                                  if (!fileUrl || typeof fileUrl !== 'string') {
                                    return (
                                      <Typography variant="caption" color="textSecondary">
                                        Invalid file data
                                      </Typography>
                                    );
                                  }
                                  
                                  const fileInfo = getFileInfo(fileUrl);
                                  const fullUrl = `${getUploadBaseURL()}${fileUrl}`;
                              
                              return (
                                <>
                                  <Tooltip title={fileInfo.label}>
                                    <IconButton
                                      size="small"
                                      onClick={() => window.open(fullUrl, '_blank')}
                                      sx={{ 
                                        color: 'primary.main',
                                        '&:hover': { backgroundColor: 'primary.light', color: 'white' }
                                      }}
                                    >
                                      {fileInfo.icon}
                                    </IconButton>
                                  </Tooltip>
                                  <Tooltip title="Download File">
                                    <IconButton
                                      size="small"
                                      onClick={() => {
                                        const link = document.createElement('a');
                                        link.href = fullUrl;
                                        link.download = fileUrl.split('/').pop() || 'assignment-file';
                                        document.body.appendChild(link);
                                        link.click();
                                        document.body.removeChild(link);
                                      }}
                                      sx={{ 
                                        color: 'success.main',
                                        '&:hover': { backgroundColor: 'success.light', color: 'white' }
                                      }}
                                    >
                                      <Download />
                                    </IconButton>
                                  </Tooltip>
                                  <Typography variant="caption" color="textSecondary">
                                    {fileUrl.split('/').pop()}
                                  </Typography>
                                </>
                              );
                            })()}
                          </div>
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
                        <Box display="flex" gap={1}>
                          <Button 
                            variant="contained" 
                            size="small" 
                            onClick={() => handleAssignmentSelect(assignment.id)}
                            disabled={assignment.status === 'submitted' || assignment.status === 'graded'}
                          >
                            {assignment.status === 'submitted' ? 'Submitted' : 
                             assignment.status === 'graded' ? 'Graded' : 'Submit'}
                          </Button>
                          {(assignment.status === 'submitted' || assignment.status === 'graded') && (
                            <Button 
                              variant="outlined" 
                              size="small" 
                              onClick={() => handleViewGrade(assignment)}
                            >
                              View Grade
                            </Button>
                          )}
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} align="center">
                      No assignments found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>

        {selectedAssignmentId && (
          <SubmissionForm
            open={submissionFormOpen}
            onClose={() => {
              setSubmissionFormOpen(false);
              setSelectedAssignmentId(null);
              refetchAssignments();
            }}
            assignmentId={selectedAssignmentId}
          />
        )}

        {/* Grade View Dialog */}
        {selectedAssignmentForGrade && (
          <SubmissionGradeView
            open={gradeViewOpen}
            onClose={() => {
              setGradeViewOpen(false);
              setSelectedAssignmentForGrade(null);
            }}
            assignmentId={selectedAssignmentForGrade.id}
            assignmentTitle={selectedAssignmentForGrade.title}
          />
        )}
      </div>
    );
  };

  return renderContent();
};

export default StudentAssignments;
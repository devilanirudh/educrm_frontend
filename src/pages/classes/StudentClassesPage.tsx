import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Chip,
  CircularProgress,
  Alert,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Divider,
} from '@mui/material';
import { ExpandMore as ExpandMoreIcon, School as SchoolIcon } from '@mui/icons-material';
import { studentsService } from '../../services/students';

interface ClassSubject {
  id: number;
  name: string;
  teacher: string;
  weekly_hours: number;
  is_optional: boolean;
  room_number?: string;
}

interface StudentClass {
  id: number;
  name: string;
  section: string;
  grade_level: number;
  academic_year: string;
  room_number?: string;
  subjects: ClassSubject[];
}

const StudentClassesPage: React.FC = () => {
  const [classes, setClasses] = useState<StudentClass[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const user = useSelector((state: RootState) => state.auth.user);

  useEffect(() => {
    const fetchStudentClasses = async () => {
      try {
        setLoading(true);
        const data = await studentsService.getMyClasses();
        if (data.classes && data.classes.length > 0) {
          setClasses(data.classes);
        }
      } catch (err: any) {
        setError(err.message || 'Failed to load classes');
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchStudentClasses();
    }
  }, [user]);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return <Alert severity="error">{error}</Alert>;
  }

  if (classes.length === 0) {
    return (
      <Alert severity="info">
        You are not currently enrolled in any classes. Please contact your administrator.
      </Alert>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        My Classes
      </Typography>
      
      <Grid container spacing={3}>
        {classes.map((classItem) => (
          <Grid item xs={12} md={8} key={classItem.id}>
            <Card>
              <CardContent>
                <Box display="flex" alignItems="center" mb={2}>
                  <SchoolIcon sx={{ mr: 2, color: 'primary.main' }} />
                  <Box>
                    <Typography variant="h5" component="h2">
                      {classItem.name} - {classItem.section}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Academic Year: {classItem.academic_year}
                    </Typography>
                    {classItem.room_number && (
                      <Typography variant="body2" color="text.secondary">
                        Room: {classItem.room_number}
                      </Typography>
                    )}
                  </Box>
                </Box>
                
                <Divider sx={{ my: 2 }} />
                
                <Typography variant="h6" gutterBottom>
                  My Subjects ({classItem.subjects.length})
                </Typography>
                
                <Grid container spacing={2}>
                  {classItem.subjects.map((subject) => (
                    <Grid item xs={12} sm={6} key={subject.id}>
                      <Accordion>
                        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                          <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                            <Typography variant="subtitle1" sx={{ flexGrow: 1 }}>
                              {subject.name}
                            </Typography>

                            {subject.is_optional && (
                              <Chip label="Optional" size="small" color="warning" />
                            )}
                          </Box>
                        </AccordionSummary>
                        <AccordionDetails>
                          <Box>
                            <Typography variant="body2" color="text.secondary" gutterBottom>
                              <strong>Teacher:</strong> {subject.teacher}
                            </Typography>

                            {subject.room_number && (
                              <Typography variant="body2" color="text.secondary" gutterBottom>
                                <strong>Room:</strong> {subject.room_number}
                              </Typography>
                            )}
                            {subject.is_optional && (
                              <Typography variant="body2" color="text.secondary">
                                <strong>Note:</strong> This is an optional subject
                              </Typography>
                            )}
                          </Box>
                        </AccordionDetails>
                      </Accordion>
                    </Grid>
                  ))}
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default StudentClassesPage;

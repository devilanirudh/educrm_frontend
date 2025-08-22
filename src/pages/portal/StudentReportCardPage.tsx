import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
  Container,
  Paper,
  Typography,
  Grid,
  CircularProgress,
  Alert,
} from '@mui/material';
import { getStudentReportCard } from '../../services/reportCards'; // Assuming this API function exists

const StudentReportCardPage: React.FC = () => {
  const { studentId } = useParams<{ studentId: string }>();
  const [reportCard, setReportCard] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (studentId) {
        try {
          setLoading(true);
          setError(null);
          const data = await getStudentReportCard(studentId);
          setReportCard(data);
        } catch (err: any) {
          setError(err.message || 'Failed to load report card');
        } finally {
          setLoading(false);
        }
      }
    };
    fetchData();
  }, [studentId]);

  if (loading) {
    return <CircularProgress />;
  }

  if (error) {
    return <Alert severity="error">{error}</Alert>;
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Report Card
        </Typography>
        {reportCard ? (
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Typography variant="h6">
                Student: {reportCard.student_name}
              </Typography>
            </Grid>
            <Grid item xs={12}>
              {/* This is a placeholder for the report card view. */}
              {/* In a real application, you would render the report card data here. */}
              <pre>{JSON.stringify(reportCard, null, 2)}</pre>
            </Grid>
          </Grid>
        ) : (
          <Typography>No report card data available.</Typography>
        )}
      </Paper>
    </Container>
  );
};

export default StudentReportCardPage;
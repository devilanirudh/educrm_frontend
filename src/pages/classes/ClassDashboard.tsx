import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
  Box,
  Typography,
  Tabs,
  Tab,
  CircularProgress,
  Alert,
} from '@mui/material';
import { classesService, Class } from '../../services/classes';
import TeacherAttendanceMarking from '../../components/attendance/TeacherAttendanceMarking';
import ClassRoster from './components/ClassRoster';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`class-tabpanel-${index}`}
      aria-labelledby={`class-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

const ClassDashboard: React.FC = () => {
  const { class_id } = useParams<{ class_id: string }>();
  const [classData, setClassData] = useState<Class | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tabValue, setTabValue] = useState(0);

  useEffect(() => {
    const fetchClassData = async () => {
      try {
        if (class_id) {
          const data = await classesService.getClass(parseInt(class_id, 10));
          setClassData(data);
        }
      } catch (err: any) {
        setError(err.message || 'Failed to load class data');
      } finally {
        setLoading(false);
      }
    };
    fetchClassData();
  }, [class_id]);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

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

  if (!classData) {
    return <Alert severity="info">Class not found.</Alert>;
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        {classData.name} - {classData.section}
      </Typography>

      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={tabValue} onChange={handleTabChange} aria-label="class dashboard tabs">
          <Tab label="Roster" />
          <Tab label="Assignments" />
          <Tab label="Exams" />
          <Tab label="Attendance" />
        </Tabs>
      </Box>
      <TabPanel value={tabValue} index={0}>
        {classData && <ClassRoster classId={classData.id} />}
      </TabPanel>
      <TabPanel value={tabValue} index={1}>
        {/* Assignments content will go here */}
        <Typography>Assignments</Typography>
      </TabPanel>
      <TabPanel value={tabValue} index={2}>
        {/* Exams content will go here */}
        <Typography>Exams</Typography>
      </TabPanel>
      <TabPanel value={tabValue} index={3}>
        {/* Attendance content */}
        {classData && <TeacherAttendanceMarking classId={classData.id} />}
      </TabPanel>
    </Box>
  );
};

export default ClassDashboard;
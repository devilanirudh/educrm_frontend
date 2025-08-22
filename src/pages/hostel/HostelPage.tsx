import React, { useState } from 'react';
import {
  Container,
  Typography,
  Box,
  Tabs,
  Tab,
} from '@mui/material';

const HostelPage: React.FC = () => {
  const [selectedTab, setSelectedTab] = useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setSelectedTab(newValue);
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Hostel Management
        </Typography>
      </Box>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={selectedTab} onChange={handleChange} aria-label="hostel tabs">
          <Tab label="Rooms" />
          <Tab label="Students" />
          <Tab label="Attendance" />
        </Tabs>
      </Box>
      <Box sx={{ p: 3 }}>
        {selectedTab === 0 && (
          <Typography>
            Hostel rooms content will be displayed here.
          </Typography>
        )}
        {selectedTab === 1 && (
          <Typography>
            Hostel students content will be displayed here.
          </Typography>
        )}
        {selectedTab === 2 && (
          <Typography>
            Hostel attendance content will be displayed here.
          </Typography>
        )}
      </Box>
    </Container>
  );
};

export default HostelPage;

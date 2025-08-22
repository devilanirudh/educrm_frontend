import React, { useState } from 'react';
import {
  Container,
  Typography,
  Box,
  Tabs,
  Tab,
} from '@mui/material';

const CommunicationPage: React.FC = () => {
  const [selectedTab, setSelectedTab] = useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setSelectedTab(newValue);
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Communication Center
        </Typography>
      </Box>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={selectedTab} onChange={handleChange} aria-label="communication tabs">
          <Tab label="Announcements" />
          <Tab label="Messages" />
          <Tab label="Email" />
        </Tabs>
      </Box>
      <Box sx={{ p: 3 }}>
        {selectedTab === 0 && (
          <Typography>
            Announcements content will be displayed here.
          </Typography>
        )}
        {selectedTab === 1 && (
          <Typography>
            Messages content will be displayed here.
          </Typography>
        )}
        {selectedTab === 2 && (
          <Typography>
            Email content will be displayed here.
          </Typography>
        )}
      </Box>
    </Container>
  );
};

export default CommunicationPage;

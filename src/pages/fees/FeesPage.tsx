import React, { useState } from 'react';
import { Box, Typography, Tabs, Tab } from '@mui/material';
import FeesOverview from './FeesOverview';
import FeeStructures from './FeeStructures';
import Invoices from './Invoices';
import Transactions from './Transactions';
import FeesReports from './FeesReports';

const FeesPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Fees & Payments
      </Typography>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={activeTab} onChange={handleChange} aria-label="fees tabs">
          <Tab label="Overview" />
          <Tab label="Structures" />
          <Tab label="Invoices" />
          <Tab label="Transactions" />
          <Tab label="Reports" />
        </Tabs>
      </Box>
      <Box sx={{ mt: 3 }}>
        {activeTab === 0 && <FeesOverview />}
        {activeTab === 1 && <FeeStructures />}
        {activeTab === 2 && <Invoices />}
        {activeTab === 3 && <Transactions />}
        {activeTab === 4 && <FeesReports />}
      </Box>
    </Box>
  );
};

export default FeesPage;

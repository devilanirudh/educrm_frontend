import React, { useState } from 'react';
import { Box, Tabs, Tab, Paper } from '@mui/material';
import Builder from './Builder';
import Preview from './Preview';
import { Build, Preview as PreviewIcon } from '@mui/icons-material';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;
  return (
    <div role="tabpanel" hidden={value !== index} {...other}>
      {value === index && <Box>{children}</Box>}
    </div>
  );
}

export default function FormBuilderPage() {
  const [tabIndex, setTabIndex] = useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabIndex(newValue);
  };

  return (
    <Paper sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={tabIndex} onChange={handleChange}>
          <Tab icon={<Build />} iconPosition="start" label="Builder" />
          <Tab icon={<PreviewIcon />} iconPosition="start" label="Preview" />
        </Tabs>
      </Box>
      <Box sx={{ flex: 1, overflow: 'auto' }}>
        <TabPanel value={tabIndex} index={0}>
          <Builder />
        </TabPanel>
        <TabPanel value={tabIndex} index={1}>
          <Preview />
        </TabPanel>
      </Box>
    </Paper>
  );
}
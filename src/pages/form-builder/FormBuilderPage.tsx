import React, { useState } from 'react';
import { 
  Box, 
  Tabs, 
  Tab, 
  Paper, 
  useTheme, 
  useMediaQuery, 
  IconButton, 
  Drawer,
  Typography   // ✅ FIX: Added Typography here
} from '@mui/material';
import Builder from './Builder';
import Preview from './Preview';
import { 
  Build, 
  Preview as PreviewIcon, 
  Menu as MenuIcon, 
  Edit as EditIcon 
} from '@mui/icons-material';
import FieldPalette from '../../components/form-builder/FieldPalette';
import PropertyEditor from '../../components/form-builder/PropertyEditor';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;
  return (
    <div role="tabpanel" hidden={value !== index} {...other}>
      {value === index && <Box sx={{ height: '100%' }}>{children}</Box>}
    </div>
  );
}

export default function FormBuilderPage() {
  const [tabIndex, setTabIndex] = useState(0);
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [editorOpen, setEditorOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabIndex(newValue);
  };

  const builderContent = isMobile ? (
    <>
      <Box 
        sx={{ 
          p: 1, 
          display: 'flex', 
          justifyContent: 'space-between', 
          borderBottom: 1, 
          borderColor: 'divider' 
        }}
      >
        <IconButton onClick={() => setPaletteOpen(true)}>
          <MenuIcon />
        </IconButton>
        
        <Typography sx={{ alignSelf: 'center' }}>Canvas</Typography> {/* ✅ FIXED */}

        <IconButton onClick={() => setEditorOpen(true)}>
          <EditIcon />
        </IconButton>
      </Box>

      {/* Left Drawer - Field Palette */}
      <Drawer anchor="left" open={paletteOpen} onClose={() => setPaletteOpen(false)}>
        <FieldPalette />
      </Drawer>

      {/* Right Drawer - Property Editor */}
      <Drawer anchor="right" open={editorOpen} onClose={() => setEditorOpen(false)}>
        <PropertyEditor />
      </Drawer>

      <Builder />
    </>
  ) : (
    <Builder />
  );

  return (
    <Paper sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Tabs */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={tabIndex} onChange={handleChange}>
          <Tab icon={<Build />} iconPosition="start" label="Builder" />
          <Tab icon={<PreviewIcon />} iconPosition="start" label="Preview" />
        </Tabs>
      </Box>

      {/* Tab Panels */}
      <Box sx={{ flex: 1, overflow: 'auto' }}>
        <TabPanel value={tabIndex} index={0}>
          {builderContent}
        </TabPanel>
        <TabPanel value={tabIndex} index={1}>
          <Preview />
        </TabPanel>
      </Box>
    </Paper>
  );
}

import React, { useState } from 'react';
import {
  Drawer,
  Box,
  Typography,
  Button,
  TextField,
  useTheme,
  useMediaQuery,
} from '@mui/material';

interface ExamFilterDrawerProps {
  open: boolean;
  onClose: () => void;
  onApply: (filters: Record<string, any>) => void;
  pinned?: boolean;
}

const ExamFilterDrawer: React.FC<ExamFilterDrawerProps> = ({
  open,
  onClose,
  onApply,
  pinned,
}) => {
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up('md'));
  const [filters, setFilters] = useState<Record<string, any>>({
    class_id: '',
    subject_id: '',
    status: '',
  });

  const handleChange = (name: string, value: any) => {
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const handleApply = () => {
    onApply(filters);
    onClose();
  };

  const handleClear = () => {
    setFilters({
      class_id: '',
      subject_id: '',
      status: '',
    });
  };

  const content = (
    <Box sx={{ width: 350, p: 3 }}>
      <Typography variant="h6" gutterBottom>
        Filters
      </Typography>
      <TextField
        label="Class ID"
        fullWidth
        margin="normal"
        value={filters.class_id}
        onChange={(e) => handleChange('class_id', e.target.value)}
      />
      <TextField
        label="Subject ID"
        fullWidth
        margin="normal"
        value={filters.subject_id}
        onChange={(e) => handleChange('subject_id', e.target.value)}
      />
      <TextField
        label="Status"
        fullWidth
        margin="normal"
        value={filters.status}
        onChange={(e) => handleChange('status', e.target.value)}
      />
      <Box sx={{ mt: 3, display: 'flex', justifyContent: 'space-between' }}>
        <Button onClick={handleClear}>Clear</Button>
        <Button variant="contained" onClick={handleApply}>
          Apply
        </Button>
      </Box>
    </Box>
  );

  if (isDesktop && pinned) {
    return (
      <Box
        sx={{
          width: 350,
          borderRight: `1px solid ${theme.palette.divider}`,
          height: 'calc(100vh - 64px)',
          overflowY: 'auto',
        }}
      >
        {content}
      </Box>
    );
  }

  return (
    <Drawer anchor="right" open={open} onClose={onClose}>
      {content}
    </Drawer>
  );
};

export default ExamFilterDrawer;
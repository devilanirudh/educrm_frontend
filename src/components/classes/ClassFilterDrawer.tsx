import React, { useState } from 'react';
import {
  Drawer,
  Box,
  Typography,
  Button,
  TextField,
} from '@mui/material';

interface ClassFilterDrawerProps {
  open: boolean;
  onClose: () => void;
  onApply: (filters: Record<string, any>) => void;
}

const ClassFilterDrawer: React.FC<ClassFilterDrawerProps> = ({
  open,
  onClose,
  onApply,
}) => {
  const [filters, setFilters] = useState<Record<string, any>>({
    session: '',
    medium: '',
    class_teacher_id: '',
    capacity_min: '',
    capacity_max: '',
  });

  const handleChange = (name: string, value: any) => {
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const handleApply = () => {
    const activeFilters: Record<string, any> = {};
    for (const key in filters) {
      if (filters[key]) {
        activeFilters[key] = filters[key];
      }
    }
    onApply(activeFilters);
    onClose();
  };

  const handleClear = () => {
    setFilters({
      session: '',
      medium: '',
      class_teacher_id: '',
      capacity_min: '',
      capacity_max: '',
    });
  };

  return (
    <Drawer anchor="right" open={open} onClose={onClose}>
      <Box sx={{ width: 350, p: 3 }}>
        <Typography variant="h6" gutterBottom>
          Filters
        </Typography>
        <TextField
          label="Session"
          fullWidth
          margin="normal"
          value={filters.session}
          onChange={(e) => handleChange('session', e.target.value)}
        />
        <TextField
          label="Medium"
          fullWidth
          margin="normal"
          value={filters.medium}
          onChange={(e) => handleChange('medium', e.target.value)}
        />
        <TextField
          label="Class Teacher ID"
          fullWidth
          margin="normal"
          value={filters.class_teacher_id}
          onChange={(e) => handleChange('class_teacher_id', e.target.value)}
        />
        <TextField
          label="Min Capacity"
          type="number"
          fullWidth
          margin="normal"
          value={filters.capacity_min}
          onChange={(e) => handleChange('capacity_min', e.target.value)}
        />
        <TextField
          label="Max Capacity"
          type="number"
          fullWidth
          margin="normal"
          value={filters.capacity_max}
          onChange={(e) => handleChange('capacity_max', e.target.value)}
        />
        <Box sx={{ mt: 3, display: 'flex', justifyContent: 'space-between' }}>
          <Button onClick={handleClear}>Clear</Button>
          <Button variant="contained" onClick={handleApply}>
            Apply
          </Button>
        </Box>
      </Box>
    </Drawer>
  );
};

export default ClassFilterDrawer;
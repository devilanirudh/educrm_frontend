import React, { useState, useEffect } from 'react';
import {
  Drawer,
  Box,
  Typography,
  Button,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Divider,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import { FormField } from '../../types/formBuilder';

interface Preset {
  name: string;
  filters: Record<string, any>;
}

interface TeacherFilterDrawerProps {
  open: boolean;
  onClose: () => void;
  schema: FormField[];
  onApply: (filters: Record<string, any>) => void;
  pinned?: boolean;
}

const TeacherFilterDrawer: React.FC<TeacherFilterDrawerProps> = ({
  open,
  onClose,
  schema,
  onApply,
  pinned,
}) => {
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up('md'));
  const [filters, setFilters] = useState<Record<string, any>>({});
  const [presetName, setPresetName] = useState('');
  const [presets, setPresets] = useState<Preset[]>([]);

  useEffect(() => {
    const initialFilters: Record<string, any> = {};
    schema.forEach(field => {
      initialFilters[field.field_name] = '';
    });
    setFilters(initialFilters);
    // Mock loading presets
    const savedPresets = localStorage.getItem('teacherFilterPresets');
    if (savedPresets) {
      setPresets(JSON.parse(savedPresets));
    }
  }, [schema]);

  const handleChange = (name: string, value: any) => {
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const handleApply = () => {
    onApply(filters);
    onClose();
  };

  const handleClear = () => {
    const clearedFilters: Record<string, any> = {};
    schema.forEach(field => {
      clearedFilters[field.field_name] = '';
    });
    setFilters(clearedFilters);
  };

  const handleSavePreset = () => {
    if (presetName) {
      const newPreset = { name: presetName, filters };
      const updatedPresets = [...presets, newPreset];
      setPresets(updatedPresets);
      localStorage.setItem('teacherFilterPresets', JSON.stringify(updatedPresets));
      setPresetName('');
    }
  };

  const handleSelectPreset = (preset: Preset) => {
    setFilters(preset.filters);
  };

  const renderField = (field: FormField) => {
    switch (field.field_type) {
      case 'select':
        return (
          <FormControl fullWidth margin="normal" key={field.field_name}>
            <InputLabel>{field.label}</InputLabel>
            <Select
              value={filters[field.field_name] || ''}
              onChange={(e) => handleChange(field.field_name, e.target.value)}
              label={field.label}
            >
              {field.options?.map(option => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        );
      case 'date':
        return (
          <TextField
            key={field.field_name}
            label={field.label}
            type="date"
            fullWidth
            margin="normal"
            value={filters[field.field_name] || ''}
            onChange={(e) => handleChange(field.field_name, e.target.value)}
            InputLabelProps={{ shrink: true }}
          />
        );
      default:
        return (
          <TextField
            key={field.field_name}
            label={field.label}
            fullWidth
            margin="normal"
            value={filters[field.field_name] || ''}
            onChange={(e) => handleChange(field.field_name, e.target.value)}
          />
        );
    }
  };

  const content = (
    <Box sx={{ width: 350, p: 3 }}>
      <Typography variant="h6" gutterBottom>
        Filters
      </Typography>
      {schema.map(renderField)}
      <Box sx={{ mt: 3, display: 'flex', justifyContent: 'space-between' }}>
        <Button onClick={handleClear}>Clear</Button>
        <Button variant="contained" onClick={handleApply}>
          Apply
        </Button>
      </Box>
      <Divider sx={{ my: 3 }} />
      <Typography variant="h6" gutterBottom>
        Save as Preset
      </Typography>
      <TextField
        label="Preset Name"
        fullWidth
        margin="normal"
        value={presetName}
        onChange={(e) => setPresetName(e.target.value)}
      />
      <Button
        variant="outlined"
        fullWidth
        onClick={handleSavePreset}
        disabled={!presetName}
      >
        Save Preset
      </Button>
      {presets.length > 0 && (
        <Box sx={{ mt: 3 }}>
          <Typography variant="h6" gutterBottom>
            Saved Presets
          </Typography>
          <FormControl fullWidth margin="normal">
            <InputLabel>Select Preset</InputLabel>
            <Select
              onChange={(e) => handleSelectPreset(e.target.value as Preset)}
              label="Select Preset"
            >
              {presets.map(p => (
                <MenuItem key={p.name} value={p as any}>
                  {p.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
      )}
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

export default TeacherFilterDrawer;
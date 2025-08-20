import React from 'react';
import { useFormBuilderStore } from '../../store/useFormBuilderStore';
import type { FormField, OptionsField } from '../../types/schema';
import { nanoid } from 'nanoid';
import { Box, Typography, TextField, FormControlLabel, Checkbox, Button, IconButton, Paper, Divider } from '@mui/material';
import { Add as AddIcon, Delete as DeleteIcon } from '@mui/icons-material';

export default function PropertyEditor() {
  const { schema, selectedId, updateField, removeField } = useFormBuilderStore();
  const field = schema.fields.find(f => f.id === selectedId);

  if (!field) {
    return (
      <Paper elevation={0} square sx={{ p: 2, borderLeft: 1, borderColor: 'divider', width: 300 }}>
        <Typography color="text.secondary">Select a field to edit its properties.</Typography>
      </Paper>
    );
  }

  const set = (patch: Partial<FormField>) => updateField(field.id, patch);

  const isOptionsField = field.type === 'select' || field.type === 'radio';
  const options = isOptionsField ? (field as OptionsField).options : [];

  const handleOptionChange = (optionId: string, key: 'label' | 'value', newValue: string) => {
    const newOptions = options.map(opt =>
      opt.id === optionId ? { ...opt, [key]: newValue } : opt
    );
    set({ ...field, options: newOptions } as OptionsField);
  };

  const addOption = () => {
    const newOption = { id: nanoid(), label: 'New Option', value: 'new_option' };
    set({ ...field, options: [...options, newOption] } as OptionsField);
  };

  const removeOption = (optionId: string) => {
    const newOptions = options.filter(opt => opt.id !== optionId);
    set({ ...field, options: newOptions } as OptionsField);
  };

  return (
    <Paper elevation={0} square sx={{ p: 2, borderLeft: 1, borderColor: 'divider', width: 300, overflowY: 'auto' }}>
      <Typography variant="h6" sx={{ mb: 2 }}>
        Properties
      </Typography>
      <Box component="form" noValidate autoComplete="off" sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <TextField label="Label" value={field.label} onChange={e => set({ label: e.target.value })} size="small" fullWidth />
        <TextField label="Name / ID" value={field.name} onChange={e => set({ name: e.target.value })} size="small" fullWidth helperText="Unique identifier for this field" />
        <TextField label="Placeholder" value={field.placeholder ?? ''} onChange={e => set({ placeholder: e.target.value })} size="small" fullWidth />
        <TextField label="Help Text" value={field.helpText ?? ''} onChange={e => set({ helpText: e.target.value })} size="small" fullWidth multiline rows={2} />
        <FormControlLabel control={<Checkbox checked={!!field.required} onChange={e => set({ required: e.target.checked })} />} label="Required" />
        
        {isOptionsField && (
          <>
            <Divider sx={{ my: 1 }} />
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="subtitle1">Options</Typography>
              <Button startIcon={<AddIcon />} onClick={addOption} size="small">Add</Button>
            </Box>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, maxHeight: 200, overflowY: 'auto' }}>
              {options.map(opt => (
                <Paper key={opt.id} variant="outlined" sx={{ p: 1, display: 'flex', gap: 1, alignItems: 'center' }}>
                  <TextField label="Label" value={opt.label} onChange={e => handleOptionChange(opt.id, 'label', e.target.value)} size="small" sx={{ flex: 1 }} />
                  <TextField label="Value" value={opt.value} onChange={e => handleOptionChange(opt.id, 'value', e.target.value)} size="small" sx={{ flex: 1 }} />
                  <IconButton onClick={() => removeOption(opt.id)} size="small"><DeleteIcon fontSize="small" /></IconButton>
                </Paper>
              ))}
            </Box>
          </>
        )}

        <Divider sx={{ my: 1 }} />
        <Button color="error" startIcon={<DeleteIcon />} onClick={() => removeField(field.id)}>
          Delete Field
        </Button>
      </Box>
    </Paper>
  );
}
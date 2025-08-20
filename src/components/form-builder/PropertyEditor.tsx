import React from 'react';
import { useFormBuilderStore } from '../../store/useFormBuilderStore';
import type { FormField, OptionsField, ImageField, ValidationRules } from '../../types/schema';
import { nanoid } from 'nanoid';
import { Box, Typography, TextField, FormControlLabel, Checkbox, Button, IconButton, Paper, Divider, Stack, ToggleButtonGroup, ToggleButton } from '@mui/material';
import { Add as AddIcon, Delete as DeleteIcon } from '@mui/icons-material';

const ValidationEditor = ({ validations, setValidations }: { validations: ValidationRules, setValidations: (v: ValidationRules) => void }) => (
  <Stack spacing={1}>
    <FormControlLabel
      control={<Checkbox checked={!!validations.required} onChange={e => setValidations({ ...validations, required: e.target.checked })} />}
      label="Required"
    />
    <TextField
      label="Min Length"
      type="number"
      size="small"
      value={validations.minLength ?? ''}
      onChange={e => setValidations({ ...validations, minLength: e.target.value ? parseInt(e.target.value) : undefined })}
    />
    <TextField
      label="Max Length"
      type="number"
      size="small"
      value={validations.maxLength ?? ''}
      onChange={e => setValidations({ ...validations, maxLength: e.target.value ? parseInt(e.target.value) : undefined })}
    />
  </Stack>
);

const OptionsEditor = ({ field, set }: { field: OptionsField, set: (patch: Partial<FormField>) => void }) => {
  const handleOptionChange = (optionId: string, key: 'label' | 'value', newValue: string) => {
    const newOptions = field.options.map(opt =>
      opt.id === optionId ? { ...opt, [key]: newValue } : opt
    );
    set({ options: newOptions });
  };

  const addOption = () => {
    const newOption = { id: nanoid(), label: 'New Option', value: `option_${nanoid(4)}` };
    set({ options: [...field.options, newOption] });
  };

  const removeOption = (optionId: string) => {
    set({ options: field.options.filter(opt => opt.id !== optionId) });
  };

  return (
    <Stack spacing={1}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="subtitle1">Options</Typography>
        <Button startIcon={<AddIcon />} onClick={addOption} size="small">Add</Button>
      </Box>
      <Stack spacing={1} sx={{ maxHeight: 200, overflowY: 'auto', p: 0.5 }}>
        {field.options.map(opt => (
          <Paper key={opt.id} variant="outlined" sx={{ p: 1, display: 'flex', gap: 1, alignItems: 'center' }}>
            <TextField label="Label" value={opt.label} onChange={e => handleOptionChange(opt.id, 'label', e.target.value)} size="small" sx={{ flex: 1 }} />
            <TextField label="Value" value={opt.value} onChange={e => handleOptionChange(opt.id, 'value', e.target.value)} size="small" sx={{ flex: 1 }} />
            <IconButton onClick={() => removeOption(opt.id)} size="small"><DeleteIcon fontSize="small" /></IconButton>
          </Paper>
        ))}
      </Stack>
    </Stack>
  );
};

const ImagePropertyEditor = ({ field, set }: { field: ImageField, set: (patch: Partial<FormField>) => void }) => (
  <Stack spacing={2}>
    <Typography variant="subtitle1">Image Options</Typography>
    <TextField
      label="Aspect Ratio"
      type="number"
      size="small"
      value={field.aspectRatio ?? ''}
      onChange={e => set({ aspectRatio: e.target.value ? parseFloat(e.target.value) : undefined })}
      helperText="e.g., 1 for square, 1.77 for 16:9"
    />
     <ToggleButtonGroup
      value={String(field.aspectRatio)}
      exclusive
      size="small"
      onChange={(_, v) => set({ aspectRatio: v ? parseFloat(v) : undefined })}
      aria-label="aspect ratio presets"
    >
      <ToggleButton value="1">1:1</ToggleButton>
      <ToggleButton value="1.33">4:3</ToggleButton>
      <ToggleButton value="1.77">16:9</ToggleButton>
    </ToggleButtonGroup>
  </Stack>
);

export default function PropertyEditor() {
  const { schema, selectedId, updateField, removeField } = useFormBuilderStore();
  const field = schema.fields.find(f => f.id === selectedId);

  if (!field) {
    return (
      <Paper elevation={0} square sx={{ p: 2, borderLeft: 1, borderColor: 'divider', width: 300, height: '100%' }}>
        <Typography color="text.secondary">Select a field to edit its properties.</Typography>
      </Paper>
    );
  }

  const set = (patch: Partial<FormField>) => updateField(field.id, patch);
  const setValidations = (validations: ValidationRules) => set({ validations });

  return (
    <Paper elevation={0} square sx={{ p: 2, borderLeft: 1, borderColor: 'divider', width: 300, overflowY: 'auto', height: '100%' }}>
      <Typography variant="h6" sx={{ mb: 2 }}>
        Properties
      </Typography>
      <Stack spacing={2} divider={<Divider />}>
        <Stack spacing={2}>
          <TextField label="Label" value={field.label} onChange={e => set({ label: e.target.value })} size="small" fullWidth />
          <TextField label="Name / ID" value={field.name} onChange={e => set({ name: e.target.value })} size="small" fullWidth helperText="Unique identifier for this field" />
          <TextField label="Placeholder" value={field.placeholder ?? ''} onChange={e => set({ placeholder: e.target.value })} size="small" fullWidth />
          <TextField label="Help Text" value={field.helpText ?? ''} onChange={e => set({ helpText: e.target.value })} size="small" fullWidth multiline rows={2} />
        </Stack>

        <ValidationEditor validations={field.validations ?? {}} setValidations={setValidations} />

        {(field.type === 'select' || field.type === 'radio') && <OptionsEditor field={field as OptionsField} set={set} />}
        {field.type === 'image' && <ImagePropertyEditor field={field as ImageField} set={set} />}

        <Button color="error" startIcon={<DeleteIcon />} onClick={() => removeField(field.id)}>
          Delete Field
        </Button>
      </Stack>
    </Paper>
  );
}
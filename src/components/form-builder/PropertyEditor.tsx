import React from 'react';
import {
  Box,
  Typography,
  TextField,
  FormControlLabel,
  Checkbox,
  Paper,
  Button,
  IconButton,
  List,
  ListItem,
  ListItemText,
} from '@mui/material';
import { Delete, Add } from '@mui/icons-material';
import { nanoid } from 'nanoid';
import { useFormBuilderStore } from '../../store/useFormBuilderStore';
import type { FormField, OptionsField } from '../../types/formBuilder';

const PropertyEditor: React.FC = () => {
  const { schema, selectedId, updateField } = useFormBuilderStore();
  const field = schema.fields.find((f) => f.id === selectedId);

  if (!field) {
    return (
      <Paper
        variant="outlined"
        sx={{ width: 320, p: 2, borderLeft: 1, borderColor: 'divider', height: '100%' }}
      >
        <Typography color="text.secondary">Select a field to see its properties.</Typography>
      </Paper>
    );
  }

  const set = (patch: Partial<FormField>) => updateField(field.id, patch);

  const isOptionsField = field.type === 'select' || field.type === 'radio';
  const options = isOptionsField ? (field as OptionsField).options : [];

  const handleOptionChange = (optionId: string, key: 'label' | 'value', value: string) => {
    const newOptions = options.map((opt) =>
      opt.id === optionId ? { ...opt, [key]: value } : opt
    );
    set({ options: newOptions } as Partial<OptionsField>);
  };

  const addOption = () => {
    const newOption = { id: nanoid(), label: 'New Option', value: 'new_option' };
    set({ options: [...options, newOption] } as Partial<OptionsField>);
  };

  const removeOption = (optionId: string) => {
    const newOptions = options.filter((opt) => opt.id !== optionId);
    set({ options: newOptions } as Partial<OptionsField>);
  };

  return (
    <Paper
      variant="outlined"
      sx={{ width: 320, p: 2, borderLeft: 1, borderColor: 'divider', height: '100%', overflowY: 'auto' }}
    >
      <Typography variant="h6" gutterBottom>
        Properties
      </Typography>
      <Box component="form" noValidate autoComplete="off" sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <TextField
          label="Label"
          value={field.label}
          onChange={(e) => set({ label: e.target.value })}
          fullWidth
          size="small"
        />
        <TextField
          label="Name / ID"
          value={field.name}
          onChange={(e) => set({ name: e.target.value })}
          fullWidth
          size="small"
          helperText="Unique identifier for this field."
        />
        <TextField
          label="Placeholder"
          value={field.placeholder ?? ''}
          onChange={(e) => set({ placeholder: e.target.value })}
          fullWidth
          size="small"
        />
        <TextField
          label="Help Text"
          value={field.helpText ?? ''}
          onChange={(e) => set({ helpText: e.target.value })}
          fullWidth
          size="small"
          multiline
          rows={2}
        />
        <FormControlLabel
          control={
            <Checkbox
              checked={!!field.required}
              onChange={(e) => set({ required: e.target.checked })}
            />
          }
          label="Required"
        />

        {isOptionsField && (
          <Box>
            <Typography variant="subtitle1" gutterBottom>
              Options
            </Typography>
            <List dense>
              {options.map((opt) => (
                <ListItem
                  key={opt.id}
                  secondaryAction={
                    <IconButton edge="end" aria-label="delete" onClick={() => removeOption(opt.id)}>
                      <Delete />
                    </IconButton>
                  }
                  disablePadding
                >
                  <Box sx={{ display: 'flex', gap: 1, width: '100%', pr: '40px' }}>
                    <TextField
                      label="Label"
                      value={opt.label}
                      onChange={(e) => handleOptionChange(opt.id, 'label', e.target.value)}
                      size="small"
                      sx={{ flex: 1 }}
                    />
                    <TextField
                      label="Value"
                      value={opt.value}
                      onChange={(e) => handleOptionChange(opt.id, 'value', e.target.value)}
                      size="small"
                      sx={{ flex: 1 }}
                    />
                  </Box>
                </ListItem>
              ))}
            </List>
            <Button startIcon={<Add />} onClick={addOption} size="small">
              Add Option
            </Button>
          </Box>
        )}
      </Box>
    </Paper>
  );
};

export default PropertyEditor;
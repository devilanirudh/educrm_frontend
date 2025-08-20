import React from 'react';
import { Box, Typography, List, ListItemButton, ListItemText, Paper } from '@mui/material';
import type { FieldType } from '../../types/schema';
import { useFormBuilderStore } from '../../store/useFormBuilderStore';

const PALETTE: { type: FieldType; label: string }[] = [
  { type: 'text', label: 'Text Input' },
  { type: 'email', label: 'Email' },
  { type: 'number', label: 'Number' },
  { type: 'textarea', label: 'Text Area' },
  { type: 'select', label: 'Select Dropdown' },
  { type: 'radio', label: 'Radio Group' },
  { type: 'checkbox', label: 'Checkbox' },
  { type: 'date', label: 'Date Picker' },
  { type: 'file', label: 'File Upload' },
];

export default function FieldPalette() {
  const addField = useFormBuilderStore(s => s.addField);

  return (
    <Paper
      elevation={0}
      square
      sx={{ p: 2, borderRight: 1, borderColor: 'divider', width: 240, overflowY: 'auto' }}
    >
      <Typography variant="h6" sx={{ mb: 1 }}>
        Fields
      </Typography>
      <List component="nav" dense>
        {PALETTE.map(p => (
          <ListItemButton key={p.type} onClick={() => addField(p.type)}>
            <ListItemText primary={p.label} />
          </ListItemButton>
        ))}
      </List>
    </Paper>
  );
}